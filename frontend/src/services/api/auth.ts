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

  // Login with Google
  static async loginWithGoogle(userData: OAuthUser): Promise<LoginResponse> {
    try {
      const response = await client.post('/api/auth/login-google', {
        provider_user_id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar_url: userData.avatar_url,
        access_token: userData.access_token,
        refresh_token: userData.refresh_token,
      });
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error('Failed to login with Google');
    }
  }

  // Login with GitHub
  static async loginWithGitHub(userData: OAuthUser): Promise<LoginResponse> {
    try {
      const response = await client.post('/api/auth/login-github', {
        provider_user_id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar_url: userData.avatar_url,
        access_token: userData.access_token,
        refresh_token: userData.refresh_token,
      });
      return response.data;
    } catch (error) {
      console.error('GitHub login error:', error);
      throw new Error('Failed to login with GitHub');
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await client.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  }
}
