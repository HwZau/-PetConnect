import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

/**
 * Custom hook to use UserContext
 * Provides easy access to user state and authentication functions
 */
export const useAuth = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }

  const { user, setUser } = context;

  // Helper functions
  const login = (token: string) => {
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return {
    user,
    setUser,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };
};

export default useAuth;
