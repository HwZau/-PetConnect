// Authentication services
import { apiClient } from "../apiClient";
import type { User, ApiResponse } from "../../types";
import { API_ENDPOINTS } from "../../config/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
    }

    return response;
  },

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      console.log('Sending register request with data:', data);
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );
      console.log('Register response:', response);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
    apiClient.setToken(null);
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return response;
  },

  // Get current user profile from /user/profile/me
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>("/user/profile/me");
  },

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.RESET, { email });
  },

  async verifiedEmailReset(
    code: string,
    email: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.VERIFIED_RESET, {
      code,
      email,
      newPassword,
    });
  },

  async disableAccount(
    email: string,
    userName: string
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.DISABLE, {
      email,
      userName,
    });
  },

  async verifiedDisableAccount(
    email: string,
    code: string
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.VERIFIED_DISABLE, {
      email,
      code,
    });
  },
};
