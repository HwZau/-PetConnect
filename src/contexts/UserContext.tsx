import { createContext, type Dispatch, type SetStateAction } from "react";

// Define the User interface
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: "user" | "admin" | "staff";
  avatar?: string;
  // Add any other user properties you need
}

// Define the context type
export interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

// Create the context with default values
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});
