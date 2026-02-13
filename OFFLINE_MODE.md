# Offline Mode - Read-Only Statistics Viewer

This guide explains how to run Your Spotify in **offline mode** - a read-only configuration for viewing existing statistics without any Spotify API integration, data imports, or write operations.

## What is Offline Mode?

Offline mode disables all active features and write operations, converting Your Spotify into a pure statistics viewer for existing database data:

### Disabled Features:
- ❌ Spotify OAuth login (uses first database user automatically)
- ❌ Token refresh and Spotify API calls
- ❌ Background music scraping/syncing
- ❌ Data imports (privacy files, full privacy)
- ❌ Play tracks on Spotify
- ❌ Create playlists
- ❌ Modify settings (blacklist artists, change username, etc.)
- ❌ Admin operations (set admin, delete user, impersonate)
- ❌ Global preferences changes

### Enabled Features:
- ✅ View all statistics (top tracks, artists, albums)
- ✅ View listening history
- ✅ View charts and graphs
- ✅ Search functionality
- ✅ Artist/track/album detail pages
- ✅ Collaborative statistics
- ✅ Dark mode toggle (local only)
- ✅ Date/timezone/format display preferences (view only)

## Setup Instructions

### Environment Variables

Add the following environment variable to enable offline mode:

```bash
OFFLINE_MODE=true
```

### Configuration Options

#### Backend (server)

In your server environment (`.env` file or environment):

```bash
# Required: Enable offline mode
OFFLINE_MODE=true

# Optional: Specify a specific user ID (otherwise uses first user)
# OFFLINE_DEV_ID=507f1f77bcf86cd799439011

# Other required variables (same as normal mode)
MONGO_ENDPOINT=mongodb://mongo:27017/your_spotify
CLIENT_ENDPOINT=http://localhost:3000
API_ENDPOINT=http://localhost:8080
SPOTIFY_PUBLIC=your_spotify_client_id
SPOTIFY_SECRET=your_spotify_client_secret
```

#### Frontend (client)

The frontend needs to know about offline mode. This is handled by the build process:

1. In your `variables-template.js` (or equivalent), ensure:
```javascript
window.API_ENDPOINT = '__API_ENDPOINT__';
window.OFFLINE_MODE = '__OFFLINE_MODE__' === 'true';
```

2. Replace `__OFFLINE_MODE__` with `true` at build/deploy time.

### Docker Setup

If using Docker Compose, update your `docker-compose.yml`:

```yaml
services:
  server:
    environment:
      - OFFLINE_MODE=true
      # ... other env vars
```

For the client, you may need to inject the OFFLINE_MODE variable at runtime. Check your deployment scripts.

## How It Works

### Backend Behavior

1. **Auto-login**: When `/oauth/spotify` is called, instead of redirecting to Spotify:
   - Fetches the first user from the database
   - Creates a JWT token for that user
   - Sets the token cookie
   - Returns success

2. **Write Blocking**: All write endpoints check for `OFFLINE_MODE`:
   ```javascript
   const blockIfOffline = (req, res, next) => {
     const offlineMode = getWithDefault("OFFLINE_MODE", false);
     if (offlineMode) {
       res.status(403).send({ 
         code: "OFFLINE_MODE", 
         message: "Write operations are disabled in offline mode" 
       });
       return;
     }
     next();
   };
   ```

3. **No Background Tasks**: The music syncing looper and import cleanup tasks don't start.

### Frontend Behavior

1. **Hidden UI Elements**: Write-related UI components are conditionally hidden:
   - Import forms
   - Settings modification forms
   - Admin controls
   - Play buttons
   - Create playlist buttons
   - Blacklist artist buttons

2. **Read-Only Message**: Settings page shows "Viewing in read-only offline mode"

## Use Cases

Offline mode is ideal for:

1. **Demos & Presentations**: Show off statistics without live Spotify integration
2. **Data Analysis**: Explore historical data without worrying about changes
3. **Archival Access**: Access old data after disconnecting from Spotify
4. **Development**: Test frontend without active backend processes
5. **Low Resource Environments**: Run without background workers

## Limitations

- You need **existing data** in MongoDB - offline mode doesn't create or import data
- All users must already exist in the database
- No way to add new listening history
- Settings changes won't persist (though some like dark mode work locally)
- Cannot log in as different users (uses first database user)

## Switching Back to Normal Mode

To re-enable full functionality:

1. Remove or set `OFFLINE_MODE=false`
2. Restart the server
3. Rebuild/redeploy the client if you hardcoded the offline mode flag

## Troubleshooting

### "No users found in database for offline mode"

**Problem**: The database has no users.

**Solution**: You need to import data first in normal mode, then switch to offline mode.

### Statistics not showing

**Problem**: Database is empty or doesn't have listening history.

**Solution**: Import historical data in normal mode before enabling offline mode.

### UI still shows write buttons

**Problem**: Frontend doesn't know about offline mode.

**Solution**: Ensure `window.OFFLINE_MODE` is set correctly in your build. Check browser console:
```javascript
console.log(window.OFFLINE_MODE); // Should be true
```

### Getting 403 errors

**Problem**: Trying to use write operations in offline mode.

**Solution**: This is expected behavior. Offline mode blocks all write operations. The UI should hide these buttons, but the backend will reject them anyway.

## API Endpoints Status

### Enabled (Read-Only)
- `GET /me` - Get current user
- `GET /accounts` - List users
- `GET /spotify/*` - All statistics endpoints
- `GET /artist/:id/*` - Artist data
- `GET /album/:id/*` - Album data
- `GET /track/:id/*` - Track data
- `GET /search/*` - Search functionality
- `GET /global/preferences` - View settings

### Disabled (Write Operations)
- `POST /settings` - Modify settings
- `POST /rename` - Rename user
- `PUT /admin/:id` - Set admin status
- `DELETE /account/:id` - Delete user
- `POST /impersonate/:userId` - Impersonate user
- `POST /generate-public-token` - Generate sharing token
- `POST /import/*` - All import operations
- `POST /spotify/play` - Play tracks
- `POST /spotify/playlist/create` - Create playlist
- `POST /artist/blacklist/:id` - Blacklist artist
- `POST /global/preferences` - Update global settings

## Security Notes

- Offline mode automatically uses the first user in the database
- No authentication is required in offline mode (JWT is auto-generated)
- This is intended for trusted environments only
- Do not expose offline mode installations to the public internet without additional authentication

## Support

For issues or questions about offline mode, please refer to the main repository documentation or open an issue on GitHub.
