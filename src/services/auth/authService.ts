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
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );

    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
    }

    return response;
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
    apiClient.setToken(null);
    return response;
  },

  async getCurrentUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`${API_ENDPOINTS.USERS.PROFILE}/${id}`);
  },

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/auth/reset-password", { token, newPassword });
  },

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/auth/verify-email", { token });
  },

  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/auth/resend-verification");
  },
};
