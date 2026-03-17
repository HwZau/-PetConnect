/* ===================================
 * FREELANCER DOMAIN INTERFACES
 * ================================= */

export interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  bookingId?: string;
}

export interface FreelancerService {
  id: string;
  name: string;
  description: string;
  price: string | number;
  duration?: string;
  category?: string;
  isActive?: boolean;
}

export interface FreelancerStats {
  completedJobs: number;
  totalEarnings?: string | number;
  rating: number;
  responseTime: string;
  completionRate?: number;
  memberSince?: string;
}

export interface FreelancerAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}

export interface FreelancerPortfolio {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  createdAt: Date;
}

// Service interface - used in multiple contexts
export interface Service {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: string | number;
  category?: string;
  duration?: string;
  isActive?: boolean;
}

// FreelancerData interface for API responses
export interface FreelancerData {
  _id: string;
  id?: string;
  name: string;
  avatar?: string;
  location?: {
    city?: string;
    country?: string;
  };
  rating?: number;
  services?: Service[];
}

// Legacy Freelancer interface for backward compatibility
export interface Freelancer {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  description?: string; // Add for compatibility
  location?: string;
  rating: number;
  reviewCount?: number;
  skills?: string[];
  completedJobs?: number;
  responseTime?: string;
  isVerified?: boolean;
  avatar?: string;
  hourlyRate?: number;
  photos?: string[];
  category?: string; // Add for compatibility
  services?: FreelancerService[]; // Array of services offered by freelancer
  email?: string;
  phone?: string;
}
