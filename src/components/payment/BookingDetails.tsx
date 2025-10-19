import React from "react";
import { FiCalendar, FiClock, FiUser, FiPhone } from "react-icons/fi";
import type { PaymentBookingData } from "../../types";

interface BookingDetailsProps {
  bookingData: PaymentBookingData;
  isVisible: boolean;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  bookingData,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="px-8 py-6 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Thông tin đặt dịch vụ</h3>

      <div className="space-y-3">
        <div className="flex items-center text-sm">
          <FiUser className="w-4 h-4 mr-3 text-gray-500" />
          <span className="text-gray-600 min-w-0 flex-1">Chuyên gia:</span>
          <span className="font-semibold">{bookingData.freelancer?.name}</span>
        </div>

        <div className="flex items-center text-sm">
          <FiCalendar className="w-4 h-4 mr-3 text-gray-500" />
          <span className="text-gray-600 min-w-0 flex-1">Ngày:</span>
          <span className="font-semibold">{bookingData.dateTime?.date}</span>
        </div>

        <div className="flex items-center text-sm">
          <FiClock className="w-4 h-4 mr-3 text-gray-500" />
          <span className="text-gray-600 min-w-0 flex-1">Giờ:</span>
          <span className="font-semibold">{bookingData.dateTime?.time}</span>
        </div>

        <div className="flex items-center text-sm">
          <FiPhone className="w-4 h-4 mr-3 text-gray-500" />
          <span className="text-gray-600 min-w-0 flex-1">Liên hệ:</span>
          <span className="font-semibold">{bookingData.customer?.phone}</span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Lưu ý:</strong> Chuyên gia sẽ liên hệ với bạn trong vòng 30
          phút để xác nhận lịch hẹn. Vui lòng giữ máy và kiểm tra tin nhắn.
        </p>
      </div>
    </div>
  );
};

export default BookingDetails;
