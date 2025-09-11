// Core types for PawNest application

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
  role: "owner" | "caregiver" | "admin";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: "dog" | "cat" | "bird" | "rabbit" | "other";
  breed?: string;
  age: number;
  weight?: number;
  gender: "male" | "female";
  isNeutered: boolean;
  photos: string[];
  description?: string;
  medicalNotes?: string;
  emergencyContact?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Caregiver {
  id: string;
  userId: string;
  bio: string;
  hourlyRate: number;
  availableServices: ServiceType[];
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  availability: Availability[];
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  ownerId: string;
  caregiverId: string;
  petIds: string[];
  serviceType: ServiceType;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  status: BookingStatus;
  specialInstructions?: string;
  reviews?: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  bookingId?: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export type ServiceType =
  | "pet-sitting"
  | "dog-walking"
  | "pet-boarding"
  | "daycare"
  | "grooming";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "disputed";

export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

export interface SearchFilters {
  location?: {
    city?: string;
    radius?: number; // in kilometers
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  serviceType?: ServiceType;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  availability?: {
    startDate: Date;
    endDate: Date;
  };
  petSpecies?: string[];
}

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

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  bookingUpdates: boolean;
  messages: boolean;
  reviews: boolean;
  marketing: boolean;
}
