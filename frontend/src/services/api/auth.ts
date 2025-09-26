import client from '@/services/client';

// Types for OAuth responses
export interface OAuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  access_token?: string;
  refresh_token?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  message: string;
}

// OAuth Service
export class OAuthService {
  // Login with MSAL - redirects to backend OAuth endpoint
  static loginWithMSAL(): void {
    try {
      const oauthUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/msal/login`;
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('MSAL login redirect error:', error);
      throw new Error('Failed to start Microsoft login');
    }
  }

  // Login with Google - redirects to backend OAuth endpoint
  static loginWithGoogle(): void {
    try {
      const oauthUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/google/login`;
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('Google OAuth login redirect error:', error);
      throw new Error('Failed to start Google login');
    }
  }

  // Login with GitHub - redirects to backend OAuth endpoint
  static loginWithGitHub(): void {
    try {
      const oauthUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/github/login`;
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('GitHub OAuth login redirect error:', error);
      throw new Error('Failed to start GitHub login');
    }
  }

  static async logout(): Promise<void> {
    try {
      await client.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  }
}
