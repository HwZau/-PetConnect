import React from "react";
import type { ServiceOption, ServiceSelectionProps } from "../../types";

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedService,
  onServiceChange,
  error,
}) => {
  const serviceOptions: ServiceOption[] = [
    {
      id: "pet_sitting",
      name: "Trông thú cưng",
      price: 200000,
      description: "Chăm sóc thú cưng tại nhà bạn",
    },
    {
      id: "dog_walking",
      name: "Dắt chó đi dạo",
      price: 150000,
      description: "Dắt chó đi dạo và vận động",
    },
    {
      id: "pet_grooming",
      name: "Tắm gội và làm đẹp",
      price: 300000,
      description: "Tắm gội, cắt tỉa lông cho thú cưng",
    },
    {
      id: "pet_training",
      name: "Huấn luyện thú cưng",
      price: 500000,
      description: "Huấn luyện kỹ năng cơ bản cho thú cưng",
    },
    {
      id: "pet_transportation",
      name: "Đưa đón thú cưng",
      price: 100000,
      description: "Đưa đón thú cưng đến các địa điểm",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        1. Chọn Dịch Vụ
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {serviceOptions.map((service) => (
          <div
            key={service.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedService === service.id
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300"
            }`}
            onClick={() => onServiceChange(service.id)}
          >
            <h3 className="font-semibold text-gray-800">{service.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
            <p className="text-purple-600 font-semibold mt-2">
              {service.price.toLocaleString("vi-VN")}đ/lần
            </p>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ServiceSelection;
