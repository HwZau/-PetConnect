import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserContextType, User } from "../types";
import { authService } from "../services/auth/authService";

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
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Fetch fresh user data from API
          const response = await authService.getProfile();

          if (response.success && response.data) {
            setUser(response.data);
            // Update localStorage with fresh data
            localStorage.setItem("user", JSON.stringify(response.data));
          } else {
            // Token invalid, clear everything
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Clear invalid data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
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
      localStorage.removeItem("token");
    }
  };

  // Function to refresh user data from API
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await authService.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Error refreshing user profile:", error);
      }
    }
  };

  const contextValue: UserContextType = {
    user,
    setUser: setUserWithStorage,
    refreshUser,
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
