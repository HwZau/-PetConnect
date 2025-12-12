import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import FreelancerHeroSection from "../../components/freelancer/FreelancerHeroSection";
import FreelancerFilters from "../../components/freelancer/FreelancerFilters";
import FreelancerList from "../../components/freelancer/FreelancerList";
import Footer from "../../components/common/Footer";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useScrollToTop } from "../../hooks";
import useAuth from "../../hooks/useAuth";
import type { FilterState } from "../../types";

const FreelancerPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

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

      <ConfirmDialog
        isOpen={showLoginModal}
        title="Yêu cầu đăng nhập"
        message="Bạn cần đăng nhập để xem danh sách freelancer và sử dụng các tính năng của trang này."
        confirmText="Đăng nhập"
        cancelText="Về trang chủ"
        onConfirm={() => navigate("/login")}
        onCancel={() => navigate("/")}
        type="info"
      />
    </div>
  );
};

export default FreelancerPage;
