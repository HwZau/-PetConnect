// file: TransactionCard.tsx
import React from "react";
// Import icons cần thiết
import { 
    AiOutlineDollarCircle, 
    AiOutlineClockCircle, 
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

// Helper component for displaying details inside the card
// ĐÃ SỬA: value có thể là undefined/string/number
const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string | number | undefined, valueClass?: string }> = ({ icon, label, value, valueClass }) => {
    // KHÔNG RENDER nếu giá trị không tồn tại
    if (!value) return null;

    return (
        <div className="flex items-center text-sm text-gray-700 justify-between">
            <div className="flex items-center">
                <div className="text-gray-500 mr-2">{icon}</div>
                <span className="font-medium text-gray-500">{label}</span>
            </div>
            <div className={`font-semibold ${valueClass || 'text-gray-800'}`}>{value}</div>
        </div>
    );
};

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

    const getVietnameseStatus = (jobStatus: string) => {
        switch (jobStatus) {
            case "Success": return "Thành Công";
            case "Pending": return "Đang Chờ Duyệt";
            case "Failed": return "Thất Bại";
            default: return "Không rõ";
        }
    };

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
        <div className="bg-white  rounded-2xl p-5 shadow-xl transition duration-300 hover:shadow-2xl"> 
            
            {/* TIÊU ĐỀ & STATUS */}
            <div className="flex items-start justify-between mb-4 pb-4">
                <div className="flex-1 min-w-0">
                    <div className="text-lg font-bold text-gray-800 truncate" title={title}>{title}</div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                        <span className="font-medium">Trạng thái:</span>
                        <span className={`text-xs ml-2 px-3 py-1 rounded-full font-medium ${getStatusStyle(status)}`}>
                            {getVietnameseStatus(status)}
                        </span>
                    </div>
                </div>
                {/* Đảm bảo hiển thị an toàn khi amount có thể là undefined */}
                <div className="text-2xl font-bold ml-4" title="Tổng số tiền giao dịch">{amount || 'N/A'}</div>
            </div>

            {/* HIỂN THỊ CHI TIẾT GIAO DỊCH */}
            <div className="space-y-2">
                {/* DetailItem sẽ không hiển thị nếu prop tương ứng là undefined */}
                <DetailItem icon={<AiOutlineUser />} label="Khách Hàng" value={customer} />
                <DetailItem icon={<AiOutlineTeam />} label="Freelancer" value={freelancer} />
                <DetailItem icon={<AiOutlineTags />} label="Dịch vụ" value={service} />
                <DetailItem icon={<AiOutlineCreditCard />} label="Phương thức" value={method} />
                <DetailItem icon={<AiOutlineClockCircle />} label="Thời gian" value={date} />
                {/* Hiển thị Phí Nền Tảng riêng biệt, có thể có màu sắc khác */}
                <DetailItem icon={<AiOutlineDollarCircle />} label="Phí Nền Tảng" value={platformFee} valueClass="text-red-500" />
            </div>

            {/* NÚT HÀNH ĐỘNG ĐỘNG */}
            <div className="mt-5 pt-4 flex justify-end">
                {renderActionButtons()}
            </div>
        </div>
    );
};

export default TransactionCard;