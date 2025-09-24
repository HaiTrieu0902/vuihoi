import { useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { GitHubOAuthService, GoogleOAuthService } from '@/services/oauth';

const OAuthCallback = () => {
  const search = useSearch({ from: '/auth/callback' });

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = (search as any)?.code;
        const state = (search as any)?.state;
        const error = (search as any)?.error;

        if (error) {
          console.error('OAuth error:', error);
          // Redirect to login with error
          window.location.href = '/login?error=oauth_error';
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          window.location.href = '/login?error=no_code';
          return;
        }

        // Handle different OAuth providers based on state
        switch (state) {
          case 'google':
            await GoogleOAuthService.handleCallback(code);
            break;
          case 'github':
            await GitHubOAuthService.handleCallback(code);
            break;
          default:
            console.error('Unknown OAuth provider:', state);
            window.location.href = '/login?error=unknown_provider';
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        window.location.href = '/login?error=callback_failed';
      }
    };

    handleCallback();
  }, [search]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Completing sign in...</h2>
        <p className="text-gray-500 mt-2">Please wait while we finish setting up your account.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
