# home-automation

Automation scripts for home

## Projects

### DailyKidsEmail

A Google Apps Script automation that sends daily emails to kids with curated content including:
- **World news** from RSS feeds (filtered for age-appropriate content)
- **Popular kids' books (English)** recommendations
- **Popular kids' books (Chinese)** recommendations
- **Optional 4 ~ 6 mins podcast** audio attachment generated with OpenAI

#### Features
- Automated daily email delivery via `GmailApp.sendEmail`
- Content filtering: automatically filters out inappropriate news content using a deny list
- Time-based filtering: only includes news from the last 48 hours
- Deduplication: removes duplicate news items across multiple RSS feeds
- English books use a dual-query strategy:
  - Recent pool: Google Books query with `orderBy=newest`, then filtered to last 5 years
  - All-time pool: Google Books query without recency filter
  - Weighted selection target: 3 recent + 2 all-time when limit is 5
  - Final book list is deduplicated by normalized title and shuffled
- Chinese books use a hybrid strategy:
  - Fixed KCLS staff-list URLs (primary source)
  - Official award/list extraction source URLs
  - Open Library Chinese discovery
  - Google Books Chinese query fallback when needed
- Optional podcast generation:
  - Script model (default `gpt-4.1-mini`) creates a kid-friendly 4-6 minute script
  - TTS model (default `gpt-4o-mini-tts`) converts script to MP3
  - MP3 attached to email with a short script preview
  - Podcast script uses provided item URLs as references (no script-side URL summary fetch)
  - Generated scripts are sanitized to remove stage-direction cues (for example `Sound effect` / `SFX`)
- HTML and plain text email formats
- Error handling and logging
- Interactive "Question of the day" prompt
- Sends to both daughter and parent (Dada) email addresses

#### Configuration
The script uses Google Apps Script Properties for configuration:
- `DAUGHTER_EMAIL`: Primary recipient email address (required)
- `DADA_EMAIL`: Additional recipient email address (required)
- `DAUGHTER_NAME`: Name to personalize the email greeting (optional)
- `NEWS_RSS_URLS`: JSON array string of RSS feed URLs, e.g. `["https://feeds.npr.org/1004/rss.xml"]` (required)
- `GOOGLE_BOOKS_API_KEY`: Google Books API key (optional, but recommended)
- `OPENAI_API_KEY`: OpenAI API key for podcast generation (optional)
- `PODCAST_ENABLED`: `true`/`false` (optional). Defaults to `true` when `OPENAI_API_KEY` is set
- `PODCAST_SCRIPT_MODEL`: Script-generation model (optional, default `gpt-4.1-mini`)
- `PODCAST_SCRIPT_STYLE`: Style guidance for script model (optional)
- `PODCAST_LINK_SUMMARY_LIMIT`: Max number of links passed to script model context (optional, default `6`)
- `PODCAST_OPENAI_MODEL`: TTS model (optional, default `gpt-4o-mini-tts`)
- `PODCAST_OPENAI_VOICE`: TTS voice (optional, default `coral`)
- `PODCAST_OPENAI_INSTRUCTIONS`: TTS speaking style instructions (optional)
- `KCLS_CHINESE_KIDS_LIST_URLS`: JSON array of fixed KCLS list URLs (optional)
- `CHINESE_KIDS_AWARD_URLS`: JSON array of official Chinese award/list URLs (optional)

#### Setup Notes
- The script includes `country=US` parameter in Google Books API requests to avoid location-related errors
- RSS feed URLs can be from any source (e.g., NPR, BBC, Reuters, Google News). Example: `["https://feeds.npr.org/1004/rss.xml"]`
- **Application restrictions**: Set to "None" (Apps Script doesn't have stable IPs)
- **API restrictions**: Restrict to "Google Books API" only
- The script filters news content using a deny list (shooting, killed, dead, murder, etc.) to ensure age-appropriate content
- News items are limited to the last 48 hours and sorted by newest first
- If podcast generation is enabled, ensure `OPENAI_API_KEY` is configured in Script Properties
- Example KCLS list property:
  - `KCLS_CHINESE_KIDS_LIST_URLS=["https://kcls.bibliocommons.com/v2/list/display/209392283/1188591387"]`

The script is located in the `DailyKidsEmail/` folder.

#### Syncing with Google Apps Script

This project uses [clasp](https://github.com/google/clasp) to sync local changes to Google Apps Script.

**Prerequisites:**
1. Install Node.js and npm (if not already installed)
2. Install clasp globally: `npm install -g @google/clasp`
3. Enable Google Apps Script API:
   - Go to https://script.google.com/home/usersettings
   - Turn on "Google Apps Script API"

**First-time setup:**
1. Navigate to the project directory:
   ```bash
   cd DailyKidsEmail
   ```
2. Login to clasp (opens browser for authentication):
   ```bash
   clasp login
   ```
3. The project is already configured with `.clasp.json`, so you're ready to push!

**Pushing changes to Google Apps Script:**
```bash
clasp push
```

**Pulling changes from Google Apps Script:**
```bash
clasp pull
```

**Note:** The `.clasp.json` file contains the script ID and should be committed to the repository. The `.clasprc.json` file (created by `clasp login`) contains authentication tokens and should be in `.gitignore`.
