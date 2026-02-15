/**
 * Daily email: world news (RSS) + popular kids books in English/Chinese
 *
 * Setup Script Properties:
 * - DAUGHTER_EMAIL: recipient email
 * - NEWS_RSS_URLS: JSON array string, e.g. ["https://feeds.bbci.co.uk/news/world/rss.xml"]
 * - GOOGLE_BOOKS_API_KEY: (optional) Google Books API key
 * - OPENAI_API_KEY: (optional) OpenAI API key for podcast audio generation
 * - PODCAST_ENABLED: (optional) true/false. Default true when OPENAI_API_KEY is set
 * - PODCAST_OPENAI_MODEL: (optional) default "gpt-4o-mini-tts"
 * - PODCAST_OPENAI_VOICE: (optional) default "coral"
 * - PODCAST_OPENAI_INSTRUCTIONS: (optional) speaking style guidance
 * - KCLS_CHINESE_KIDS_LIST_URLS: (optional) JSON array of fixed KCLS Chinese kids list URLs
 * - CHINESE_KIDS_AWARD_URLS: (optional) JSON array of official award/list URLs for curated Chinese kids books
 */

const DEFAULT_KCLS_CHINESE_KIDS_LIST_URLS = [
  "https://kcls.bibliocommons.com/v2/list/display/209392283/1188591387"
];

const DEFAULT_CHINESE_KIDS_AWARD_URLS = [
  "https://www.chinawriter.com.cn/n1/2025/0725/c403937-40529641.html"
];

const DEFAULT_CURATED_CHINESE_KIDS_TITLES = [
  // From the 12th National Outstanding Children's Literature Award (official list, 2025)
  "我人生最开始的好朋友",
  "大河的歌谣",
  "万花筒",
  "方一禾，快跑",
  "狼洞的外婆",
  "额吉的河",
  "胡同也有小时候",
  "我知道所有问题的答案了",
  "外婆变成了麻猫",
  "器成千年",
  "白夜梦想家",
  "月光蟋蟀",
  "我的，我的",
  "改造天才",
  "火苗照亮宇宙：暗生命传奇",
  "不能没有",
  "妈妈的剪影",
  "守护神"
];

function dailyJob() {
  const cfg = getConfig_();

  let news = [];
  let englishBooks = [];
  let chineseBooks = [];
  const errors = [];

  try {
    news = getNewsItems_(cfg.newsRssUrls, 5);
  } catch (e) {
    errors.push(`News fetch failed: ${e.message || e}`);
  }

  try {
    englishBooks = getPopularKidsBooks_(5, cfg.googleBooksApiKey);
  } catch (e) {
    errors.push(`English books fetch failed: ${e.message || e}`);
  }

  try {
    chineseBooks = getPopularChineseKidsBooks_(
      5,
      cfg.googleBooksApiKey,
      cfg.kclsChineseKidsListUrls,
      cfg.chineseKidsAwardUrls
    );
  } catch (e) {
    errors.push(`Chinese books fetch failed: ${e.message || e}`);
  }

  let podcast = null;
  if (cfg.podcastEnabled) {
    try {
      console.log(JSON.stringify({
        event: "podcast_generation_started",
        date: new Date().toISOString(),
        model: cfg.podcastOpenAiModel,
        voice: cfg.podcastOpenAiVoice
      }));

      podcast = createDailyPodcast_(
        cfg.daughterName,
        news,
        englishBooks,
        chineseBooks,
        errors,
        cfg.openAiApiKey,
        cfg.podcastOpenAiModel,
        cfg.podcastOpenAiVoice,
        cfg.podcastOpenAiInstructions
      );

      console.log(JSON.stringify({
        event: "podcast_generation_succeeded",
        date: new Date().toISOString(),
        fileName: podcast.fileName,
        sizeBytes: podcast.audioBlob ? podcast.audioBlob.getBytes().length : 0
      }));
    } catch (e) {
      errors.push(`Podcast generation failed: ${e.message || e}`);
    }
  }

  const subject = `Daily News + Books for JoJo (${formatDate_ (new Date())})`;
  const html = renderEmailHtml_(cfg.daughterName, news, englishBooks, chineseBooks, errors, podcast);
  const text = renderEmailText_(cfg.daughterName, news, englishBooks, chineseBooks, errors, podcast);

  const mailOpts = { htmlBody: html };
  if (podcast && podcast.audioBlob) {
    mailOpts.attachments = [podcast.audioBlob];
  }

  GmailApp.sendEmail(cfg.recipients, subject, text, mailOpts);

  console.log(JSON.stringify({
    event: "dailyJob_sent",
    date: new Date().toISOString(),
    newsCount: news.length,
    englishBookCount: englishBooks.length,
    chineseBookCount: chineseBooks.length,
    podcastGenerated: !!podcast,
    errors
  }));
}

