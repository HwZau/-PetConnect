// Authentication services
import { apiClient } from "../apiClient";
import type { User, ApiResponse } from "../../types";
import { API_ENDPOINTS } from "../../config/api";
import { isAdminRole } from "../../utils/authUtils";

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
    // Clear localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    return response;
  },


  async getProfile(): Promise<ApiResponse<User>> {
    console.log("[authService.getProfile] START");

    // Check if current user is admin - if so, return cached user instead of calling API
    const userStr = localStorage.getItem("user");
    let userObj: unknown = null;
    try {
      userObj = userStr ? JSON.parse(userStr) : null;
    } catch {
      /* ignore */
    }

    console.log("[authService.getProfile] userObj:", userObj);

    if (
      userObj &&
      typeof userObj === "object" &&
      userObj !== null &&
      "role" in userObj &&
      typeof (userObj as { role: unknown }).role === "string" &&
      isAdminRole((userObj as { role: string }).role)
    ) {
      // Admin user - return cached user without calling API
      console.log("[authService.getProfile] Admin detected, returning cached user");
      return {
        success: true,
        data: userObj as User,
        message: "User from cache",
        statusCode: 200,
      };
    }

    console.log("[authService.getProfile] Non-admin user, calling API");

    // For non-admin users, try to fetch profile from API
    const basicProfile = await apiClient.get<User>(API_ENDPOINTS.USERS.PROFILE);

    if (basicProfile.success) {
      console.log("[authService.getProfile] Basic profile success");
      return basicProfile;
    }

    console.log("[authService.getProfile] Basic profile failed, trying freelancer profile");

    // If basic profile fails, try freelancer profile
    const freelancerProfile = await apiClient.get<User>(
      API_ENDPOINTS.USERS.FREELANCER_PROFILE
    );

    if (freelancerProfile.success) {
      console.log("[authService.getProfile] Freelancer profile success");
      return freelancerProfile;
    }

    // Both failed, return the error
    console.log("[authService.getProfile] Both profiles failed");
    return basicProfile;
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
