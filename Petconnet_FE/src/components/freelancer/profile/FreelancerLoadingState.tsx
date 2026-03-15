import React from "react";
import Navbar from "../../common/Navbar";

const FreelancerLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <div className="flex items-start space-x-6">
              <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerLoadingState;