function getConfig_() {
  const props = PropertiesService.getScriptProperties();

  const daughterEmail = props.getProperty("DAUGHTER_EMAIL");
  const dadaEmail = props.getProperty("DADA_EMAIL");

  const daughterName = props.getProperty("DAUGHTER_NAME");

  if (!daughterEmail) throw new Error("Missing Script Property: DAUGHTER_EMAIL");
  if (!dadaEmail) throw new Error("Missing Script Property: DADA_EMAIL");

  const rssRaw = props.getProperty("NEWS_RSS_URLS");
  const newsRssUrls = rssRaw ? JSON.parse(rssRaw) : [];
  if (!Array.isArray(newsRssUrls) || newsRssUrls.length === 0) {
    throw new Error("Missing/invalid Script Property: NEWS_RSS_URLS (JSON array)");
  }

  const googleBooksApiKey = props.getProperty("GOOGLE_BOOKS_API_KEY") || "";
  const openAiApiKey = props.getProperty("OPENAI_API_KEY") || "";
  const podcastEnabledRaw = props.getProperty("PODCAST_ENABLED");
  const podcastEnabled = podcastEnabledRaw
    ? podcastEnabledRaw.toLowerCase() === "true"
    : !!openAiApiKey;
  const podcastOpenAiModel = props.getProperty("PODCAST_OPENAI_MODEL") || "gpt-4o-mini-tts";
  const podcastOpenAiVoice = props.getProperty("PODCAST_OPENAI_VOICE") || "coral";
  const podcastOpenAiInstructions = props.getProperty("PODCAST_OPENAI_INSTRUCTIONS") || "Warm, upbeat, youthful girl narrator voice, clear pacing for kids.";
  const kclsListUrlsRaw = props.getProperty("KCLS_CHINESE_KIDS_LIST_URLS");
  const awardUrlsRaw = props.getProperty("CHINESE_KIDS_AWARD_URLS");
  let kclsChineseKidsListUrls = DEFAULT_KCLS_CHINESE_KIDS_LIST_URLS;
  if (kclsListUrlsRaw) {
    try {
      const parsed = JSON.parse(kclsListUrlsRaw);
      if (Array.isArray(parsed) && parsed.length) kclsChineseKidsListUrls = parsed;
    } catch (e) {
      console.log(`Invalid KCLS_CHINESE_KIDS_LIST_URLS, using default list: ${e.message || e}`);
    }
  }
  let chineseKidsAwardUrls = DEFAULT_CHINESE_KIDS_AWARD_URLS;
  if (awardUrlsRaw) {
    try {
      const parsed = JSON.parse(awardUrlsRaw);
      if (Array.isArray(parsed) && parsed.length) chineseKidsAwardUrls = parsed;
    } catch (e) {
      console.log(`Invalid CHINESE_KIDS_AWARD_URLS, using default list: ${e.message || e}`);
    }
  }

  return {
    recipients: [daughterEmail, dadaEmail].join(","), // GmailApp supports comma-separated list
    daughterName,
    newsRssUrls,
    googleBooksApiKey,
    openAiApiKey,
    podcastEnabled,
    podcastOpenAiModel,
    podcastOpenAiVoice,
    podcastOpenAiInstructions,
    kclsChineseKidsListUrls,
    chineseKidsAwardUrls
  };
}

