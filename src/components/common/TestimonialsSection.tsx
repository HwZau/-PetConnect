const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Nguyễn Minh Anh",
      role: "Chủ thú cưng",
      avatar: "👩",
      rating: 5,
      content:
        "Dịch vụ tuyệt vời! Chó con của tôi được chăm sóc rất tận tình. Tôi nhận được cập nhật và hình ảnh liên tục, rất yên tâm khi đi công tác xa.",
      petType: "🐕",
    },
    {
      name: "Trần Hoàng Nam",
      role: "Chủ thú cưng",
      avatar: "👨",
      rating: 5,
      content:
        "Tìm được người chăm sóc phù hợp ngay lần đầu. Mèo nhà tôi rất thích chị chăm sóc, về nhà vẫn khỏe mạnh và vui vẻ như thường.",
      petType: "🐱",
    },
    {
      name: "Lê Thị Hương",
      role: "Người chăm sóc",
      avatar: "👩‍🦰",
      rating: 5,
      content:
        "Là người chăm sóc thú cưng, tôi thấy platform này rất dễ sử dụng. Hệ thống đặt lịch và thanh toán rất tiện lợi, khách hàng đều rất hài lòng.",
      petType: "🐰",
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-lg ${
              index < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Đánh giá từ khách hàng
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hàng nghìn khách hàng đã tin tưởng PawNest để chăm sóc những người
            bạn lông xù của họ. Đây là những chia sẻ chân thật từ cộng đồng của
            chúng tôi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 relative group hover:shadow-lg transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-emerald-200 text-4xl">
                "
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed text-lg italic">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Rating */}
              <div className="mb-6">{renderStars(testimonial.rating)}</div>

              {/* User info */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-xl mr-4">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
                <div className="text-2xl">{testimonial.petType}</div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-12 text-white text-center">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-emerald-100">Đánh giá trung bình</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-emerald-100">Đánh giá tích cực</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-emerald-100">Khách hàng quay lại</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-emerald-100">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
