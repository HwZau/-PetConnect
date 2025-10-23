import type { ReactNode } from "react";
import type {
  Review,
  FreelancerService,
  FreelancerStats,
} from "../domains/freelancer";
import type { FreelancerProfile } from "../domains/profile";
import type { BaseComponentProps } from "./common";

/* ===================================
 * FREELANCER FILTER INTERFACES
 * ================================= */

export interface FreelancerFilters {
  searchTerm?: string;
  category?: string;
  location?: string;
  rating?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

/* ===================================
 * FREELANCER COMPONENT PROPS
 * ================================= */

export interface FreelancerProfileHeaderProps extends BaseComponentProps {
  freelancer: FreelancerProfile;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookService: () => void;
  onContact?: () => void;
}

export interface FreelancerOverviewTabProps extends BaseComponentProps {
  freelancer: FreelancerProfile;
  services?: FreelancerService[];
  isLoading?: boolean;
}

export interface FreelancerReviewsTabProps extends BaseComponentProps {
  freelancer: FreelancerProfile;
  reviews?: Review[];
  onLoadMoreReviews?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export interface FreelancerPortfolioTabProps extends BaseComponentProps {
  freelancer: FreelancerProfile;
  onImageClick?: (imageUrl: string, index: number) => void;
  isLoading?: boolean;
}

export interface FreelancerTabNavigationProps extends BaseComponentProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
  tabs?: Array<{ id: string; label: string; count?: number }>;
}

export interface FreelancerSidebarProps extends BaseComponentProps {
  freelancer: FreelancerProfile;
  onBookService: () => void;
  onContact?: () => void;
  onCall?: () => void;
  stats?: FreelancerStats;
}

/* ===================================
 * FREELANCER LIST & FILTER PROPS
 * ================================= */

export interface FreelancerListProps extends BaseComponentProps {
  filters: FreelancerFilters;
  freelancers: FreelancerProfile[];
  onFreelancerClick?: (freelancer: FreelancerProfile) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export interface FreelancerCardProps extends BaseComponentProps {
  freelancer: FreelancerProfile;
  onClick?: (freelancer: FreelancerProfile) => void;
  onFavoriteToggle?: (freelancer: FreelancerProfile) => void;
  isFavorite?: boolean;
}

export interface FreelancerFiltersProps extends BaseComponentProps {
  filters?: FreelancerFilters;
  onFiltersChange?: (filters: FreelancerFilters) => void;
  availableCategories?: string[];
  availableLocations?: string[];
  // Add for backward compatibility
  onFilterChange?: (filters: any) => void;
}

export interface FreelancerHeroSectionProps extends BaseComponentProps {
  onSearch?: (filters: Partial<FreelancerFilters>) => void;
  totalFreelancers?: number;
  featuredCategories?: string[];
}
