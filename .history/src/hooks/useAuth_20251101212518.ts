import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { authService } from "../services/auth/authService";
import type {
  LoginCredentials,
  RegisterData,
} from "../services/auth/authService";
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
        // Step 1: Call login API
        const loginResponse = await authService.login(credentials);

        if (!loginResponse.success || !loginResponse.data) {
          showError(loginResponse.message || "Đăng nhập thất bại");
          return { success: false };
        }

        // Step 2: Save token to localStorage
        const { token } = loginResponse.data;
        localStorage.setItem("auth_token", token);

        // Step 3: Fetch user profile from /user/profile/me
        const profileResponse = await authService.getProfile();

        if (!profileResponse.success || !profileResponse.data) {
          showError("Không thể lấy thông tin người dùng");
          localStorage.removeItem("token");
          return { success: false };
        }

        // Step 4: Set user to context and localStorage
        setUser(profileResponse.data);
        showSuccess("Đăng nhập thành công!");

        return { success: true, user: profileResponse.data };
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

        // After register, also fetch profile
        const { token } = response.data;
        localStorage.setItem("token", token);

        const profileResponse = await authService.getProfile();

        if (profileResponse.success && profileResponse.data) {
          setUser(profileResponse.data);
          showSuccess("Đăng ký thành công!");
          return { success: true, user: profileResponse.data };
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

      const response = await authService.getProfile();

      if (response.success && response.data) {
        setUser(response.data);
        return { success: true, user: response.data };
      } else {
        // Token invalid, clear everything
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        return { success: false };
      }
    } catch (error) {
      console.error("Refresh user error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      return { success: false };
    }
  }, [setUser]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

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
