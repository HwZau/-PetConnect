import React from "react";
import type { FreelancerProfile } from "../../../types/domains/profile";

interface FreelancerPortfolioTabProps {
  freelancer: FreelancerProfile;
}

const FreelancerPortfolioTab: React.FC<FreelancerPortfolioTabProps> = ({
  freelancer,
}) => {
  return (
    <div className="space-y-6">
      {freelancer.portfolio?.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {item.title}
          </h3>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {item.imageUrls?.map((photo: string, index: number) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={photo}
                  alt={`${item.title} - Hình ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {item.clientTestimonial && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 italic">"{item.clientTestimonial}"</p>
            </div>
          )}
        </div>
      ))}

      {(!freelancer.portfolio || freelancer.portfolio.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500">Chưa có portfolio để hiển thị</p>
        </div>
      )}
    </div>
  );
};

export default FreelancerPortfolioTab;
