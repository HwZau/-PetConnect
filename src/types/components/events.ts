import type { FilterState, Event } from "../domains/events";

/* ===================================
 * EVENT COMPONENT PROPS
 * ================================= */

export interface EventFiltersProps {
  filters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
  onFilterChange?: (filters: FilterState) => void;
  categories?: Array<{ id: string; name: string }>;
}

export interface EventListSectionProps {
  filters: FilterState;
  events?: Event[];
  onEventClick?: (event: Event) => void;
  isLoading?: boolean;
}

export interface IncomingEventsSectionProps {
  filters: FilterState;
  events?: Event[];
  onEventClick?: (event: Event) => void;
  maxEvents?: number;
}

export interface EventHeroSectionProps {
  onSearch?: (filters: {
    searchTerm?: string;
    location?: string;
    category?: string;
  }) => void;
}
