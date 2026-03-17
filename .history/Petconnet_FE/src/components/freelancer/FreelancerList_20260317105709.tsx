import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineStar,
  AiOutlineHeart,
  AiOutlineEnvironment,
  AiOutlinePhone,
  AiOutlineMail,
} from "react-icons/ai";
import { freelancerService, type FreelancerData } from "../../services";
import { showError } from "../../utils";

interface FreelancerListProps {
  filters: any;
}

const FreelancerList: React.FC<FreelancerListProps> = ({ filters }) => {
  const navigate = useNavigate();
  const [freelancers, setFreelancers] = useState<FreelancerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9; // 3 columns x 3 rows

  // Fetch freelancers từ API
  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      try {
        const response = await freelancerService.getAllFreelancers({
          page: currentPage,
          size: pageSize,
          searchTerm: filters.searchTerm,
          category: filters.category,
          location: filters.location,
          rating: filters.rating,
        });

        if (response.success && response.data) {
          // API trả về items, totalPages, pageNumber, pageSize
          setFreelancers(response.data.items || []);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setFreelancers([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching freelancers:", error);
        showError("Đã xảy ra lỗi khi tải danh sách freelancer");
        setFreelancers([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, [filters, currentPage]);

  // Chuyển đổi FreelancerData từ API sang format hiển thị
  const displayFreelancers = freelancers.map((freelancer: FreelancerData) => {
    const avgRating = freelancerService.calculateAverageRating(
      (freelancer as any).reviewsReceived || []
    );
    const reviewCount = (freelancer as any).reviewsReceived?.length || 0;

    const firstService = (freelancer.services && freelancer.services[0]) || {};

    return {
      id: freelancer._id || (freelancer as any).id,
      name: freelancer.name,
      avatar: (freelancer as any).avatarUrl || "https://picsum.photos/150",
      title: (firstService as any)?.name || "Freelancer thú cưng",
      category: freelancerService.formatServiceType(
        (firstService as any)?.category || "0"
      ),
      location: (freelancer as any).location || `${(freelancer as any).address?.city || ''}, ${(freelancer as any).address?.country || ''}`.trim() || 'Unknown',
      rating: avgRating,
      reviewCount: reviewCount,
      description:
        (firstService as any)?.description || "Chuyên nghiệp và tận tâm",
      skills: ((freelancer.services || [])
        .slice(0, 3)
        .map((s: any) => s.name) as string[]),
      isVerified: true, // Có thể thêm field này vào API sau
      completedJobs: undefined, // Chỉ hiển thị nếu API có data thực
      responseTime: undefined, // Chỉ hiển thị nếu API có data thực
      email: (freelancer as any).email,
      phone: (freelancer as any).phoneNumber,
      // Thêm services để truyền sang BookingPage
      services: (freelancer.services || []).map((s: any) => ({
        _id: s._id || s.id,
        id: s.id || s._id,
        name: s.name,
        title: s.name,
        description: s.description,
        price: s.price,
      })),
    };
  });

  // Sort freelancers based on selected option
  const sortedFreelancers = [...displayFreelancers].sort((a, b) => {
    switch (sortOption) {
      case "rating":
        // Đánh giá cao nhất trước
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        // Nếu rating bằng nhau, ưu tiên số lượng đánh giá nhiều hơn
        return (b.reviewCount || 0) - (a.reviewCount || 0);

      case "newest":
        // Mới nhất - ưu tiên completed jobs ít hơn (mới vào nghề)
        return (a.completedJobs || 0) - (b.completedJobs || 0);

      case "experience":
        // Kinh nghiệm nhiều nhất
        return (b.completedJobs || 0) - (a.completedJobs || 0);

      case "response":
        // Phản hồi nhanh nhất - skip if no response time
        return 0;

      case "relevant":
      default: {
        // Độ phù hợp - chỉ dựa trên rating và verified status
        const scoreA = a.rating * 0.6 + (a.isVerified ? 2 : 0);
        const scoreB = b.rating * 0.6 + (b.isVerified ? 2 : 0);
        return scoreB - scoreA;
      }
    }
  });

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const toggleFavorite = (freelancerId: string) => {
    setFavorites((prev) =>
      prev.includes(freelancerId)
        ? prev.filter((id) => id !== freelancerId)
        : [...prev, freelancerId]
    );
  };

  const handleBookService = (freelancer: (typeof displayFreelancers)[0]) => {
    console.log("Navigating to booking with freelancer:", freelancer);
    // Navigate to booking page with freelancer data
    navigate("/booking", {
      state: {
        freelancer: freelancer,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Freelancer thú cưng ({sortedFreelancers.length})
            </h2>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="relevant">Sắp xếp theo độ phù hợp</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="experience">Kinh nghiệm nhiều nhất</option>
              <option value="response">Phản hồi nhanh nhất</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFreelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                onClick={() => navigate(`/freelancers/${freelancer.id}`)}
              >
                {/* Header với avatar và favorite */}
                <div className="relative p-6 pb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(freelancer.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <AiOutlineHeart
                      className={`w-5 h-5 ${
                        favorites.includes(freelancer.id)
                          ? "text-red-500 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={freelancer.avatar}
                        alt={freelancer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {freelancer.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {freelancer.name}
                      </h3>
                      {freelancer.email && (
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <AiOutlineMail className="w-4 h-4 text-gray-400 mr-1" />
                          {freelancer.email}
                        </p>
                      )}
                      {freelancer.phone && (
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <AiOutlinePhone className="w-4 h-4 text-gray-400 mr-1" />
                          {freelancer.phone}
                        </p>
                      )}
                      <div className="flex items-center mt-1">
                        <AiOutlineEnvironment className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          {freelancer.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-4">
                  {/* Services/Skills badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {freelancer.skills?.slice(0, 5).map((skill: string, index: number) => (
                      <span
                        key={`${freelancer.id}-skill-${index}`}
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {freelancer.skills && freelancer.skills.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                        ...
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <AiOutlineStar className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium text-gray-700">
                        {freelancer.rating}
                      </span>
                      <span className="ml-1">
                        ({freelancer.reviewCount} đánh giá)
                      </span>
                    </div>
                    {freelancer.completedJobs && (
                      <div>{freelancer.completedJobs} công việc hoàn thành</div>
                    )}
                  </div>

                  {/* Response Time - Only show if available */}
                  {freelancer.responseTime && (
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-500">
                        Phản hồi: {freelancer.responseTime}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookService(freelancer);
                      }}
                      className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                    >
                      Đặt dịch vụ
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <AiOutlinePhone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <AiOutlineMail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {sortedFreelancers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Không tìm thấy freelancer phù hợp
              </h3>
              <p className="text-gray-500">
                Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          )}

          {/* Pagination */}
          {sortedFreelancers.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Trước
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Tiếp
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FreelancerList;
