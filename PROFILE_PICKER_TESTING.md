# Profile Picker Testing & Validation

## Test Plan

### Unit Tests (if implemented)

#### Backend Tests
- [ ] `/users/list` endpoint returns array of users
- [ ] `/users/list` only returns id and username fields
- [ ] `/users/list` works without authentication
- [ ] `/login/select` validates user exists
- [ ] `/login/select` returns 404 for invalid user
- [ ] `/login/select` generates valid JWT token
- [ ] `/login/select` sets HttpOnly cookie
- [ ] JWT token contains correct userId

#### Frontend Tests
- [ ] Login component fetches users on mount
- [ ] Login component displays loading state
- [ ] Login component displays user buttons
- [ ] Login component handles selection click
- [ ] Login component shows error on failure
- [ ] Login component navigates after success

### Integration Tests

#### Happy Path
1. **Load Login Page**
   - Visit `/login`
   - Verify page loads
   - Verify loading spinner appears
   - Verify user list loads
   - Verify buttons render for each user

2. **Select Profile**
   - Click on a user button
   - Verify button shows "Logging in..."
   - Verify API call to `/login/select`
   - Verify redirect to home page

3. **Verify Login State**
   - After redirect, check user is logged in
   - Verify correct user is shown in header/menu
   - Verify statistics load for selected user

#### Error Cases
1. **No Users Available**
   - Empty database
   - Verify message: "No profiles available"
   - Verify Spotify login option still shown

2. **Network Error**
   - Simulate failed API call
   - Verify error message displayed
   - Verify user can retry

3. **Invalid User**
   - Send invalid userId to backend
   - Verify 404 response
   - Verify error handling

### Manual Testing Checklist

#### Setup
- [ ] Database has multiple users
- [ ] Server is running
- [ ] Client is built and running

#### Test Scenarios

**Scenario 1: Normal Login Flow**
- [ ] Navigate to `/login`
- [ ] Wait for profiles to load
- [ ] See list of usernames
- [ ] Click on first username
- [ ] See "Logging in..." text
- [ ] Redirect to home page
- [ ] Verify logged in as correct user

**Scenario 2: Multiple Users**
- [ ] See multiple profile buttons
- [ ] Each button shows different username
- [ ] Click different users in sequence (logout between)
- [ ] Verify each login works correctly

**Scenario 3: Spotify Login Fallback**
- [ ] See "Or login with Spotify:" text
- [ ] See Spotify login button
- [ ] Click Spotify button
- [ ] Verify OAuth flow starts

**Scenario 4: Loading State**
- [ ] Clear cache/reload page
- [ ] Immediately see loading spinner
- [ ] See "Loading profiles..." text
- [ ] Spinner disappears when loaded

**Scenario 5: Remember Me**
- [ ] Check "Remember me" checkbox
- [ ] Click profile to login
- [ ] Close browser
- [ ] Reopen browser
- [ ] Verify auto-login behavior

**Scenario 6: Styling & UX**
- [ ] Profile buttons have borders
- [ ] Buttons have hover effect
- [ ] Buttons are properly sized
- [ ] Text is readable
- [ ] Layout is centered
- [ ] Mobile responsive

### API Testing

#### GET /users/list

**Request:**
```bash
curl http://localhost:8080/users/list
```

**Expected Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "username": "John Smith"
  },
  {
    "id": "507f191e810c19729de860ea",
    "username": "Jane Doe"
  }
]
```

**Validations:**
- Status code: 200
- Response is array
- Each item has id and username
- No sensitive data (tokens, emails, etc.)

#### POST /login/select

**Request:**
```bash
curl -X POST http://localhost:8080/login/select \
  -H "Content-Type: application/json" \
  -d '{"userId": "507f1f77bcf86cd799439011"}'
```

**Expected Response:**
```json
{
  "success": true,
  "username": "John Smith"
}
```

**Expected Cookie:**
- Cookie name: `token`
- HttpOnly: true
- SameSite: strict
- Secure: depends on HTTPS

**Validations:**
- Status code: 200
- Response has success and username
- Cookie is set
- JWT token is valid

### Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari
- [ ] Mobile Chrome

### Performance Testing

- [ ] Load time for user list < 1 second
- [ ] Login response time < 500ms
- [ ] UI remains responsive during login
- [ ] No memory leaks on repeated logins

### Security Testing

⚠️ **Note**: This feature intentionally has NO security. Document findings:

- [ ] Confirm anyone can access `/users/list`
- [ ] Confirm no password validation
- [ ] Confirm no rate limiting
- [ ] Confirm cookie is HttpOnly (prevents XSS)
- [ ] Document that this should not be public-facing

### Regression Testing

Ensure existing features still work:

- [ ] Spotify OAuth login still works
- [ ] Logout still works
- [ ] Statistics pages still load
- [ ] Settings pages still work
- [ ] Offline mode still works (if enabled)
- [ ] Impersonation still works (if used)

## Test Results

### Environment
- Server version: ___
- Client version: ___
- Database: MongoDB
- Browser: ___
- OS: ___

### Results Summary

| Test Category | Pass | Fail | Notes |
|--------------|------|------|-------|
| Backend Endpoints | _/2 | _/2 | |
| Frontend UI | _/6 | _/6 | |
| Integration | _/3 | _/3 | |
| Error Handling | _/3 | _/3 | |
| Browser Compat | _/5 | _/5 | |
| Performance | _/4 | _/4 | |

### Issues Found

1. **Issue:** ___
   - **Severity:** High/Medium/Low
   - **Steps to Reproduce:** ___
   - **Expected:** ___
   - **Actual:** ___
   - **Fix:** ___

### Screenshots

#### Login Page - Initial Load
[Screenshot showing loading state]

#### Login Page - Profiles Loaded
[Screenshot showing list of profile buttons]

#### Login Page - Clicking Profile
[Screenshot showing "Logging in..." state]

#### Home Page - After Login
[Screenshot showing logged in state]

## Acceptance Criteria

✅ All criteria must be met:

- [ ] User can see list of available profiles
- [ ] User can click any profile to log in
- [ ] No password or authentication required
- [ ] Login redirects to home page
- [ ] Correct user is logged in
- [ ] Spotify login option remains available
- [ ] Loading states are shown
- [ ] Error messages are shown when appropriate
- [ ] UI is visually appealing
- [ ] Works on desktop and mobile

## Sign-off

- Developer: ___
- Tester: ___
- Date: ___
- Build: ___
- Status: Pass/Fail
