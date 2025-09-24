/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthenticationResult, PublicClientApplication } from '@azure/msal-browser';
import { GRAPH_ME_ENDPOINT, LOGIN_REQUEST, MSAL_CONFIG, OAUTH_CONFIG } from '../configs/oauth';
import { authActions } from '../store/auth';
import { OAuthService } from './api/auth';
import type { OAuthUser } from './api/auth';
// Initialize MSAL instance
const msalInstance = new PublicClientApplication(MSAL_CONFIG);

// MSAL Service
export class MSALService {
  static async login(): Promise<void> {
    try {
      // Trigger login popup
      const response: AuthenticationResult = await msalInstance.loginPopup(LOGIN_REQUEST);

      if (response && response.account) {
        // Get user profile from Microsoft Graph
        const userProfile = await this.getUserProfile(response.accessToken);

        // Prepare user data for backend
        const userData: OAuthUser = {
          id: response.account.homeAccountId,
          email: response.account.username || userProfile.mail || userProfile.userPrincipalName,
          name: response.account.name || userProfile.displayName,
          avatar_url: userProfile.photo?.value || undefined,
          access_token: response.accessToken,
          refresh_token: undefined, // MSAL handles refresh tokens internally
        };

        // Call backend login
        const loginResponse = await OAuthService.loginWithMSAL(userData);

        // Store user session using TanStack store
        authActions.login(
          {
            id: loginResponse.user_id,
            email: loginResponse.email,
            name: loginResponse.name,
            avatar_url: loginResponse.avatar_url,
          },
          loginResponse.access_token,
          true,
        );

        // Redirect to dashboard or intended page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('MSAL login error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      // Logout from backend
      await OAuthService.logout();

      // Clear auth store
      authActions.logout();

      // Logout from MSAL
      await msalInstance.logoutPopup();

      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('MSAL logout error:', error);
      throw error;
    }
  }

  private static async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await fetch(GRAPH_ME_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {};
    }
  }

  // storeUserSession is deprecated, use TanStack store instead
}

// Google OAuth Service
export class GoogleOAuthService {
  static async login(): Promise<void> {
    const clientId = OAUTH_CONFIG.GOOGLE.CLIENT_ID;
    const redirectUri = OAUTH_CONFIG.GOOGLE.REDIRECT_URI;

    if (!clientId) {
      throw new Error('Google Client ID not configured');
    }

    // Redirect to Google OAuth
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', clientId);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('state', 'google');

    window.location.href = googleAuthUrl.toString();
  }

  static async handleCallback(code: string): Promise<void> {
    try {
      // Exchange code for tokens (this should be done on your backend for security)
      // For now, we'll simulate getting user data
      const userData = await this.exchangeCodeForUserData(code);

      // Call backend login
      const loginResponse = await OAuthService.loginWithGoogle(userData);

      // Store user session using TanStack store
      authActions.login(
        {
          id: loginResponse.user_id,
          email: loginResponse.email,
          name: loginResponse.name,
          avatar_url: loginResponse.avatar_url,
        },
        loginResponse.access_token,
        true,
      );

      // Redirect to dashboard
      window.location.href = '/';
    } catch (error) {
      console.error('Google callback error:', error);
      throw error;
    }
  }

  private static async exchangeCodeForUserData(code: string): Promise<OAuthUser> {
    // This is a simplified version. In production, token exchange should happen on the backend
    // Here we're just returning mock data for the example
    return {
      id: 'google_user_id',
      email: 'user@gmail.com',
      name: 'Google User',
      avatar_url: undefined,
      access_token: 'google_access_token',
      refresh_token: 'google_refresh_token',
    };
  }

  // storeUserSession is deprecated, use TanStack store instead
}

// GitHub OAuth Service
export class GitHubOAuthService {
  static async login(): Promise<void> {
    const clientId = OAUTH_CONFIG.GITHUB.CLIENT_ID;
    const redirectUri = OAUTH_CONFIG.GITHUB.REDIRECT_URI;

    if (!clientId) {
      throw new Error('GitHub Client ID not configured');
    }

    // Redirect to GitHub OAuth
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', clientId);
    githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
    githubAuthUrl.searchParams.set('scope', 'user:email');
    githubAuthUrl.searchParams.set('state', 'github');

    window.location.href = githubAuthUrl.toString();
  }

  static async handleCallback(code: string): Promise<void> {
    try {
      // Exchange code for tokens (this should be done on your backend for security)
      const userData = await this.exchangeCodeForUserData(code);

      // Call backend login
      const loginResponse = await OAuthService.loginWithGitHub(userData);

      // Store user session using TanStack store
      authActions.login(
        {
          id: loginResponse.user_id,
          email: loginResponse.email,
          name: loginResponse.name,
          avatar_url: loginResponse.avatar_url,
        },
        loginResponse.access_token,
        true,
      );

      // Redirect to dashboard
      window.location.href = '/';
    } catch (error) {
      console.error('GitHub callback error:', error);
      throw error;
    }
  }

  private static async exchangeCodeForUserData(code: string): Promise<OAuthUser> {
    // This is a simplified version. In production, token exchange should happen on the backend
    return {
      id: 'github_user_id',
      email: 'user@example.com',
      name: 'GitHub User',
      avatar_url: undefined,
      access_token: 'github_access_token',
      refresh_token: undefined,
    };
  }

  // storeUserSession is deprecated, use TanStack store instead
}
