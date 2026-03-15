import React from "react";
import { ServiceManager } from "../../services/booking/serviceManager";

interface ServiceSelectionProps {
  selectedServiceIds?: string[];
  onServiceChange?: (serviceId: string) => void;
  error?: string;
  freelancer?: any;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedServiceIds,
  onServiceChange,
  error,
  freelancer,
}) => {
  // If freelancer is provided and has services, use their services
  // Otherwise fall back to all services
  const serviceOptions = freelancer?.services
    ? freelancer.services.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description || "",
        price:
          typeof service.price === "number"
            ? service.price
            : parseFloat(service.price) || 0,
      }))
    : ServiceManager.getServicesForSelect();

  const isSelected = (serviceId: string) =>
    selectedServiceIds?.includes(serviceId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        1. Chọn Dịch Vụ
        {selectedServiceIds && selectedServiceIds.length > 0 && (
          <span className="ml-2 text-sm text-purple-600">
            ({selectedServiceIds.length} đã chọn)
          </span>
        )}
      </h2>

      {serviceOptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceOptions.map((service: any, index: number) => {
            const selected = isSelected(service.id);
            return (
              <div
                key={`${freelancer?.id || 'default'}-service-${service.id}-${index}`}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${
                  selected
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
                onClick={() => onServiceChange?.(service.id)}
              >
                {/* Checkbox indicator */}
                <div
                  className={`absolute top-3 right-3 w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selected
                      ? "bg-purple-500 border-purple-500"
                      : "border-gray-300"
                  }`}
                >
                  {selected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                <h3 className="font-semibold text-gray-800 pr-8">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {service.description}
                </p>
                <p className="text-purple-600 font-semibold mt-2">
                  {service.price.toLocaleString("vi-VN")}đ/lần
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Freelancer này chưa có dịch vụ nào</p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ServiceSelection;
