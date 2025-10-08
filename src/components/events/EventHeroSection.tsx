import eventImage from "../../assets/image/event.png";

const EventHeroSection = () => {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden pt-16 px-3">
      {/* Banner with rounded corners and event background image */}
      <div
        className="w-[95%] mx-auto rounded-t-3xl relative overflow-visible min-h-screen"
        style={{
          backgroundImage: `url(${eventImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 rounded-t-3xl"></div>

        {/* Background decorative elements */}
        <div className="absolute inset-0">
          {/* Large circle decoration */}
          <div className="absolute top-1/2 right-1/5 transform -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-white/15 to-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-xl"></div>
        </div>

        {/* Content inside banner */}
        <div className="px-12 py-16 pt-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-4xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-5xl lg:text-5xl font-bold text-white leading-tight">
                Những sự kiện cộng đồng
              </h1>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                Kết nối với những người yêu thú cưng và người chăm sóc chuyên
                nghiệp trong khu vực của bạn
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button className="btn bg-white hover:bg-gray-50 font-semibold px-8 py-4 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all text-blue-700">
                Tìm kiếm
              </button>
              <button className="btn !border-2 border-white text-white hover:bg-white hover:text-gray-900 font-medium px-8 py-4 rounded-full text-lg transition-all ">
                Tạo Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional floating elements outside banner */}
      <div className="absolute top-1/4 left-1/4 animate-float">
        <div className="w-6 h-6 bg-white/20 rounded-full"></div>
      </div>
      <div className="absolute top-1/3 right-1/3 animate-float delay-1000">
        <div className="w-4 h-4 bg-white/20 rounded-full"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-float delay-500">
        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
      </div>
    </section>
  );
};

export default EventHeroSection;
