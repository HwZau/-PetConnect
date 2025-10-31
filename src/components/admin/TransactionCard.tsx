// file: TransactionCard.tsx
import React from "react";
import { useSettings } from "../../contexts/SettingsContext";
// Import icons cần thiết
import { 
    AiOutlineDollarCircle, 
    AiOutlineUser, 
    AiOutlineTeam, 
    AiOutlineCreditCard,
    AiOutlineTags,
    AiOutlineCheck, 
    AiOutlineClose,
    AiOutlineInfoCircle,
    AiOutlineRedo
} from "react-icons/ai";

interface TransactionCardProps {
    title: string;
    // ĐÃ SỬA LỖI: Thêm dấu '?' để các prop là tùy chọn
    customer?: string;
    freelancer?: string;
    service?: string;
    method?: string;
    date?: string;
    amount?: string;
    platformFee?: string; // Phí nền tảng
    status: "Success" | "Pending" | "Failed";
}

// (Details rendered inline below; helper removed to simplify layout)

const TransactionCard: React.FC<TransactionCardProps> = ({ 
    title, 
    customer, 
    freelancer, 
    service, 
    method, 
    date, 
    amount, 
    platformFee, 
    status 
}) => {
    const { theme } = useSettings();
    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
    const subText = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
    const muted = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    
    // Helper function để quyết định màu sắc dựa trên status
    const getStatusStyle = (jobStatus: string) => {
        switch (jobStatus) {
            case "Success":
                return "bg-green-100 text-green-700";
            case "Pending":
                return "bg-yellow-100 text-yellow-700";
            case "Failed":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Avatar initials
    const avatarText = (customer || freelancer || "").split(' ').filter(Boolean).map(s => s[0]).slice(0,2).join('').toUpperCase() || 'PN';

    const getVietnameseStatus = (jobStatus: string) => {
        switch (jobStatus) {
            case "Success": return "Thành Công";
            case "Pending": return "Đang Chờ Duyệt";
            case "Failed": return "Thất Bại";
            default: return "Không rõ";
        }
    };

    const getStatusLabel = (jobStatus: string) => getVietnameseStatus(jobStatus);

    // LOGIC XÁC ĐỊNH NÚT HÀNH ĐỘNG (Giữ nguyên)
    const renderActionButtons = () => {
        switch (status) {
            case "Pending":
                return (
                    <div className="flex gap-2 w-full">
                        {/* Nút Phê Duyệt (Bên Trái) */}
                        <button className="flex items-center justify-center flex-1 px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors text-sm">
                            <AiOutlineCheck className="mr-1" /> Phê Duyệt
                        </button>
                        {/* Nút Xem Chi Tiết (Ở Giữa) */}
                        <button className="flex items-center justify-center flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 font-medium transition-colors text-sm">
                            <AiOutlineInfoCircle className="mr-1" /> Chi Tiết
                        </button>
                        {/* Nút Từ Chối (Bên Phải) */}
                        <button className="flex items-center justify-center flex-1 px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors text-sm">
                            <AiOutlineClose className="mr-1" /> Từ Chối
                        </button>
                    </div>
                );
            case "Failed":
                return (
                    <div className="flex gap-2 w-full">
                        {/* Nút Thử Lại (Bên Trái) */}
                        <button className="flex items-center justify-center flex-1 px-3 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 font-medium transition-colors text-sm">
                            <AiOutlineRedo className="mr-1" /> Thử Lại
                        </button>
                        {/* Nút Xem Chi Tiết (Bên Phải) */}
                        <button className="flex items-center justify-center flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 font-medium transition-colors text-sm">
                            <AiOutlineInfoCircle className="mr-1" /> Chi Tiết
                        </button>
                    </div>
                );
            case "Success":
            default:
                return (
                    <div className="flex justify-end w-full">
                        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors text-sm">
                            <AiOutlineInfoCircle className="mr-1" /> Xem Chi Tiết
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className={`rounded-2xl p-5 shadow-xl transition duration-300 hover:shadow-2xl border-l-4 ${status === 'Success' ? 'border-green-400' : status === 'Pending' ? 'border-amber-400' : 'border-red-400'} ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            {/* HEADER: avatar, title, status, amount */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-700'}`}>{avatarText}</div>
                    </div>
                    <div className="min-w-0">
                        <div className={`text-md font-semibold ${textColor} truncate`} title={title}>{title}</div>
                        <div className={`${subText} text-xs mt-1 flex items-center gap-2`}>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(status)}`}>{getStatusLabel(status)}</span>
                            <span className={`${muted}`}>•</span>
                            <span>{date}</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className={`${subText} text-sm`}>Tổng</div>
                    <div className={`text-lg font-bold ${textColor}`}>{amount || 'N/A'}</div>
                </div>
            </div>

            {/* DETAILS */}
            <div className={`grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4 ${subText}`}>
                <div className="flex items-center gap-2"><AiOutlineUser className={`${muted}`} /> <span className="truncate">{customer || '—'}</span></div>
                <div className="flex items-center gap-2"><AiOutlineTeam className={`${muted}`} /> <span className="truncate">{freelancer || '—'}</span></div>
                <div className="flex items-center gap-2"><AiOutlineTags className={`${muted}`} /> <span className="truncate">{service || '—'}</span></div>
                <div className="flex items-center gap-2"><AiOutlineCreditCard className={`${muted}`} /> <span className="truncate">{method || '—'}</span></div>
                <div className="flex items-center gap-2 col-span-2"><AiOutlineDollarCircle className={`${muted}`} /> <span className="truncate">Phí nền tảng: <span className="font-semibold text-red-500 ml-2">{platformFee || '—'}</span></span></div>
            </div>

            {/* ACTIONS */}
            <div className="mt-2 flex justify-end">
                {renderActionButtons()}
            </div>
        </div>
    );
};

export default TransactionCard;