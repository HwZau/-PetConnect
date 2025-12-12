import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { authService } from "../services/auth/authService";
import { apiClient } from "../services/apiClient";
import {
  isAdminRole,
  extractRoleFromToken,
  extractUserIdFromToken,
} from "../utils/authUtils";
import type {
  LoginCredentials,
  RegisterData,
} from "../services/auth/authService";
import type { User } from "../types";
import { showSuccess, showError } from "../utils";

/**
 * Custom hook to use UserContext
 * Provides easy access to user state and authentication functions
 */
export const useAuth = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }

  const { user, setUser } = context;

  // Login and fetch profile
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        console.log("[useAuth.login] START with email:", credentials.email);

        // Step 1: Call login API
        const loginResponse = await authService.login(credentials);

        console.log("[useAuth.login] loginResponse:", loginResponse);

        if (!loginResponse.success || !loginResponse.data) {
          showError(loginResponse.message || "Đăng nhập thất bại");
          return { success: false };
        }

        // Step 2: token is set inside authService.login via apiClient.setToken
        const { token } = loginResponse.data;
        apiClient.setToken(token);

        // Step 3: Extract role and user id from JWT token
        const tokenRole = extractRoleFromToken(token);
        const tokenUserId = extractUserIdFromToken(token);

        console.log("[useAuth.login] tokenRole:", tokenRole);
        console.log("[useAuth.login] tokenUserId:", tokenUserId);

        // Step 4: Fetch full profile from backend (endpoint now supports all roles)
        const profileResponse = await authService.getProfile();

        console.log("[useAuth.login] profileResponse:", profileResponse);

        if (profileResponse.success && profileResponse.data) {
          // Profile fetched successfully
          setUser(profileResponse.data);
          localStorage.setItem("user", JSON.stringify(profileResponse.data));
          localStorage.setItem("auth_token", token);
          showSuccess("Đăng nhập thành công!");

          // No automatic navigation here; caller (LoginPage) will handle redirects

          return { success: true, user: profileResponse.data };
        }

        // getProfile failed, but token is valid - use fallback user from token
        console.log(
          "[useAuth.login] getProfile failed, using fallback user from token"
        );
        const fallbackUser: User = {
          id: tokenUserId || "",
          role: tokenRole || "customer",
        } as User;

        setUser(fallbackUser);
        localStorage.setItem("user", JSON.stringify(fallbackUser));
        localStorage.setItem("auth_token", token);
        showSuccess("Đăng nhập thành công!");

        // No automatic navigation here; caller (LoginPage) will handle redirects

        return { success: true, user: fallbackUser };
      } catch (error) {
        console.error("Login error:", error);
        showError("Đã xảy ra lỗi khi đăng nhập");
        return { success: false };
      }
    },
    [setUser]
  );

  // Register
  const register = useCallback(
    async (data: RegisterData) => {
      try {
        const response = await authService.register(data);

        if (!response.success || !response.data) {
          showError(response.message || "Đăng ký thất bại");
          return { success: false };
        }

        // After register, set token and try to fetch full profile
        const { token, user: registerUser } = response.data;
        apiClient.setToken(token);

        const profileResponse = await authService.getProfile();

        if (profileResponse.success && profileResponse.data) {
          setUser(profileResponse.data);
          localStorage.setItem("user", JSON.stringify(profileResponse.data));
          showSuccess("Đăng ký thành công!");
          return { success: true, user: profileResponse.data };
        }

        // Fallback to register response user if profile fetch failed
        if (registerUser) {
          setUser(registerUser);
          localStorage.setItem("user", JSON.stringify(registerUser));
          showSuccess("Đăng ký thành công!");
          return { success: true, user: registerUser };
        }

        return { success: false };
      } catch (error) {
        console.error("Register error:", error);
        showError("Đã xảy ra lỗi khi đăng ký");
        return { success: false };
      }
    },
    [setUser]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      showSuccess("Đăng xuất thành công!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      setUser(null);
      navigate("/");
    }
  }, [setUser, navigate]);

  // Check authentication status and refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        return { success: false };
      }


      // Always fetch profile from backend (endpoint supports all roles now)
      const response = await authService.getProfile();

      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        return { success: true, user: response.data };
      } else {
        // Token invalid, clear everything
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        setUser(null);
        return { success: false };
      }
    } catch (error) {
      console.error("Refresh user error:", error);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setUser(null);
      return { success: false };
    }
  }, [setUser]);

  const isAuthenticated = !!user;
  const isAdmin = isAdminRole(user?.role);

  return {
    user,
    setUser,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated,
    isAdmin,
  };
};

export default useAuth;
