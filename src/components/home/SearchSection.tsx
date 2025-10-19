import Dog from "../../assets/image/Dog.png";

const SearchSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tìm kiếm dịch vụ chăm sóc thú cưng
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá hàng nghìn dịch vụ chăm sóc thú cưng chuyên nghiệp gần bạn
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Left side - Dog Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8 h-full flex flex-col justify-center">
              <div className="w-full h-[500px] bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center">
                <img
                  src={Dog}
                  alt="Dog"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-emerald-300 rounded-full"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-teal-300 rounded-full"></div>
          </div>

          {/* Right side - Search Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 h-full flex flex-col justify-center">
            <div className="space-y-6">
              {/* Service Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tìm kiếm dịch vụ và người chăm sóc
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="VD: Dắt chó đi dạo, chăm sóc mèo..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  <div className="absolute right-3 top-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                </div>
              </div>

              {/* Location Selector */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 Khu vực gần đây
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option>HÀ NỘI</option>
                    <option>TP.HCM</option>
                    <option>ĐÀ NẴNG</option>
                    <option>CẦN THƠ</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tất cả dịch vụ
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option>Tất cả dịch vụ</option>
                    <option>Chăm sóc tại nhà</option>
                    <option>Dắt chó đi dạo</option>
                    <option>Nhận nuôi tạm thời</option>
                    <option>Spa & Grooming</option>
                  </select>
                </div>
              </div>

              {/* Date Picker and Popular Searches */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tìm kiếm gần đây
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                    <div className="absolute right-3 top-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tìm kiếm phổ biến
                  </label>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      🐕 Dắt chó đi dạo
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      🐱 Chăm sóc mèo tại nhà
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      ✂️ Cắt tỉa lông thú cưng
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-emerald-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Tìm người chăm sóc
                </button>
                <button className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Xem dịch vụ gần đây
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
