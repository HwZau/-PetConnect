// file: JobCard.tsx
import React from "react";
import { useSettings } from "../../contexts/SettingsContext";
// Import icons cần thiết
import { AiOutlineDollarCircle, AiOutlineClockCircle, AiOutlineEnvironment, AiOutlineUser, AiOutlineTeam } from "react-icons/ai";
import { FaPaw, FaStar, FaUserPlus } from "react-icons/fa"; // Thêm icon cho Phân Công và Xem Đánh Giá

interface JobCardProps {
  title: string;
  customer: string;
  pet: string;
  freelancer: string;
  time: string;
  location: string;
  status: "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
  price: string;
}

// Helper component for displaying details inside the card
const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => {
  const { theme } = useSettings();
  const textCls = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const iconCls = theme === 'dark' ? 'text-green-400' : 'text-green-500';
  return (
    <div className={`flex items-center text-sm ${textCls}`}>
      <div className={`${iconCls} mr-2`}>{icon}</div>
      <div className="flex-1">
        <span className="font-medium">{label}:</span> {value}
      </div>
    </div>
  );
};

const JobCard: React.FC<JobCardProps> = ({ title, customer, pet, freelancer, time, location, status, price }) => {

  const { theme } = useSettings();
  // Helper function để quyết định màu sắc dựa trên status
  const getStatusStyle = (jobStatus: string) => {
    switch (jobStatus) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Assigned":
        return "bg-indigo-100 text-indigo-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getVietnameseStatus = (jobStatus: string) => {
    switch (jobStatus) {
      case "Completed": return "Đã Hoàn Thành";
      case "In Progress": return "Đang Xử Lý";
      case "Assigned": return "Đã Giao";
      case "Pending": return "Đang Chờ";
      case "Cancelled": return "Đã Hủy";
      default: return "Không rõ";
    }
  };

  // LOGIC XÁC ĐỊNH NÚT HÀNH ĐỘNG
  const renderActionButton = () => {
    let label = "Xem Chi Tiết";
    let icon = null;
    let className = "bg-green-600 hover:bg-green-700";

    switch (status) {
      case "Pending":
      case "In Progress":
        label = (status === "Pending" && freelancer === "Chưa phân công") ? "Phân Công" : "Tái Phân Công";
        icon = <FaUserPlus className="mr-2" />;
        className = "bg-yellow-600 hover:bg-yellow-700";
        break;
      case "Completed":
        label = "Xem Đánh Giá";
        icon = <FaStar className="mr-2" />;
        className = "bg-blue-600 hover:bg-blue-700";
        break;
      case "Assigned":
      case "Cancelled":
      default:
        label = "Xem Chi Tiết";
        icon = null;
        className = "bg-green-600 hover:bg-green-700";
        break;
    }

  if (status === "Cancelled") return null; // Không hiển thị nút nếu bị Hủy

    return (
      <button className={`px-4 py-2 text-white rounded-xl font-medium transition-colors flex items-center ${className}`}>
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} rounded-2xl p-5 shadow-xl transition duration-300 hover:shadow-2xl`}>
      <div className="flex items-start justify-between mb-4 pb-4 ">
        <div className="flex-1 min-w-0">
          <div className="text-xl font-bold truncate" title={title}>{title}</div>
          <div className={`text-sm mt-1 flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
            <span className="font-medium">Trạng thái:</span>
            <span className={`text-xs ml-2 px-3 py-1 rounded-full font-medium ${getStatusStyle(status)}`}>
              {getVietnameseStatus(status)}
            </span>
          </div>
        </div>
      </div>

      {/* HIỂN THỊ 6 THÔNG TIN CHI TIẾT */}
      <div className="space-y-2">
        <DetailItem icon={<AiOutlineUser />} label="Khách Hàng" value={customer} />
        <DetailItem icon={<FaPaw />} label="Thú Cưng" value={pet} />
        <DetailItem icon={<AiOutlineTeam />} label="Freelancer" value={freelancer} />
        <DetailItem icon={<AiOutlineClockCircle />} label="Thời Gian" value={time} />
        <DetailItem icon={<AiOutlineEnvironment />} label="Địa Điểm" value={location} />
        <DetailItem icon={<AiOutlineDollarCircle />} label="Giá" value={price} />
      </div>

      {/* NÚT HÀNH ĐỘNG ĐỘNG */}
      <div className="mt-5 pt-4 flex justify-center">
        {renderActionButton()}
      </div>
    </div>
  );
};

export default JobCard;