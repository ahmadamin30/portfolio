import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Centralized Axios instance with request and response interceptors.
 * Synchronizes with localStorage and dispatches global unauthorized events.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer token if present
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global 401 handling and friendly error extraction
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; success?: boolean }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:unauthorized'));

      if (
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/login'
      ) {
        window.location.href = '/admin/login';
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected server error occurred';

    return Promise.reject(new Error(message));
  }
);

export default api;
export { api };
