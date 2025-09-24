/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
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
      // Logout from backend
      await OAuthService.logout();

      // Redirect to login page
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('MSAL logout error:', error);
      throw error;
    }
  }
}

// Google OAuth Service
export class GoogleOAuthService {
  static login(): void {
    // For now, redirect to backend (backend Google OAuth endpoint to be implemented)
    // TODO: Implement backend Google OAuth redirect endpoint
    console.warn('Google OAuth redirect not yet implemented on backend');
    window.location.href = '/auth/login?error=google_not_implemented';
  }
}

// GitHub OAuth Service
export class GitHubOAuthService {
  static login(): void {
    // For now, redirect to backend (backend GitHub OAuth endpoint to be implemented)
    // TODO: Implement backend GitHub OAuth redirect endpoint
    console.warn('GitHub OAuth redirect not yet implemented on backend');
    window.location.href = '/auth/login?error=github_not_implemented';
  }
}
