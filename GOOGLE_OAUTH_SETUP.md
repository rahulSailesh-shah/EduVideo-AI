# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the EduVideo AI application.

## Backend Setup

### 1. Install Dependencies

The required dependencies have been added to `server/requirements.txt`:

- `httpx==0.27.0`
- `google-auth==2.28.1`
- `google-auth-oauthlib==1.2.0`

Run the following command to install them:

```bash
cd server
pip install -r requirements.txt
```

### 2. Database Migration

Run the database migration script to add OAuth support to the existing users table:

```bash
cd server
python scripts/migrate_oauth.py
```

### 3. Environment Configuration

Add the following variables to your `.env` file in the `server` directory:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/auth/callback
```

## Google OAuth Application Setup

### 1. Create Google OAuth Application

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Choose "Web application" as the application type
7. Add the following authorized redirect URIs:
   - `http://localhost:8080/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)
8. Copy the Client ID and Client Secret

### 2. Configure Environment Variables

Update your `.env` file with the actual values:

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-secret-here
GOOGLE_REDIRECT_URI=http://localhost:8080/auth/callback
```

## Frontend Setup

The frontend has been updated with:

- Authentication context (`AuthContext.tsx`)
- Login modal with Google OAuth support (`LoginModal.tsx`)
- OAuth callback handler (`AuthCallback.tsx`)
- Updated navbar with authentication controls
- Updated home page to use authentication

No additional configuration is needed for the frontend.

## Testing the Setup

### 1. Start the Backend Server

```bash
cd server
uvicorn app.main:app --reload
```

### 2. Start the Frontend

```bash
cd client
npm run dev
```

### 3. Test Authentication

1. Open the application in your browser
2. Click the "Login" button in the navbar
3. Choose "Continue with Google"
4. Complete the Google OAuth flow
5. You should be redirected back to the application and logged in

## Features Added

### Backend

- ✅ Google OAuth service (`app/service/google_oauth.py`)
- ✅ Extended User model with OAuth fields
- ✅ OAuth authentication endpoints (`/api/auth/google`, `/api/auth/google/url`)
- ✅ Database migration script
- ✅ Updated CRUD operations for OAuth users

### Frontend

- ✅ Authentication context for state management
- ✅ Login modal with traditional and Google OAuth options
- ✅ OAuth callback page
- ✅ Updated navbar with user menu and logout
- ✅ Protected routes and components

## Security Notes

1. **Client Secret**: Never expose your Google OAuth client secret in frontend code
2. **HTTPS**: Use HTTPS in production for secure OAuth redirects
3. **Token Storage**: JWT tokens are stored in localStorage (consider using httpOnly cookies for production)
4. **Redirect URIs**: Always validate redirect URIs to prevent open redirect attacks

## Troubleshooting

### Common Issues

1. **"Invalid redirect_uri" error**: Make sure the redirect URI in your Google OAuth app matches exactly
2. **"Client ID not configured" error**: Check that `GOOGLE_CLIENT_ID` is set in your `.env` file
3. **Database errors**: Run the migration script to add required columns
4. **CORS errors**: Ensure your backend CORS settings allow requests from your frontend domain

### Debug Mode

To enable debug logging, set `DEBUG=true` in your `.env` file.

## Production Deployment

For production deployment:

1. Update `GOOGLE_REDIRECT_URI` to your production domain
2. Add your production domain to Google OAuth authorized redirect URIs
3. Use HTTPS for all OAuth redirects
4. Consider using secure cookie storage for JWT tokens
5. Set appropriate CORS origins for your production domain
