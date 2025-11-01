import { useState } from "react";
import type { FilterState } from "../../types";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import EventHeroSection from "../../components/events/EventHeroSection";
import EventListSection from "../../components/events/EventListSection";
import IncomingEventsSection from "../../components/events/IncomingEventsSection";
import EventFilters from "../../components/events/EventFilters";
import { useScrollToTop } from "../../hooks";
import type { FilterState } from "../../types";

const EventPage = () => {
  // Scroll to top when page loads
  useScrollToTop();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    location: "",
    dateRange: "",
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Here you can implement the actual filtering logic
    console.log("Filters changed:", newFilters);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <EventHeroSection />
      <EventFilters onFilterChange={handleFilterChange} />
      <IncomingEventsSection filters={filters} />
      <EventListSection filters={filters} />
      <Footer />
    </div>
  );
};

export default EventPage;
