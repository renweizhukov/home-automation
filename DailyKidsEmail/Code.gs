/**
 * Daily email: world news (RSS) + popular kids books (Google Books)
 *
 * Setup Script Properties:
 * - DAUGHTER_EMAIL: recipient email
 * - NEWS_RSS_URLS: JSON array string, e.g. ["https://feeds.bbci.co.uk/news/world/rss.xml"]
 * - GOOGLE_BOOKS_API_KEY: (optional) Google Books API key
 */

function dailyJob() {
  const cfg = getConfig_();

  let news = [];
  let books = [];
  const errors = [];

  try {
    news = getNewsItems_(cfg.newsRssUrls, 5);
  } catch (e) {
    errors.push(`News fetch failed: ${e.message || e}`);
  }

  try {
    books = getPopularKidsBooks_(5, cfg.googleBooksApiKey);
  } catch (e) {
    errors.push(`Books fetch failed: ${e.message || e}`);
  }

  const subject = `Daily News + Books for JoJo (${formatDate_ (new Date())})`;
  const html = renderEmailHtml_(cfg.daughterName, news, books, errors);
  const text = renderEmailText_(cfg.daughterName, news, books, errors);

  GmailApp.sendEmail(cfg.recipients, subject, text, { htmlBody: html });

  console.log(JSON.stringify({
    event: "dailyJob_sent",
    date: new Date().toISOString(),
    newsCount: news.length,
    bookCount: books.length,
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

  return {
    recipients: [daughterEmail, dadaEmail].join(","), // GmailApp supports comma-separated list
    daughterName,
    newsRssUrls,
    googleBooksApiKey
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
  // Randomize results by:
  // 1. Fetching more books than needed (3-4x the limit)
  // 2. Optionally varying query terms for diversity
  // 3. Randomly shuffling and selecting the requested number
  
  const fetchMultiplier = 4; // Fetch 4x the limit to have more options
  const maxResults = Math.min(Math.max(limit * fetchMultiplier, 20), 40);
  
  // Vary query terms for more diversity (randomly select one)
  const queryVariants = [
    'subject:"juvenile fiction"',
    'subject:"children\'s fiction"',
    'subject:"juvenile fiction" subject:"adventure"',
    'subject:"juvenile fiction" subject:"fantasy"',
    'subject:"children\'s books"',
    'subject:"juvenile fiction" inauthor:"rowling" OR inauthor:"dahl" OR inauthor:"cleary"'
  ];
  const randomQuery = queryVariants[Math.floor(Math.random() * queryVariants.length)];
  const q = encodeURIComponent(randomQuery);
  
  // Optionally use random startIndex to get different pages (0-10)
  const randomStart = Math.floor(Math.random() * 11);
  
  let url =
    `https://www.googleapis.com/books/v1/volumes` +
    `?q=${q}` +
    `&maxResults=${maxResults}` +
    `&startIndex=${randomStart}` +
    `&printType=books` +
    `&langRestrict=en` +
    `&country=US`;

  if (apiKey) url += `&key=${encodeURIComponent(apiKey)}`;

  const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (resp.getResponseCode() >= 400) {
    throw new Error(`Google Books error ${resp.getResponseCode()}: ${resp.getContentText()}`);
  }

  const data = JSON.parse(resp.getContentText("UTF-8"));
  const allBooks = [];

  for (const item of (data.items || [])) {
    const v = item.volumeInfo || {};
    const title = v.title || "";
    const authors = (v.authors || []).join(", ");
    const description = (v.description || "").replace(/<[^>]*>/g, ""); // strip HTML
    const link = v.previewLink || v.infoLink || "";

    if (!title || !link) continue;

    allBooks.push({
      title,
      authors,
      link,
      blurb: truncate_(description, 220)
    });
  }

  // Randomly shuffle and select the requested number
  const shuffled = shuffleArray_(allBooks);
  return shuffled.slice(0, limit);
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

function renderEmailHtml_(daughterName, news, books, errors) {
  const intro = `Hi ${daughterName}! Here are today’s updates.`;

  const newsHtml = news.length
    ? `<ol>${news.map(n => `<li><a href="${escapeHtml_(n.link)}">${escapeHtml_(n.title)}</a></li>`).join("")}</ol>`
    : `<p><i>No news items available today.</i></p>`;

  const booksHtml = books.length
    ? `<ol>${books.map(b => {
        const authorPart = b.authors ? ` <span style="color:#555;">(${escapeHtml_(b.authors)})</span>` : "";
        const blurbPart = b.blurb ? `<div style="color:#333; margin-top:4px;">${escapeHtml_(b.blurb)}</div>` : "";
        return `<li><a href="${escapeHtml_(b.link)}">${escapeHtml_(b.title)}</a>${authorPart}${blurbPart}</li>`;
      }).join("")}</ol>`
    : `<p><i>No book items available today.</i></p>`;

  const errHtml = errors.length
    ? `<hr><p style="color:#a00;"><b>Note:</b> Some sources failed today:<br>${errors.map(e => escapeHtml_(e)).join("<br>")}</p>`
    : "";

  return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4;">
      <p>${intro}</p>

      <h3>Top World News</h3>
      ${newsHtml}

      <h3>Popular Kids’ Books</h3>
      ${booksHtml}

      <hr>
      <p style="color:#555;">Question of the day: Which story sounds the most interesting, and why?</p>
      ${errHtml}
    </div>
  `;
}

function renderEmailText_(daughterName, news, books, errors) {
  const lines = [];
  lines.push(`Hi ${daughterName}! Here are today's updates.\n`);

  lines.push("Top World News:");
  if (news.length) {
    news.forEach((n, i) => lines.push(`${i + 1}. ${n.title}\n   ${n.link}`));
  } else {
    lines.push("(No news items available today.)");
  }

  lines.push("\nPopular Kids’ Books:");
  if (books.length) {
    books.forEach((b, i) => {
      const authorPart = b.authors ? ` (${b.authors})` : "";
      const blurbPart = b.blurb ? `\n   ${b.blurb}` : "";
      lines.push(`${i + 1}. ${b.title}${authorPart}\n   ${b.link}${blurbPart}`);
    });
  } else {
    lines.push("(No book items available today.)");
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
