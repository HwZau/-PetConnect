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

// Booking related interfaces
export interface Freelancer {
  id: number;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  reviewCount: number;
  location: string;
  completedJobs: number;
  responseTime: string;
  category?: string;
  price?: string;
  description?: string;
  skills?: string[];
  isVerified?: boolean;
}

export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface PetInfoData {
  petType: string;
  petSize: string;
  duration: string;
  petName?: string;
  petAge?: string;
  petWeight?: string;
}

export interface MultiplePetsData {
  pets: PetInfoData[];
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
  emergencyContact: string;
}

export interface UserPet {
  id: string;
  name: string;
  type: string;
  age: string;
  gender: string;
  breed: string;
}

// Component Props interfaces
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

// Common filter interfaces
export interface FilterState {
  searchTerm: string;
  category: string;
  location: string;
  rating: string;
}

// Service related interfaces
export interface Service {
  id: number;
  name: string;
  provider: string;
  date: string;
  status: "completed" | "upcoming" | "cancelled";
  price: number;
  rating?: number;
}

export interface FavoriteService {
  id: number;
  name: string;
  provider: string;
  price: number;
  rating: number;
  image: string;
}

// Props interfaces
export interface FreelancerListProps {
  filters: FilterState;
}
