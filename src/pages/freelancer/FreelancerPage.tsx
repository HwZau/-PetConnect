import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
import FreelancerHeroSection from "../../components/freelancer/FreelancerHeroSection";
import FreelancerFilters from "../../components/freelancer/FreelancerFilters";
import FreelancerList from "../../components/freelancer/FreelancerList";
import Footer from "../../components/common/Footer";
import { useScrollToTop } from "../../hooks";
import type { FilterState } from "../../types";

const FreelancerPage: React.FC = () => {
  // Scroll to top when page loads
  useScrollToTop();

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    category: "",
    location: "",
    rating: "",
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <FreelancerHeroSection onSearch={handleFilterChange} />
      <FreelancerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <FreelancerList filters={filters} />
      <Footer />
    </div>
  );
};

export default FreelancerPage;
