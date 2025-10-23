import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineStar,
  AiOutlineHeart,
  AiOutlineEnvironment,
  AiOutlinePhone,
  AiOutlineCheckCircle,
  AiOutlineShoppingCart,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import type { FreelancerProfile } from "../../../types/domains/profile";

interface FreelancerProfileHeaderProps {
  freelancer: FreelancerProfile;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookService: () => void;
}

const FreelancerProfileHeader: React.FC<FreelancerProfileHeaderProps> = ({
  freelancer,
  isFavorite,
  onToggleFavorite,
  onBookService,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
        Quay lại
      </button>

      {/* Header Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="relative h-48 bg-gradient-to-r from-emerald-400 to-teal-500">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4 md:mb-0">
              <img
                src={freelancer.avatar}
                alt={freelancer.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {freelancer.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
                  <AiOutlineCheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {freelancer.name}
                  </h1>
                  <p className="text-lg text-emerald-600 font-medium mb-2">
                    {freelancer.businessName || "Chuyên gia chăm sóc thú cưng"}
                  </p>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <AiOutlineEnvironment className="w-5 h-5 mr-1" />
                      <span>
                        {freelancer.address?.city || "TP. Hồ Chí Minh"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <AiOutlineStar className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="font-medium">{freelancer.rating}</span>
                      <span className="ml-1">
                        ({freelancer.reviewsCount} đánh giá)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <button
                    onClick={onToggleFavorite}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <AiOutlineHeart
                      className={`w-5 h-5 ${
                        isFavorite
                          ? "text-red-500 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <AiOutlinePhone className="w-5 h-5 mr-2" />
                    Liên hệ
                  </button>
                  <button
                    onClick={onBookService}
                    className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    <AiOutlineShoppingCart className="w-5 h-5 mr-2" />
                    Đặt dịch vụ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreelancerProfileHeader;
