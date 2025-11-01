/* ===================================
 * ORGANIZED TYPE SYSTEM
 *
 * This file serves as the main entry point for all type definitions.
 * Types are organized into two categories:
 *
 * 1. DOMAINS: Business logic interfaces (User, Payment, etc.)
 * 2. COMPONENTS: React component prop interfaces
 *
 * See /types/README.md for detailed explanation
 * ================================= */

// Export all domain types (business logic interfaces)
export * from "./domains/payment";
export * from "./domains/freelancer";
export * from "./domains/events";
export * from "./domains/community";
export * from "./domains/booking";
export * from "./domains/profile";

// Export all component prop types (React component interfaces)
export * from "./components/common";
export * from "./components/payment";
export * from "./components/freelancer";
export * from "./components/events";
export * from "./components/community";
export * from "./components/booking";
export * from "./components/profile";

/* ===================================
 * LEGACY INTERFACES (MIGRATION IN PROGRESS)
 *
 * These are kept temporarily for backward compatibility.
 * Please use the organized types from domains/ and components/ instead.
 *
 * Migration Guide:
 * - User -> UserProfile (domains/profile.ts)
 * - Pet -> Pet (domains/booking.ts)
 * - Component props -> components/[domain].ts
 * ================================= */

// Legacy User interface - use UserProfile from domains/profile.ts instead
export interface User {
  id: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  avatar?: string;
  role: string;
  isActive?: boolean;
}

// Legacy Context Types - update with new domain types when migrating
export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Common API Response Types - can be used with organized types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
