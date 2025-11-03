import { useState, useEffect } from "react";
import { FiStar, FiEdit3, FiSmile, FiHeart, FiZap } from "react-icons/fi";

const TestimonialsReviewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thị Lan",
      role: "Chủ nhân của Milo",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b422?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      content:
        "Dịch vụ tuyệt vời! Bác sĩ rất tận tâm và chuyên nghiệp. Milo được chăm sóc như ở nhà vậy. Tôi hoàn toàn yên tâm khi gửi gắm bé ở đây.",
      service: "Khám sức khỏe định kỳ",
      petType: "🐕",
      date: "2 tuần trước",
    },
    {
      id: 2,
      name: "Trần Văn Minh",
      role: "Chủ nhân của Luna & Max",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      content:
        "Staff rất nhiệt tình, giải thích kỹ càng về tình trạng sức khỏe của 2 bé. Giá cả hợp lý, không gian sạch sẽ và thoáng mát.",
      service: "Spa & Grooming",
      petType: "🐱",
      date: "1 tháng trước",
    },
    {
      id: 3,
      name: "Lê Thị Hương",
      role: "Chủ nhân của Buddy",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      content:
        "Lần đầu sử dụng dịch vụ nhưng tôi rất hài lòng. Buddy được chăm sóc chu đáo, tỉ mỉ. Nhân viên thân thiện và giàu kinh nghiệm.",
      service: "Phẫu thuật nhỏ",
      petType: "🐕",
      date: "3 tuần trước",
    },
    {
      id: 4,
      name: "Phạm Đức Thành",
      role: "Chủ nhân của Whiskers",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      content:
        "Dịch vụ online rất tiện lợi, đặt lịch nhanh chóng. Bác sĩ tư vấn chi tiết qua điện thoại trước khi đến. Rất chuyên nghiệp!",
      service: "Tư vấn online",
      petType: "🐱",
      date: "1 tuần trước",
    },
  ];

  const statistics = [
    {
      number: "10,000+",
      label: "Khách hàng hài lòng",
      icon: FiSmile,
      color: "from-green-400 to-emerald-500",
    },
    {
      number: "4.9/5",
      label: "Đánh giá trung bình",
      icon: FiStar,
      color: "from-yellow-400 to-orange-500",
    },
    {
      number: "95%",
      label: "Khách hàng quay lại",
      icon: FiHeart,
      color: "from-pink-400 to-red-500",
    },
    {
      number: "24/7",
      label: "Hỗ trợ khẩn cấp",
      icon: FiZap,
      color: "from-blue-400 to-purple-500",
    },
  ];

  const recentReviews = [
    {
      author: "Mai Linh",
      rating: 5,
      comment: "Dịch vụ tốt, giá cả hợp lý",
      time: "30 phút trước",
    },
    {
      author: "Hoàng Nam",
      rating: 5,
      comment: "Bác sĩ rất tận tâm với bé Luna",
      time: "1 giờ trước",
    },
    {
      author: "Thu Thảo",
      rating: 4,
      comment: "Spa cho Meo rất chuyên nghiệp",
      time: "2 giờ trước",
    },
    {
      author: "Quang Huy",
      rating: 5,
      comment: "Đội ngũ nhiệt tình, tư vấn kỹ",
      time: "3 giờ trước",
    },
  ];

  // Auto slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-pink-200 rounded-full opacity-20 animate-ping"></div>
      </div>

      <div className="container relative mx-auto px-4 z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 shadow-lg">
            <FiEdit3 className="text-blue-800 text-sm mr-2" />
            <span className="text-blue-800 text-sm font-medium">Đánh giá</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Khách hàng nói gì về chúng tôi?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hàng ngàn khách hàng tin tưởng và hài lòng với dịch vụ của PawNest
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div
                className={`bg-gradient-to-r ${stat.color} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300`}
              >
                <div className="text-4xl mb-3">
                  <stat.icon />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/90 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Testimonials Slider */}
          <div className="lg:col-span-2">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 lg:p-12">
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Câu chuyện khách hàng
                  </h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={prevSlide}
                      className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="relative min-h-[300px]">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className={`absolute inset-0 transition-all duration-500 ${
                        index === currentSlide
                          ? "opacity-100 transform translate-x-0"
                          : "opacity-0 transform translate-x-full"
                      }`}
                    >
                      <div className="flex items-start space-x-4 mb-6">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-lg font-bold text-gray-900">
                              {testimonial.name}
                            </h4>
                            <span className="text-2xl">
                              {testimonial.petType}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {testimonial.role}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-lg">
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                        "{testimonial.content}"
                      </blockquote>

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                          {testimonial.service}
                        </span>
                        <span>{testimonial.date}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slide Indicators */}
                <div className="flex justify-center space-x-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-blue-500 w-8"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reviews Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <FiEdit3 className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold">Đánh giá gần đây</h3>
              </div>

              <div className="space-y-4">
                {recentReviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded-xl p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">
                        {review.author}
                      </span>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-300 text-sm">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-white/90 text-sm mb-2">
                      "{review.comment}"
                    </p>
                    <span className="text-white/70 text-xs">{review.time}</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-xl transition-colors duration-300">
                Xem tất cả đánh giá
              </button>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white">
              <div className="text-center">
                <div className="text-4xl mb-4">
                  <FiStar />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Chia sẻ trải nghiệm của bạn
                </h3>
                <p className="text-white/90 text-sm mb-6">
                  Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn
                </p>
                <button className="w-full bg-white text-emerald-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                  Viết đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsReviewsSection;
