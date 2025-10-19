import React from "react";
import { AiOutlineFilter, AiOutlineStar } from "react-icons/ai";
import type { FreelancerFiltersProps } from "../../types";

const FreelancerFilters: React.FC<FreelancerFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const categories = [
    "Chăm sóc thú cưng",
    "Huấn luyện thú cưng",
    "Bác sĩ thú y",
    "Làm đẹp thú cưng",
    "Trông giữ thú cưng",
    "Tắm rửa thú cưng",
    "Nhiếp ảnh thú cưng",
    "Tư vấn dinh dưỡng",
  ];

  const ratings = [
    { value: "4+", label: "4+ sao" },
    { value: "3+", label: "3+ sao" },
    { value: "2+", label: "2+ sao" },
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <AiOutlineFilter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Bộ lọc</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange?.({ category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khu vực
            </label>
            <select
              value={filters.location}
              onChange={(e) => onFilterChange?.({ location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
            >
              <option value="">Tất cả khu vực</option>
              <option value="hanoi">Hà Nội</option>
              <option value="hcm">TP. Hồ Chí Minh</option>
              <option value="danang">Đà Nẵng</option>
              <option value="haiphong">Hải Phòng</option>
              <option value="cantho">Cần Thơ</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AiOutlineStar className="inline w-4 h-4 mr-1" />
              Đánh giá
            </label>
            <select
              value={filters.rating}
              onChange={(e) => onFilterChange?.({ rating: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
            >
              <option value="">Tất cả đánh giá</option>
              {ratings.map((rating) => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() =>
              onFilterChange?.({
                category: "",
                location: "",
                rating: "",
              })
            }
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Xóa tất cả bộ lọc
          </button>

          <div className="text-sm text-gray-500">
            Tìm thấy freelancer phù hợp với tiêu chí của bạn
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerFilters;