function getNewsItems_(rssUrls, limit) {
  const deny = [
    "shooting", "killed", "dead", "murder", "rape", "porn", "terror", "isis",
    "massacre", "hostage", "bomb", "explosion"
  ];

  const items = [];
  const now = new Date();
  const cutoffMs = 48 * 60 * 60 * 1000; // last 48 hours

  for (const url of rssUrls) {
    const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (resp.getResponseCode() >= 400) {
      throw new Error(`RSS fetch error ${resp.getResponseCode()} for ${url}`);
    }

    const xml = resp.getContentText("UTF-8");
    const doc = XmlService.parse(xml);
    const root = doc.getRootElement();

    // RSS 2.0 typical: <rss><channel><item>...</item></channel></rss>
    const channel = root.getChild("channel");
    if (!channel) continue;

    const rssItems = channel.getChildren("item");
    for (const it of rssItems) {
      const title = safeText_(it.getChildText("title"));
      const link = safeText_(it.getChildText("link"));
      const pubDateText = safeText_(it.getChildText("pubDate"));
      const pubDate = pubDateText ? new Date(pubDateText) : null;

      if (!title || !link) continue;
      if (denyHit_(title, deny)) continue;

      if (pubDate && (now - pubDate) > cutoffMs) {
        // Skip older than cutoff to keep “most recent”
        continue;
      }

      items.push({ title, link, pubDate });
    }
  }

  // Sort newest first
  items.sort((a, b) => (b.pubDate ? b.pubDate.getTime() : 0) - (a.pubDate ? a.pubDate.getTime() : 0));

  // De-dup by link
  const seen = new Set();
  const deduped = [];
  for (const it of items) {
    if (seen.has(it.link)) continue;
    seen.add(it.link);
    deduped.push(it);
    if (deduped.length >= limit) break;
  }

  return deduped;
}

function getPopularKidsBooks_(limit, apiKey) {
  // Run two queries and combine:
  // 1) Recent books (published in the past 5 years)
  // 2) All-time books
  const fetchMultiplier = 4; // Fetch 4x the limit to have more options
  const maxResults = Math.min(Math.max(limit * fetchMultiplier, 20), 40);
  const currentYear = new Date().getFullYear();
  const recentCutoffYear = currentYear - 4; // inclusive year range: currentYear-4 .. currentYear

  const queryVariants = [
    'subject:"juvenile fiction"',
    'subject:"children\'s fiction"',
    'subject:"juvenile fiction" subject:"adventure"',
    'subject:"juvenile fiction" subject:"fantasy"',
    'subject:"children\'s books"',
    'subject:"juvenile nonfiction" subject:"science"',
    'subject:"juvenile nonfiction" subject:"history"',
    'subject:"graphic novels" subject:"juvenile fiction"',
    'subject:"comics" subject:"juvenile fiction"',
    'subject:"manga" subject:"juvenile"'
  ];

  const recentQuery = queryVariants[Math.floor(Math.random() * queryVariants.length)];
  const recentStart = Math.floor(Math.random() * 6);
  const recentBooksRaw = getGoogleBooks_(
    recentQuery,
    "en",
    "US",
    maxResults,
    recentStart,
    apiKey,
    { orderBy: "newest" }
  );
  const recentBooks = recentBooksRaw.filter(b => (b.publishedYear || 0) >= recentCutoffYear);

  const allTimeQuery = queryVariants[Math.floor(Math.random() * queryVariants.length)];
  const allTimeStart = Math.floor(Math.random() * 11);
  const allTimeBooks = getGoogleBooks_(
    allTimeQuery,
    "en",
    "US",
    maxResults,
    allTimeStart,
    apiKey
  );

  const recentPool = shuffleArray_(dedupeBooksByTitle_(recentBooks));
  const allTimePool = shuffleArray_(dedupeBooksByTitle_(allTimeBooks));
  const selected = [];
  const selectedTitleKeys = new Set();

  const preferredRecentCount = limit >= 5 ? 3 : Math.ceil(limit * 0.6);
  const targetRecent = Math.min(preferredRecentCount, limit);
  const targetAllTime = Math.max(0, limit - targetRecent);

  function pickFromPool_(pool, need) {
    let added = 0;
    for (const b of pool) {
      if (added >= need) break;
      const key = getBookTitleKey_(b);
      if (selectedTitleKeys.has(key)) continue;
      selected.push(b);
      selectedTitleKeys.add(key);
      added += 1;
    }
    return added;
  }

  const pickedRecent = pickFromPool_(recentPool, targetRecent);
  const pickedAllTime = pickFromPool_(allTimePool, targetAllTime);

  if (selected.length < limit) pickFromPool_(recentPool, limit - selected.length);
  if (selected.length < limit) pickFromPool_(allTimePool, limit - selected.length);

  console.log(JSON.stringify({
    event: "books_dual_query",
    recentQuery,
    recentStart,
    recentCutoffYear,
    recentCount: recentBooks.length,
    recentPoolCount: recentPool.length,
    allTimeQuery,
    allTimeStart,
    allTimeCount: allTimeBooks.length,
    allTimePoolCount: allTimePool.length,
    pickedRecent,
    pickedAllTime,
    finalCount: selected.length,
    finalUniqueTitleCount: selectedTitleKeys.size
  }));

  // Randomize final order while preserving weighted composition
  const shuffled = shuffleArray_(selected);
  
  console.log(JSON.stringify({
    event: "books_after_shuffle",
    count: shuffled.length,
    limit
  }));
  
  return shuffled.slice(0, limit);
}

