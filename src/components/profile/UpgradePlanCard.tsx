import React from "react";
import { FaCrown } from "react-icons/fa";

interface UpgradePlanCardProps {
  onUpgrade: () => void;
}

const UpgradePlanCard: React.FC<UpgradePlanCardProps> = ({ onUpgrade }) => {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg shadow-md p-6 border-2 border-teal-200">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 animate-pulse">
          <FaCrown className="text-white text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          🐾 Nâng cấp tài khoản VIP
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Trở thành thành viên VIP và nhận ưu đãi đặc biệt cho thú cưng
        </p>{" "}
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="text-3xl font-bold text-teal-600 mb-1">
            299.000đ
            <span className="text-lg text-gray-500">/tháng</span>
          </div>
          <p className="text-xs text-gray-500">
            Hoặc 2.990.000đ/năm (tiết kiệm 17%)
          </p>
        </div>
        <ul className="text-left text-sm space-y-2 mb-6">
          <li className="flex items-start">
            <span className="text-teal-500 mr-2">✓</span>
            <span className="text-gray-700">
              Ưu tiên hiển thị trong tìm kiếm
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 mr-2">✓</span>
            <span className="text-gray-700">Chat không giới hạn</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 mr-2">✓</span>
            <span className="text-gray-700">Huy hiệu Premium</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 mr-2">✓</span>
            <span className="text-gray-700">Thống kê chi tiết</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 mr-2">✓</span>
            <span className="text-gray-700">Hỗ trợ ưu tiên 24/7</span>
          </li>
        </ul>
        <button
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
        >
          Nâng cấp ngay
        </button>
        <p className="text-xs text-gray-500 mt-3">
          Hủy bất cứ lúc nào. Không tính phí ẩn.
        </p>
      </div>
    </div>
  );
};

export default UpgradePlanCard;
