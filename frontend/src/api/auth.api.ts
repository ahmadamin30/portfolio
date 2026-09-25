import api from '../services/api';
import { Admin, LoginResponse, LoginCredentials } from '../types/auth.types';

export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', credentials);
  const data = response.data;
  const token = data.data?.token || data.token;
  const rawAdmin = data.data?.admin || data.admin;

  const admin: Admin = {
    id: rawAdmin.id,
    email: rawAdmin.email,
    name: rawAdmin.name ?? null,
    username: rawAdmin.username || rawAdmin.name || rawAdmin.email.split('@')[0],
  };

  return {
    success: true,
    token,
    admin,
    message: data.message,
  };
};

export const getMeApi = async (): Promise<Admin> => {
  const response = await api.get('/auth/me');
  const rawAdmin = response.data?.data?.admin || response.data?.admin;

  return {
    id: rawAdmin.id,
    email: rawAdmin.email,
    name: rawAdmin.name ?? null,
    username: rawAdmin.username || rawAdmin.name || rawAdmin.email.split('@')[0],
  };
};
