import React from "react";
import type { CustomerInformationProps } from "../../types";

const CustomerInformation: React.FC<CustomerInformationProps> = ({
  customerInfo,
  onCustomerInfoChange,
  errors,
}) => {
  const getStringValue = (value: any): string => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (value && typeof value === "object") {
      // Handle emergency contact object
      if ("name" in value || "phone" in value) {
        return "";
      }
      // Handle address object
      if ("street" in value || "city" in value) {
        return "";
      }
    }
    return "";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        4. Thông Tin Khách Hàng
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên
          </label>
          <input
            type="text"
            value={
              (customerInfo as any)?.name ||
              (customerInfo as any)?.fullName ||
              ""
            }
            onChange={(e) => onCustomerInfoChange?.("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Nhập họ và tên"
          />
          {errors?.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={customerInfo?.email || ""}
            onChange={(e) => onCustomerInfoChange?.("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="example@gmail.com"
          />
          {errors?.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={customerInfo?.phone || ""}
            onChange={(e) => onCustomerInfoChange?.("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="0987654321"
          />
          {errors?.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Liên hệ khẩn cấp
          </label>
          <input
            type="tel"
            value={getStringValue(customerInfo?.emergencyContact)}
            onChange={(e) =>
              onCustomerInfoChange?.("emergencyContact", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Số điện thoại khẩn cấp"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ
          </label>
          <input
            type="text"
            value={getStringValue(customerInfo?.address)}
            onChange={(e) => onCustomerInfoChange?.("address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Số nhà, đường, quận/huyện, thành phố"
          />
          {errors?.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerInformation;
