import { createContext } from "react";
import type { UserContextType } from "../types";

// Create the context with default values
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});
