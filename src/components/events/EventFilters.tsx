import { useState } from "react";

interface EventFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  search: string;
  category: string;
  location: string;
  dateRange: string;
}

const EventFilters = ({ onFilterChange }: EventFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    location: "",
    dateRange: "",
  });

  const categories = [
    { value: "", label: "Tất cả thể loại" },
    { value: "workshop", label: "Workshop" },
    { value: "show", label: "Show diễn" },
    { value: "adoption", label: "Nhận nuôi" },
    { value: "competition", label: "Cuộc thi" },
    { value: "training", label: "Huấn luyện" },
    { value: "healthcare", label: "Chăm sóc sức khỏe" },
  ];

  const locations = [
    { value: "", label: "Tất cả địa điểm" },
    { value: "q1", label: "Quận 1" },
    { value: "q3", label: "Quận 3" },
    { value: "q7", label: "Quận 7" },
    { value: "govap", label: "Gò Vấp" },
    { value: "tanbinh", label: "Tân Bình" },
    { value: "binhtan", label: "Bình Tân" },
    { value: "online", label: "Online" },
  ];

  const dateRanges = [
    { value: "", label: "Bất kỳ lúc nào" },
    { value: "today", label: "Hôm nay" },
    { value: "tomorrow", label: "Ngày mai" },
    { value: "this-week", label: "Tuần này" },
    { value: "next-week", label: "Tuần sau" },
    { value: "this-month", label: "Tháng này" },
    { value: "next-month", label: "Tháng sau" },
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      location: "",
      dateRange: "",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.search || filters.category || filters.location || filters.dateRange;

  return (
    <section className="py-8 bg-white border-b border-gray-200 px-3">
      <div className="w-[95%] mx-auto">
        {/* Filter Row with Search */}
        <div className="flex flex-wrap gap-4 items-end justify-between">
          {/* Search Bar - Left Side */}
          <div className="flex flex-col flex-1 max-w-md">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>

          {/* Filters Group - Right Side */}
          <div className="flex flex-wrap gap-4 items-end">
            {/* Category Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Thể loại
              </label>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[150px]"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Địa điểm
              </label>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[150px]"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              >
                {locations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Thời gian
              </label>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[150px]"
                value={filters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-transparent mb-1">
                  Action
                </label>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Bộ lọc hiện tại:</span>
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Tìm kiếm: "{filters.search}"
                <button
                  onClick={() => handleFilterChange("search", "")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {categories.find((c) => c.value === filters.category)?.label}
                <button
                  onClick={() => handleFilterChange("category", "")}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {locations.find((l) => l.value === filters.location)?.label}
                <button
                  onClick={() => handleFilterChange("location", "")}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.dateRange && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {dateRanges.find((d) => d.value === filters.dateRange)?.label}
                <button
                  onClick={() => handleFilterChange("dateRange", "")}
                  className="ml-2 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventFilters;
