import api from './api';

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  business_name?: string;
  sector?: string;
  role?: string;
  primary_destination?: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  full_name?: string;
  business_name?: string;
  sector?: string;
  role?: string;
  primary_destination?: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },
  login: async (data: LoginRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/login', data);
    return response.data;
  },
  getMe: async (userId: number): Promise<RegisterResponse> => {
    const response = await api.get<RegisterResponse>(`/auth/me?user_id=${userId}`);
    return response.data;
  }
};
