import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserContextType, User } from "../types";
import { authService } from "../services/auth/authService";
import { extractUserIdFromToken, extractRoleFromToken } from "../utils/authUtils";

// Create the context with default values
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  refreshUser: async () => {},
});

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from token on app start
  useEffect(() => {
    const initializeUser = async () => {
      console.log("[UserContext.initializeUser] START");

      const token = localStorage.getItem("auth_token");
      // If token exists, always try to fetch latest profile from backend
      const userStr = localStorage.getItem("user");
      let userObj: unknown = null;
      try {
        userObj = userStr ? JSON.parse(userStr) : null;
      } catch { /* ignore JSON parse error */ }

      console.log("[UserContext.initializeUser] token:", !!token);
      console.log("[UserContext.initializeUser] userObj:", userObj);

      if (token) {
        try {
          console.log("[UserContext.initializeUser] Calling getProfile");
          // Fetch fresh user data from API
          const response = await authService.getProfile();

          console.log("[UserContext.initializeUser] getProfile response:", response);

          if (response.success && response.data) {
            setUser(response.data);
            // Update localStorage with fresh data
            localStorage.setItem("user", JSON.stringify(response.data));
          } else {
            // Profile API failed, use token data
            console.log("[UserContext.initializeUser] Profile failed, using token data");
            const tokenData = extractUserIdFromToken(token);
            const roleData = extractRoleFromToken(token);
            if (tokenData) {
              const tokenUser = { id: tokenData, role: roleData || 'customer' };
              setUser(tokenUser as User);
              localStorage.setItem("user", JSON.stringify(tokenUser));
            } else {
              // Invalid token
              localStorage.removeItem("auth_token");
              localStorage.removeItem("user");
              setUser(null);
            }
          }
        } catch (error) {
          console.error("[UserContext.initializeUser] Error:", error);
          // Exception, use token data
          const tokenData = extractUserIdFromToken(token);
          const roleData = extractRoleFromToken(token);
          if (tokenData) {
            const tokenUser = { id: tokenData, role: roleData || 'customer' };
            setUser(tokenUser as User);
            localStorage.setItem("user", JSON.stringify(tokenUser));
          } else {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            setUser(null);
          }
        }
      } else {
        // No token, clear user
        setUser(null);
      }

      setIsLoading(false);
    };

    initializeUser();
  }, []);

  // Enhanced setUser function to also handle localStorage
  const setUserWithStorage = (newUser: User | null) => {
    setUser(newUser);

    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      // Clear user data when logging out
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
    }
  };

  // Function to refresh user data from API
  const refreshUser = async () => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");
    let userObj: unknown = null;
    try {
      userObj = userStr ? JSON.parse(userStr) : null;
    } catch { /* ignore JSON parse error */ }

    // Always try to refresh from API, fall back to cached if it fails
    if (token) {
      try {
        const response = await authService.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        } else if (userObj) {
          // API failed, use cached user
          setUser(userObj as User);
        }
      } catch (error) {
        console.error("Error refreshing user profile:", error);
        // API failed, keep cached user if available
        if (userObj) {
          setUser(userObj as User);
        }
      }
    }
  };

  const contextValue: UserContextType = {
    user,
    setUser: setUserWithStorage,
    refreshUser,
    isLoading,
  };

  // Note: Don't show loading screen here - let AppRoutes handle it
  // So that routes can render while waiting for auth check
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
