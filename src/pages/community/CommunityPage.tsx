import React from "react";
import Navbar from "../../components/common/Navbar";
import CommunityHeroSection from "../../components/community/CommunityHeroSection";
import CommunityFeed from "../../components/community/CommunityFeed";
import CommunitySidebar from "../../components/community/CommunitySidebar";
import Footer from "../../components/common/Footer";
import { useScrollToTop } from "../../hooks";

const CommunityPage: React.FC = () => {
  // Scroll to top when page loads
  useScrollToTop();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <CommunityHeroSection />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content - Community Feed */}
          <div className="lg:col-span-3">
            <CommunityFeed />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CommunitySidebar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommunityPage;
