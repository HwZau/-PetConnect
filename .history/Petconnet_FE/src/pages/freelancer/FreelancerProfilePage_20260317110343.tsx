import React, { useState, useEffect } from "react";
import { isAdminRole } from "../../utils/authUtils";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import {
  FaStar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import {
  FreelancerOverviewTab,
  FreelancerReviewsTab,
  FreelancerPortfolioTab,
  FreelancerTabNavigation,
  FreelancerSidebar,
  FreelancerLoadingState,
  FreelancerNotFound,
} from "../../components/freelancer/profile";
import { freelancerService, type FreelancerData } from "../../services";
import type { FreelancerProfile as Freelancer } from "../../types/domains/profile";
import Header from "../../components/profile/Header";
import { showError } from "../../utils";

const FreelancerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "reviews" | "portfolio"
  >("overview");
  const [isFavorite, setIsFavorite] = useState(false);

  // Convert FreelancerData from API to FreelancerProfile format
  const convertToFreelancerProfile = (data: FreelancerData): Freelancer => {
    const avgRating = freelancerService.calculateAverageRating(
      data.reviewsReceived || []
    );

    // Parse address - handle both string and object formats
   let city = "Unknown";
    if (data.address && typeof data.address !== 'string') {
      // It's an object format
      city = (data.address as any).city || "Unknown";
    } else if (!data.address || data.address === '') {
      city = "Unknown";
    }

    const services = data.services || [];

    return {
      id: data.id || data._id || "",
      name: data.name,
      email: (data as any).email,
      phoneNumber: (data as any).phoneNumber,
      address: typeof data.address === 'string' ? data.address : JSON.stringify(data.address || {}),
      avatarUrl: (data as any).avatarUrl || undefined,
      role: ((data as any).role || "Freelancer") as "Customer" | "Freelancer" | "Admin",

      // Extended freelancer fields
      description: services[0]?.description || "Chuyên nghiệp và tận tâm",
      specializations: services.map((s: any) =>
        freelancerService.formatServiceType(s.category || s.type)
      ),
      experience: Math.floor(services.length / 2) || 1,
      rating: avgRating,
      reviewsCount: (data.reviewsReceived || []).length,
      completedBookings:
        ((data as any).bookings?.filter((b: any) => Number(b.status) === 2)
          .length) || 0,
      responseTime: 1, // 1 hour
      isActive: true,

      // Additional fields for display
      avatar: (data as any).avatarUrl || "https://via.placeholder.com/150",
      phone: (data as any).phoneNumber,
      isVerified: true,
      location: city,

      certifications: [],
      portfolio: [],
      availability: {
        schedule: {
          monday: { isAvailable: true, timeSlots: [] },
          tuesday: { isAvailable: true, timeSlots: [] },
          wednesday: { isAvailable: true, timeSlots: [] },
          thursday: { isAvailable: true, timeSlots: [] },
          friday: { isAvailable: true, timeSlots: [] },
          saturday: { isAvailable: true, timeSlots: [] },
          sunday: { isAvailable: false, timeSlots: [] },
        },
        exceptions: [],
        advanceBooking: 7,
        timezone: "Asia/Ho_Chi_Minh",
      },
      pricing: services.map((service: any) => ({
        serviceType: service.name,
        basePrice: service.price,
        currency: "VND",
        unit: "session" as const,
        description: service.description,
      })),
      serviceArea: {
        type: "regions" as const,
        regions: [city],
      },
      // Map services from API for booking page
      services: services.map((service: any) => ({
        _id: service._id || service.id,
        id: service.id || service._id,
        name: service.name,
        title: service.name,
        description: service.description,
        price: service.price,
      })),
    } as Freelancer;
  };

  // Load freelancer profile data
  useEffect(() => {
    if (user && isAdminRole(user.role)) {
      window.location.replace("/admin/dashboard");
      return;
    }
    const loadFreelancerProfile = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await freelancerService.getFreelancerById(id);

        if (response.success && response.data) {
          const profileData = convertToFreelancerProfile(response.data);
          setFreelancer(profileData);
        } else {
          showError(response.message || "Không thể tải thông tin freelancer");
          setFreelancer(null);
        }
      } catch (error) {
        console.error("Failed to load freelancer profile:", error);
        showError("Đã xảy ra lỗi khi tải thông tin freelancer");
        setFreelancer(null);
      } finally {
        setLoading(false);
      }
    };
    loadFreelancerProfile();
  }, [id, user]);

  const handleBookService = () => {
    // Require login to book service
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/freelancer/${id}` } });
      return;
    }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-cyan-50">
      <Header />

      {/* Pet Background Section - Covers top half */}
      <div className="relative w-full">
        {/* Pet Image Background with Teal Overlay */}
        <div className="absolute top-0 left-0 right-0 h-[350px] rounded-b-[3rem] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1920&q=80')`,
            }}
          ></div>
          {/* Teal/Cyan Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/90 via-cyan-500/85 to-emerald-500/90"></div>
        </div>

        {/* Freelancer Header on Pet Background */}
        <div className="relative z-20 w-full px-6 pt-8 pb-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-2xl shadow-xl p-3">
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400";
                    }}
                  />
                </div>
                {freelancer.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center">
                    <FaCheckCircle className="text-white text-sm" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {freelancer.name}
                    </h1>
                    <p className="text-teal-100 text-sm mb-3 flex items-center gap-2">
                      <FaBriefcase /> {freelancer.specializations.join(", ")}
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                        <FaStar className="text-yellow-300" />{" "}
                        {freelancer.rating.toFixed(1)} (
                        {freelancer.reviewsCount} đánh giá)
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm flex items-center gap-2">
                        <FaMapMarkerAlt />{" "}
                        {freelancer.location || freelancer.address || "Hà Nội"}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <FaBriefcase className="text-orange-300" />
                        <span>{freelancer.completedBookings} dự án</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-300" />
                        <span>{freelancer.experience} năm kinh nghiệm</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleFavorite}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-lg transition-all shadow-lg"
                    >
                      {isFavorite ? (
                        <FaHeart className="text-red-400" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>
                    <button
                      onClick={handleBookService}
                      className="bg-white hover:bg-gray-50 text-teal-600 font-semibold px-6 py-2.5 rounded-lg transition-all shadow-lg flex items-center gap-2"
                    >
                      ĐẶT DỊCH VỤ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="relative z-10 w-full px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Main Content (8/12) */}
              <div className="lg:col-span-8 space-y-6">
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

              {/* Right Column - Sidebar (4/12) */}
              <div className="lg:col-span-4">
                <FreelancerSidebar
                  freelancer={freelancer}
                  onBookService={handleBookService}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfilePage;
