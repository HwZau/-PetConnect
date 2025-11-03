// file: FreelancerCard.tsx
import React from "react";
import { useSettings } from "../../contexts/SettingsContext";
// IMPORT ICONS CẦN THIẾT
import { AiOutlineStar, AiOutlineTrophy, AiOutlineDollarCircle, AiOutlineEnvironment, AiOutlineClockCircle } from "react-icons/ai";

interface FreelancerCardProps {
    name: string;
    subtitle?: string;
    avatar?: string;
    badge?: string;
    actionLabel?: string;

    // 5 TRƯỜNG MỚI CHO FREELANCER
    experience?: string; // Kinh nghiệm
    rating?: number; // Đánh giá
    jobsCompleted?: number; // Công việc hoàn thành
    servicePrice?: string; // Giá dịch vụ trung bình
    region?: string; // Khu vực
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

// Helper function để xử lý badge style
const getBadgeClasses = (badge: string) => {
    switch (badge) {
        case "Active":
        case "Hoạt động":
            return "bg-green-100 text-green-800";
        case "Busy":
        case "Bận":
            return "bg-yellow-100 text-yellow-800";
        case "Suspended":
        case "Tạm ngưng": // Trạng thái mới
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-700";
    }
}


const FreelancerCard: React.FC<FreelancerCardProps> = ({
    name,
    subtitle,
    avatar,
    badge,
    actionLabel,
    // Lấy 5 trường mới
    experience,
    rating,
    jobsCompleted,
    servicePrice,
    region,
}) => {
    
    const { theme } = useSettings();
    // Kiểm tra trạng thái tạm ngưng (Hỗ trợ cả Tiếng Anh và Tiếng Việt)
    const isSuspended = badge === "Suspended" || badge === "Tạm ngưng";

    // LOGIC CHO NÚT BẤM
    let buttonLabel = actionLabel || "Xem Hồ Sơ";
    let buttonClass = "flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors";

    if (isSuspended) {
        buttonLabel = "Xem Lý Do";
        // Sử dụng màu đỏ để nhấn mạnh vấn đề tạm ngưng
        buttonClass = "flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors"; 
    }
    // END LOGIC CHO NÚT BẤM

    return (
        <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} rounded-2xl p-5 shadow-xl transition duration-300 hover:shadow-2xl`}>
            <div className="flex items-center gap-4">
                <img src={avatar || "https://i.pravatar.cc/80"} alt={name} className="w-16 h-16 rounded-full object-cover shadow-md" />
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div className="min-w-0 pr-4">
                            <div className="font-bold text-lg truncate" title={name}>{name}</div>
                            {subtitle && <div className="text-sm truncate" title={subtitle}>{subtitle}</div>}
                        </div>
                        {badge && <div className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${getBadgeClasses(badge)}`}>{badge}</div>}
                    </div>
                </div>
            </div>

            {/* HIỂN THỊ THÔNG TIN CHI TIẾT */}
            {(experience || rating !== undefined || jobsCompleted !== undefined || servicePrice || region) && (
                <div className={`space-y-2 pt-4 mt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    {experience && <DetailItem icon={<AiOutlineClockCircle />} label="Kinh nghiệm" value={experience} />}
                    {rating !== undefined && <DetailItem icon={<AiOutlineStar />} label="Đánh giá" value={`${rating}/5`} />}
                    {jobsCompleted !== undefined && <DetailItem icon={<AiOutlineTrophy />} label="Hoàn thành" value={`${jobsCompleted} công việc`} />}
                    {servicePrice && <DetailItem icon={<AiOutlineDollarCircle />} label="Giá TB" value={servicePrice} />}
                    {region && <DetailItem icon={<AiOutlineEnvironment />} label="Khu Vực" value={region} />}
                </div>
            )}

            {/* NÚT BẤM */}
            <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} flex justify-center`}>
                <button className={buttonClass}>
                    {buttonLabel}
                </button>
            </div>
        </div>
    );
};

export default FreelancerCard;