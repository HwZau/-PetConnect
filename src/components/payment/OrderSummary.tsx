import React from "react";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiLock,
  FiShield,
} from "react-icons/fi";
import type { PaymentBookingData } from "../../types";
import { ServiceManager } from "../../services/booking/serviceManager";

interface OrderSummaryProps {
  bookingData: PaymentBookingData;
  onPayment: () => void;
  isProcessing: boolean;
  totalPrice: number; // Total price from booking API
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  bookingData,
  onPayment,
  isProcessing,
  totalPrice,
}) => {
  const getSingleServiceInfo = () => {
    if (bookingData.service) {
      const name = ServiceManager.getServiceName(bookingData.service);
      const basePrice = ServiceManager.getServicePrice(bookingData.service);
      return { name, basePrice };
    }
    return { name: "Dịch vụ chăm sóc thú cưng", basePrice: 100000 };
  };

  const getMultipleServiceDetails = () => {
    if (!bookingData.serviceIds || bookingData.serviceIds.length === 0) {
      return [];
    }
    return bookingData.serviceIds.map((serviceId) => ({
      name: ServiceManager.getServiceName(serviceId),
      basePrice: ServiceManager.getServicePrice(serviceId),
    }));
  };

  // Removed calculateTotal - using totalPrice from API instead

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
      <h2 className="text-xl font-semibold mb-6">Tóm tắt đơn hàng</h2>

      {/* Service Info */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center">
          <img
            src={bookingData.freelancer.avatar}
            alt={bookingData.freelancer.name}
            className="w-12 h-12 rounded-full object-cover mr-3"
          />
          <div>
            <p className="font-semibold">{bookingData.freelancer.name}</p>
            <p className="text-sm text-gray-600 flex items-center">
              <FiMapPin className="w-4 h-4 mr-1" />
              {bookingData.freelancer.location}
            </p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center text-sm">
            <FiCalendar className="w-4 h-4 mr-2 text-gray-500" />
            <span>{bookingData.dateTime.date}</span>
          </div>
          <div className="flex items-center text-sm">
            <FiClock className="w-4 h-4 mr-2 text-gray-500" />
            <span>{bookingData.dateTime.time}</span>
          </div>

          {/* Service(s) Display */}
          {bookingData.serviceIds && bookingData.serviceIds.length > 0 ? (
            <div className="text-sm">
              <div className="flex items-start">
                <FiUser className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  {getMultipleServiceDetails().map((service, idx) => (
                    <div key={idx} className="mb-1">
                      {service.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center text-sm">
              <FiUser className="w-4 h-4 mr-2 text-gray-500" />
              <span>{getSingleServiceInfo().name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pet Details */}
      <div className="border-t pt-4 mb-6">
        <h4 className="font-semibold mb-3">
          Thú cưng ({bookingData.petInfo.length})
        </h4>
        {bookingData.petInfo.map((pet, index) => (
          <div key={index} className="text-sm mb-2">
            {pet.petName} ({pet.petType})
          </div>
        ))}
      </div>

      {/* Price Total */}
      <div className="border-t pt-4">
        <div className="flex justify-between font-semibold text-xl">
          <span>Tổng cộng</span>
          <span className="text-blue-600">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={onPayment}
        disabled={isProcessing}
        className="w-full mt-6 bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Đang xử lý...
          </>
        ) : (
          <>
            <FiLock className="mr-2" />
            Thanh toán ngay
          </>
        )}
      </button>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <FiShield className="inline mr-1" />
        Thanh toán của bạn được bảo mật và mã hóa
      </div>
    </div>
  );
};

export default OrderSummary;
