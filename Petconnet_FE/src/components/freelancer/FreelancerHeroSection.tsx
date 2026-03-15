import React, { useState } from "react";

interface FreelancerHeroSectionProps {
  onSearch?: (filters: { searchTerm?: string }) => void;
}

const FreelancerHeroSection: React.FC<FreelancerHeroSectionProps> = ({
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch?.({ searchTerm });
  };

  const services = [
    { icon: "🛁", name: "Grooming", color: "from-blue-400 to-cyan-400" },
    { icon: "🏥", name: "Chăm Sóc", color: "from-red-400 to-pink-400" },
    { icon: "🎓", name: "Huấn Luyện", color: "from-purple-400 to-violet-400" },
    { icon: "🏠", name: "Trông Giữ", color: "from-green-400 to-emerald-400" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(124, 58, 237, 0.3) 2px, transparent 2px), linear-gradient(90deg, rgba(124, 58, 237, 0.3) 2px, transparent 2px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-56 h-56 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-20 w-64 h-64 bg-fuchsia-500/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="container mx-auto px-6 lg:px-16 py-2 relative z-10">
        <div className="grid lg:grid-cols-2 gap-4 items-center">
          {/* Left Content */}
          <div className="space-y-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              <span className="text-lg">🌟</span>
              <span className="text-white font-bold text-xs">
                Chuyên Gia Uy Tín
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-1">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight text-white">
                <span className="inline-block">Tìm Kiếm</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  Chuyên Gia
                </span>
                <br />
                <span className="inline-block">Chăm Sóc Boss</span>
              </h1>
              <p className="text-base lg:text-lg text-gray-300 leading-relaxed max-w-xl">
                Kết nối với các chuyên gia chăm sóc thú cưng có chứng chỉ, sẵn
                sàng mang đến dịch vụ tốt nhất cho boss nhà bạn.
              </p>
            </div>

            {/* Search Box */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-1 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-1.5">
                <div className="flex-1 bg-white rounded-xl px-2.5 py-2 flex items-center gap-1.5">
                  <span className="text-lg">🔍</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm dịch vụ, huấn luyện viên, groomer..."
                    className="flex-1 outline-none text-gray-800 font-medium placeholder-gray-400 text-xs"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-xs"
                >
                  Tìm
                </button>
              </div>
            </div>

            {/* Quick Service Tags */}
            <div>
              <p className="text-gray-400 text-xs mb-1.5 font-semibold">
                Dịch Vụ Phổ Biến:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {services.map((service, index) => (
                  <button
                    key={index}
                    className={`bg-gradient-to-r ${service.color} hover:scale-110 text-white font-bold px-2.5 py-1 rounded-full transition-all duration-300 shadow-lg flex items-center gap-1 text-xs`}
                  >
                    <span className="text-base">{service.icon}</span>
                    <span>{service.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="text-center">
                <div className="text-2xl font-black text-white">1000+</div>
                <div className="text-xs text-gray-400 font-semibold">
                  Chuyên Gia
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-white">4.9★</div>
                <div className="text-xs text-gray-400 font-semibold">
                  Đánh Giá TB
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-white">50K+</div>
                <div className="text-xs text-gray-400 font-semibold">
                  Boss Hài Lòng
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Freelancer Cards */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[450px]">
              {/* Stacked Cards Effect */}
              <div className="space-y-3">
                {/* Card 1 */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                  <div className="flex items-start gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
                      alt="Chuyên gia"
                      className="w-14 h-14 rounded-2xl object-cover border-4 border-purple-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-white font-black text-base">
                          Nguyễn Thị Lan
                        </h3>
                        <span className="bg-green-400 text-green-900 px-2 py-0.5 rounded-full text-xs font-bold">
                          Sẵn Sàng
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs mb-1.5">
                        Groomer Chuyên Nghiệp
                      </p>
                      <div className="flex items-center gap-2.5 text-xs">
                        <span className="text-yellow-400">⭐ 4.9</span>
                        <span className="text-gray-300">• 230 việc</span>
                        <span className="text-gray-300">• 450k/h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                  <div className="flex items-start gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
                      alt="Chuyên gia"
                      className="w-14 h-14 rounded-2xl object-cover border-4 border-fuchsia-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-white font-black text-base">
                          Trần Văn Minh
                        </h3>
                        <span className="bg-green-400 text-green-900 px-2 py-0.5 rounded-full text-xs font-bold">
                          Sẵn Sàng
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs mb-1.5">
                        Huấn Luyện Viên Chó
                      </p>
                      <div className="flex items-center gap-2.5 text-xs">
                        <span className="text-yellow-400">⭐ 5.0</span>
                        <span className="text-gray-300">• 180 việc</span>
                        <span className="text-gray-300">• 550k/h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Partially Visible */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 opacity-60 transform translate-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-white/20 rounded w-20 mb-1.5"></div>
                      <div className="h-2 bg-white/10 rounded w-28"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1.5 rounded-2xl shadow-2xl transform rotate-12 animate-bounce">
                <div className="font-black text-sm">Top Rated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreelancerHeroSection;
