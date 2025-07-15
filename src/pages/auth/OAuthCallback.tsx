import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { OAuthService } from '../../services/oauthService';
import { validateState } from '../../lib/oauth';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const OAuthCallback = () => {
  const { platform } = useParams<{ platform: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authorization...');
  const [details, setDetails] = useState('');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      if (!platform) {
        throw new Error('Platform not specified in callback URL');
      }

      if (!user) {
        throw new Error('User not authenticated. Please log in first.');
      }

      // Get authorization code and state from URL parameters
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Check for OAuth errors
      if (error) {
        throw new Error(errorDescription || `OAuth error: ${error}`);
      }

      if (!code) {
        throw new Error('Authorization code not received from platform');
      }

      if (!state) {
        throw new Error('State parameter missing from callback');
      }

      // Validate state parameter
      if (!validateState(state, platform, user.id)) {
        throw new Error('Invalid state parameter. Possible CSRF attack.');
      }

      setMessage('Exchanging authorization code for access token...');

      // Exchange code for tokens
      const tokenResponse = await OAuthService.exchangeCodeForToken(platform, code, state);
      
      if (!tokenResponse.access_token) {
        throw new Error('Failed to obtain access token from platform');
      }

      setMessage('Fetching user information from platform...');

      // Fetch user info from platform
      const userInfo = await OAuthService.fetchUserInfo(platform, tokenResponse.access_token);

      setMessage('Saving account information...');

      // Calculate token expiration
      const tokenExpiresAt = tokenResponse.expires_in 
        ? OAuthService.calculateExpirationDate(tokenResponse.expires_in)
        : new Date(Date.now() + 3600000).toISOString(); // Default 1 hour

      // Prepare social account data
      const socialAccountData = {
        user_id: user.id,
        platform: platform,
        platform_user_id: userInfo.id,
        username: userInfo.username || '',
        display_name: userInfo.display_name || '',
        follower_count: userInfo.follower_count || 0,
        is_business_account: userInfo.is_business_account || false,
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token || '',
        token_expires_at: tokenExpiresAt,
        scopes: tokenResponse.scope ? tokenResponse.scope.split(' ') : [],
      };

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'https://placeholder.supabase.co' || 
          supabaseKey === 'placeholder-key') {
        
        console.warn('Supabase not configured, using demo mode');
        setStatus('success');
        setMessage('Successfully connected!');
        setDetails('Demo mode: Account connected locally only. Configure Supabase for persistent storage.');
        
        // Refresh user data to update UI
        setTimeout(() => {
          navigate('/dashboard', { state: { message: `Successfully connected to ${platform}!` } });
        }, 2000);
        return;
      }

      // Check if account already exists
      const { data: existingAccount } = await supabase
        .from('social_accounts')
        .select('id')
        .eq('user_id', user.id)
        .eq('platform', platform)
        .single();

      if (existingAccount) {
        // Update existing account
        const { error: updateError } = await supabase
          .from('social_accounts')
          .update({
            platform_user_id: userInfo.id,
            username: userInfo.username || '',
            display_name: userInfo.display_name || '',
            follower_count: userInfo.follower_count || 0,
            is_business_account: userInfo.is_business_account || false,
            access_token: tokenResponse.access_token,
            refresh_token: tokenResponse.refresh_token || '',
            token_expires_at: tokenExpiresAt,
            scopes: tokenResponse.scope ? tokenResponse.scope.split(' ') : [],
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingAccount.id);

        if (updateError) {
          throw new Error(`Failed to update existing account: ${updateError.message}`);
        }
      } else {
        // Insert new social account
        const { error: insertError } = await supabase
          .from('social_accounts')
          .insert([socialAccountData]);

        if (insertError) {
          throw new Error(`Failed to save account: ${insertError.message}`);
        }

        // Create default platform config
        const defaultConfig = {
          user_id: user.id,
          platform: platform,
          default_post_format: 'optimized',
          optimal_posting_times: ['09:00', '12:00', '17:00'],
          hashtag_strategy: 'platform_optimized',
          image_quality: 'high',
          auto_publish: false,
          settings: {
            auto_hashtags: true,
            cross_post: true,
            analytics_tracking: true,
          },
        };

        const { error: configError } = await supabase
          .from('platform_configs')
          .insert([defaultConfig]);

        if (configError) {
          console.warn('Failed to create platform config:', configError);
          // Continue anyway - config is optional
        }
      }

      // Refresh user data to update UI
      await refreshUserData();

      setStatus('success');
      setMessage('Successfully connected!');
      setDetails(`Your ${platform} account has been connected and is ready to use.`);

      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard', { state: { message: `Successfully connected to ${platform}!` } });
      }, 2000);

    } catch (error) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setMessage('Connection failed');
      setDetails(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const handleRetry = () => {
    navigate('/dashboard');
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-8 h-8 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            
            <h1 className={`text-xl font-semibold mb-2 ${getStatusColor()}`}>
              {message}
            </h1>
            
            {platform && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connecting to {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </p>
            )}
            
            {details && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                {details}
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Go to Settings
                </button>
              </div>
            )}

            {status === 'loading' && (
              <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <span>Please wait...</span>
              </div>
            )}

            {status === 'success' && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting to dashboard...
              </div>
            )}
          </div>
        </div>

        {/* Back to dashboard link */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback; 