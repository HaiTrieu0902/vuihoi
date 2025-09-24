import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';
import { OAUTH_STORAGE_KEYS } from '../../constants';

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
      // Store tokens and user data
      localStorage.setItem(OAUTH_STORAGE_KEYS.ACCESS_TOKEN, access_token);
      if (refresh_token) {
        localStorage.setItem(OAUTH_STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
      }
      if (user_id) localStorage.setItem(OAUTH_STORAGE_KEYS.USER_ID, user_id);
      if (email) localStorage.setItem(OAUTH_STORAGE_KEYS.USER_EMAIL, email);
      if (name) localStorage.setItem(OAUTH_STORAGE_KEYS.USER_NAME, name);

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
