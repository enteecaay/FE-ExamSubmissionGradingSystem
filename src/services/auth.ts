import { iamClient } from './client';

export interface LoginPayload {
  keyLogin: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 0 | 1 | 2;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: 0 | 1 | 2;
  };
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await iamClient.getClient().post<AuthResponse>('/api/auth/login', payload);

      const token = response.data.token || response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      if (token) {
        iamClient.setAuthToken(token, refreshToken);
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await iamClient.getClient().post<AuthResponse>('/api/auth/register', payload);

      const token = response.data.token || response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      if (token) {
        iamClient.setAuthToken(token, refreshToken);
      }

      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    iamClient.removeAuthToken();
  },

  getToken(): string | null {
    return iamClient.getAuthToken();
  },

  isAuthenticated(): boolean {
    return !!iamClient.getAuthToken();
  },
};

export default authService;
