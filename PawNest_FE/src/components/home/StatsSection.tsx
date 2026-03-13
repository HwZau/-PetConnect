import { useState, useEffect } from "react";
import { FiUsers, FiHeart, FiTarget, FiStar } from "react-icons/fi";

const StatsSection = () => {
  const [counters, setCounters] = useState({
    users: 0,
    caregivers: 0,
    services: 0,
    rating: 0,
  });

  // Counter animation effect
  useEffect(() => {
    const finalStats = {
      users: 15000,
      caregivers: 1200,
      services: 50000,
      rating: 4.9,
    };

    const animateCounters = () => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = {
        users: finalStats.users / steps,
        caregivers: finalStats.caregivers / steps,
        services: finalStats.services / steps,
        rating: finalStats.rating / steps,
      };

      let step = 0;
      const timer = setInterval(() => {
        step++;
        setCounters({
          users: Math.min(Math.floor(increment.users * step), finalStats.users),
          caregivers: Math.min(
            Math.floor(increment.caregivers * step),
            finalStats.caregivers
          ),
          services: Math.min(
            Math.floor(increment.services * step),
            finalStats.services
          ),
          rating: Math.min(increment.rating * step, finalStats.rating),
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounters({
            users: 15000,
            caregivers: 1200,
            services: 50000,
            rating: 4.9,
          });
        }
      }, duration / steps);
    };

    // Trigger animation when component mounts
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });

    const element = document.getElementById("stats-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      id: "users",
      value: counters.users.toLocaleString(),
      suffix: "+",
      label: "Khách hàng tin tưởng",
      icon: FiUsers,
      color: "from-blue-500 to-purple-500",
      bgColor: "bg-blue-50",
    },
    {
      id: "caregivers",
      value: counters.caregivers.toLocaleString(),
      suffix: "+",
      label: "Chuyên gia chăm sóc",
      icon: FiHeart,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
    },
    {
      id: "services",
      value: counters.services.toLocaleString(),
      suffix: "+",
      label: "Dịch vụ hoàn thành",
      icon: FiTarget,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
    {
      id: "rating",
      value: counters.rating.toFixed(1),
      suffix: "⭐",
      label: "Đánh giá trung bình",
      icon: FiStar,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
    },
  ];

  const achievements = [
    {
      icon: "🏆",
      title: "Ứng dụng #1",
      desc: "Chăm sóc thú cưng 2024",
      color: "text-yellow-600",
    },
    {
      icon: "🛡️",
      title: "Chứng nhận an toàn",
      desc: "ISO 27001:2013",
      color: "text-blue-600",
    },
    {
      icon: "💎",
      title: "Chất lượng cao",
      desc: "99.8% hài lòng",
      color: "text-purple-600",
    },
    {
      icon: "🚀",
      title: "Phát triển nhanh",
      desc: "200% năm qua",
      color: "text-emerald-600",
    },
  ];

  return (
    <section
      id="stats-section"
      className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-2 h-2 bg-white rounded-full opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="container relative mx-auto px-4 z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <span className="text-white text-sm font-medium">
              📊 Thống kê ấn tượng
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Những con số nói lên tất cả
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Cộng đồng PawNest đang phát triển mạnh mẽ với sự tin tưởng của hàng
            ngàn khách hàng
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 lg:p-8 text-center group hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} mb-4 text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-white/80 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/10">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Thành tựu & Chứng nhận
            </h3>
            <p className="text-white/80 text-lg">
              Được công nhận bởi các tổ chức uy tín trong và ngoài nước
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-white/10 rounded-2xl p-6 mb-4 group-hover:bg-white/20 transition-colors duration-300">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h4 className={`text-lg font-bold ${achievement.color} mb-2`}>
                    {achievement.title}
                  </h4>
                  <p className="text-white/70 text-sm">{achievement.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-white text-sm">Xác minh danh tính</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-white text-sm">Bảo mật thông tin</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white text-sm">Đảm bảo chất lượng</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
