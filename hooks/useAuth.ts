import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';

const API_BASE_URL = '/api';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('cultural_concierge_token');
    
    if (token) {
      // Verify token with backend
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Token invalid');
      })
      .then(data => {
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          token,
        });
      })
      .catch(() => {
        localStorage.removeItem('cultural_concierge_token');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: data.message };
      }

      // Store token
      localStorage.setItem('cultural_concierge_token', data.token);

      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        token: data.token,
      });

      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: responseData.message };
      }

      // Store token
      localStorage.setItem('cultural_concierge_token', responseData.token);

      setAuthState({
        user: responseData.user,
        isAuthenticated: true,
        isLoading: false,
        token: responseData.token,
      });

      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cultural_concierge_token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
    });
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!authState.user || !authState.token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState(prev => ({ ...prev, user: data.user }));
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  }, [authState.user, authState.token]);

  const hasRole = useCallback((role: string | string[]) => {
    if (!authState.user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(authState.user.role);
  }, [authState.user]);

  const hasPermission = useCallback((permission: string) => {
    if (!authState.user) return false;
    
    // Define role-based permissions
    const permissions = {
      admin: ['manage_users', 'view_analytics', 'manage_content', 'moderate_content'],
      moderator: ['moderate_content', 'view_analytics'],
      user: ['view_content', 'manage_profile'],
    };

    return permissions[authState.user.role]?.includes(permission) || false;
  }, [authState.user]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    hasPermission,
  };
};

// Auth Context
export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};