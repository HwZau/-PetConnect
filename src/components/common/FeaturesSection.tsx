const FeaturesSection = () => {
  const features = [
    {
      icon: "🔍",
      title: "Tìm kiếm dễ dàng",
      description:
        "Tìm kiếm người chăm sóc phù hợp với thú cưng của bạn một cách nhanh chóng và dễ dàng",
    },
    {
      icon: "🛡️",
      title: "An toàn & Tin cậy",
      description:
        "Tất cả người chăm sóc đều được xác minh danh tính và có bảo hiểm toàn diện",
    },
    {
      icon: "📱",
      title: "Cập nhật thời gian thực",
      description:
        "Nhận ảnh, video và cập nhật về thú cưng của bạn trong suốt thời gian chăm sóc",
    },
    {
      icon: "💰",
      title: "Giá cả minh bạch",
      description:
        "Không có phí ẩn. Giá cả rõ ràng với hệ thống thanh toán an toàn",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi mang đến giải pháp chăm sóc thú cưng đơn giản, an toàn và
            không lo lắng cho cả thú cưng và chủ nhân.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
