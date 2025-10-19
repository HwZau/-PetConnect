import type { ReactNode } from "react";

/* ===================================
 * CORE ENTITY INTERFACES
 * ================================= */

// User & Authentication - Used in UserContext, Login/Register pages, Profile components
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string; // For simplified user context
  phoneNumber?: string;
  avatar?: string;
  role: "owner" | "caregiver" | "admin" | "user" | "staff";
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Pet Entity - Used in Pet components, Profile page, Booking components
export interface Pet {
  id: string;
  ownerId?: string;
  name: string;
  species?: "dog" | "cat" | "bird" | "rabbit" | "other";
  type?: string; // Alternative to species for simplified components
  breed?: string;
  age: number | string; // Allow both for flexibility
  weight?: number | string;
  gender: "male" | "female" | string;
  isNeutered?: boolean;
  photos?: string[];
  description?: string;
  medicalNotes?: string;
  emergencyContact?: string;
  isActive?: boolean;
  status?: string; // For profile components
  avatar?: string; // For profile components
  color?: string; // For UI styling
  createdAt?: Date;
  updatedAt?: Date;
}

// Freelancer/Caregiver - Used in FreelancerPage, FreelancerList, Booking components
export interface Freelancer {
  id: string | number;
  name: string;
  avatar: string;
  title?: string;
  bio?: string;
  rating: number;
  reviewCount?: number;
  totalReviews?: number;
  location: string;
  completedJobs?: number;
  responseTime?: string;
  category?: string;
  hourlyRate?: number;
  availableServices?: ServiceType[];
  isVerified?: boolean;
  availability?: Availability[];
  photos?: string[];
  description?: string;
  skills?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Service Types - Used across all service-related components
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

// Service Entity - Used in Profile components, Recent services, Favorite services
export interface Service {
  id: number | string;
  name?: string;
  title?: string; // Alternative naming
  provider?: string;
  date?: string;
  status?: "completed" | "upcoming" | "cancelled" | string;
  price?: number;
  rating?: number;
  image?: string;
  description?: string;
  desc?: string; // Alternative naming for description
  location?: string; // For recent services
  color?: string; // For UI styling
  icon?: ReactNode; // For UI icons
  bgColor?: string; // For UI background
  percentage?: string; // For progress indicators
}

/* ===================================
 * BOOKING SYSTEM INTERFACES
 * ================================= */

// Booking Entity - Main booking data structure
export interface Booking {
  id: string;
  ownerId: string;
  caregiverId: string;
  petIds?: string[];
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

// Booking Form Data - Used in BookingPage components
export interface PetInfoData {
  petType: string;
  petSize: string;
  duration: string;
  petName?: string;
  petAge?: string;
  petWeight?: string;
}

export interface DateTimeData {
  date: string;
  time: string;
  recurringService: boolean;
  frequency?: string;
}

export interface CustomerInfoData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact?: string;
}

// Booking Component Props - Used in booking form components
export interface ServiceSelectionProps {
  selectedService: string;
  onServiceChange: (serviceId: string) => void;
  error?: string;
}

export interface PetInformationProps {
  petInfo: PetInfoData[];
  onPetInfoChange: (
    petIndex: number,
    field: keyof PetInfoData,
    value: string
  ) => void;
  onAddPet: () => void;
  onRemovePet: (petIndex: number) => void;
  errors: Record<string, string>;
}

export interface DateTimeSelectionProps {
  dateTimeData: DateTimeData;
  onDateTimeChange: (
    field: keyof DateTimeData,
    value: string | boolean
  ) => void;
  errors: Record<string, string>;
}

export interface CustomerInformationProps {
  customerInfo: CustomerInfoData;
  onCustomerInfoChange: (field: keyof CustomerInfoData, value: string) => void;
  errors: Record<string, string>;
}

export interface BookingHeaderProps {
  selectedFreelancer?: Freelancer;
}

export interface BookingSummaryProps {
  selectedFreelancer?: Freelancer;
  selectedService?: string;
  petInfo: PetInfoData[];
  date: string;
  time: string;
  recurringService: boolean;
  frequency?: string;
  onSubmit: () => void;
}

export interface SpecialRequestsProps {
  specialRequests: string;
  onSpecialRequestsChange: (value: string) => void;
}

/* ===================================
 * PAYMENT SYSTEM INTERFACES
 * ================================= */

// Payment Data - Used in PaymentPage and PaymentStatusPage
export interface PaymentBookingData {
  freelancer: {
    id: string;
    name: string;
    rating: number;
    avatar: string;
    location: string;
  };
  service: string;
  petInfo: Array<{
    petType: string;
    petName: string;
    petSize: string;
    duration: string;
  }>;
  dateTime: {
    date: string;
    time: string;
    recurringService: boolean;
    frequency?: string;
  };
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  specialRequests?: string;
}

export interface PaymentStatusData {
  status: "success" | "failed";
  bookingData: PaymentBookingData;
  totalAmount: number;
  paymentMethod: string;
  transactionId: string;
}

/* ===================================
 * FILTER & SEARCH INTERFACES
 * ================================= */

// Common Filter State - Used in FreelancerPage, EventPage, Search components
export interface FilterState {
  searchTerm?: string;
  search?: string; // Alternative naming for events
  category?: string;
  location?: string;
  rating?: string;
  dateRange?: string; // For event filters
  priceRange?: {
    min: number;
    max: number;
  };
}

// Advanced Search Filters - Used in main search functionality
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

/* ===================================
 * COMPONENT PROPS INTERFACES
 * ================================= */

// Freelancer Components - Used in FreelancerPage and related components
export interface FreelancerListProps {
  filters: FilterState;
}

export interface FreelancerFiltersProps {
  filters: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
  onFilterChange?: (filters: Partial<FilterState>) => void; // Alternative naming
}

export interface FreelancerHeroSectionProps {
  onSearch?: (filters: {
    searchTerm?: string;
    location?: string;
    category?: string;
  }) => void;
}

// Event Components - Used in EventPage and related components
export interface EventFiltersProps {
  filters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
  onFilterChange?: (filters: FilterState) => void; // Alternative naming
}

export interface EventListSectionProps {
  filters: FilterState;
}

export interface IncomingEventsSectionProps {
  filters: FilterState;
}

// Profile Components - Used in UserProfilePage
export interface UserProfileCardProps {
  user?: User & {
    // Additional fields specific to profile card
    location?: string;
    memberSince?: string;
  };
}

export interface UserStatsProps {
  stats?: {
    totalBookings?: number;
    totalSpent?: number;
    favoriteServices?: number;
    memberSince?: string;
    // Alternative naming for different components
    friendsCount?: number;
    petCount?: number;
    reviewCount?: number;
    messagesCount?: string | number;
  };
}

export interface UserPetsProps {
  pets?: Pet[];
}

export interface RecentServicesProps {
  services?: Service[];
}

export interface FavoriteServicesProps {
  services?: Service[];
}

/* ===================================
 * UTILITY & HELPER INTERFACES
 * ================================= */

// API Response Types
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

// Context Types
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

// Notification & Preferences
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  bookingUpdates: boolean;
  messages: boolean;
  reviews: boolean;
  marketing: boolean;
}

// Reviews & Messages
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

// Availability & Scheduling
export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

/* ===================================
 * DEPRECATED INTERFACES (TO BE REMOVED)
 * ================================= */

// These interfaces are kept for backward compatibility
// TODO: Remove after migrating all components to use the consolidated interfaces above

export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface MultiplePetsData {
  pets: PetInfoData[];
}

export interface UserPet {
  id: string;
  name: string;
  type: string;
  age: string;
  gender: string;
  breed: string;
}

export interface FavoriteService {
  id: number;
  name: string;
  provider: string;
  price: number;
  rating: number;
  image: string;
}
