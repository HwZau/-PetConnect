const EventHeroSection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden flex items-center">
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="flex-1 space-y-2 text-white">
            {/* Animated Icon */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full animate-pulse">
              <span className="font-bold text-xs">Sự Kiện Sắp Tới</span>
            </div>
            {/* Main Heading with Animation */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-5xl xl:text-6xl font-black leading-tight">
                <span className="text-white drop-shadow-2xl">Tiệc Boss</span>
                <br />
                <span className="text-yellow-300 drop-shadow-2xl">
                  Vui Nhộn!
                </span>
              </h1>
              <p className="text-base lg:text-lg text-white/90 leading-relaxed max-w-xl font-medium">
                Kết nối, vui chơi và ăn mừng cùng các sen thú cưng tại sự kiện
                cộng đồng sôi động!
              </p>
            </div>

            {/* Event Highlights */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                <span className="text-lg">🏆</span>
                <span className="font-semibold text-xs">
                  Thi đấu & giải thưởng hàng tuần
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                <span className="text-lg">🎨</span>
                <span className="font-semibold text-xs">
                  Hội thảo sáng tạo & huấn luyện
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                <span className="text-lg">🤝</span>
                <span className="font-semibold text-xs">
                  Gặp gỡ bạn mới cùng thú cưng
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-2">
              <button className="group bg-white hover:bg-yellow-300 text-purple-600 font-black px-5 py-2 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-3 shadow-2xl">
                <span className="flex items-center gap-2 text-xs">
                  Tham Gia
                  <span className="text-lg group-hover:animate-bounce">🎊</span>
                </span>
              </button>
              <button className="bg-transparent border-2 border-white hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 backdrop-blur-sm text-xs">
                Xem Lịch
              </button>
            </div>
          </div>

          {/* Right Content - Event Gallery Grid */}
          <div className="flex-1 relative">
            <div className="grid grid-cols-2 gap-2 max-w-[450px]">
              {/* Large Image */}
              <div className="col-span-2 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop"
                  alt="Sự kiện thú cưng"
                  className="w-full h-44 object-cover"
                />
              </div>

              {/* Small Images */}
              <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop"
                  alt="Chó vui chơi"
                  className="w-full h-28 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=300&h=300&fit=crop"
                  alt="Thi đua thú cưng"
                  className="w-full h-28 object-cover"
                />
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-3 -right-3 bg-yellow-400 text-purple-900 px-3 py-1.5 rounded-full shadow-2xl transform rotate-12 animate-bounce">
              <div className="font-black text-sm">50+ Sự Kiện</div>
              <div className="text-xs font-bold">Hàng Tháng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventHeroSection;
