import React from "react";
import { formatDate, getPickUpTimeLabel } from "../../utils";
import type { BookingSummaryProps } from "../../types";

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedFreelancer,
  selectedService,
  petInfo,
  date,
  time,
  onSubmit,
}) => {
  // Find selected service from freelancer's services
  const currentService = selectedFreelancer?.services?.find(
    (service: any) => service.id === selectedService
  );

  // Calculate total price based on selected service and number of pets
  const calculateTotalPrice = () => {
    if (!currentService || !petInfo || petInfo.length === 0) return 0;

    // Base price * number of pets
    const basePrice =
      typeof currentService.price === "number"
        ? currentService.price
        : parseFloat(currentService.price) || 0;

    return basePrice * petInfo.length;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Tóm Tắt Đặt Dịch Vụ
      </h2>

      {/* Freelancer Info */}
      {selectedFreelancer && (
        <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
          <div className="flex items-center space-x-3 mb-2">
            <img
              src={selectedFreelancer.avatar}
              alt={selectedFreelancer.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <h4 className="font-semibold text-gray-800">
                {selectedFreelancer.name}
              </h4>
              {selectedFreelancer.email && (
                <p className="text-xs text-gray-600">
                  {selectedFreelancer.email}
                </p>
              )}
            </div>
          </div>
          {selectedFreelancer.phone && (
            <div className="text-sm text-gray-700 mt-2">
              📞 {selectedFreelancer.phone}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {/* Service */}
        {currentService && (
          <div className="pb-3 border-b border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-600">Dịch vụ:</span>
              <span className="font-semibold text-gray-800 text-right">
                {currentService.name}
              </span>
            </div>
            {currentService.description && (
              <p className="text-xs text-gray-500 mt-1">
                {currentService.description}
              </p>
            )}
          </div>
        )}

        {/* Pet Information */}
        {petInfo && petInfo.length > 0 && (
          <div className="pb-3 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Thú cưng:</span>
              <span className="text-sm font-medium text-gray-800">
                {petInfo.length} bé
              </span>
            </div>

            <div className="space-y-2">
              {petInfo.map((pet: any, index: number) => (
                <div
                  key={pet.petId || index}
                  className="bg-purple-50 rounded-lg p-2 flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {pet.petName?.charAt(0) || "P"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {pet.petName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {pet.species === "dog"
                        ? "Chó"
                        : pet.species === "cat"
                        ? "Mèo"
                        : pet.species}{" "}
                      • {pet.breed}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date & Time */}
        {date && (
          <div className="pb-3 border-b border-gray-200">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Ngày:</span>
              <span className="font-medium text-gray-800">
                {formatDate(new Date(date), "dd/MM/yyyy")}
              </span>
            </div>
            {time && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Giờ:</span>
                <span className="font-medium text-gray-800">
                  {getPickUpTimeLabel(time)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        {currentService && petInfo && petInfo.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Giá dịch vụ:</span>
              <span>
                {(typeof currentService.price === "number"
                  ? currentService.price
                  : parseFloat(currentService.price) || 0
                ).toLocaleString("vi-VN")}
                đ
              </span>
            </div>

            {petInfo.length > 1 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Số lượng:</span>
                <span>x {petInfo.length}</span>
              </div>
            )}

            <div className="pt-3 border-t-2 border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-800">
                  Tổng cộng:
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  {totalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSubmit?.();
        }}
        type="button"
        className="w-full py-3 px-4 rounded-lg transition-all duration-200 font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg"
      >
        Tiếp tục thanh toán
      </button>

      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>✓ Xác nhận trong 30 phút</p>
        <p>✓ Hủy miễn phí trước 2 giờ</p>
        <p>✓ Thanh toán sau khi hoàn thành</p>
      </div>
    </div>
  );
};

export default BookingSummary;
