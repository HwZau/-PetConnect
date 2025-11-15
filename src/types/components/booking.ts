/* ===================================
 * BOOKING COMPONENT PROPS
 * ================================= */

import type {
  Pet,
  ServiceOption,
  TimeSlot,
  BookingRequest,
  CustomerInfo,
  ServiceAddon,
  CustomerInfoData,
} from "../domains/booking";
import type { BaseComponentProps } from "./common";

export interface BookingHeaderProps extends BaseComponentProps {
  currentStep?: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
  selectedFreelancer?: any; // Add this for backward compatibility
}

export interface ServiceSelectionProps extends BaseComponentProps {
  services?: ServiceOption[];
  selectedServiceId?: string;
  selectedService?: string; // Deprecated - for backward compatibility
  selectedServiceIds?: string[]; // New - support multiple selection
  onServiceSelect?: (serviceId: string) => void;
  onServiceChange?: (serviceId: string) => void; // Add for backward compatibility
  isLoading?: boolean;
  error?: string; // Add for backward compatibility
  freelancer?: any; // Add freelancer to filter services
}

export interface PetInformationProps extends BaseComponentProps {
  pets?: Pet[];
  selectedPetIds?: string[];
  onPetToggle?: (petId: string) => void;
  onAddPet?: () => void;
  allowMultiple?: boolean;
  // Add for backward compatibility
  petInfo?: any[];
  onPetInfoChange?: (petIndex: number, field: string, value: string) => void;
  onRemovePet?: (petIndex: number) => void;
  errors?: Record<string, string>;
}

export interface DateTimeSelectionProps extends BaseComponentProps {
  availableSlots?: TimeSlot[];
  selectedDate?: Date;
  selectedSlot?: TimeSlot;
  onDateSelect?: (date: Date) => void;
  onSlotSelect?: (slot: TimeSlot) => void;
  freelancerId?: string;
  serviceId?: string;
  // Add for backward compatibility
  dateTimeData?: any;
  onDateTimeChange?: (field: string, value: string | boolean) => void;
  errors?: Record<string, string>;
}

export interface CustomerInformationProps extends BaseComponentProps {
  customerInfo?: Partial<CustomerInfo> | CustomerInfoData;
  onInfoChange?: (info: Partial<CustomerInfo>) => void;
  errors?: Record<string, string>;
  isEditable?: boolean;
  // Add for backward compatibility
  onCustomerInfoChange?: (field: string, value: string) => void;
}

export interface SpecialRequestsProps extends BaseComponentProps {
  specialRequests?: string;
  onRequestsChange?: (requests: string) => void;
  maxLength?: number;
  placeholder?: string;
  // Add for backward compatibility
  onSpecialRequestsChange?: (value: string) => void;
}

export interface BookingSummaryProps extends BaseComponentProps {
  booking?: Partial<BookingRequest>;
  service?: ServiceOption;
  pets?: Pet[];
  customerInfo?: CustomerInfo;
  onEdit?: (
    section: "service" | "pets" | "datetime" | "customer" | "requests"
  ) => void;
  isConfirming?: boolean;
  onConfirm?: () => void;
  // Add for backward compatibility
  selectedFreelancer?: any;
  selectedService?: string;
  petInfo?: any[];
  date?: any;
  time?: any;
  recurringService?: any;
  frequency?: any;
  onSubmit?: () => void;
}

export interface ServiceAddonSelectorProps extends BaseComponentProps {
  addOns: ServiceAddon[];
  selectedAddOns: string[];
  onAddOnToggle: (addOnId: string) => void;
  allowMultiple?: boolean;
}
