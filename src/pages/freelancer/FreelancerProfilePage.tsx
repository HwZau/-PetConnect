import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AiOutlineStar,
  AiOutlineHeart,
  AiOutlineEnvironment,
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineShoppingCart,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import Navbar from "../../components/common/Navbar";
import type { Freelancer } from "../../types";

const FreelancerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "reviews" | "portfolio"
  >("overview");
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data cho freelancer profile
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockFreelancer: Freelancer = {
        id: parseInt(id || "1"),
        name: "Nguyễn Thị Mai",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b60b2bb4?w=300&h=300&fit=crop&crop=face",
        title: "Chuyên gia chăm sóc thú cưng",
        bio: "Tôi là một người yêu động vật với hơn 5 năm kinh nghiệm trong việc chăm sóc và huấn luyện thú cưng. Tôi hiểu rằng mỗi thú cưng đều có tính cách và nhu cầu riêng biệt, vì vậy tôi luôn dành thời gian để tìm hiểu và tạo ra phương pháp chăm sóc phù hợp nhất cho từng bé cưng.",
        category: "Chăm sóc thú cưng",
        location: "Hà Nội",
        rating: 4.9,
        reviewCount: 127,
        totalReviews: 127,
        description:
          "Có 5 năm kinh nghiệm chăm sóc chó mèo. Yêu thương và tận tâm với mọi bé cưng.",
        skills: [
          "Chăm sóc chó",
          "Chăm sóc mèo",
          "Sơ cứu thú y",
          "Huấn luyện cơ bản",
          "Tắm rửa",
          "Cắt tỉa lông",
        ],
        isVerified: true,
        completedJobs: 156,
        responseTime: "Trong 1 giờ",
        hourlyRate: 200000,
        availableServices: ["pet-sitting", "dog-walking", "grooming"],
        photos: [
          "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
        ],
      };

      setFreelancer(mockFreelancer);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleBookService = () => {
    if (freelancer) {
      navigate("/booking", {
        state: { freelancer },
      });
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
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
  }

  if (!freelancer) {
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
  }

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      userName: "Trần Văn A",
      userAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      comment:
        "Chị Mai chăm sóc thú cưng rất tận tâm và chu đáo. Bé cún nhà tôi rất thích chị.",
      date: "2 ngày trước",
      service: "Chăm sóc tại nhà",
    },
    {
      id: 2,
      userName: "Nguyễn Thị B",
      userAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b60b2bb4?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      comment:
        "Dịch vụ tuyệt vời! Chị rất kiên nhẫn với thú cưng và luôn cập nhật tình hình cho tôi.",
      date: "1 tuần trước",
      service: "Trông giữ thú cưng",
    },
    {
      id: 3,
      userName: "Lê Văn C",
      userAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      rating: 4,
      comment: "Chuyên nghiệp và đáng tin cậy. Sẽ tiếp tục sử dụng dịch vụ.",
      date: "2 tuần trước",
      service: "Huấn luyện cơ bản",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
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
                      {freelancer.title}
                    </p>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center">
                        <AiOutlineEnvironment className="w-5 h-5 mr-1" />
                        <span>{freelancer.location}</span>
                      </div>
                      <div className="flex items-center">
                        <AiOutlineStar className="w-5 h-5 text-yellow-400 mr-1" />
                        <span className="font-medium">{freelancer.rating}</span>
                        <span className="ml-1">
                          ({freelancer.reviewCount} đánh giá)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <button
                      onClick={toggleFavorite}
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
                      onClick={handleBookService}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: "overview", label: "Tổng quan" },
                    { id: "reviews", label: "Đánh giá" },
                    { id: "portfolio", label: "Portfolio" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setActiveTab(
                          tab.id as "overview" | "reviews" | "portfolio"
                        )
                      }
                      className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-emerald-500 text-emerald-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Giới thiệu
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {freelancer.bio}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Kỹ năng chuyên môn
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills?.map((skill) => (
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
                        {[
                          { name: "Chăm sóc tại nhà", price: "200,000đ/ngày" },
                          {
                            name: "Trông giữ thú cưng",
                            price: "150,000đ/ngày",
                          },
                          { name: "Dắt đi dạo", price: "100,000đ/lần" },
                          { name: "Tắm rửa làm đẹp", price: "300,000đ/lần" },
                        ].map((service) => (
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
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Đánh giá từ khách hàng
                      </h3>
                      <div className="text-right">
                        <div className="flex items-center">
                          <AiOutlineStar className="w-5 h-5 text-yellow-400 mr-1" />
                          <span className="text-2xl font-bold">
                            {freelancer.rating}
                          </span>
                          <span className="text-gray-500 ml-2">
                            ({freelancer.reviewCount} đánh giá)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-200 pb-6 last:border-b-0"
                        >
                          <div className="flex items-start space-x-4">
                            <img
                              src={review.userAvatar}
                              alt={review.userName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-800">
                                    {review.userName}
                                  </h4>
                                  <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <AiOutlineStar
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                  <div>{review.date}</div>
                                  <div className="text-emerald-600 font-medium">
                                    {review.service}
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-600">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "portfolio" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Hình ảnh công việc
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {freelancer.photos?.map((photo, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                        >
                          <img
                            src={photo}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Thống kê
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Công việc hoàn thành</span>
                  <span className="font-semibold">
                    {freelancer.completedJobs}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thời gian phản hồi</span>
                  <span className="font-semibold text-emerald-600">
                    {freelancer.responseTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tỷ lệ hoàn thành</span>
                  <span className="font-semibold text-emerald-600">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thành viên từ</span>
                  <span className="font-semibold">2019</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Thông tin liên hệ
              </h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <AiOutlinePhone className="w-5 h-5 mr-2" />
                  Gọi điện thoại
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <AiOutlineMail className="w-5 h-5 mr-2" />
                  Gửi tin nhắn
                </button>
                <button
                  onClick={handleBookService}
                  className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <AiOutlineCalendar className="w-5 h-5 mr-2" />
                  Đặt lịch hẹn
                </button>
              </div>
            </div>

            {/* Verification */}
            {freelancer.isVerified && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <AiOutlineCheckCircle className="w-6 h-6 text-emerald-600 mr-2" />
                  <h3 className="text-lg font-semibold text-emerald-800">
                    Đã xác thực
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-emerald-700">
                  <li>✓ Danh tính đã được xác thực</li>
                  <li>✓ Số điện thoại đã được xác thực</li>
                  <li>✓ Email đã được xác thực</li>
                  <li>✓ Đã hoàn thành khóa đào tạo</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfilePage;
