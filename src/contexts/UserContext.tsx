import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserContextType, User } from "../types";
import { authService } from "../services/auth/authService";
import { isAdminRole } from "../utils/authUtils";

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
      // Nếu đã có user trong localStorage và là admin thì không gọi getProfile
      const userStr = localStorage.getItem("user");
      let userObj: unknown = null;
      try {
        userObj = userStr ? JSON.parse(userStr) : null;
      } catch { /* ignore JSON parse error */ }

      console.log("[UserContext.initializeUser] token:", !!token);
      console.log("[UserContext.initializeUser] userObj:", userObj);

      if (
        token &&
        userObj &&
        typeof userObj === "object" &&
        userObj !== null &&
        "role" in userObj &&
        typeof (userObj as { role: unknown }).role === "string" &&
        isAdminRole((userObj as { role: string }).role)
      ) {
        console.log("[UserContext.initializeUser] Admin user detected, returning cached");
        setUser(userObj as User);
        setIsLoading(false);
        return;
      }

      if (token) {
        try {
          console.log("[UserContext.initializeUser] Non-admin, calling getProfile");
          // Fetch fresh user data from API
          const response = await authService.getProfile();

          console.log("[UserContext.initializeUser] getProfile response:", response);

          if (response.success && response.data) {
            setUser(response.data);
            // Update localStorage with fresh data
            localStorage.setItem("user", JSON.stringify(response.data));
          } else {
            // Profile API failed, but keep cached user if available
            if (userObj) {
              console.log(
                "[UserContext.initializeUser] getProfile failed, using cached user"
              );
              setUser(userObj as User);
            } else {
              // No cached user, token might be invalid
              console.log(
                "[UserContext.initializeUser] getProfile failed, no cached user"
              );
              localStorage.removeItem("auth_token");
              localStorage.removeItem("user");
            }
          }
        } catch (error) {
          console.error(
            "[UserContext.initializeUser] Error fetching user profile:",
            error
          );
          // Profile API failed, keep cached user if available
          if (userObj) {
            console.log(
              "[UserContext.initializeUser] Exception, using cached user"
            );
            setUser(userObj as User);
          } else {
            // No cached user, clear token
            console.log(
              "[UserContext.initializeUser] Exception, no cached user"
            );
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
          }
        }
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

    // If admin, no need to refresh from API
    if (
      token &&
      userObj &&
      typeof userObj === "object" &&
      userObj !== null &&
      "role" in userObj &&
      typeof (userObj as { role: unknown }).role === "string" &&
      isAdminRole((userObj as { role: string }).role)
    ) {
      setUser(userObj as User);
      return;
    }

    // For non-admin, try to fetch from API, but fall back to cached if it fails
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
