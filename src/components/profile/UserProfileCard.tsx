import React from "react";
import { FaRegEdit, FaCalendarAlt } from "react-icons/fa";
import type { UserProfileCardProps } from "../../types";

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  // Hình ảnh cố định từ Unsplash cho avatar người dùng
  const getPersonImage = () => {
    // Hình ảnh phụ nữ châu Á chuyên nghiệp
    return "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center">
          <img
            src={user?.avatar || getPersonImage()}
            alt={user?.name || "User"}
            className="h-20 w-20 rounded-full object-cover border-4 border-white shadow"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300";
            }}
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.name || "Người dùng"}
            </h1>
            <p className="text-gray-600">{user?.role || "Thành viên"}</p>
            <div className="flex items-center mt-1">
              <div className="bg-green-500 h-2 w-2 rounded-full mr-2"></div>
              <span className="text-xs text-gray-500 mr-3">
                {user?.location || "Chưa cập nhật"}
              </span>
              <FaCalendarAlt className="text-gray-400 mr-1 h-3 w-3" />
              <span className="text-xs text-gray-500">
                Thành viên từ {user?.memberSince || "2024"}
              </span>
            </div>
          </div>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-orange-100 text-orange-500 rounded-md hover:bg-orange-200 transition-colors">
          <FaRegEdit className="mr-2" />
          Chỉnh sửa
        </button>
      </div>
    </div>
  );
};

export default UserProfileCard;
