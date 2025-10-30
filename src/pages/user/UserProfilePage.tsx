import React from "react";
import Header from "../../components/profile/Header";
import UserProfileCard from "../../components/profile/UserProfileCard";
import UserStats from "../../components/profile/UserStats";
import UserPets from "../../components/profile/UserPets";
import RecentServices from "../../components/profile/RecentServices";
import QuickActions from "../../components/profile/QuickActions";
import FavoriteServices from "../../components/profile/FavoriteServices";
import ChatSupport from "../../components/profile/ChatSupport";
import { FaCut, FaStethoscope, FaPaw } from "react-icons/fa";
import { useScrollToTop } from "../../hooks";

// Giả lập dữ liệu user
const user = {
  id: "1",
  email: "lyhongthu@example.com",
  name: "Lý Hồng Thư",
  avatar: "/images/avatars/user-1.jpg",
  role: "Chủ thú cưng yêu thương",
  location: "Quận trí TPHCM",
  memberSince: "2023",
  stats: {
    petCount: 3,
    friendsCount: 24,
    reviewCount: 3,
    messagesCount: "2.3M",
  },
  pets: [
    {
      id: "1",
      name: "Buddy",
      type: "Golden Retriever",
      status: "Khỏe",
      avatar: "/images/pets/dog1.jpg",
      age: 2,
      gender: "male",
      color: "bg-orange-100",
    },
    {
      id: "2",
      name: "Luna",
      type: "Persian Cat",
      status: "Ốm",
      avatar: "/images/pets/cat1.jpg",
      age: 3,
      gender: "female",
      color: "bg-blue-100",
    },
    {
      id: "3",
      name: "Kiwi",
      type: "Cockatiel",
      status: "Khỏe mạnh",
      avatar: "/images/pets/bird1.jpg",
      age: 1,
      gender: "male",
      color: "bg-green-100",
    },
  ],
  recentServices: [
    {
      id: "1",
      title: "Cắt tỉa lông cho Buddy",
      location: "Pet Parlament • 12/10/2024",
      status: "Hoàn thành",
      color: "green",
      icon: <FaCut className="text-white" />,
      bgColor: "bg-green-500",
      percentage: "100%",
    },
    {
      id: "2",
      title: "Khám sức khỏe Luna",
      location: "Dr PetCare • 09/10/2024",
      status: "Đang xử lý",
      color: "yellow",
      icon: <FaStethoscope className="text-white" />,
      bgColor: "bg-yellow-500",
      percentage: "50%",
    },
    {
      id: "3",
      title: "Pet sitting cho tất cả",
      location: "Pet Parlament • 25/12/2024",
      status: "Đã đặt",
      color: "blue",
      icon: <FaPaw className="text-white" />,
      bgColor: "bg-blue-500",
      percentage: "0%",
    },
  ],
  favoriteServices: [
    {
      id: "1",
      title: "Cắt tỉa lông",
      desc: "Tỉnh xảo nhất",
      icon: <FaCut className="text-white" />,
      bgColor: "bg-orange-500",
    },
    {
      id: "2",
      title: "Khám sức khỏe",
      desc: "Đặt đi đừng ngại",
      icon: <FaStethoscope className="text-white" />,
      bgColor: "bg-blue-500",
    },
    {
      id: "3",
      title: "Pet sitting",
      desc: "Giá cả phải chăng",
      icon: <FaPaw className="text-white" />,
      bgColor: "bg-green-500",
    },
  ],
};

const UserProfilePage: React.FC = () => {
  // Scroll to top when page loads
  useScrollToTop();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Profile Card */}
            <UserProfileCard user={user} />

            {/* Stats */}
            <UserStats stats={user.stats} />

            {/* Pets */}
            <UserPets pets={user.pets} />

            {/* Recent Services */}
            <RecentServices services={user.recentServices} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Favorite Services */}
            <FavoriteServices services={user.favoriteServices} />

            {/* Chat Support */}
            <ChatSupport />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
