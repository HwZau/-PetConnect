import { FaStar, FaRegStar, FaQuoteRight, FaDog, FaCat } from "react-icons/fa";
import { GiRabbit } from "react-icons/gi";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Nguyễn Minh Anh",
      role: "Chủ thú cưng",
      avatar: `https://ui-avatars.com/api/?name=Nguyễn+Minh+Anh&background=random&color=fff`,
      rating: 5,
      content:
        "Dịch vụ tuyệt vời! Chó con của tôi được chăm sóc rất tận tình. Tôi nhận được cập nhật và hình ảnh liên tục, rất yên tâm khi đi công tác xa.",
      petIcon: <FaDog className="text-gray-700 text-2xl" />,
    },
    {
      name: "Trần Hoàng Nam",
      role: "Chủ thú cưng",
      avatar: `https://ui-avatars.com/api/?name=Trần+Hoàng+Nam&background=random&color=fff`,
      rating: 5,
      content:
        "Tìm được người chăm sóc phù hợp ngay lần đầu. Mèo nhà tôi rất thích chị chăm sóc, về nhà vẫn khỏe mạnh và vui vẻ như thường.",
      petIcon: <FaCat className="text-gray-700 text-2xl" />,
    },
    {
      name: "Lê Thị Hương",
      role: "Người chăm sóc",
      avatar: `https://ui-avatars.com/api/?name=Lê+Thị+Hương&background=random&color=fff`,
      rating: 5,
      content:
        "Là người chăm sóc thú cưng, tôi thấy platform này rất dễ sử dụng. Hệ thống đặt lịch và thanh toán rất tiện lợi, khách hàng đều rất hài lòng.",
      petIcon: <GiRabbit className="text-gray-700 text-2xl" />,
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <span key={index}>
            {index < rating ? (
              <FaStar className="text-yellow-400 text-xl" />
            ) : (
              <FaRegStar className="text-gray-300 text-xl" />
            )}
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
              <div className="absolute top-6 right-2 text-emerald-200">
                <FaQuoteRight className="text-3xl" />
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
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
                <div>{testimonial.petIcon}</div>
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
