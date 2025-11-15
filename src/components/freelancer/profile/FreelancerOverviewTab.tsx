import React from "react";
import type { FreelancerProfile as Freelancer } from "../../../types/domains/profile";

interface FreelancerOverviewTabProps {
  freelancer: Freelancer;
}

const FreelancerOverviewTab: React.FC<FreelancerOverviewTabProps> = ({
  freelancer,
}) => {
  // Use services from pricing if available (mapped from API services)
  const services =
    freelancer.pricing && freelancer.pricing.length > 0
      ? freelancer.pricing.map((pricing) => ({
          name: pricing.serviceType,
          description: pricing.description,
          price: `${pricing.basePrice.toLocaleString("vi-VN")}đ/${
            pricing.unit === "hour"
              ? "giờ"
              : pricing.unit === "session"
              ? "buổi"
              : "ngày"
          }`,
        }))
      : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Giới thiệu</h3>
        <p className="text-gray-600 leading-relaxed">
          {freelancer.description}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Kỹ năng chuyên môn
        </h3>
        <div className="flex flex-wrap gap-2">
          {freelancer.specializations?.map((skill: string) => (
            <span
              key={skill}
              className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Dịch vụ cung cấp
        </h3>
        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {services.map((service, index) => (
              <div
                key={`${service.name}-${index}`}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {service.name}
                  </h4>
                  <span className="text-emerald-600 font-bold whitespace-nowrap ml-4">
                    {service.price}
                  </span>
                </div>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có dịch vụ nào được đăng ký</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerOverviewTab;
