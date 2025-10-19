import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarCheck } from "react-icons/fa";

interface Service {
  id: string;
  title: string;
  location: string;
  status: string;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  percentage: string;
}

interface RecentServicesProps {
  services: Service[];
}

const RecentServices: React.FC<RecentServicesProps> = ({ services }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaCalendarCheck className="mr-2 text-blue-500" />
          Đặt dịch vụ gần đây
        </h2>
        <Link to="/services" className="text-sm text-blue-500 hover:underline">
          Xem tất cả
        </Link>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="flex items-start">
            <div
              className={`${service.bgColor} h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0`}
            >
              {service.icon}
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-medium">{service.title}</h3>
              <p className="text-xs text-gray-500">{service.location}</p>
              <div className="mt-2 flex items-center justify-between">
                <span
                  className={`text-xs text-${service.color}-500 font-medium`}
                >
                  {service.status}
                </span>
                <span className="text-xs text-gray-500">
                  {service.percentage} xong
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentServices;
