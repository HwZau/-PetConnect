/* ===================================
 * EVENT DOMAIN INTERFACES
 * ================================= */

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: Date;
  endDate: Date;
  organizer: string;
  maxParticipants?: number;
  currentParticipants: number;
  price: number;
  imageUrl?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface EventCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface EventParticipant {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: Date;
  status: "registered" | "attended" | "cancelled";
}

export interface FilterState {
  searchTerm?: string;
  search?: string; // Make optional again
  category?: string;
  location?: string;
  rating?: string;
  dateRange?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

// Separate interface for FreelancerPage
export interface FreelancerFilterState {
  searchTerm?: string;
  category?: string;
  location?: string;
  rating?: string;
  search?: string; // Optional for freelancer filters
}
