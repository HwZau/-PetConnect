import React from "react";
import type { ServiceSelectionProps } from "../../types";
import { ServiceManager } from "../../services/booking/serviceManager";

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedService,
  onServiceChange,
  error,
}) => {
  const serviceOptions = ServiceManager.getServicesForSelect();

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
