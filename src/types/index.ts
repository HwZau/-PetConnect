/* ===================================
 * ORGANIZED TYPE SYSTEM
 *
 * This file serves as the main entry point for all type definitions.
 * Types are organized for domain entities (business logic interfaces).
 * Component props are now defined within their respective components.
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
export * from "./domains/PostCategory";

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
  address?: string;
  avatarUrl?: string;
  avatar?: string;
  role: string;
  isActive?: boolean;
  bookings?: Array<{
    bookingId: string;
    serviceType: string;
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled"; // BookingStatus enum values
    scheduledDate: string;
    totalPrice: number;
    pickUpStatus?: "NotPickedUp" | "PickedUp" | "Delivered"; // PickUpStatus enum values
    pickUpTime?: "Slot1" | "Slot2" | "Slot3" | "Slot4" | "Slot5"; // PickUpTime enum values
  }>;
  pets?: Array<{
    petId: string;
    petName: string;
    species: string;
    breed: string;
  }>;
  services?: Array<{
    id: string;
    title: string;
    description: string;
    type: "Grooming" | "Training" | "Walking" | "Sitting"; // ServiceType enum string representation
    price: number;
    createdAt?: string;
    updatedAt?: string;
    freelancerId?: string;
  }>;
}

// Legacy Context Types - update with new domain types when migrating
export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser?: () => Promise<void>;
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
