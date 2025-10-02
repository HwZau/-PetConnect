import React from "react";
import { FaCheck, FaPaw, FaRegStar, FaEnvelope } from "react-icons/fa";

interface UserStatsProps {
  stats: {
    friendsCount: number;
    petCount: number;
    reviewCount: number;
    messagesCount: string;
  };
}

const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Bạn đã có sẵn</span>
          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
            <FaCheck className="h-3 w-3 text-blue-500" />
          </div>
        </div>
        <span className="text-xl font-bold mt-2">{stats.friendsCount}</span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Thú cưng</span>
          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
            <FaPaw className="h-3 w-3 text-green-500" />
          </div>
        </div>
        <span className="text-xl font-bold mt-2">{stats.petCount}</span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Đánh giá</span>
          <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
            <FaRegStar className="h-3 w-3 text-yellow-500" />
          </div>
        </div>
        <span className="text-xl font-bold mt-2">
          {stats.reviewCount} bài đánh giá
        </span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Tin nhắn</span>
          <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
            <FaEnvelope className="h-3 w-3 text-purple-500" />
          </div>
        </div>
        <span className="text-xl font-bold mt-2">{stats.messagesCount}</span>
      </div>
    </div>
  );
};

export default UserStats;
