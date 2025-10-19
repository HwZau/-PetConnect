import React from "react";
import { AiOutlineCamera, AiOutlineUsergroupAdd } from "react-icons/ai";
import CommunityImage from "../../assets/image/community.png";

const CommunityHeroSection: React.FC = () => {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden pt-16 px-3">
      {/* Banner with rounded corners and community background image */}
      <div
        className="w-[95%] mx-auto rounded-t-3xl relative overflow-visible min-h-screen"
        style={{
          backgroundImage: `url(${CommunityImage})`,
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
          <div className="absolute top-1/2 right-1/5 transform -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-orange-400/10 to-amber-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-orange-300/15 to-amber-300/5 rounded-full blur-2xl"></div>
          <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-400/5 rounded-full blur-xl"></div>
        </div>

        {/* Content inside banner */}
        <div className="px-12 py-16 pt-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-4xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                Cộng đồng{" "}
                <span className="text-orange-400">Pet Freelancer</span>
                <br />
                <span className="text-amber-400">Kết nối</span> đam mê cùng nhau
              </h1>

              <div className="flex justify-center">
                <p className="text-lg lg:text-xl text-gray-200 leading-relaxed text-center max-w-xl">
                  Chia sẻ kinh nghiệm, kết nối với những người yêu thú cưng và
                  học hỏi từ cộng đồng freelancer thú cưng chuyên nghiệp.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button className="flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl hover:bg-orange-700 transition-colors duration-200 font-semibold text-lg">
                <AiOutlineCamera className="w-5 h-5" />
                Chia sẻ ngay
              </button>
              <button className="flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors duration-200 font-semibold text-lg">
                <AiOutlineUsergroupAdd className="w-5 h-5" />
                Tham gia cộng đồng
              </button>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-orange-400">
                  2.5K+
                </div>
                <div className="text-sm text-gray-300 mt-2">Thành viên</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-amber-400">
                  850+
                </div>
                <div className="text-sm text-gray-300 mt-2">Bài viết</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                  15K+
                </div>
                <div className="text-sm text-gray-300 mt-2">Lượt thích</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHeroSection;
