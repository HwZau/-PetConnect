import CatImage from "../../assets/image/Cat.png";

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden pt-16 px-3">
      {/* Banner with rounded corners and gradient background - allow overflow for large cat */}
      <div className="w-[95%] mx-auto bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 rounded-3xl relative overflow-visible min-h-screen">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          {/* Large circle decoration behind cat area - adjusted for larger cat */}
          <div className="absolute top-1/2 right-1/5 transform -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-cyan-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-emerald-200/25 to-green-200/25 rounded-full blur-2xl"></div>
          <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-cyan-300/20 to-blue-200/20 rounded-full blur-xl"></div>
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
                <button className="btn border-2 border-gray-400 text-gray-700 hover:scale-105 font-medium px-8 py-4 rounded-full text-lg transition-all !underline">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>

            {/* Right side - Cat Image */}
            <div className="relative">
              {/* Main cat image container with cyan oval background */}
              <div className="relative z-10 flex justify-center">
                <div className="relative">
                  {/* Larger cyan oval background - centered for large cat */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-to-br from-cyan-200/70 to-teal-200/70 rounded-full max-lg:w-[450px] max-lg:h-[400px]"></div>

                  {/* Cat image container - full height */}
                  <div className="relative w-[800px] h-screen flex items-center justify-center -mt-16 max-lg:w-[600px] max-lg:-mt-12">
                    {/* Cat image - extremely large to fill from nav to bottom */}
                    <div className="relative z-10">
                      <img
                        src={CatImage}
                        alt="Cat"
                        className="w-[800px] h-[800px] filter drop-shadow-2xl max-lg:w-[700px] max-lg:h-[700px]"
                        style={{
                          width: "800px",
                          height: "800px",
                          maxWidth: "none",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative floating elements - adjusted for larger layout */}
              <div className="absolute top-16 left-2 w-10 h-10 bg-emerald-200/40 rounded-full animate-pulse"></div>
              <div className="absolute bottom-16 right-4 w-6 h-6 bg-teal-200/40 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-1/4 left-0 w-4 h-4 bg-cyan-200/40 rounded-full animate-pulse delay-500"></div>
              <div className="absolute top-1/5 right-2 w-3 h-3 bg-emerald-300/40 rounded-full animate-pulse delay-700"></div>
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
