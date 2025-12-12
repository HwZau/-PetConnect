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
    amount?: number | string;
    platformFee?: number | string; // Phí nền tảng
    status: "Success" | "Pending" | "Failed" | "Cancelled";
    onView?: () => void;
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
    status,
    onView,
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
            case "Cancelled":
                return "bg-gray-100 text-gray-700";
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
            case "Cancelled": return "Đã Hủy";
            default: return "Không rõ";
        }
    };

    const formatVnd = (value?: number | string) => {
        if (value === null || value === undefined || value === '') return '—';
        const num = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.-]+/g, ''));
        if (Number.isNaN(num)) return '—';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    };

    const formatDate = (d?: string) => {
        if (!d) return '—';
        const dt = new Date(d);
        if (Number.isNaN(dt.getTime())) return d;
        return dt.toLocaleDateString('vi-VN');
    };

    const methodLabel = (m?: string) => {
        if (!m) return '—';
        if (m === 'Unknown' || m.toLowerCase() === 'unknown') return '—';
        return m;
    };

    const getStatusLabel = (jobStatus: string) => getVietnameseStatus(jobStatus);

    // Single action: view details only (approve/reject removed)
    const renderActionButtons = () => (
        <div className="flex justify-end w-full">
            <button onClick={() => onView?.()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors text-sm">
                <AiOutlineInfoCircle className="mr-1" /> Xem Chi Tiết
            </button>
        </div>
    );

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
                                                        {date ? (
                                                            <>
                                                                <span className={`${muted}`}>•</span>
                                                                <span>{formatDate(date)}</span>
                                                            </>
                                                        ) : null}
                                                </div>
                    </div>
                </div>

                                <div className="text-right">
                                        {amount !== undefined && amount !== null ? (
                                            <>
                                                <div className={`${subText} text-sm`}>Tổng</div>
                                                <div className={`text-lg font-bold ${textColor}`}>{formatVnd(amount)}</div>
                                            </>
                                        ) : null}
                                </div>
            </div>

            {/* DETAILS */}
                        <div className={`grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4 ${subText}`}>
                                {customer ? (
                                    <div className="flex items-center gap-2"><AiOutlineUser className={`${muted}`} /> <span className="truncate">{customer}</span></div>
                                ) : null}

                                {freelancer ? (
                                    <div className="flex items-center gap-2"><AiOutlineTeam className={`${muted}`} /> <span className="truncate">{freelancer}</span></div>
                                ) : null}

                                {service ? (
                                    <div className="flex items-center gap-2"><AiOutlineTags className={`${muted}`} /> <span className="truncate">{service}</span></div>
                                ) : null}

                                {method && methodLabel(method) !== '—' ? (
                                    <div className="flex items-center gap-2"><AiOutlineCreditCard className={`${muted}`} /> <span className="truncate">{methodLabel(method)}</span></div>
                                ) : null}

                                {(platformFee !== undefined && platformFee !== null) ? (
                                    <div className="flex items-center gap-2 col-span-2"><AiOutlineDollarCircle className={`${muted}`} /> <span className="truncate">Phí nền tảng: <span className="font-semibold text-red-500 ml-2">{formatVnd(platformFee)}</span></span></div>
                                ) : null}
                        </div>

            {/* ACTIONS */}
            <div className="mt-2 flex justify-end">
                {renderActionButtons()}
            </div>
        </div>
    );
};

export default TransactionCard;