function getPopularChineseKidsBooks_(limit, apiKey, kclsListUrls, awardUrls) {
  // Hybrid strategy:
  // 1) Fixed KCLS list URLs (preferred)
  // 2) Curated picks from official award/list sources
  // 3) Open Library discovery for additional variety
  // 4) Google Books as last fallback
  const fetchMultiplier = 4;
  const maxResults = Math.min(Math.max(limit * fetchMultiplier, 20), 40);

  const kclsBooks = getKclsChineseKidsBooks_(kclsListUrls || DEFAULT_KCLS_CHINESE_KIDS_LIST_URLS, maxResults);
  const curatedBooks = getCuratedChineseKidsBooks_(awardUrls || DEFAULT_CHINESE_KIDS_AWARD_URLS, maxResults);
  const openLibraryBooks = getOpenLibraryChineseKidsBooks_(maxResults);

  console.log(JSON.stringify({
    event: "chinese_books_hybrid_primary",
    kclsCount: kclsBooks.length,
    curatedCount: curatedBooks.length,
    openLibraryCount: openLibraryBooks.length
  }));

  let merged = dedupeBooks_(
    shuffleArray_(kclsBooks)
      .concat(shuffleArray_(curatedBooks))
      .concat(shuffleArray_(openLibraryBooks))
  );

  let googleBooks = [];
  if (merged.length < limit) {
    const queryVariants = [
      'subject:"Children\'s stories, Chinese"',
      'subject:"juvenile fiction" 儿童文学',
      '儿童文学',
      '少儿故事',
      '儿童小说'
    ];
    const randomQuery = queryVariants[Math.floor(Math.random() * queryVariants.length)];
    const randomStart = Math.floor(Math.random() * 11);

    googleBooks = getGoogleBooks_(randomQuery, "zh", "US", maxResults, randomStart, apiKey);

    console.log(JSON.stringify({
      event: "chinese_books_google",
      query: randomQuery,
      startIndex: randomStart,
      maxResults,
      googleCount: googleBooks.length
    }));

    merged = dedupeBooks_(merged.concat(shuffleArray_(googleBooks)));
  }

  const filtered = filterChineseKidsBooks_(merged);
  const ranked = rankChineseKidsBooks_(filtered);
  return ranked.slice(0, limit);
}

function getKclsChineseKidsBooks_(listUrls, maxResults) {
  const books = [];
  const urls = (listUrls || []).slice(0, 8); // avoid too many network calls

  for (const url of urls) {
    try {
      const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
      if (resp.getResponseCode() >= 400) continue;

      const html = resp.getContentText("UTF-8");
      const extracted = extractKclsRecordBooks_(html);
      extracted.forEach(b => books.push({
        title: b.title,
        authors: b.authors || "",
        link: b.link,
        blurb: "From KCLS Chinese kids list"
      }));
    } catch (e) {
      console.log(`KCLS list fetch failed for ${url}: ${e.message || e}`);
    }
  }

  return dedupeBooks_(books).slice(0, maxResults);
}

