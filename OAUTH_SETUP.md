# OAuth Setup Guide

This guide explains how to set up OAuth integration for each social media platform in your MultiPostPro application.

## Overview

The application now supports real OAuth integration with social media platforms. When users click the "Connect" button, they will be redirected to the platform's official login page, authorize your application, and their access tokens will be securely saved to the database for future use.

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Application URL (Required for OAuth callbacks)
VITE_APP_URL=http://localhost:5173  # For development
# VITE_APP_URL=https://yourdomain.com  # For production

# Platform OAuth Credentials (Add only the platforms you want to support)

# YouTube/Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth  
VITE_FACEBOOK_APP_ID=your-facebook-app-id
VITE_FACEBOOK_APP_SECRET=your-facebook-app-secret

# Instagram OAuth (uses Facebook)
VITE_INSTAGRAM_APP_ID=your-instagram-app-id
VITE_INSTAGRAM_APP_SECRET=your-instagram-app-secret

# Twitter OAuth
VITE_TWITTER_CLIENT_ID=your-twitter-client-id
VITE_TWITTER_CLIENT_SECRET=your-twitter-client-secret

# LinkedIn OAuth
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id
VITE_LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# TikTok OAuth
VITE_TIKTOK_CLIENT_KEY=your-tiktok-client-key
VITE_TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
```

## Platform Setup Instructions

### 1. YouTube (Google OAuth)

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable YouTube Data API**
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5173/auth/callback/youtube` (development)
     - `https://yourdomain.com/auth/callback/youtube` (production)

4. **Get Client ID and Secret**
   - Copy the Client ID and Client Secret
   - Add to your `.env` file as `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_SECRET`

### 2. Facebook

