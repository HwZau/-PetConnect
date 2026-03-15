const HeroSection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden flex items-center">
      {/* Animated Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 py-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-3">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 px-5 py-2 rounded-full border-2 border-orange-200">
              <span className="text-2xl">🏡</span>
              <span className="text-orange-800 font-bold text-sm">
                Chào Mừng Đến Pet Connect
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                <span className="text-gray-900">Ngôi Nhà</span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                  Hạnh Phúc Của Boss
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xl font-medium">
                Mọi thứ boss cưng của bạn cần - từ sản phẩm cao cấp đến dịch vụ
                chăm sóc chuyên nghiệp.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-orange-100">
                <div className="text-2xl font-black text-orange-600">5K+</div>
                <div className="text-xs text-gray-600 font-semibold">
                  Boss Vui Vẻ
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-amber-100">
                <div className="text-2xl font-black text-amber-600">1K+</div>
                <div className="text-xs text-gray-600 font-semibold">
                  Sản Phẩm
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-yellow-100">
                <div className="text-2xl font-black text-yellow-600">24/7</div>
                <div className="text-xs text-gray-600 font-semibold">
                  Hỗ Trợ
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="group bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2">
                Mua Ngay
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-900 font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg border-2 border-gray-200">
                Tìm Hiểu Thêm
              </button>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[500px]">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=700&h=700&fit=crop"
                  alt="Happy pets"
                  className="w-full h-[400px] lg:h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-2xl animate-bounce">
                <div className="text-3xl mb-1">⭐</div>
                <div className="text-xs font-bold text-gray-800">Uy Tín</div>
              </div>

              <div
                className="absolute -bottom-6 -left-4 bg-white p-4 rounded-xl shadow-2xl animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="text-3xl mb-1">💝</div>
                <div className="text-xs font-bold text-gray-800">
                  Yêu Thương
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-5 w-24 h-24 bg-orange-300/30 rounded-full blur-2xl animate-pulse"></div>
            <div
              className="absolute bottom-10 left-5 w-32 h-32 bg-amber-300/30 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
