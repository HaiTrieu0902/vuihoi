import { Store, useStore } from '@tanstack/react-store';
import { KEY_LOCALSTORAGE_SYNC } from '@/constants';

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Initialize auth state from localStorage
const getInitialState = (): AuthState => {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
    };
  }

  try {
    const storedUser = localStorage.getItem(KEY_LOCALSTORAGE_SYNC.user);
    const storedToken =
      localStorage.getItem(KEY_LOCALSTORAGE_SYNC.token) || sessionStorage.getItem(KEY_LOCALSTORAGE_SYNC.token);
    const storedRefreshToken =
      localStorage.getItem(KEY_LOCALSTORAGE_SYNC.refreshToken) ||
      sessionStorage.getItem(KEY_LOCALSTORAGE_SYNC.refreshToken);

    const user = storedUser ? JSON.parse(storedUser) : null;
    const accessToken = storedToken || null;
    const refreshToken = storedRefreshToken || null;

    return {
      user,
      accessToken,
      refreshToken,
      isLoading: false,
      isAuthenticated: !!(user && accessToken),
    };
  } catch (error) {
    console.error('Error initializing auth state:', error);
    // Clear corrupted data
    localStorage.removeItem(KEY_LOCALSTORAGE_SYNC.user);
    localStorage.removeItem(KEY_LOCALSTORAGE_SYNC.token);
    localStorage.removeItem(KEY_LOCALSTORAGE_SYNC.refreshToken);
    sessionStorage.removeItem(KEY_LOCALSTORAGE_SYNC.token);
    sessionStorage.removeItem(KEY_LOCALSTORAGE_SYNC.refreshToken);

    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
    };
  }
};

// Create TanStack Store
export const authStore = new Store<AuthState>(getInitialState());

// Auth Store Actions
export const authActions = {
  // Set loading state
  setLoading: (isLoading: boolean) => {
    authStore.setState((state) => ({
      ...state,
      isLoading,
    }));
  },

  // Login function
  login: (userData: User, token: string, refreshToken?: string, rememberMe: boolean = true) => {
    const newState: AuthState = {
      user: userData,
      accessToken: token,
      refreshToken: refreshToken || null,
      isLoading: false,
      isAuthenticated: true,
    };

    // Store in localStorage or sessionStorage
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(KEY_LOCALSTORAGE_SYNC.user, JSON.stringify(userData));
    storage.setItem(KEY_LOCALSTORAGE_SYNC.token, token);
    if (refreshToken) {
      storage.setItem(KEY_LOCALSTORAGE_SYNC.refreshToken, refreshToken);
    }

    // Clear the other storage
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    otherStorage.removeItem(KEY_LOCALSTORAGE_SYNC.user);
    otherStorage.removeItem(KEY_LOCALSTORAGE_SYNC.token);
    otherStorage.removeItem(KEY_LOCALSTORAGE_SYNC.refreshToken);

    authStore.setState(() => newState);
  },

  // Logout function
  logout: () => {
    const newState: AuthState = {
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
    };

    // COMPLETELY CLEAR ALL localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    authStore.setState(() => newState);
  },

  // Update user info
  updateUser: (userData: Partial<User>) => {
    authStore.setState((state) => {
      if (!state.user) return state;

      const updatedUser = { ...state.user, ...userData };

      // Update storage
      const storage = localStorage.getItem(KEY_LOCALSTORAGE_SYNC.token) ? localStorage : sessionStorage;
      storage.setItem(KEY_LOCALSTORAGE_SYNC.user, JSON.stringify(updatedUser));

      return {
        ...state,
        user: updatedUser,
      };
    });
  },

  // Update access token
  updateAccessToken: (token: string) => {
    authStore.setState((state) => {
      // Update storage
      const storage = localStorage.getItem(KEY_LOCALSTORAGE_SYNC.token) ? localStorage : sessionStorage;
      storage.setItem(KEY_LOCALSTORAGE_SYNC.token, token);

      return {
        ...state,
        accessToken: token,
        isAuthenticated: !!(state.user && token),
      };
    });
  },

  // Update refresh token
  updateRefreshToken: (refreshToken: string) => {
    authStore.setState((state) => {
      // Update storage
      const storage = localStorage.getItem(KEY_LOCALSTORAGE_SYNC.token) ? localStorage : sessionStorage;
      storage.setItem(KEY_LOCALSTORAGE_SYNC.refreshToken, refreshToken);

      return {
        ...state,
        refreshToken,
      };
    });
  },
};

// Custom hook to use auth store
// For TanStack Store v0.4 compatibility
export function useAuthStore() {
  const state = useStore(authStore);

  return {
    ...state,
    actions: authActions,
  };
}
