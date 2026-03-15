import {
  AiOutlineCalendar,
  AiOutlineSafetyCertificate,
  AiOutlineCamera,
  AiOutlineHeart,
} from "react-icons/ai";

const FeaturesSection = () => {
  const features = [
    {
      icon: <AiOutlineCalendar className="w-12 h-12" />,
      title: "Dịch vụ linh hoạt",
      description: "Lên lịch chăm sóc theo giờ, theo ngày hoặc dịch vụ lâu dài",
      color: "from-blue-500 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50",
      iconColor: "text-blue-600",
      link: "Tìm hiểu thêm →",
    },
    {
      icon: <AiOutlineSafetyCertificate className="w-12 h-12" />,
      title: "An toàn minh bạch",
      description: "Hợp đồng dịch vụ đầu tiên kèm theo bảo hiểm toàn diện",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50",
      iconColor: "text-emerald-600",
      link: "Tìm hiểu thêm →",
    },
    {
      icon: <AiOutlineCamera className="w-12 h-12" />,
      title: "Theo dõi mọi lúc",
      description: "Xem hình ảnh, video ghi chép chi tiết về diễn biến ăn uống",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      iconColor: "text-purple-600",
      link: "Tìm hiểu thêm →",
    },
    {
      icon: <AiOutlineHeart className="w-12 h-12" />,
      title: "Kết nối người yêu thú",
      description: "Đăng ký hỗ trợ, chia sẻ kinh nghiệm nuôi thú cưng",
      color: "from-rose-500 to-orange-500",
      bgColor: "from-rose-50 to-orange-50",
      iconColor: "text-rose-600",
      link: "Tìm hiểu thêm →",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-6">
            <span className="text-blue-800 font-medium text-sm">
              ✨ Tính Năng Nổi Bật
            </span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Tại sao chọn
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}
              Pet Connect
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi mang đến giải pháp chăm sóc thú cưng toàn diện với công
            nghệ hiện đại, đội ngũ chuyên nghiệp và dịch vụ đáng tin cậy nhất.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-3xl p-8 h-full hover:bg-white/90 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                {/* Icon */}
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className={`${feature.iconColor} text-4xl`}>
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                  <div
                    className={`inline-flex items-center text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0`}
                  >
                    {feature.link}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Khám phá tất cả tính năng
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
