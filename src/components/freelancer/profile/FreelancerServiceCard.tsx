import React from "react";
import {
  FaBriefcase,
  FaClock,
  FaMoneyBillWave,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
}

interface FreelancerServiceCardProps {
  service: Service;
  onEdit?: (service: Service) => void;
  onDelete?: (serviceId: string) => void;
}

const FreelancerServiceCard: React.FC<FreelancerServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-5 hover:shadow-lg transition-all hover:scale-105">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
            <FaBriefcase className="text-white text-xl" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-lg">{service.name}</h4>
            <span className="inline-block mt-1 text-xs bg-teal-500 text-white px-3 py-1 rounded-full font-medium">
              {service.category}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(service)}
              className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-all"
              title="Chỉnh sửa"
            >
              <FaEdit />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(service.id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
              title="Xóa"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{service.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-teal-200">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <FaClock className="text-teal-600" />
          <span>{service.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-lg font-bold text-teal-600">
          <FaMoneyBillWave />
          <span>{formatPrice(service.price)}</span>
        </div>
      </div>
    </div>
  );
};

export default FreelancerServiceCard;
