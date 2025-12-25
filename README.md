# home-automation

Automation scripts for home

## Projects

### DailyKidsEmail

A Google Apps Script automation that sends daily emails to kids with curated content including:
- **World news** from RSS feeds (filtered for age-appropriate content)
- **Popular kids books** recommendations from Google Books API

#### Features
- Automated daily email delivery via `GmailApp.sendEmail`
- Content filtering: automatically filters out inappropriate news content using a deny list
- Time-based filtering: only includes news from the last 48 hours
- Deduplication: removes duplicate news items across multiple RSS feeds
- HTML and plain text email formats
- Error handling and logging
- Interactive "Question of the day" prompt
- Sends to both daughter and parent (Dada) email addresses

#### Configuration
The script uses Google Apps Script Properties for configuration:
- `DAUGHTER_EMAIL`: Primary recipient email address (required)
- `DADA_EMAIL`: Additional recipient email address (required)
- `DAUGHTER_NAME`: Name to personalize the email greeting (optional)
- `NEWS_RSS_URLS`: JSON array string of RSS feed URLs, e.g. `["https://feeds.bbci.co.uk/news/world/rss.xml"]` (required)
- `GOOGLE_BOOKS_API_KEY`: Google Books API key (optional, but recommended)

#### Setup Notes
- The script includes `country=US` parameter in Google Books API requests to avoid location-related errors
- RSS feed URLs can be from any source (e.g., BBC, Reuters, Google News). Example: `["https://feeds.bbci.co.uk/news/world/rss.xml"]`
- **Application restrictions**: Set to "None" (Apps Script doesn't have stable IPs)
- **API restrictions**: Restrict to "Google Books API" only
- The script filters news content using a deny list (shooting, killed, dead, murder, etc.) to ensure age-appropriate content
- News items are limited to the last 48 hours and sorted by newest first

The script is located in the `DailyKidsEmail/` folder.
