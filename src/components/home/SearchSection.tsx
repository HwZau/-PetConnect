import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dog from "../../assets/image/Dog.png";

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const handleSearch = () => {
    navigate("/freelancers", {
      state: {
        searchTerm,
        location: selectedLocation,
        category: selectedService,
      },
    });
  };

  const handleQuickSearch = (term: string, category: string) => {
    navigate("/freelancers", {
      state: {
        searchTerm: term,
        category,
      },
    });
  };

  return (
    <section className="relative py-7 overflow-hidden">
      {/* Background with gradient and patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-emerald-600"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full animate-ping"></div>

      <div className="container relative mx-auto px-4 z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <span className="text-white text-sm font-medium">
              🐾 Dịch vụ thú cưng #1 Việt Nam
            </span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Tìm người chăm sóc
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              thú cưng yêu thương
            </span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Kết nối với hàng nghìn chuyên gia chăm sóc thú cưng tin cậy. An tâm
            để lại bé cưng trong tay những người yêu thương động vật.
          </p>
        </div>

        {/* Main Search Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 lg:p-12">
            {/* Quick Search Tabs */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {[
                {
                  icon: "🐕",
                  label: "Dắt chó đi dạo",
                  category: "Chăm sóc thú cưng",
                },
                {
                  icon: "🐱",
                  label: "Chăm sóc mèo",
                  category: "Chăm sóc thú cưng",
                },
                {
                  icon: "✂️",
                  label: "Cắt tỉa lông",
                  category: "Làm đẹp thú cưng",
                },
                { icon: "🏥", label: "Bác sĩ thú y", category: "Bác sĩ thú y" },
                {
                  icon: "📸",
                  label: "Chụp ảnh pet",
                  category: "Nhiếp ảnh thú cưng",
                },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(item.label, item.category)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Main Search Form */}
            <div className="space-y-6">
              {/* Primary Search Bar */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm dịch vụ chăm sóc thú cưng..."
                  className="w-full pl-14 pr-4 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white shadow-lg"
                />
              </div>

              {/* Location and Service Filters */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    Khu vực
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300"
                  >
                    <option value="">Tất cả khu vực</option>
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">TP. Hồ Chí Minh</option>
                    <option value="danang">Đà Nẵng</option>
                    <option value="haiphong">Hải Phòng</option>
                    <option value="cantho">Cần Thơ</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Loại dịch vụ
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                  >
                    <option value="">Tất cả dịch vụ</option>
                    <option value="Chăm sóc thú cưng">Chăm sóc thú cưng</option>
                    <option value="Huấn luyện thú cưng">
                      Huấn luyện thú cưng
                    </option>
                    <option value="Bác sĩ thú y">Bác sĩ thú y</option>
                    <option value="Làm đẹp thú cưng">Làm đẹp thú cưng</option>
                    <option value="Trông giữ thú cưng">
                      Trông giữ thú cưng
                    </option>
                    <option value="Nhiếp ảnh thú cưng">
                      Nhiếp ảnh thú cưng
                    </option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleSearch}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Tìm người chăm sóc ngay
                </button>
                <button
                  onClick={() => navigate("/freelancers")}
                  className="sm:w-auto px-8 py-4 border-2 border-purple-300 text-purple-700 rounded-2xl font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Xem tất cả
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    1,000+
                  </div>
                  <div className="text-sm text-gray-600">Chuyên gia</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    50,000+
                  </div>
                  <div className="text-sm text-gray-600">
                    Dịch vụ đã hoàn thành
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600 mb-1">
                    4.9⭐
                  </div>
                  <div className="text-sm text-gray-600">
                    Đánh giá trung bình
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    24/7
                  </div>
                  <div className="text-sm text-gray-600">Hỗ trợ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Pet Image */}
          <div className="absolute -bottom-20 -right-60 hidden lg:block">
            <div className="relative">
              <div className="w-64 h-64 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float">
                <img
                  src={Dog}
                  alt="Happy Dog"
                  className="w-48 h-48 object-cover rounded-full border-4 border-white/50"
                />
              </div>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Additional floating elements */}
        <style>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </div>
    </section>
  );
};

export default SearchSection;
