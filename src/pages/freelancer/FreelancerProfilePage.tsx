import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FreelancerProfileHeader,
  FreelancerOverviewTab,
  FreelancerReviewsTab,
  FreelancerPortfolioTab,
  FreelancerTabNavigation,
  FreelancerSidebar,
  FreelancerLoadingState,
  FreelancerNotFound,
} from "../../components/freelancer/profile";
import { fetchFreelancerProfile } from "../../services/Profile/Freelancer/mockFreelancerService";
import type { FreelancerProfile as Freelancer } from "../../types/domains/profile";

const FreelancerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "reviews" | "portfolio"
  >("overview");
  const [isFavorite, setIsFavorite] = useState(false);

  // Load freelancer profile data
  useEffect(() => {
    const loadFreelancerProfile = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const profileData = await fetchFreelancerProfile(id);
        setFreelancer(profileData);
      } catch (error) {
        console.error("Failed to load freelancer profile:", error);
        setFreelancer(null);
      } finally {
        setLoading(false);
      }
    };

    loadFreelancerProfile();
  }, [id]);

  const handleBookService = () => {
    if (freelancer) {
      navigate("/booking", {
        state: { freelancer },
      });
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return <FreelancerLoadingState />;
  }

  if (!freelancer) {
    return <FreelancerNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <FreelancerProfileHeader
          freelancer={freelancer}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onBookService={handleBookService}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <FreelancerTabNavigation
              activeTab={activeTab}
              onTabChange={(tabId) =>
                setActiveTab(tabId as "overview" | "reviews" | "portfolio")
              }
            >
              {activeTab === "overview" && (
                <FreelancerOverviewTab freelancer={freelancer} />
              )}
              {activeTab === "reviews" && (
                <FreelancerReviewsTab freelancer={freelancer} />
              )}
              {activeTab === "portfolio" && (
                <FreelancerPortfolioTab freelancer={freelancer} />
              )}
            </FreelancerTabNavigation>
          </div>

          {/* Right Column - Sidebar */}
          <FreelancerSidebar
            freelancer={freelancer}
            onBookService={handleBookService}
          />
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfilePage;
