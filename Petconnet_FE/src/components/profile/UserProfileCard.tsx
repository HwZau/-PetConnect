import React from "react";
import {
  FaGithub,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaGlobe,
  FaPencilAlt,
  FaPaw,
  FaStar,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDog,
  FaCalendarCheck,
} from "react-icons/fa";
import type { User } from "../../types";

interface UserProfileCardProps {
  user: User;
  onContact: () => void;
  onViewResume?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  onContact,
  onViewResume,
}) => {
  const getPersonImage = () => {
    return "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <img
            src={user?.avatar || getPersonImage()}
            alt={user?.name || "User"}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getPersonImage();
            }}
          />
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      </div>

      {/* Name & Title */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {user?.name || "Người dùng"}
        </h1>
        <p className="text-gray-600 text-sm mb-2 flex items-center justify-center gap-2">
          <FaPaw className="text-teal-600" /> Khách hàng thân thiết
        </p>
        <div className="flex items-center justify-center text-sm text-teal-600">
          <span className="bg-teal-50 px-3 py-1 rounded-full flex items-center gap-1">
            <FaStar /> Thành viên từ 2024
          </span>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="border-t border-b border-gray-200 py-4 mb-4">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <FaEnvelope className="text-teal-600" /> Email:
            </span>
            <span className="text-gray-800 text-xs">
              {user?.email || "user@example.com"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <FaPhone className="text-teal-600" /> Điện thoại:
            </span>
            <span className="text-gray-800">
              {user?.phoneNumber || "Chưa cập nhật"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <FaMapMarkerAlt className="text-teal-600" /> Địa điểm:
            </span>
            <span className="text-gray-800">Hà Nội, Việt Nam</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <FaDog className="text-teal-600" /> Thú cưng:
            </span>
            <span className="text-teal-600 font-semibold">3 bé</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <FaCalendarCheck className="text-teal-600" /> Lượt đặt:
            </span>
            <span className="text-teal-600 font-semibold">12 lần</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <FaStar className="text-yellow-500" /> Đánh giá:
            </span>
            <span className="text-yellow-500 font-semibold flex items-center gap-1">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar /> 5.0
            </span>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-3 mb-4">
        <a
          href="#"
          className="text-gray-400 hover:text-teal-600 transition-colors"
        >
          <FaGithub className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-teal-600 transition-colors"
        >
          <FaTwitter className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-teal-600 transition-colors"
        >
          <FaFacebookF className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-teal-600 transition-colors"
        >
          <FaLinkedinIn className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-teal-600 transition-colors"
        >
          <FaInstagram className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-teal-600 transition-colors"
        >
          <FaGlobe className="w-5 h-5" />
        </a>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onContact}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
        >
          <FaPencilAlt /> Chỉnh sửa hồ sơ
        </button>
        {onViewResume && (
          <button
            onClick={onViewResume}
            className="w-full bg-white hover:bg-orange-50 text-orange-600 font-semibold py-3 rounded-lg border-2 border-orange-500 transition-colors flex items-center justify-center gap-2"
          >
            <FaPaw /> Xem thú cưng
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;
