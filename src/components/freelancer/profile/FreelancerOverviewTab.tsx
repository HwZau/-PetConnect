import React from "react";
import type { FreelancerProfile as Freelancer } from "../../../types/domains/profile";

interface FreelancerOverviewTabProps {
  freelancer: Freelancer;
}

const FreelancerOverviewTab: React.FC<FreelancerOverviewTabProps> = ({
  freelancer,
}) => {
  const services = [
    { name: "Chăm sóc tại nhà", price: "200,000đ/ngày" },
    { name: "Trông giữ thú cưng", price: "150,000đ/ngày" },
    { name: "Dắt đi dạo", price: "100,000đ/lần" },
    { name: "Tắm rửa làm đẹp", price: "300,000đ/lần" },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
            >
              <span className="font-medium">{service.name}</span>
              <span className="text-emerald-600 font-semibold">
                {service.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreelancerOverviewTab;
