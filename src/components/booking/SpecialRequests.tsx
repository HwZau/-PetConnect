import React from "react";
import type { SpecialRequestsProps } from "../../types";

const SpecialRequests: React.FC<SpecialRequestsProps> = ({
  specialRequests,
  onSpecialRequestsChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        5. Yêu Cầu Đặc Biệt
      </h2>
      <textarea
        value={specialRequests}
        onChange={(e) => onSpecialRequestsChange?.(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Ví dụ: Thú cưng sợ tiếng ồn, có dị ứng thức ăn, cần chú ý đặc biệt..."
      />
    </div>
  );
};

export default SpecialRequests;