1. **Create Facebook App**
   - Visit [Facebook Developers](https://developers.facebook.com/)
   - Click "Create App" > "Business" or "Consumer"
   - Fill in app details

2. **Add Facebook Login Product**
   - In your app dashboard, click "Add Product"
   - Select "Facebook Login" > "Set Up"

3. **Configure OAuth Settings**
   - Go to Facebook Login > Settings
   - Add Valid OAuth Redirect URIs:
     - `http://localhost:5173/auth/callback/facebook`
     - `https://yourdomain.com/auth/callback/facebook`

4. **Get App ID and Secret**
   - Go to Settings > Basic
   - Copy App ID and App Secret
   - Add to `.env` as `VITE_FACEBOOK_APP_ID` and `VITE_FACEBOOK_APP_SECRET`

5. **Request Permissions** (for production)
   - Go to App Review > Permissions and Features
   - Request these permissions:
     - `pages_manage_posts`
     - `pages_read_engagement`
     - `pages_show_list`

### 3. Instagram

Instagram uses Facebook's OAuth system:

1. **Use Facebook App** (from step 2 above)

2. **Add Instagram Basic Display**
   - In Facebook app dashboard, add "Instagram Basic Display" product
   - Configure redirect URIs: `http://localhost:5173/auth/callback/instagram`

3. **Environment Variables**
   - You can use the same Facebook credentials:
   ```env
   VITE_INSTAGRAM_APP_ID=your-facebook-app-id
   VITE_INSTAGRAM_APP_SECRET=your-facebook-app-secret
   ```

### 4. Twitter

1. **Create Twitter App**
   - Visit [Twitter Developer Portal](https://developer.twitter.com/)
   - Apply for developer account if needed
   - Create a new app

2. **Configure OAuth 2.0**
   - In app settings, enable OAuth 2.0
   - Set callback URLs:
     - `http://localhost:5173/auth/callback/twitter`
     - `https://yourdomain.com/auth/callback/twitter`

3. **Get Credentials**
   - Go to "Keys and tokens"
   - Copy Client ID and Client Secret
   - Add to `.env` as `VITE_TWITTER_CLIENT_ID` and `VITE_TWITTER_CLIENT_SECRET`

### 5. LinkedIn

1. **Create LinkedIn App**
   - Visit [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
   - Click "Create App"
   - Fill in app details

2. **Configure OAuth**
   - In app settings, go to "Auth" tab
   - Add redirect URLs:
     - `http://localhost:5173/auth/callback/linkedin`
     - `https://yourdomain.com/auth/callback/linkedin`

3. **Request Products**
   - Request "Share on LinkedIn" and "Sign In with LinkedIn"

4. **Get Credentials**
   - Copy Client ID and Client Secret
   - Add to `.env` as `VITE_LINKEDIN_CLIENT_ID` and `VITE_LINKEDIN_CLIENT_SECRET`

### 6. TikTok

1. **Create TikTok App**
   - Visit [TikTok for Developers](https://developers.tiktok.com/)
   - Register and create a new app

2. **Configure OAuth**
   - Add redirect URIs in app settings:
     - `http://localhost:5173/auth/callback/tiktok`
     - `https://yourdomain.com/auth/callback/tiktok`

3. **Get Credentials**
   - Copy Client Key and Client Secret
   - Add to `.env` as `VITE_TIKTOK_CLIENT_KEY` and `VITE_TIKTOK_CLIENT_SECRET`

## How It Works

1. **User Clicks Connect**: When a user clicks the "Connect" button for a platform
2. **OAuth Check**: The app checks if OAuth is configured for that platform
3. **Redirect to Platform**: If configured, user is redirected to the platform's OAuth page
4. **User Authorizes**: User logs in and authorizes your app on the platform
5. **Callback Handling**: Platform redirects back to your app with authorization code
6. **Token Exchange**: Your app exchanges the code for access and refresh tokens
7. **Save to Database**: Tokens and user info are saved to your Supabase database
8. **Ready to Use**: Platform connection is now active and ready for posting

## Demo Mode

If OAuth is not configured for a platform, the app will offer to create a demo connection instead. This allows you to test the UI without setting up OAuth, but won't provide real platform integration.

## Security Features

- **State Parameter**: Prevents CSRF attacks during OAuth flow
- **Token Refresh**: Automatically refreshes expired access tokens
- **Token Revocation**: Properly revokes tokens when disconnecting platforms
- **Secure Storage**: Tokens are stored securely in your Supabase database
- **Validation**: Extensive validation of OAuth responses and state parameters

## Troubleshooting

### Common Issues

1. **"OAuth not configured" message**
   - Check that environment variables are set correctly
   - Ensure variable names match exactly (case-sensitive)
   - Restart development server after adding variables

2. **Redirect URI mismatch**
   - Verify redirect URIs in platform settings match your app URLs exactly
   - Include both development and production URLs
   - Check for trailing slashes or missing protocols

3. **Invalid client credentials**
   - Double-check Client ID and Secret are copied correctly
   - Ensure no extra spaces or characters
   - Verify app is not in development mode (for production)

4. **Permission denied errors**
   - Check that required permissions/scopes are requested
   - For Facebook/Instagram, ensure permissions are approved in App Review
   - Verify app has appropriate access levels

### Development vs Production

- **Development**: Use `http://localhost:5173` URLs
- **Production**: Use your actual domain with HTTPS
- **Environment Variables**: Set `VITE_APP_URL` appropriately for each environment
- **Platform Settings**: Configure redirect URIs for both environments

### Testing

1. Start with one platform (YouTube/Google is often easiest)
2. Test the complete flow: connect → authorize → callback → save
3. Verify tokens are saved in Supabase `social_accounts` table
4. Test token refresh and platform disconnection
5. Add additional platforms one by one

## Security Considerations

- Never commit `.env` files to version control
- Use different apps/credentials for development and production
- Regularly rotate client secrets
- Monitor OAuth app usage in platform dashboards
- Implement proper error handling for failed OAuth flows
- Consider implementing rate limiting for OAuth endpoints

## Support

If you encounter issues:
1. Check browser developer console for error messages
2. Verify environment variables are loaded correctly
3. Test OAuth URLs manually to ensure they're constructed properly
4. Check platform developer documentation for any API changes
5. Ensure your app complies with platform policies and guidelines 