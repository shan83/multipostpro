// OAuth configuration for social media platforms
export interface OAuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scope: string[];
  authUrl: string;
  tokenUrl: string;
  userInfoUrl?: string;
  responseType: string;
}

export interface PlatformConfig {
  [key: string]: OAuthConfig;
}

// Get base URL for callbacks
const getBaseUrl = () => {
  return import.meta.env.VITE_APP_URL || 'http://localhost:5173';
};

// OAuth configurations for each platform
export const oauthConfigs: PlatformConfig = {
  youtube: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
    redirectUri: `${getBaseUrl()}/auth/callback/youtube`,
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    responseType: 'code'
  },
  
  facebook: {
    clientId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
    clientSecret: import.meta.env.VITE_FACEBOOK_APP_SECRET || '',
    redirectUri: `${getBaseUrl()}/auth/callback/facebook`,
    scope: [
      'pages_manage_posts',
      'pages_read_engagement',
      'pages_show_list',
      'publish_to_groups',
      'user_posts'
    ],
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userInfoUrl: 'https://graph.facebook.com/me',
    responseType: 'code'
  },
  
  instagram: {
    clientId: import.meta.env.VITE_INSTAGRAM_APP_ID || import.meta.env.VITE_FACEBOOK_APP_ID || '',
    clientSecret: import.meta.env.VITE_INSTAGRAM_APP_SECRET || import.meta.env.VITE_FACEBOOK_APP_SECRET || '',
    redirectUri: `${getBaseUrl()}/auth/callback/instagram`,
    scope: [
      'instagram_basic',
      'instagram_content_publish',
      'pages_show_list',
      'pages_read_engagement'
    ],
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userInfoUrl: 'https://graph.facebook.com/me/accounts',
    responseType: 'code'
  },
  
  twitter: {
    clientId: import.meta.env.VITE_TWITTER_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_TWITTER_CLIENT_SECRET || '',
    redirectUri: `${getBaseUrl()}/auth/callback/twitter`,
    scope: [
      'tweet.read',
      'tweet.write',
      'users.read',
      'offline.access'
    ],
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    userInfoUrl: 'https://api.twitter.com/2/users/me',
    responseType: 'code'
  },
  
  linkedin: {
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET || '',
    redirectUri: `${getBaseUrl()}/auth/callback/linkedin`,
    scope: [
      'r_liteprofile',
      'r_emailaddress',
      'w_member_social'
    ],
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    userInfoUrl: 'https://api.linkedin.com/v2/me',
    responseType: 'code'
  },
  
  tiktok: {
    clientId: import.meta.env.VITE_TIKTOK_CLIENT_KEY || '',
    clientSecret: import.meta.env.VITE_TIKTOK_CLIENT_SECRET || '',
    redirectUri: `${getBaseUrl()}/auth/callback/tiktok`,
    scope: [
      'user.info.basic',
      'video.publish',
      'video.list'
    ],
    authUrl: 'https://www.tiktok.com/auth/authorize/',
    tokenUrl: 'https://open-api.tiktok.com/oauth/access_token/',
    userInfoUrl: 'https://open-api.tiktok.com/user/info/',
    responseType: 'code'
  }
};

// Generate OAuth authorization URL
export const generateAuthUrl = (platform: string, state?: string): string => {
  const config = oauthConfigs[platform];
  if (!config) {
    throw new Error(`OAuth configuration not found for platform: ${platform}`);
  }

  if (!config.clientId) {
    throw new Error(`OAuth client ID not configured for platform: ${platform}`);
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope.join(' '),
    response_type: config.responseType,
    state: state || platform,
  });

  // Platform-specific parameters
  switch (platform) {
    case 'twitter':
      params.append('code_challenge', 'challenge');
      params.append('code_challenge_method', 'plain');
      break;
    case 'facebook':
    case 'instagram':
      params.append('display', 'popup');
      break;
  }

  return `${config.authUrl}?${params.toString()}`;
};

// Check if platform OAuth is configured
export const isPlatformConfigured = (platform: string): boolean => {
  const config = oauthConfigs[platform];
  return !!(config && config.clientId && config.clientId !== '');
};

// Get platform configuration
export const getPlatformConfig = (platform: string): OAuthConfig | null => {
  return oauthConfigs[platform] || null;
};

// Generate secure state parameter for OAuth
export const generateState = (platform: string, userId: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${platform}_${userId}_${timestamp}_${random}`;
};

// Validate state parameter
export const validateState = (state: string, platform: string, userId: string): boolean => {
  if (!state) return false;
  const parts = state.split('_');
  return parts.length >= 4 && parts[0] === platform && parts[1] === userId;
}; 