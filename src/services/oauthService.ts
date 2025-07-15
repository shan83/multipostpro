import { getPlatformConfig, oauthConfigs } from '../lib/oauth';

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
}

export interface UserInfo {
  id: string;
  username?: string;
  display_name?: string;
  email?: string;
  avatar_url?: string;
  follower_count?: number;
  is_business_account?: boolean;
}

export class OAuthService {
  // Exchange authorization code for access token
  static async exchangeCodeForToken(
    platform: string, 
    code: string, 
    state: string
  ): Promise<TokenResponse> {
    const config = getPlatformConfig(platform);
    if (!config) {
      throw new Error(`OAuth configuration not found for platform: ${platform}`);
    }

    const tokenData = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret || '',
      code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    });

    // Platform-specific token exchange
    switch (platform) {
      case 'twitter':
        tokenData.append('code_verifier', 'challenge');
        break;
    }

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: tokenData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Token exchange failed: ${response.status} - ${errorData}`);
    }

    const tokenResponse = await response.json();
    return tokenResponse;
  }

  // Fetch user information using access token
  static async fetchUserInfo(platform: string, accessToken: string): Promise<UserInfo> {
    const config = getPlatformConfig(platform);
    if (!config || !config.userInfoUrl) {
      throw new Error(`User info URL not configured for platform: ${platform}`);
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    };

    // Platform-specific headers
    switch (platform) {
      case 'facebook':
      case 'instagram':
        // Facebook uses different auth header format sometimes
        break;
      case 'youtube':
        headers['Authorization'] = `Bearer ${accessToken}`;
        break;
    }

    const response = await fetch(config.userInfoUrl, {
      headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to fetch user info: ${response.status} - ${errorData}`);
    }

    const userData = await response.json();
    return this.normalizeUserData(platform, userData);
  }

  // Normalize user data across different platforms
  private static normalizeUserData(platform: string, rawData: any): UserInfo {
    switch (platform) {
      case 'youtube':
        return {
          id: rawData.id,
          username: rawData.email?.split('@')[0] || '',
          display_name: rawData.name,
          email: rawData.email,
          avatar_url: rawData.picture,
        };

      case 'facebook':
        return {
          id: rawData.id,
          username: rawData.username || rawData.id,
          display_name: rawData.name,
          email: rawData.email,
          avatar_url: rawData.picture?.data?.url,
        };

      case 'instagram':
        return {
          id: rawData.id,
          username: rawData.username,
          display_name: rawData.name || rawData.username,
          avatar_url: rawData.profile_picture_url,
          follower_count: rawData.followers_count,
          is_business_account: rawData.account_type === 'BUSINESS',
        };

      case 'twitter':
        return {
          id: rawData.data?.id || rawData.id,
          username: rawData.data?.username || rawData.username,
          display_name: rawData.data?.name || rawData.name,
          avatar_url: rawData.data?.profile_image_url || rawData.profile_image_url,
          follower_count: rawData.data?.public_metrics?.followers_count,
        };

      case 'linkedin':
        return {
          id: rawData.id,
          display_name: `${rawData.localizedFirstName} ${rawData.localizedLastName}`,
          avatar_url: rawData.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier,
        };

      case 'tiktok':
        return {
          id: rawData.data?.user?.open_id,
          username: rawData.data?.user?.unique_id,
          display_name: rawData.data?.user?.display_name,
          avatar_url: rawData.data?.user?.avatar_url,
          follower_count: rawData.data?.user?.follower_count,
        };

      default:
        return {
          id: rawData.id || rawData.user_id || '',
          username: rawData.username || rawData.screen_name || '',
          display_name: rawData.name || rawData.display_name || '',
          email: rawData.email,
          avatar_url: rawData.avatar_url || rawData.profile_image_url,
        };
    }
  }

  // Refresh access token using refresh token
  static async refreshToken(platform: string, refreshToken: string): Promise<TokenResponse> {
    const config = getPlatformConfig(platform);
    if (!config) {
      throw new Error(`OAuth configuration not found for platform: ${platform}`);
    }

    const tokenData = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret || '',
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: tokenData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Token refresh failed: ${response.status} - ${errorData}`);
    }

    return await response.json();
  }

  // Validate if token is expired
  static isTokenExpired(expiresAt: string): boolean {
    return new Date(expiresAt) <= new Date();
  }

  // Calculate token expiration date
  static calculateExpirationDate(expiresIn: number): string {
    return new Date(Date.now() + expiresIn * 1000).toISOString();
  }

  // Revoke access token
  static async revokeToken(platform: string, accessToken: string): Promise<void> {
    const revokeUrls: Record<string, string> = {
      youtube: 'https://oauth2.googleapis.com/revoke',
      facebook: 'https://graph.facebook.com/me/permissions',
      instagram: 'https://graph.facebook.com/me/permissions',
      twitter: 'https://api.twitter.com/2/oauth2/revoke',
      linkedin: 'https://www.linkedin.com/oauth/v2/revoke',
    };

    const revokeUrl = revokeUrls[platform];
    if (!revokeUrl) {
      console.warn(`Token revocation not supported for platform: ${platform}`);
      return;
    }

    try {
      const response = await fetch(revokeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: new URLSearchParams({ token: accessToken }),
      });

      if (!response.ok) {
        console.warn(`Failed to revoke token for ${platform}:`, response.status);
      }
    } catch (error) {
      console.warn(`Error revoking token for ${platform}:`, error);
    }
  }
} 