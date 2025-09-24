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
  // Login with MSAL
  static async loginWithMSAL(userData: OAuthUser): Promise<LoginResponse> {
    try {
      const response = await client.post('/api/auth/login-msal', {
        provider_user_id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar_url: userData.avatar_url,
        access_token: userData.access_token,
        refresh_token: userData.refresh_token,
      });
      return response.data;
    } catch (error) {
      console.error('MSAL login error:', error);
      throw new Error('Failed to login with Microsoft');
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
