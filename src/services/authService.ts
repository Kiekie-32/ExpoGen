import api from './api';

export interface RegisterRequest {
  full_name: string;
  email: string;
  business_name?: string;
}

export interface RegisterResponse {
  id: number;
  full_name: string;
  email: string;
  business_name?: string;
  created_at: string;
}

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    // Explicitly using /auth/register which will be proxied to https://expo-gen-rose.vercel.app/auth/register
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },
};