function extractKclsRecordBooks_(html) {
  const books = [];
  const seenLinks = new Set();
  const linkAndTitleRe = /<a[^>]+href="([^"]*(?:\/v2\/record\/S82C\d+|\/item\/show\/\d+)[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = linkAndTitleRe.exec(html)) !== null) {
    let link = safeText_(m[1]);
    if (!link) continue;
    if (!/^https?:\/\//i.test(link)) {
      link = `https://kcls.bibliocommons.com${link.startsWith("/") ? "" : "/"}${link}`;
    }
    if (seenLinks.has(link)) continue;
    seenLinks.add(link);

    const anchorTag = m[0];
    const ariaMatch = /aria-label="([^"]+)"/i.exec(anchorTag);
    const textTitle = decodeHtmlEntities_(stripHtmlTags_(m[2]));
    const ariaTitle = ariaMatch ? decodeHtmlEntities_(safeText_(ariaMatch[1])) : "";
    const title = safeText_(textTitle || ariaTitle);

    if (!title || title.length > 180) continue;
    books.push({ title, authors: "", link, blurb: "" });
  }
  return books;
}

function getCuratedChineseKidsBooks_(awardUrls, maxResults) {
  const books = [];
  const urls = (awardUrls || []).slice(0, 8); // avoid too many network calls

  for (const url of urls) {
    try {
      const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
      if (resp.getResponseCode() >= 400) continue;

      const html = resp.getContentText("UTF-8");
      const titles = extractChineseBracketTitles_(html);

      for (const title of titles) {
        books.push({
          title,
          authors: "",
          link: url,
          blurb: "Curated from official Chinese children's literature award/list source"
        });
      }
    } catch (e) {
      console.log(`Curated source fetch failed for ${url}: ${e.message || e}`);
    }
  }

  // If source pages change format or extraction is weak, use a curated safety set.
  if (books.length < 6) {
    DEFAULT_CURATED_CHINESE_KIDS_TITLES.forEach(t => books.push({
      title: t,
      authors: "",
      link: urls[0] || "https://www.chinawriter.com.cn",
      blurb: "Curated classic Chinese kids book"
    }));
  }

  return dedupeBooks_(books).slice(0, maxResults);
}

function extractChineseBracketTitles_(html) {
  const stopWords = [
    "全国优秀儿童文学奖",
    "中国作家协会",
    "评奖",
    "名单",
    "奖项",
    "委员会",
    "通知",
    "文学奖",
    "获奖",
    "作品",
    "图书"
  ];
  const titles = [];
  const re = /《([^《》\r\n]{2,40})》/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const title = safeText_(m[1]);
    if (!title) continue;
    if (stopWords.some(w => title.includes(w))) continue;
    if (/第[一二三四五六七八九十0-9]+/.test(title)) continue;
    titles.push(title);
  }
  return dedupeStrings_(titles);
}

function getGoogleBooks_(query, langRestrict, country, maxResults, startIndex, apiKey, options) {
  const opts = options || {};
  const q = encodeURIComponent(query);
  let url =
    `https://www.googleapis.com/books/v1/volumes` +
    `?q=${q}` +
    `&maxResults=${maxResults}` +
    `&startIndex=${startIndex}` +
    `&printType=books` +
    `&langRestrict=${encodeURIComponent(langRestrict)}` +
    `&country=${encodeURIComponent(country)}`;

  if (opts.orderBy) url += `&orderBy=${encodeURIComponent(opts.orderBy)}`;
  if (apiKey) url += `&key=${encodeURIComponent(apiKey)}`;

  const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (resp.getResponseCode() >= 400) {
    throw new Error(`Google Books error ${resp.getResponseCode()}: ${resp.getContentText()}`);
  }

  const data = JSON.parse(resp.getContentText("UTF-8"));
  const books = [];
  for (const item of (data.items || [])) {
    const v = item.volumeInfo || {};
    const title = v.title || "";
    const authors = (v.authors || []).join(", ");
    const description = (v.description || "").replace(/<[^>]*>/g, "");
    const link = v.previewLink || v.infoLink || "";
    const publishedYear = parsePublishedYear_(v.publishedDate || "");

    if (!title || !link) continue;
    books.push({
      title,
      authors,
      link,
      blurb: truncate_(description, 220),
      publishedYear
    });
  }

  return books;
}

