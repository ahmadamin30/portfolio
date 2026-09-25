import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { AuthState, AuthContextType } from '../types/auth.types';
import { getMeApi, loginApi } from '../api/auth.api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    return {
      token,
      admin: null,
      isAuthenticated: false,
      isLoading: Boolean(token),
    };
  });

  const logout = useCallback((): void => {
    localStorage.removeItem('token');
    setState({
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const response = await loginApi({ email, password });
    localStorage.setItem('token', response.token);
    setState({
      token: response.token,
      admin: response.admin,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const checkAuth = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
      setState({
        token: null,
        admin: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      const admin = await getMeApi();
      setState({
        token,
        admin,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem('token');
      setState({
        token: null,
        admin: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleUnauthorized = (): void => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
