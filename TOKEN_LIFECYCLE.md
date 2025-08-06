# Token Lifecycle and Expiration Management

## Overview

This document explains how different tokens work in the OAuth flow, when they expire, and what happens when they do.

## Token Types

### 1. Google Access Token

- **Lifetime**: 1 hour (3600 seconds)
- **Purpose**: Access Google APIs (userinfo, etc.)
- **Storage**: Not stored in database (temporary)
- **Scope**: `openid email profile`

### 2. Google Refresh Token

- **Lifetime**: Never expires (unless revoked)
- **Purpose**: Get new access tokens without user interaction
- **Storage**: Stored in database (`users.refresh_token`)
- **Revocation**: User can revoke in Google Account settings

### 3. Application JWT Token

- **Lifetime**: 24 hours (configurable)
- **Purpose**: Authenticate with your backend APIs
- **Storage**: Frontend localStorage
- **Scope**: Your application's authentication

## Token Flow Diagram

```
User Login Flow:
1. User clicks "Login with Google"
2. Frontend → Backend: GET /api/auth/google/url
3. Backend → Frontend: Google OAuth URL
4. Frontend → Google: Redirect to OAuth consent
5. Google → Frontend: Redirect with authorization code
6. Frontend → Backend: POST /api/auth/google (with code)
7. Backend → Google: Exchange code for tokens
8. Google → Backend: access_token + refresh_token
9. Backend → Database: Store refresh_token
10. Backend → Frontend: JWT token
11. Frontend → localStorage: Store JWT token
```

## What Happens When Tokens Expire

### Scenario 1: Google Access Token Expires (After 1 hour)

**Trigger**: Backend tries to call Google API with expired access token

**Flow**:

```
1. Backend makes Google API call
2. Google returns 401 Unauthorized
3. Backend detects expired token
4. Backend uses refresh_token to get new access_token
5. Backend retries original API call
6. Success - user doesn't notice anything
```

**Implementation**:

```python
# In google_oauth_service.py
async def refresh_access_token(self, refresh_token: str):
    # Exchange refresh_token for new access_token
    # Returns new access_token (valid for 1 hour)
```

### Scenario 2: Google Refresh Token Expires/Revoked

**Trigger**: User revokes access in Google Account or token is invalid

**Flow**:

```
1. Backend tries to refresh access_token
2. Google returns 400 Bad Request
3. Backend detects invalid refresh_token
4. Backend clears refresh_token from database
5. Backend returns error to frontend
6. Frontend redirects user to login
7. User must re-authenticate with Google
```

**Implementation**:

```python
# In auth.py - /google/refresh endpoint
if not new_token_data:
    # Clear invalid refresh token
    update_user_refresh_token(db, user.id, None)
    raise HTTPException("Failed to refresh Google token")
```

### Scenario 3: Application JWT Token Expires (After 24 hours)

**Trigger**: Frontend makes API call with expired JWT

**Flow**:

```
1. Frontend makes authenticated API call
2. Backend validates JWT and finds it expired
3. Backend returns 401 Unauthorized
4. Frontend catches 401 response
5. Frontend clears localStorage
6. Frontend redirects to login page
7. User must login again
```

**Implementation**:

```typescript
// In authService.ts
async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.status === 401) {
    // Clear expired tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    // Redirect to login
    window.location.href = '/';
    throw new Error('Authentication expired');
  }
}
```

## Token Refresh Strategies

### 1. Proactive Refresh (Recommended)

- Check token expiration before making API calls
- Refresh tokens before they expire
- User never experiences interruption

### 2. Reactive Refresh

- Wait for 401 error, then refresh
- More complex error handling
- User might experience brief interruption

### 3. Background Refresh

- Refresh tokens in background
- Update tokens silently
- Best user experience

## Security Considerations

### 1. Token Storage

- **JWT**: Frontend localStorage (consider httpOnly cookies for production)
- **Refresh Token**: Backend database (encrypted)
- **Access Token**: Not stored (temporary)

### 2. Token Validation

- Always validate tokens on backend
- Check expiration times
- Verify token signatures

### 3. Token Revocation

- Implement logout endpoint to clear tokens
- Clear both frontend and backend tokens
- Consider token blacklisting for sensitive apps

## Error Handling

### Common Error Scenarios

1. **Invalid Refresh Token**

   ```
   Error: 400 Bad Request
   Solution: Clear refresh token, force re-authentication
   ```

2. **Expired JWT Token**

   ```
   Error: 401 Unauthorized
   Solution: Redirect to login page
   ```

3. **Network Errors**

   ```
   Error: Network failure
   Solution: Retry with exponential backoff
   ```

4. **Google API Rate Limits**
   ```
   Error: 429 Too Many Requests
   Solution: Implement rate limiting and retry logic
   ```

## Best Practices

### 1. Token Management

- Store refresh tokens securely
- Implement proper token rotation
- Clear tokens on logout

### 2. Error Handling

- Graceful degradation
- Clear error messages
- Automatic retry logic

### 3. User Experience

- Seamless token refresh
- Minimal interruption
- Clear feedback on errors

### 4. Security

- HTTPS in production
- Secure token storage
- Regular token validation

## Monitoring and Logging

### What to Monitor

- Token refresh success/failure rates
- Token expiration patterns
- Authentication errors
- User session durations

### What to Log

- Token refresh attempts
- Authentication failures
- Token expiration events
- User login/logout events

## Testing Token Expiration

### Manual Testing

1. Login with Google
2. Wait for token expiration (or modify expiration time)
3. Make API call
4. Verify refresh flow works

### Automated Testing

```python
# Test token refresh
async def test_token_refresh():
    # Create expired token
    expired_token = create_expired_token()

    # Attempt to use expired token
    response = await client.post("/api/some-endpoint",
                               headers={"Authorization": f"Bearer {expired_token}"})

    # Should return 401
    assert response.status_code == 401
```

This comprehensive token management ensures a secure and smooth user experience while handling all edge cases of token expiration.
