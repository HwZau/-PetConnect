import React from "react";
import {
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineCalendar,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import type { FreelancerProfile } from "../../../types/domains/profile";

interface FreelancerSidebarProps {
  freelancer: FreelancerProfile;
  onBookService: () => void;
}

const FreelancerSidebar: React.FC<FreelancerSidebarProps> = ({
  freelancer,
  onBookService,
}) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Công việc hoàn thành</span>
            <span className="font-semibold">
              {freelancer.completedBookings}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Thời gian phản hồi</span>
            <span className="font-semibold text-emerald-600">
              {freelancer.responseTime}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tỷ lệ hoàn thành</span>
            <span className="font-semibold text-emerald-600">98%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Thành viên từ</span>
            <span className="font-semibold">2019</span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Thông tin liên hệ
        </h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <AiOutlinePhone className="w-5 h-5 mr-2" />
            Gọi điện thoại
          </button>
          <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <AiOutlineMail className="w-5 h-5 mr-2" />
            Gửi tin nhắn
          </button>
          <button
            onClick={onBookService}
            className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <AiOutlineCalendar className="w-5 h-5 mr-2" />
            Đặt lịch hẹn
          </button>
        </div>
      </div>

      {/* Verification */}
      {freelancer.isVerified && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center mb-3">
            <AiOutlineCheckCircle className="w-6 h-6 text-emerald-600 mr-2" />
            <h3 className="text-lg font-semibold text-emerald-800">
              Đã xác thực
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-emerald-700">
            <li>✓ Danh tính đã được xác thực</li>
            <li>✓ Số điện thoại đã được xác thực</li>
            <li>✓ Email đã được xác thực</li>
            <li>✓ Đã hoàn thành khóa đào tạo</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FreelancerSidebar;
