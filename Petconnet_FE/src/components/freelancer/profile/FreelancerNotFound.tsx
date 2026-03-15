import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../common/Navbar";

const FreelancerNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Không tìm thấy freelancer
          </h2>
          <button
            onClick={() => navigate("/freelancers")}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreelancerNotFound;
