/* ===================================
 * BOOKING DOMAIN INTERFACES
 * ================================= */

export interface Pet {
  id: string;
  name: string;
  type: "dog" | "cat" | "bird" | "other";
  breed?: string;
  age: number;
  weight: number;
  specialNeeds?: string;
  medicalHistory?: string;
  vaccinations?: Array<{
    name: string;
    date: Date;
    nextDue?: Date;
  }>;
  imageUrl?: string;
  // Add for backward compatibility
  avatar?: string;
  status?: string;
  color?: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category:
    | "grooming"
    | "training"
    | "boarding"
    | "walking"
    | "veterinary"
    | "other";
  requirements?: string[];
  addOns?: ServiceAddon[];
}

export interface ServiceAddon {
  id: string;
  name: string;
  description?: string;
  price: number;
  isRequired?: boolean;
}

export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  price?: number; // for dynamic pricing
}

export interface BookingRequest {
  id?: string;
  customerId: string;
  freelancerId: string;
  serviceId: string;
  petIds: string[];
  scheduledDate: Date;
  timeSlot: TimeSlot;
  specialRequests?: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  customerInfo: CustomerInfo;
  addOns?: ServiceAddon[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface BookingStatus {
  id: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  updatedAt: Date;
  notes?: string;
  updatedBy: "customer" | "freelancer" | "system";
}

// Additional types for booking page components
export interface PetInfoData {
  id?: string;
  petName: string;
  petType: string;
  petAge: string;
  petWeight: string;
  petSize: string;
  specialRequests?: string;
  // Add for backward compatibility
  duration?: string;
}

export interface DateTimeData {
  selectedDate: string;
  selectedTime: string;
  recurringService: boolean;
  frequency?: string;
  // Add for backward compatibility
  date?: string;
  time?: string;
}

export interface CustomerInfoData {
  fullName?: string;
  email?: string;
  phone?: string;
  address?:
    | {
        street: string;
        city: string;
        zipCode: string;
        country: string;
      }
    | string; // Allow string for backward compatibility
  emergencyContact?:
    | {
        name: string;
        phone: string;
        relationship: string;
      }
    | string; // Allow string for backward compatibility
}

export interface UserPet {
  id: string;
  name: string;
  type: string;
  avatar?: string;
  status?: string;
  color?: string;
  // Add for backward compatibility
  age?: string;
  gender?: string;
  breed?: string;
}
