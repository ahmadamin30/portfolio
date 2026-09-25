export interface Admin {
  id: number;
  username: string;
  email: string;
  name?: string | null;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  admin: Admin;
  message?: string;
}

export interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
