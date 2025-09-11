const HeroSection = () => {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden pt-16 px-3">
      {/* Banner with rounded corners and gradient background */}
      <div className="w-[95%] mx-auto bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 rounded-3xl relative overflow-hidden min-h-screen">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          {/* Large circle decoration behind cat */}
          <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-teal-200/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-emerald-200/30 to-green-200/30 rounded-full blur-2xl"></div>
        </div>

        {/* Content inside banner */}
        <div className="px-12 py-16 pt-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Chăm sóc thú cưng{" "}
                  <span className="text-emerald-600">chưa bao giờ</span>
                  <br />
                  <span className="text-emerald-600">dễ dàng đến thế</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Tìm người chăm thú phù hợp - an tâm, nhanh chóng, có bảo cảo
                  đầy đủ.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn bg-white text-gray-900 hover:bg-gray-50 font-semibold px-8 py-4 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all border border-gray-200">
                  Đặt Lịch ngay !!
                </button>
                <button className="btn border-2 border-gray-400 text-gray-700 hover:bg-gray-50 font-medium px-8 py-4 rounded-full text-lg transition-all underline">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>

            {/* Right side - Cat Image */}
            <div className="relative">
              {/* Main cat image container with cyan circle background */}
              <div className="relative z-10 flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Cyan circle background */}
                  <div className="absolute inset-0 w-96 h-96 bg-gradient-to-br from-cyan-200 to-teal-200 rounded-full opacity-80"></div>

                  {/* Cat image placeholder - replace with actual cat image */}
                  <div className="relative w-96 h-96 flex items-center justify-center">
                    {/* You can replace this with an actual img tag */}
                    <div className="text-8xl filter drop-shadow-lg">🐱</div>
                  </div>
                </div>
              </div>

              {/* Decorative floating elements */}
              <div className="absolute top-16 left-8 w-16 h-16 bg-emerald-200/50 rounded-full animate-pulse"></div>
              <div className="absolute bottom-24 right-16 w-12 h-12 bg-teal-200/50 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-1/3 left-0 w-8 h-8 bg-cyan-200/50 rounded-full animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional floating elements outside banner */}
      <div className="absolute top-1/4 left-1/4 animate-float">
        <div className="w-6 h-6 bg-emerald-300/30 rounded-full"></div>
      </div>
      <div className="absolute top-1/3 right-1/3 animate-float delay-1000">
        <div className="w-4 h-4 bg-teal-300/30 rounded-full"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-float delay-500">
        <div className="w-8 h-8 bg-cyan-300/30 rounded-full"></div>
      </div>
    </section>
  );
};

export default HeroSection;
