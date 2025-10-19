import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineStar,
  AiOutlineHeart,
  AiOutlineEnvironment,
  AiOutlinePhone,
  AiOutlineMail,
} from "react-icons/ai";
import type { Freelancer, FreelancerListProps } from "../../types";

const FreelancerList: React.FC<FreelancerListProps> = ({ filters }) => {
  const navigate = useNavigate();
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<string>("relevant");

  // Mock data cho freelancers
  useEffect(() => {
    const mockFreelancers: Freelancer[] = [
      {
        id: 1,
        name: "Nguyễn Thị Mai",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b60b2bb4?w=150&h=150&fit=crop&crop=face",
        title: "Chuyên gia chăm sóc thú cưng",
        category: "Chăm sóc thú cưng",
        location: "Hà Nội",
        rating: 4.9,
        reviewCount: 127,
        description:
          "Có 5 năm kinh nghiệm chăm sóc chó mèo. Yêu thương và tận tâm với mọi bé cưng.",
        skills: ["Chăm sóc chó", "Chăm sóc mèo", "Sơ cứu thú y"],
        isVerified: true,
        completedJobs: 156,
        responseTime: "Trong 1 giờ",
      },
      {
        id: 2,
        name: "Trần Văn Đức",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        title: "Huấn luyện viên chó chuyên nghiệp",
        category: "Huấn luyện thú cưng",
        location: "TP. Hồ Chí Minh",
        rating: 4.8,
        reviewCount: 89,
        description:
          "Chuyên huấn luyện chó các giống từ nhỏ đến lớn. Phương pháp hiện đại, hiệu quả.",
        skills: ["Huấn luyện cơ bản", "Huấn luyện nâng cao", "Sửa tật xấu"],
        isVerified: true,
        completedJobs: 78,
        responseTime: "Trong 30 phút",
      },
      {
        id: 3,
        name: "Lê Thị Hoa",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        title: "Bác sĩ thú y",
        category: "Bác sĩ thú y",
        location: "Đà Nẵng",
        rating: 5.0,
        reviewCount: 203,
        description:
          "Bác sĩ thú y với 8 năm kinh nghiệm. Chuyên điều trị và phẫu thuật cho thú cưng.",
        skills: ["Khám tổng quát", "Phẫu thuật", "Điều trị bệnh"],
        isVerified: true,
        completedJobs: 245,
        responseTime: "Trong 2 giờ",
      },
      {
        id: 4,
        name: "Phạm Minh Tuấn",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        title: "Chuyên gia làm đẹp thú cưng",
        category: "Làm đẹp thú cưng",
        location: "Hà Nội",
        rating: 4.7,
        reviewCount: 156,
        description:
          "Chuyên cắt tỉa lông, làm đẹp cho chó mèo. Phong cách đa dạng, sáng tạo.",
        skills: ["Cắt tỉa lông", "Tạo kiểu", "Chăm sóc móng"],
        isVerified: true,
        completedJobs: 189,
        responseTime: "Trong 3 giờ",
      },
      {
        id: 5,
        name: "Võ Thị Lan",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        title: "Dịch vụ trông giữ thú cưng",
        category: "Trông giữ thú cưng",
        location: "TP. Hồ Chí Minh",
        rating: 4.6,
        reviewCount: 92,
        description:
          "Trông giữ thú cưng tại nhà với tình yêu thương. Môi trường an toàn, sạch sẽ.",
        skills: ["Trông giữ tại nhà", "Dắt đi dạo", "Cho ăn đúng giờ"],
        isVerified: false,
        completedJobs: 67,
        responseTime: "Trong 4 giờ",
      },
      {
        id: 6,
        name: "Đặng Văn Nam",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        title: "Nhiếp ảnh gia thú cưng",
        category: "Nhiếp ảnh thú cưng",
        location: "Hải Phòng",
        rating: 4.9,
        reviewCount: 134,
        description:
          "Chuyên chụp ảnh thú cưng với phong cách nghệ thuật. Lưu giữ những khoảnh khắc đẹp nhất.",
        skills: ["Chụp ảnh ngoại cảnh", "Chụp ảnh studio", "Chỉnh sửa ảnh"],
        isVerified: true,
        completedJobs: 112,
        responseTime: "Trong 2 giờ",
      },
    ];

    setFreelancers(mockFreelancers);
  }, []);

  // Filter freelancers based on filters
  const filteredFreelancers = freelancers.filter((freelancer) => {
    // Search term filter
    if (
      filters.searchTerm &&
      !freelancer.name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) &&
      !freelancer.title
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) &&
      !freelancer.description
        ?.toLowerCase()
        .includes(filters.searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (filters.category && freelancer.category !== filters.category) {
      return false;
    }

    // Location filter - match with actual location names
    if (filters.location) {
      const locationMap: Record<string, string> = {
        hanoi: "Hà Nội",
        hcm: "TP. Hồ Chí Minh",
        danang: "Đà Nẵng",
        haiphong: "Hải Phòng",
        cantho: "Cần Thơ",
      };

      const targetLocation = locationMap[filters.location] || filters.location;
      if (freelancer.location !== targetLocation) {
        return false;
      }
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating.replace("+", ""));
      if (freelancer.rating < minRating) {
        return false;
      }
    }

    return true;
  });

  // Sort freelancers based on selected option
  const sortedFreelancers = [...filteredFreelancers].sort((a, b) => {
    switch (sortOption) {
      case "rating":
        // Đánh giá cao nhất trước
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        // Nếu rating bằng nhau, ưu tiên số lượng đánh giá nhiều hơn
        return b.reviewCount - a.reviewCount;

      case "newest":
        // Mới nhất - ưu tiên completed jobs ít hơn (mới vào nghề)
        return a.completedJobs - b.completedJobs;

      case "experience":
        // Kinh nghiệm nhiều nhất
        return b.completedJobs - a.completedJobs;

      case "response":
        // Phản hồi nhanh nhất
        { const responseTimeA = parseInt(
          a.responseTime.match(/\d+/)?.[0] || "999"
        );
        const responseTimeB = parseInt(
          b.responseTime.match(/\d+/)?.[0] || "999"
        );
        return responseTimeA - responseTimeB; }

      case "relevant":
      default:
        // Độ phù hợp - kết hợp rating, completed jobs và verified status
        { const scoreA =
          a.rating * 0.4 +
          Math.min(a.completedJobs / 10, 10) * 0.3 +
          (a.isVerified ? 2 : 0);
        const scoreB =
          b.rating * 0.4 +
          Math.min(b.completedJobs / 10, 10) * 0.3 +
          (b.isVerified ? 2 : 0);
        return scoreB - scoreA; }
    }
  });

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const toggleFavorite = (freelancerId: number) => {
    setFavorites((prev) =>
      prev.includes(freelancerId)
        ? prev.filter((id) => id !== freelancerId)
        : [...prev, freelancerId]
    );
  };

  const handleBookService = (freelancer: Freelancer) => {
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
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Header với avatar và favorite */}
            <div className="relative p-6 pb-4">
              <button
                onClick={() => toggleFavorite(freelancer.id)}
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
                  <p className="text-sm text-emerald-600 font-medium">
                    {freelancer.title}
                  </p>
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
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {freelancer.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {freelancer.skills?.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
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
                <div>{freelancer.completedJobs} công việc hoàn thành</div>
              </div>

              {/* Response Time */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                  Phản hồi: {freelancer.responseTime}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBookService(freelancer)}
                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                >
                  Đặt dịch vụ
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <AiOutlinePhone className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <AiOutlineMail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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

      {/* Load More Button */}
      {sortedFreelancers.length > 0 && (
        <div className="text-center mt-12">
          <button className="px-8 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium">
            Xem thêm freelancer
          </button>
        </div>
      )}
    </div>
  );
};

export default FreelancerList;
