import React, { useState, useEffect } from "react";
import Header from "../../components/profile/Header";
import UserProfileCard from "../../components/profile/UserProfileCard";
import UserStats from "../../components/profile/UserStats";
import UserPets from "../../components/profile/UserPets";
import RecentServices from "../../components/profile/RecentServices";
import QuickActions from "../../components/profile/QuickActions";
import FavoriteServices from "../../components/profile/FavoriteServices";
import ChatSupport from "../../components/profile/ChatSupport";
import { useScrollToTop } from "../../hooks";
import type {
  UserProfile,
  UserStats as UserStatsType,
} from "../../types/domains/profile";
import type { Pet } from "../../types/domains/booking";
import {
  fetchUserProfile,
  fetchUserStats,
  fetchUserPets,
  fetchRecentBookings,
  fetchFavoriteServices,
} from "../../services/Profile/User/mockUserService";

const UserProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStatsType | null>(null);
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [favoriteServices, setFavoriteServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top when page loads
  useScrollToTop();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [profile, stats, pets, bookings, services] = await Promise.all([
          fetchUserProfile("user-001"),
          fetchUserStats("user-001"),
          fetchUserPets("user-001"),
          fetchRecentBookings("user-001"),
          fetchFavoriteServices("user-001"),
        ]);

        setUserProfile(profile);
        setUserStats(stats);
        setUserPets(pets);
        setRecentBookings(bookings as any[]);
        setFavoriteServices(services as any[]);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading || !userProfile || !userStats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Profile Card */}
            <UserProfileCard user={userProfile} />

            {/* Stats */}
            <UserStats stats={userStats} userType="customer" />

            {/* Pets */}
            <UserPets pets={userPets} />

            {/* Recent Services */}
            <RecentServices bookings={recentBookings} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Favorite Services */}
            <FavoriteServices services={favoriteServices} />

            {/* Chat Support */}
            <ChatSupport />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
