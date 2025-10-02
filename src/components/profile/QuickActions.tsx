import React from "react";
import { Link } from "react-router-dom";
import {
  FaLocationArrow,
  FaCalendarCheck,
  FaSearch,
  FaCalendarAlt,
  FaCommentDots,
  FaCrown,
} from "react-icons/fa";

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <FaLocationArrow className="mr-2 text-orange-500" />
        <h2 className="text-lg font-semibold text-gray-800">Thao tác nhanh</h2>
      </div>

      <div className="space-y-3">
        <Link
          to="/services/new"
          className="flex items-center p-3 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
        >
          <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
            <FaCalendarCheck className="text-white" />
          </div>
          <span className="font-medium">Đặt dịch vụ mới</span>
        </Link>

        <Link
          to="/experts"
          className="flex items-center p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <FaSearch className="text-white" />
          </div>
          <span className="font-medium">Tìm chuyên gia</span>
        </Link>

        <Link
          to="/appointments"
          className="flex items-center p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
        >
          <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
            <FaCalendarAlt className="text-white" />
          </div>
          <span className="font-medium">Xem lịch hẹn</span>
        </Link>

        <Link
          to="/messages"
          className="flex items-center p-3 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors"
        >
          <div className="h-8 w-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
            <FaCommentDots className="text-white" />
          </div>
          <span className="font-medium">Tin nhắn</span>
        </Link>

        <Link
          to="/upgrade"
          className="flex items-center p-3 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
            <FaCrown className="text-white" />
          </div>
          <span className="font-medium">Nâng cấp tài khoản</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
