/* ===================================
 * BOOKING DOMAIN INTERFACES
 * ================================= */

// Enum types matching backend
export enum PickUpTime {
  Slot1 = "Slot1", // 8:00 AM - 10:00 AM
  Slot2 = "Slot2", // 10:00 AM - 12:00 PM
  Slot3 = "Slot3", // 12:00 PM - 2:00 PM
  Slot4 = "Slot4", // 2:00 PM - 4:00 PM
  Slot5 = "Slot5", // 4:00 PM - 6:00 PM
}

export enum BookingStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum PickUpStatus {
  NotPickedUp = "NotPickedUp",
  PickedUp = "PickedUp",
  Delivered = "Delivered",
}

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
  timeSlot: TimeSlot | PickUpTime; // Can use enum
  specialRequests?: string;
  totalAmount: number;
  status: BookingStatus;
  pickUpStatus?: PickUpStatus;
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

// Interface for tracking booking status changes
export interface BookingStatusHistory {
  id: string;
  status: BookingStatus;
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
  selectedTime: PickUpTime | string;
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
