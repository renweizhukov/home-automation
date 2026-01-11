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
- `NEWS_RSS_URLS`: JSON array string of RSS feed URLs, e.g. `["https://feeds.npr.org/1004/rss.xml"]` (required)
- `GOOGLE_BOOKS_API_KEY`: Google Books API key (optional, but recommended)

#### Setup Notes
- The script includes `country=US` parameter in Google Books API requests to avoid location-related errors
- RSS feed URLs can be from any source (e.g., NPR, BBC, Reuters, Google News). Example: `["https://feeds.npr.org/1004/rss.xml"]`
- **Application restrictions**: Set to "None" (Apps Script doesn't have stable IPs)
- **API restrictions**: Restrict to "Google Books API" only
- The script filters news content using a deny list (shooting, killed, dead, murder, etc.) to ensure age-appropriate content
- News items are limited to the last 48 hours and sorted by newest first

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
