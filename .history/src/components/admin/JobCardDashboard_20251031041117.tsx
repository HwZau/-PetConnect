// file: JobCardDashboard.tsx
import React from "react";
import { useSettings } from "../../contexts/SettingsContext";
import { AiOutlineClockCircle, AiOutlineDollarCircle } from "react-icons/ai"; // Icons cho thời gian và giá

interface JobCardDashboardProps {
  title: string;
  client: string; // Khách hàng
  status: "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
  date: string; // Thời gian ngắn gọn (ví dụ: "2 giờ trước")
  price: string; // Giá
}

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

// language-aware label helper
const getStatusLabel = (jobStatus: string, language: string) => {
    if (language === 'vi') return getVietnameseStatus(jobStatus);
    switch (jobStatus) {
        case "Completed": return "Completed";
        case "In Progress": return "In Progress";
        case "Assigned": return "Assigned";
        case "Pending": return "Pending";
        case "Cancelled": return "Cancelled";
        default: return "Unknown";
    }
};

const getStatusClasses = (jobStatus: string) => {
    switch (jobStatus) {
        case "Completed": return "bg-green-100 text-green-700";
        case "In Progress": return "bg-blue-100 text-blue-700";
        case "Assigned": return "bg-indigo-100 text-indigo-700";
        case "Pending": return "bg-yellow-100 text-yellow-700";
        case "Cancelled": return "bg-red-100 text-red-700";
        default: return "bg-gray-100 text-gray-700";
    }
};

const JobCardDashboard: React.FC<JobCardDashboardProps> = ({ title, client, status, date, price }) => {
    const { theme, language } = useSettings();
    const titleCls = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
    const subCls = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
    return (
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl  p-4 shadow-sm transition hover:shadow-md cursor-pointer`}>
            <div className="flex items-center justify-between">
                {/* TIÊU ĐỀ VÀ KHÁCH HÀNG */}
                <div>
                    <div className={`font-semibold ${titleCls} truncate`} title={title}>{title}</div>
                    <div className={`text-xs ${subCls} mt-0.5`}>{client}</div>
                </div>
                {/* STATUS */}
                <div className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusClasses(status)}`}>
                    {getStatusLabel(status, language)}
                </div>
            </div>

            {/* THÔNG TIN PHỤ: GIÁ VÀ THỜI GIAN */}
            <div className="mt-3 pt-3  flex items-center justify-between text-sm">
                <div className="flex items-center text-red-600 font-bold">
                    <AiOutlineDollarCircle className="mr-1.5 text-lg" />
                    {price}
                </div>
                <div className={`flex items-center ${subCls}`}>
                    <AiOutlineClockCircle className="mr-1.5 text-lg" />
                    {date}
                </div>
            </div>
        </div>
    );
};

export default JobCardDashboard;