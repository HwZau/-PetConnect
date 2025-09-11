// Authentication services
import { apiClient } from "./apiClient";
import type { User, ApiResponse } from "../types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: "owner" | "caregiver";
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
      "/auth/login",
      credentials
    );

    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
    }

    return response;
  },

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);

    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
    }

    return response;
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>("/auth/logout");
    apiClient.setToken(null);
    return response;
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>("/auth/me");
  },

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/auth/forgot-password", { email });
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
