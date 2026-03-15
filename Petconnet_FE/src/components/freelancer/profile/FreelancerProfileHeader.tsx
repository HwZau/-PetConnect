import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AiOutlineStar,
  AiOutlineHeart,
  AiOutlineEnvironment,
  AiOutlinePhone,
  AiOutlineCheckCircle,
  AiOutlineShoppingCart,
  AiOutlineArrowLeft,
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineSetting,
  AiOutlineBell,
} from "react-icons/ai";
import { FaPaw } from "react-icons/fa";
import type { FreelancerProfile } from "../../../types/domains/profile";
import Logo from "../../../assets/image/Logo.png";
import { useAuth } from "../../../hooks";

interface FreelancerProfileHeaderProps {
  freelancer: FreelancerProfile;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookService: () => void;
}

const FreelancerProfileHeader: React.FC<FreelancerProfileHeaderProps> = ({
  freelancer,
  isFavorite,
  onToggleFavorite,
  onBookService,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Function to get user avatar with fallback
  const getUserAvatar = () => {
    if (user?.avatar) {
      return user.avatar;
    }
    return "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100";
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const getCityFromAddress = (address: any): string | undefined => {
    if (!address) return undefined;
    if (typeof address === "string") return address;
    return address?.city;
  };

  return (
    <>
      {/* Navbar Similar to Other Pages */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <img src={Logo} alt="Pet Connect" className="h-8 w-8" />
              <span className="text-xl font-bold text-emerald-600">
                Pet Connect
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <AiOutlineHome className="w-4 h-4" />
                  <span>Trang chủ</span>
                </div>
              </Link>

              <Link
                to="/freelancers"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-600 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <AiOutlineUser className="w-4 h-4" />
                  <span>Tìm Người</span>
                </div>
              </Link>

              <Link
                to="/community"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <FaPaw className="w-4 h-4" />
                  <span>Cộng Đồng</span>
                </div>
              </Link>

              <Link
                to="/events"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <AiOutlineCalendar className="w-4 h-4" />
                  <span>Sự kiện</span>
                </div>
              </Link>

              <Link
                to="/support"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <AiOutlineSetting className="w-4 h-4" />
                  <span>Hỗ Trợ</span>
                </div>
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="hidden md:flex items-center space-x-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                <img
                  src="https://flagcdn.com/w40/vn.png"
                  alt="Vietnam"
                  className="w-5 h-3 object-cover"
                />
                <span className="text-gray-700 font-medium text-sm">VI</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <AiOutlineBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <AiOutlineSetting className="w-5 h-5" />
              </button>

              {/* User Profile */}
              {user ? (
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={getUserAvatar()}
                    alt={getUserDisplayName()}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100";
                    }}
                  />
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
          Quay lại
        </button>

        {/* Header Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-r from-emerald-400 to-teal-500">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4 md:mb-0">
                <img
                  src={freelancer.avatar}
                  alt={freelancer.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {freelancer.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
                    <AiOutlineCheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {freelancer.name}
                    </h1>
                    <p className="text-lg text-emerald-600 font-medium mb-2">
                      {freelancer.businessName ||
                        "Chuyên gia chăm sóc thú cưng"}
                    </p>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center">
                        <AiOutlineEnvironment className="w-5 h-5 mr-1" />
                        <span>
                          {getCityFromAddress(freelancer.address) || "TP. Hồ Chí Minh"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <AiOutlineStar className="w-5 h-5 text-yellow-400 mr-1" />
                        <span className="font-medium">{freelancer.rating}</span>
                        <span className="ml-1">
                          ({freelancer.reviewsCount} đánh giá)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <button
                      onClick={onToggleFavorite}
                      className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <AiOutlineHeart
                        className={`w-5 h-5 ${
                          isFavorite
                            ? "text-red-500 fill-current"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                    <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <AiOutlinePhone className="w-5 h-5 mr-2" />
                      Liên hệ
                    </button>
                    <button
                      onClick={onBookService}
                      className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      <AiOutlineShoppingCart className="w-5 h-5 mr-2" />
                      Đặt dịch vụ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreelancerProfileHeader;
