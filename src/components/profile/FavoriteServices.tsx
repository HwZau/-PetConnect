import React from "react";
import { FaHeart } from "react-icons/fa";

interface FavoriteService {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  bgColor: string;
}

interface FavoriteServicesProps {
  services: FavoriteService[];
}

const FavoriteServices: React.FC<FavoriteServicesProps> = ({ services }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <FaHeart className="mr-2 text-red-500" />
        <h2 className="text-lg font-semibold text-gray-800">
          Dịch vụ yêu thích
        </h2>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center p-3 bg-gray-50 rounded-lg"
          >
            <div
              className={`h-8 w-8 ${service.bgColor} rounded-lg flex items-center justify-center mr-3`}
            >
              {service.icon}
            </div>
            <div>
              <h3 className="font-medium">{service.title}</h3>
              <p className="text-xs text-gray-500">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteServices;
