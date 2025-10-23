import React from "react";
import { formatDate } from "../../utils";
import type { BookingSummaryProps } from "../../types";
import { ServiceManager } from "../../services/booking/serviceManager";

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedFreelancer,
  selectedService,
  petInfo,
  date,
  time,
  recurringService,
  frequency,
  onSubmit,
}) => {
  const currentService = selectedService
    ? ServiceManager.getServiceById(selectedService)
    : undefined;

  // Calculate total price using ServiceManager
  const calculateTotalPrice = () => {
    if (!selectedService || !petInfo || petInfo.length === 0) return 0;

    const petSizes = petInfo.map((pet) => pet.petSize);
    return ServiceManager.calculateTotalPrice(
      selectedService,
      petInfo.length,
      petSizes,
      recurringService
    );
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Tóm Tắt Đặt Dịch Vụ
      </h2>

      {/* Freelancer Info */}
      {selectedFreelancer && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={selectedFreelancer.avatar}
              alt={selectedFreelancer.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h4 className="font-medium text-gray-800">
                {selectedFreelancer.name}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedFreelancer.title}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>📍 {selectedFreelancer.location}</p>
            <p>💼 {selectedFreelancer.completedJobs} công việc hoàn thành</p>
            <p>⏱️ Phản hồi: {selectedFreelancer.responseTime}</p>
          </div>
        </div>
      )}

      {currentService && (
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Dịch vụ:</span>
            <span className="font-medium">{currentService.name}</span>
          </div>

          {/* Pet Information Section */}
          {petInfo && petInfo.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thú cưng:</span>
                <span className="text-sm text-gray-500">
                  {petInfo.length}{" "}
                  {petInfo.length === 1 ? "thú cưng" : "thú cưng"}
                </span>
              </div>

              {petInfo.map((pet, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-md p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-800">
                      {pet.petName || `Thú cưng ${index + 1}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {pet.petType === "dog"
                        ? "Chó"
                        : pet.petType === "cat"
                        ? "Mèo"
                        : pet.petType === "bird"
                        ? "Chim"
                        : pet.petType === "fish"
                        ? "Cá"
                        : pet.petType === "rabbit"
                        ? "Thỏ"
                        : pet.petType === "hamster"
                        ? "Chuột hamster"
                        : pet.petType || "Chưa chọn"}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600">
                    <span>
                      Kích thước:{" "}
                      {pet.petSize === "small"
                        ? "Nhỏ"
                        : pet.petSize === "medium"
                        ? "Trung bình"
                        : pet.petSize === "large"
                        ? "Lớn"
                        : pet.petSize || "Chưa chọn"}
                    </span>
                  </div>

                  {pet.petAge && (
                    <div className="text-xs text-gray-600">
                      Tuổi: {pet.petAge}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {date && (
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày:</span>
              <span className="font-medium">
                {formatDate(new Date(date), "dd/MM/yyyy")}
              </span>
            </div>
          )}

          {time && (
            <div className="flex justify-between">
              <span className="text-gray-600">Giờ:</span>
              <span className="font-medium">{time}</span>
            </div>
          )}

          <hr className="my-4" />

          <div className="space-y-2">
            {petInfo && petInfo.length > 1 && (
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Dịch vụ cơ bản:</span>
                  <span>
                    {ServiceManager.formatPrice(currentService.basePrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Số thú cưng:</span>
                  <span>x {petInfo.length}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng cộng:</span>
              <span className="text-purple-600">
                {ServiceManager.formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          {recurringService && (
            <p className="text-sm text-gray-600">
              * Dịch vụ định kỳ{" "}
              {frequency === "daily"
                ? "hàng ngày"
                : frequency === "weekly"
                ? "hàng tuần"
                : frequency === "monthly"
                ? "hàng tháng"
                : ""}
            </p>
          )}
        </div>
      )}

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSubmit();
        }}
        type="button"
        className="w-full py-3 px-4 rounded-lg transition-colors font-medium bg-purple-600 text-white hover:bg-purple-700"
      >
        Xác Nhận Đặt Dịch Vụ
      </button>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Chúng tôi sẽ liên hệ xác nhận trong 30 phút</p>
        <p>• Có thể hủy miễn phí trước 2 giờ</p>
        <p>• Thanh toán sau khi hoàn thành dịch vụ</p>
      </div>
    </div>
  );
};

export default BookingSummary;
