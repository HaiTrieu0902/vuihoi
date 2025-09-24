import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { authActions } from '../../store/auth';

export const Route = createFileRoute('/auth/callback')({
  component: CallbackComponent,
  validateSearch: (search) => ({
    access_token: search.access_token as string | undefined,
    refresh_token: search.refresh_token as string | undefined,
    user_id: search.user_id as string | undefined,
    email: search.email as string | undefined,
    name: search.name as string | undefined,
    error: search.error as string | undefined,
  }),
});

function CallbackComponent() {
  const { access_token, refresh_token, user_id, email, name, error } = Route.useSearch();

  useEffect(() => {
    if (error) {
      console.error('OAuth error:', error);
      // Redirect to login with error
      window.location.href = `/auth/login?error=${encodeURIComponent(error)}`;
      return;
    }

    if (access_token && user_id) {
      // COMPLETELY CLEAR localStorage to ensure no old values exist
      localStorage.clear();
      sessionStorage.clear();

      // Create user object from URL params
      const userData = {
        id: user_id,
        email: email || '',
        name: name || '',
        avatar_url: undefined, // Not provided by backend currently
      };

      // Use auth store to properly set authentication state
      // This will store ONLY the standardized keys: @user, @access_token, and @refresh_token
      authActions.login(userData, access_token, refresh_token, true);

      // Redirect to home or intended page
      window.location.href = '/';
    } else {
      // Missing required data
      window.location.href = '/auth/login?error=missing_data';
    }
  }, [access_token, refresh_token, user_id, email, name, error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