function getOpenLibraryChineseKidsBooks_(maxResults) {
  const books = [];
  const queries = [
    "subject:\"Children's stories, Chinese\"",
    "儿童文学",
    "少儿故事"
  ];

  for (const q of queries) {
    const url =
      `https://openlibrary.org/search.json` +
      `?q=${encodeURIComponent(q)}` +
      `&language=chi` +
      `&limit=${Math.min(Math.max(Math.floor(maxResults / 2), 10), 25)}`;

    const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (resp.getResponseCode() >= 400) continue;

    const data = JSON.parse(resp.getContentText("UTF-8"));
    for (const d of (data.docs || [])) {
      const title = safeText_(d.title);
      if (!title) continue;

      const authors = (d.author_name || []).slice(0, 2).join(", ");
      const link = d.key ? `https://openlibrary.org${d.key}` : "";
      if (!link) continue;

      books.push({
        title,
        authors,
        link,
        blurb: d.first_publish_year ? `First published: ${d.first_publish_year}` : ""
      });
    }
  }

  return dedupeBooks_(books);
}

function parsePublishedYear_(publishedDateText) {
  const text = safeText_(publishedDateText);
  const m = /^(\d{4})/.exec(text);
  if (!m) return null;
  const y = parseInt(m[1], 10);
  if (y < 1000 || y > 3000) return null;
  return y;
}

function isLikelyChineseBook_(book) {
  const haystack = `${book.title || ""} ${book.authors || ""} ${book.blurb || ""}`;
  return /[\u3400-\u9FFF]/.test(haystack);
}

function filterChineseKidsBooks_(books) {
  const deny = ["言情", "成人", "耽美", "色情", "恐怖", "犯罪", "悬疑", "杀人", "谋杀"];
  return books.filter(b => {
    const fromKcls = (b.link || "").includes("kcls.bibliocommons.com");
    if (!isLikelyChineseBook_(b) && !fromKcls) return false;
    const haystack = `${b.title || ""} ${b.blurb || ""}`.toLowerCase();
    if (denyHit_(haystack, deny)) return false;
    return true;
  });
}

function rankChineseKidsBooks_(books) {
  const kidSignals = ["儿童", "少儿", "童话", "少年", "小学生", "图画书", "绘本", "成长", "校园", "故事"];
  return books
    .map(b => {
      const text = `${b.title || ""} ${b.blurb || ""}`.toLowerCase();
      let score = 0;
      if ((b.link || "").includes("kcls.bibliocommons.com")) score += 6;
      if ((b.link || "").includes("chinawriter.com.cn")) score += 4;
      if ((b.link || "").includes("openlibrary.org")) score += 2;
      kidSignals.forEach(k => {
        if (text.includes(k)) score += 1;
      });
      if (/[\u3400-\u9FFF]/.test(b.title || "")) score += 2;
      return { book: b, score, tie: Math.random() };
    })
    .sort((a, b) => (b.score - a.score) || (a.tie - b.tie))
    .map(x => x.book);
}

function dedupeBooks_(books) {
  const seen = new Set();
  const out = [];
  for (const b of books) {
    const key = getBookKey_(b);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(b);
  }
  return out;
}

function dedupeBooksByTitle_(books) {
  const seen = new Set();
  const out = [];
  for (const b of books) {
    const key = getBookTitleKey_(b);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(b);
  }
  return out;
}

function getBookKey_(b) {
  return `${(b.title || "").toLowerCase()}|${(b.authors || "").toLowerCase()}`;
}

function getBookTitleKey_(b) {
  return (b.title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\u3400-\u9FFF]+/g, "");
}

