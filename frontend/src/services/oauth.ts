/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { authActions } from '../store/auth';
import { OAuthService } from './api/auth';

// MSAL Service
export class MSALService {
  static login(): void {
    try {
      OAuthService.loginWithMSAL();
    } catch (error) {
      console.error('MSAL login error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      // First clear all local auth state
      authActions.logout();

      // Then logout from backend
      await OAuthService.logout();

      // Finally redirect to auth/login page (not Azure logout to avoid redirect loop)
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('MSAL logout error:', error);
      // Fallback: clear local state and redirect to login
      authActions.logout();
      window.location.href = '/auth/login';
    }
  }
}

// Google OAuth Service
export class GoogleOAuthService {
  static login(): void {
    try {
      OAuthService.loginWithGoogle();
    } catch (error) {
      console.error('Google OAuth login error:', error);
      throw error;
    }
  }
}

// GitHub OAuth Service
export class GitHubOAuthService {
  static login(): void {
    try {
      OAuthService.loginWithGitHub();
    } catch (error) {
      console.error('GitHub OAuth login error:', error);
      throw error;
    }
  }
}
