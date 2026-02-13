# Simple Profile Picker Login

This feature provides a simple login screen where users can select which profile they want to log in as, without requiring passwords or authentication.

## Features

- **Profile Selection**: View all available user profiles and select one to log in
- **No Authentication Required**: Simply click on a username to log in
- **Spotify Login Option**: Original Spotify OAuth login is still available
- **Works Online**: Can load metadata from Spotify as needed (not completely offline)

## How It Works

### Backend

Two new endpoints were added:

1. **GET /users/list** - Public endpoint that returns a list of all users
   - No authentication required
   - Returns only user ID and username (no sensitive data)

2. **POST /login/select** - Simple login endpoint
   - Accepts a userId in the request body
   - Generates a JWT token for the selected user
   - Sets the token in an HttpOnly cookie
   - No password or authentication required

### Frontend

The login page was enhanced to:

1. **Fetch Available Profiles**: On page load, fetches the list of users from `/users/list`
2. **Display Profile Buttons**: Shows each username as a clickable button
3. **Handle Selection**: When clicked, calls `/login/select` with the selected user ID
4. **Navigate Home**: After successful login, redirects to the home page
5. **Fallback to Spotify**: Original Spotify login button remains available

## Usage

### For Users

1. Navigate to the login page
2. See a list of available profiles
3. Click on the profile you want to use
4. You'll be logged in and redirected to the home page

### Configuration

No special configuration is required. The feature works out of the box with any existing database that has users.

## UI Design

The login screen shows:
- A title "Login"
- Subtitle "Select a profile to continue"
- List of profile buttons (one per user)
  - Each button shows the username
  - Styled with borders and hover effects
  - Disabled while logging in
- A separator with "Or login with Spotify:"
- The original Spotify login button
- Remember me checkbox (existing feature)

## Security Considerations

**⚠️ Important**: This feature has NO security or authentication. Anyone who accesses the login page can log in as any user.

This is intentional per the requirements but means:
- Should only be used in trusted environments
- Not suitable for public-facing deployments
- Users can access any profile without verification

## Technical Details

### API Endpoints

**GET /users/list**
```javascript
Response: [
  { id: "userId1", username: "username1" },
  { id: "userId2", username: "username2" }
]
```

**POST /login/select**
```javascript
Request: { userId: "userId1" }
Response: { success: true, username: "username1" }
```

### Component Changes

**Login.tsx**
- Added state for profiles list, loading, and error handling
- Added useEffect to fetch profiles on mount
- Added handleProfileSelect function to handle login
- Enhanced UI to show profile buttons
- Added CircularProgress for loading state

**api.ts**
- Added getUsersList() method
- Added selectUser(userId) method

## Comparison with Other Modes

### vs. Offline Mode
- Offline mode: Automatically logs in with first user, no UI
- Profile picker: Shows list of users, user selects which one

### vs. Spotify OAuth
- Spotify OAuth: Full authentication, requires Spotify account
- Profile picker: No authentication, just select username

### vs. Impersonation
- Impersonation: Admin feature, requires existing login
- Profile picker: Primary login method, no prerequisites

## Example Screenshot

```
┌─────────────────────────────────────┐
│            Login                    │
│                                     │
│  Select a profile to continue       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │         John Smith            │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │         Jane Doe              │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │         Bob Johnson           │ │
│  └───────────────────────────────┘ │
│                                     │
│  Or login with Spotify:             │
│  ┌───────────────────────────────┐ │
│  │    Login with Spotify         │ │
│  └───────────────────────────────┘ │
│                                     │
│  ☑ Remember me                      │
└─────────────────────────────────────┘
```

## Future Enhancements

Possible improvements (not currently implemented):
- Profile pictures/avatars
- Last login timestamp
- User search/filter for many users
- Recently used profiles at the top
- Profile descriptions
- User statistics preview

## Troubleshooting

**No profiles showing?**
- Ensure the database has users
- Check that `/users/list` endpoint is accessible
- Check browser console for errors

**Login fails?**
- Verify the user ID exists in the database
- Check that JWT private key is configured
- Check server logs for errors

**Redirects to login after selection?**
- Cookie may not be set properly
- Check browser cookie settings
- Ensure secure flag matches HTTPS/HTTP

## Related Files

- Backend: `apps/server/src/routes/index.ts`
- Frontend: `apps/client/src/scenes/Account/Login/Login.tsx`
- API: `apps/client/src/services/apis/api.ts`