function dedupeStrings_(arr) {
  const seen = new Set();
  const out = [];
  for (const s of arr) {
    const key = (s || "").toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

function stripHtmlTags_(s) {
  return safeText_((s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " "));
}

function decodeHtmlEntities_(s) {
  return (s || "")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#([0-9]+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function shuffleArray_(array) {
  // Fisher-Yates shuffle algorithm
  const shuffled = array.slice(); // Create a copy
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createDailyPodcast_(daughterName, news, englishBooks, chineseBooks, errors, openAiApiKey, model, voice, instructions) {
  if (!openAiApiKey) {
    throw new Error("Missing Script Property: OPENAI_API_KEY");
  }
  const script = buildDailyPodcastScript_(daughterName, news, englishBooks, chineseBooks, errors);
  const fileName = `daily-kids-podcast-${formatDate_(new Date())}.mp3`;
  const audioBlob = synthesizeSpeechWithOpenAi_(script, openAiApiKey, model, voice, instructions, fileName);
  return { fileName, script, audioBlob };
}

function buildDailyPodcastScript_(daughterName, news, englishBooks, chineseBooks, errors) {
  const name = safeText_(daughterName) || "friend";
  const intro = `Hi ${name}! Here is your three minute Daily News and Books podcast.`;

  const newsLines = news.map((n, i) =>
    `World news ${i + 1}: ${normalizeForSpeech_(n.title)}.`
  );
  if (!newsLines.length) newsLines.push("Today there are no world news highlights available.");

  const englishBookLines = englishBooks.map((b, i) => {
    const authorPart = b.authors ? ` by ${normalizeForSpeech_(b.authors)}` : "";
    return `English book ${i + 1}: ${normalizeForSpeech_(b.title)}${authorPart}.`;
  });
  if (!englishBookLines.length) englishBookLines.push("No English book picks are available today.");

  const chineseBookLines = chineseBooks.map((b, i) => {
    const authorPart = b.authors ? ` by ${normalizeForSpeech_(b.authors)}` : "";
    return `Chinese book ${i + 1}: ${normalizeForSpeech_(b.title)}${authorPart}.`;
  });
  if (!chineseBookLines.length) chineseBookLines.push("No Chinese book picks are available today.");

  const errLine = errors.length
    ? "A quick note: some sources had temporary issues today."
    : "";

  const outro = "Question of the day: Which story sounds the most interesting, and why? Thanks for listening.";

  const script = [
    intro,
    "First, top world news.",
    newsLines.join(" "),
    "Now, popular kids books in English.",
    englishBookLines.join(" "),
    "And now, popular kids books in Chinese.",
    chineseBookLines.join(" "),
    errLine,
    outro
  ].filter(Boolean).join(" ");

  return trimWords_(script, 900);
}

function normalizeForSpeech_(s) {
  return safeText_(s)
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/[|_*#`~^<>[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trimWords_(text, maxWords) {
  const words = safeText_(text).split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")} Thanks for listening.`;
}

function synthesizeSpeechWithOpenAi_(text, apiKey, model, voice, instructions, fileName) {
  const url = "https://api.openai.com/v1/audio/speech";
  const payload = {
    model: model || "gpt-4o-mini-tts",
    voice: voice || "alloy",
    input: text,
    response_format: "mp3"
  };
  if (instructions) payload.instructions = instructions;

  const resp = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() >= 400) {
    throw new Error(`OpenAI audio.speech error ${resp.getResponseCode()}: ${resp.getContentText()}`);
  }
  return resp.getBlob().setName(fileName).setContentType("audio/mpeg");
}

function renderEmailHtml_(daughterName, news, englishBooks, chineseBooks, errors, podcast) {
  const intro = `Hi ${daughterName}! Here are today’s updates.`;
  const podcastHtml = podcast
    ? `<p><b>&#x1F3A7; 3-Min Podcast:</b> Audio attached as <b>${escapeHtml_(podcast.fileName)}</b>.<br><span style="color:#555;">Preview: ${escapeHtml_(truncate_(podcast.script, 240))}</span></p>`
    : "";

  const newsHtml = news.length
    ? `<ol>${news.map(n => `<li><a href="${escapeHtml_(n.link)}">${escapeHtml_(n.title)}</a></li>`).join("")}</ol>`
    : `<p><i>No news items available today.</i></p>`;

  const englishBooksHtml = englishBooks.length
    ? `<ol>${englishBooks.map(b => {
        const authorPart = b.authors ? ` <span style="color:#555;">(${escapeHtml_(b.authors)})</span>` : "";
        const blurbPart = b.blurb ? `<div style="color:#333; margin-top:4px;">${escapeHtml_(b.blurb)}</div>` : "";
        return `<li><a href="${escapeHtml_(b.link)}">${escapeHtml_(b.title)}</a>${authorPart}${blurbPart}</li>`;
      }).join("")}</ol>`
    : `<p><i>No English book items available today.</i></p>`;

  const chineseBooksHtml = chineseBooks.length
    ? `<ol>${chineseBooks.map(b => {
        const authorPart = b.authors ? ` <span style="color:#555;">(${escapeHtml_(b.authors)})</span>` : "";
        const blurbPart = b.blurb ? `<div style="color:#333; margin-top:4px;">${escapeHtml_(b.blurb)}</div>` : "";
        return `<li><a href="${escapeHtml_(b.link)}">${escapeHtml_(b.title)}</a>${authorPart}${blurbPart}</li>`;
      }).join("")}</ol>`
    : `<p><i>No Chinese book items available today.</i></p>`;

  const errHtml = errors.length
    ? `<hr><p style="color:#a00;"><b>Note:</b> Some sources failed today:<br>${errors.map(e => escapeHtml_(e)).join("<br>")}</p>`
    : "";

  return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4;">
      <p>${intro}</p>
      ${podcastHtml}

      <h3>&#x1F4F0; Top World News</h3>
      ${newsHtml}

      <h3>&#x1F4DA; Popular Kids' Books (English)</h3>
      ${englishBooksHtml}

      <h3>&#x1F4DA; Popular Kids' Books (Chinese)</h3>
      ${chineseBooksHtml}

      <hr>
      <p style="color:#555;">Question of the day: Which story sounds the most interesting, and why?</p>
      ${errHtml}
    </div>
  `;
}

function renderEmailText_(daughterName, news, englishBooks, chineseBooks, errors, podcast) {
  const lines = [];
  lines.push(`Hi ${daughterName}! Here are today's updates.\n`);
  if (podcast && podcast.fileName) {
    lines.push(`\uD83C\uDFA7 3-Min Podcast attached: ${podcast.fileName}`);
    lines.push(`Preview: ${truncate_(podcast.script, 200)}`);
    lines.push("");
  }

  lines.push("\uD83D\uDCF0 Top World News:");
  if (news.length) {
    news.forEach((n, i) => lines.push(`${i + 1}. ${n.title}\n   ${n.link}`));
  } else {
    lines.push("(No news items available today.)");
  }

  lines.push("\n\uD83D\uDCDA Popular Kids' Books (English):");
  if (englishBooks.length) {
    englishBooks.forEach((b, i) => {
      const authorPart = b.authors ? ` (${b.authors})` : "";
      const blurbPart = b.blurb ? `\n   ${b.blurb}` : "";
      lines.push(`${i + 1}. ${b.title}${authorPart}\n   ${b.link}${blurbPart}`);
    });
  } else {
    lines.push("(No English book items available today.)");
  }

  lines.push("\n\uD83D\uDCDA Popular Kids' Books (Chinese):");
  if (chineseBooks.length) {
    chineseBooks.forEach((b, i) => {
      const authorPart = b.authors ? ` (${b.authors})` : "";
      const blurbPart = b.blurb ? `\n   ${b.blurb}` : "";
      lines.push(`${i + 1}. ${b.title}${authorPart}\n   ${b.link}${blurbPart}`);
    });
  } else {
    lines.push("(No Chinese book items available today.)");
  }

  lines.push("\nQuestion of the day: Which story sounds the most interesting, and why?");

  if (errors.length) {
    lines.push("\nNOTE: Some sources failed today:");
    errors.forEach(e => lines.push(`- ${e}`));
  }

  return lines.join("\n");
}

function denyHit_(text, deny) {
  const t = (text || "").toLowerCase();
  return deny.some(w => t.includes(w));
}

function truncate_(s, n) {
  if (!s) return "";
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trim() + "…";
}

function safeText_(s) {
  return (s || "").toString().trim();
}

function formatDate_(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function escapeHtml_(s) {
  return (s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
