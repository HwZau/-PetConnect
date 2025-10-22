import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserContextType, User } from "../types";

// Create the context with default values
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Initialize user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
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

  const contextValue: UserContextType = {
    user,
    setUser: setUserWithStorage,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
