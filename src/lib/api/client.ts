import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';

// Create axios instance
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Only attach token for browser requests, not during SSR
    if (typeof window !== 'undefined') {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle unauthorized errors (401)
    if (error.response?.status === 401) {
      // If we haven't tried to refresh the token yet
      if (!originalRequest?._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          const res = await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true });

          if (res.status === 200) {
            // If refresh was successful, retry the original request
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, sign out the user
          if (typeof window !== 'undefined') {
            signOut({ callbackUrl: '/login' });
          }
        }
      } else {
        // If we've already tried to refresh, sign out
        if (typeof window !== 'undefined') {
          signOut({ callbackUrl: '/login' });
        }
      }
    }

    // Handle forbidden errors (403)
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    }

    // Handle not found errors (404)
    if (error.response?.status === 404) {
      toast.error('The requested resource was not found');
    }

    // Handle validation errors (422)
    if (error.response?.status === 422) {
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        Object.values(validationErrors).forEach((message: any) => {
          if (typeof message === 'string') {
            toast.error(message);
          } else if (Array.isArray(message)) {
            message.forEach((msg) => toast.error(msg));
          }
        });
      } else {
        toast.error('Validation failed');
      }
    }

    // Handle server errors (500)
    if (error.response?.status === 500) {
      toast.error('Server error occurred. Please try again later.');
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      toast.error('Unable to connect to the server. Please check your internet connection.');
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      toast.error('The request timed out. Please try again.');
    }

    return Promise.reject(error);
  }
);

// Define API response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Helper function to access API data directly
export const extractApiData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  return response.data.data;
};
