import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

interface ApiConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
  }> = [];

  constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      withCredentials: config.withCredentials || false,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add JWT token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY || 'auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle 401 and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
            // Wait for the refresh promise to complete
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve: (token: string) => {
                  if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                  }
                  resolve(this.client(originalRequest));
                },
                reject: reject,
              });
            });
          }

          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem(
              import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'refresh_token'
            );

            if (!refreshToken) {
              // No refresh token available, clear auth and reject
              this.clearAuth();
              return Promise.reject(error);
            }

            // Attempt token refresh
            const newToken = await this.refreshAuthToken(refreshToken);

            if (newToken) {
              // Process queued requests
              this.failedQueue.forEach(({ resolve }) => {
                resolve(newToken);
              });
              this.failedQueue = [];

              // Retry original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return this.client(originalRequest);
            } else {
              this.clearAuth();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            this.failedQueue = [];
            this.clearAuth();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAuthToken(refreshToken: string): Promise<string | null> {
    try {
      // Note: Implement this based on your API's token refresh endpoint
      // This is a placeholder - adjust according to your actual API
      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY_URL}${import.meta.env.VITE_API_IAM_PATH}/api/auth/refresh`,
        { refreshToken }
      );

      const newToken = response.data.token || response.data.accessToken;
      if (newToken) {
        localStorage.setItem(import.meta.env.VITE_TOKEN_STORAGE_KEY || 'auth_token', newToken);
        return newToken;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  private clearAuth(): void {
    localStorage.removeItem(import.meta.env.VITE_TOKEN_STORAGE_KEY || 'auth_token');
    localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'refresh_token');
    // Dispatch logout event or trigger store update if needed
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  getClient(): AxiosInstance {
    return this.client;
  }

  setAuthToken(token: string, refreshToken?: string): void {
    const tokenKey = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'auth_token';
    const refreshTokenKey = import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'refresh_token';
    
    localStorage.setItem(tokenKey, token);
    if (refreshToken) {
      localStorage.setItem(refreshTokenKey, refreshToken);
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY || 'auth_token');
  }

  removeAuthToken(): void {
    this.clearAuth();
  }
}

// Create instances for different API services
const iamClient = new ApiClient({
  baseURL: `${import.meta.env.VITE_API_GATEWAY_URL}${import.meta.env.VITE_API_IAM_PATH}`,
});

const courseClient = new ApiClient({
  baseURL: `${import.meta.env.VITE_API_GATEWAY_URL}${import.meta.env.VITE_API_COURSE_PATH}`,
});

export { iamClient, courseClient };
export default ApiClient;
