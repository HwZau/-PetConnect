import React from "react";
import { useSettings } from "../../contexts/SettingsContext";
import { AiOutlineCalendar, AiOutlineUser, AiOutlineDollarCircle } from "react-icons/ai";

interface BookingCardProps {
  bookingId: string;
  customerName: string;
  freelancerName: string;
  petNames: string;
  bookingDate: string;
  pickupTime: string;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  pickupStatus: string;
  isPaid: boolean;
  onCancel?: () => void;
  onStatusChange?: (newStatus: string) => void;
  onPickupStatusChange?: (newStatus: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  bookingId,
  customerName,
  freelancerName,
  petNames,
  bookingDate,
  pickupTime,
  totalPrice,
  status,
  pickupStatus,
  isPaid,
  onCancel,
  onStatusChange,
  onPickupStatusChange,
}) => {
  const { theme } = useSettings();

  const getStatusStyle = (s: string) => {
    switch (s) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} rounded-2xl p-5 shadow transition` }>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-lg font-bold truncate">{customerName || 'N/A'}</div>
          <div className="text-sm text-gray-500">{petNames || 'N/A'}</div>
        </div>
        <div className="text-right">
          <div className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(status)}`}>{status}</div>
          <div className="text-xs text-gray-400 mt-1">{bookingId.substring(0, 8)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div className="flex items-center gap-2 text-gray-500"><AiOutlineCalendar /> <div>{new Date(bookingDate).toLocaleDateString('vi-VN')} • {pickupTime}</div></div>
        <div className="flex items-center gap-2 justify-end text-gray-500"><AiOutlineDollarCircle /> <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}</div></div>
        <div className="col-span-2 text-sm text-gray-600">Freelancer: {freelancerName || 'N/A'}</div>
        <div className="col-span-2 text-sm">Trạng thái lấy: <span className="ml-2 font-medium">{pickupStatus}</span></div>
      </div>

      <div className="flex gap-3 justify-end">
        {onStatusChange && (
          <button onClick={() => onStatusChange('Confirmed')} className="px-3 py-1 bg-blue-600 text-white rounded-md">Xác nhận</button>
        )}
        {onPickupStatusChange && (
          <button onClick={() => onPickupStatusChange('PickedUp')} className="px-3 py-1 bg-indigo-600 text-white rounded-md">Đã lấy</button>
        )}
        {onCancel && (
          <button onClick={onCancel} className="px-3 py-1 bg-red-600 text-white rounded-md">Hủy</button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
