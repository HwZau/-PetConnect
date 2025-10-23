/* ===================================
 * PROFILE COMPONENT PROPS
 * ================================= */

import type { UserProfile, UserStats, Certification } from "../domains/profile";
import type { Pet } from "../domains/booking";
import type { BaseComponentProps } from "./common";

export interface UserProfileCardProps extends BaseComponentProps {
  user: UserProfile;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onViewFullProfile?: () => void;
}

export interface UserStatsProps extends BaseComponentProps {
  stats: UserStats;
  userType: "customer" | "freelancer";
  isLoading?: boolean;
}

export interface UserPetsProps extends BaseComponentProps {
  pets: Pet[];
  isEditable?: boolean;
  onAddPet?: () => void;
  onEditPet?: (petId: string) => void;
  onDeletePet?: (petId: string) => void;
}

export interface QuickActionsProps extends BaseComponentProps {
  actions: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }>;
}

export interface FavoriteServicesProps extends BaseComponentProps {
  services: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    rating: number;
    imageUrl?: string;
    // Add for backward compatibility
    title?: string;
    desc?: string;
    icon?: React.ReactNode;
    bgColor?: string;
  }>;
  onServiceClick?: (serviceId: string) => void;
  onRemoveFavorite?: (serviceId: string) => void;
}

export interface RecentServicesProps extends BaseComponentProps {
  bookings?: Array<{
    id: string;
    serviceName: string;
    freelancerName: string;
    date: Date;
    status: "completed" | "upcoming" | "cancelled";
    rating?: number;
  }>;
  onBookingClick?: (bookingId: string) => void;
  onRateService?: (bookingId: string, rating: number) => void;
  // Add for backward compatibility
  services?: any[];
}

export interface ChatSupportProps extends BaseComponentProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: Array<{
    id: string;
    content: string;
    timestamp: Date;
    sender: "user" | "support";
  }>;
  onSendMessage: (message: string) => void;
  isConnected?: boolean;
}

// Note: Freelancer-specific profile props are in ./freelancer.ts to avoid duplication

export interface CertificationDisplayProps extends BaseComponentProps {
  certifications: Certification[];
  isEditable?: boolean;
  onAdd?: () => void;
  onEdit?: (certId: string) => void;
  onDelete?: (certId: string) => void;
}
