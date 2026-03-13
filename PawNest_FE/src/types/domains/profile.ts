/* ===================================
 * PROFILE DOMAIN INTERFACES
 * ================================= */

// Pet interface for user profile (simpler version)
export interface UserPet {
  petId: string;
  petName: string;
  species: string;
  breed: string;
}

// Booking interface for user profile
export interface Booking {
  bookingId: string;
  serviceType: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  scheduledDate: string;
  totalPrice: number;
  pickUpStatus?: "NotPickedUp" | "PickedUp" | "Delivered";
  pickUpTime?: "Slot1" | "Slot2" | "Slot3" | "Slot4" | "Slot5";
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
  role: "Customer" | "Freelancer" | "Admin";
  bookings?: Booking[];
  pets?: UserPet[];
  // Additional fields for backward compatibility
  avatar?: string;
  phone?: string;
  isVerified?: boolean;
  createdAt?: Date;
  lastLoginAt?: Date;
  preferences?: UserPreferences;
  location?: string;
  memberSince?: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showProfile: boolean;
    showEmail: boolean;
    showPhone: boolean;
  };
  language: string;
  currency: string;
  theme: "light" | "dark" | "system";
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface FreelancerProfile extends UserProfile {
  businessName?: string;
  description: string;
  specializations: string[];
  experience: number; // years
  certifications: Certification[];
  portfolio: PortfolioItem[];
  availability: Availability;
  pricing: PricingTier[];
  rating: number;
  reviewsCount: number;
  completedBookings: number;
  responseTime: number; // in hours
  serviceArea: ServiceArea;
  isActive: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  issuedDate: Date;
  expiryDate?: Date;
  credentialUrl?: string;
  isVerified: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  serviceType: string;
  completedDate: Date;
  clientTestimonial?: string;
}

export interface Availability {
  schedule: WeeklySchedule;
  exceptions: DateException[];
  advanceBooking: number; // days in advance
  timezone: string;
}

export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isAvailable: boolean;
  timeSlots: Array<{
    startTime: string; // "09:00"
    endTime: string; // "17:00"
  }>;
}

export interface DateException {
  date: Date;
  isAvailable: boolean;
  reason?: string;
  customTimeSlots?: Array<{
    startTime: string;
    endTime: string;
  }>;
}

export interface PricingTier {
  serviceType: string;
  basePrice: number;
  currency: string;
  unit: "hour" | "session" | "day";
  description?: string;
}

export interface ServiceArea {
  type: "radius" | "regions";
  radius?: number; // in km
  centerLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  regions?: string[]; // city names or postal codes
}

export interface UserStats {
  totalBookings: number;
  totalSpent?: number; // for customers
  totalEarned?: number; // for freelancers
  favoriteServices: string[];
  joinDate: Date;
  lastActivity: Date;
  // Add for backward compatibility
  friendsCount?: number;
  petCount?: number;
  reviewCount?: number;
  messagesCount?: string;
}
