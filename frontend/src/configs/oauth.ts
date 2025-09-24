// OAuth Configuration
export const OAUTH_CONFIG = {
  MSAL: {
    CLIENT_ID: import.meta.env.VITE_APP_AZURE_CLIENT_ID || '',
    TENANT_ID: import.meta.env.VITE_APP_AZURE_TENANT_ID || '',
    REDIRECT_URI: import.meta.env.VITE_APP_AZURE_REDIRECT_URI || 'http://localhost:7101/auth/callback',
  },
  GOOGLE: {
    CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:7101/auth/callback/google',
  },
  GITHUB: {
    CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
    REDIRECT_URI: import.meta.env.VITE_GITHUB_REDIRECT_URI || 'http://localhost:7101/auth/callback/github',
  },
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  },
} as const;

// MSAL Configuration
export const MSAL_CONFIG = {
  auth: {
    clientId: OAUTH_CONFIG.MSAL.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${OAUTH_CONFIG.MSAL.TENANT_ID}`,
    redirectUri: OAUTH_CONFIG.MSAL.REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'localStorage' as const,
    storeAuthStateInCookie: false,
  },
};

// Login Request Configuration for MSAL
export const LOGIN_REQUEST = {
  scopes: ['User.Read', 'profile', 'email', 'openid'],
};

export const GRAPH_ME_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
