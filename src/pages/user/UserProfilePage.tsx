import React, { useState, useEffect } from "react";
import Header from "../../components/profile/Header";
import { useScrollToTop, useAuth } from "../../hooks";
import { petService } from "../../services";
import { useNavigate } from "react-router-dom";
import type { Pet } from "../../types/domains/booking";
import {
  fetchUserStats,
  fetchRecentBookings,
  fetchFavoriteServices,
} from "../../services/Profile/User/mockUserService";
import {
  AiOutlineEdit,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEnvironment,
  AiOutlineCalendar,
  AiOutlineTeam,
  AiOutlineStar,
} from "react-icons/ai";
import { FaPaw, FaCheck } from "react-icons/fa";

const UserProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top when page loads
  useScrollToTop();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const pets = await petService.getUserPets(user.id);
        if (pets.success && pets.data) {
          setUserPets(pets.data);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user?.id]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const getUserAvatar = () => {
    if (user?.avatar) return user.avatar;
    return "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400";
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Background */}
      <div className="relative h-64 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Section - 2 columns */}
          <div className="lg:col-span-2">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <img
                    src={getUserAvatar()}
                    alt={getUserDisplayName()}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400";
                    }}
                  />

                  {/* User Info */}
                  <div className="pt-2">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                      {getUserDisplayName()}
                      {user.isActive && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-emerald-500 rounded-full">
                          <FaCheck className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                      {user.role === "admin"
                        ? "Administrator"
                        : user.role === "freelancer"
                        ? "Pet Care Provider"
                        : "Pet Owner"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      {user.email && (
                        <span className="flex items-center">
                          <AiOutlineMail className="w-4 h-4 mr-1" />
                          {user.email}
                        </span>
                      )}
                      {user.phoneNumber && (
                        <span className="flex items-center">
                          <AiOutlinePhone className="w-4 h-4 mr-1" />
                          {user.phoneNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                  <AiOutlineEdit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Summary Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Summary
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Passionate pet lover with {userPets.length || 0} adorable
                  pets. Member of the PawNest community, dedicated to providing
                  the best care for furry friends.
                </p>
              </div>

              {/* Ask Me About Section */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Ask Me About
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    Pet Care
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Training Tips
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    Health & Nutrition
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <nav className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "overview"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("pets")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "pets"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pets
                </button>
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "posts"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab("events")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "events"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Events
                </button>
                <button
                  onClick={() => setActiveTab("more")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "more"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  More
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Bookings</span>
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <AiOutlineCalendar className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Pets</span>
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FaPaw className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {userPets.length}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Reviews</span>
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <AiOutlineStar className="w-4 h-4 text-yellow-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Following</span>
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <AiOutlineTeam className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">48</p>
                  </div>
                </div>

                {/* My Pets */}
                {userPets.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      My Pets
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {userPets.map((pet) => (
                        <div
                          key={pet.id}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                            <FaPaw className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {pet.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {pet.type} • {pet.breed || "Mixed"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "pets" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  All My Pets
                </h3>
                {userPets.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No pets added yet
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userPets.map((pet) => (
                      <div
                        key={pet.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-16 h-16 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <FaPaw className="w-8 h-8 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {pet.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {pet.type} • {pet.breed || "Mixed"}
                            </p>
                            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                              <span>Age: {pet.age || "N/A"}</span>
                              <span>•</span>
                              <span>Weight: {pet.weight || "N/A"} kg</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(activeTab === "posts" ||
              activeTab === "events" ||
              activeTab === "more") && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-500 text-center py-8">
                  Content coming soon...
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* My Manager Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                My Manager
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100"
                    alt="Manager"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Roy Benali
                    </p>
                    <p className="text-xs text-gray-500">
                      Chief Executive Officer
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100"
                    alt="Manager"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      James Botosh
                    </p>
                    <p className="text-xs text-gray-500">
                      Chief Operating Officer
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-emerald-50 p-2 rounded-lg">
                  <img
                    src={getUserAvatar()}
                    alt="You"
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500">
                      VP of Customer Operations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">✨</span>
                Additional Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <AiOutlineMail className="w-5 h-5 text-emerald-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-emerald-600 font-medium">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <AiOutlinePhone className="w-5 h-5 text-emerald-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">
                      {user.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <AiOutlineEnvironment className="w-5 h-5 text-emerald-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">
                      Ho Chi Minh City, Vietnam
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <AiOutlineCalendar className="w-5 h-5 text-emerald-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="text-sm text-gray-900">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-emerald-500 mr-3 mt-0.5">🏆</span>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm font-medium text-emerald-600">
                      {user.isActive ? "Verified Member" : "Member"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
