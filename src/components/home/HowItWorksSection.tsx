import { FiSearch, FiCalendar, FiHeart, FiStar } from "react-icons/fi";

const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      icon: FiSearch,
      title: "Tìm kiếm",
      description:
        "Tìm kiếm và lựa chọn người chăm sóc phù hợp với thú cưng của bạn",
      color: "from-purple-500 to-pink-500",
    },
    {
      step: "02",
      icon: FiCalendar,
      title: "Đặt lịch",
      description:
        "Đặt lịch hẹn với chuyên gia chăm sóc thú cưng một cách dễ dàng",
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "03",
      icon: FiHeart,
      title: "Yên tâm",
      description:
        "An tâm để lại thú cưng trong tay những người yêu thương động vật",
      color: "from-emerald-500 to-teal-500",
    },
    {
      step: "04",
      icon: FiStar,
      title: "Đánh giá",
      description: "Chia sẻ trải nghiệm và đánh giá dịch vụ để giúp cộng đồng",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container relative mx-auto px-4 z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6">
            <span className="text-purple-800 text-sm font-medium">
              ✨ Quy trình đơn giản
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Cách thức hoạt động
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chỉ với 4 bước đơn giản, bạn đã có thể tìm được người chăm sóc thú
            cưng uy tín
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-purple-200 to-orange-200"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Step card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative z-10">
                  {/* Step number */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.color} text-white font-bold text-xl mb-6 shadow-lg`}
                  >
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300 text-gray-600">
                    <step.icon />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Hover effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                  ></div>
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 bg-white rounded-full border-4 border-gray-200 flex items-center justify-center shadow-lg">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 lg:p-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Sẵn sàng bắt đầu?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Hãy để chúng tôi giúp bạn tìm được người chăm sóc thú cưng tốt
              nhất
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Bắt đầu ngay hôm nay
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;
