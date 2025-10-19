import React, { useState, useRef } from "react";
import { AiOutlineCamera, AiOutlineUsergroupAdd } from "react-icons/ai";
import CommunityImage from "../../assets/image/community.png";

const CommunityHeroSection: React.FC = () => {
  const [isMember, setIsMember] = useState(false);
  const [stats, setStats] = useState({
    members: 2500,
    posts: 850,
    likes: 15000,
  });

  const createPostRef = useRef<HTMLDivElement>(null);

  // 📸 Scroll xuống khu vực tạo bài đăng
  const handleShareNow = () => {
    createPostRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 👥 Tham gia cộng đồng (hiển thị modal xác nhận)
  const handleJoinCommunity = () => {
    if (isMember) return;
    const confirmed = window.confirm(
      "Bạn có muốn tham gia cộng đồng PawNest không?"
    );
    if (confirmed) {
      setIsMember(true);
      setStats((prev) => ({ ...prev, members: prev.members + 1 }));
      alert("Chào mừng bạn đến với cộng đồng PawNest 🐾!");
    }
  };

  return (
    <section className="min-h-screen bg-white relative overflow-hidden pt-16 px-3">
      {/* Banner */}
      <div
        className="w-[95%] mx-auto rounded-t-3xl relative overflow-visible min-h-screen"
        style={{
          backgroundImage: `url(${CommunityImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 rounded-t-3xl"></div>

        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 right-1/5 transform -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-orange-400/10 to-amber-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-orange-300/15 to-amber-300/5 rounded-full blur-2xl"></div>
          <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-400/5 rounded-full blur-xl"></div>
        </div>

        {/* Main content */}
        <div className="px-12 py-16 pt-20 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              Cộng đồng{" "}
              <span className="text-orange-400">Pet Freelancer</span>
              <br />
              <span className="text-amber-400">Kết nối</span> đam mê cùng nhau
            </h1>

            <p className="text-lg lg:text-xl text-gray-200 leading-relaxed mt-6 max-w-xl mx-auto">
              Chia sẻ kinh nghiệm, kết nối với những người yêu thú cưng và học hỏi
              từ cộng đồng freelancer thú cưng chuyên nghiệp.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={handleShareNow}
                className="flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl hover:bg-orange-700 transition-colors duration-200 font-semibold text-lg"
              >
                <AiOutlineCamera className="w-5 h-5" />
                Chia sẻ ngay
              </button>

              <button
                onClick={handleJoinCommunity}
                disabled={isMember}
                className={`flex items-center justify-center gap-2 border-2 px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 ${
                  isMember
                    ? "bg-white/10 border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border-white text-white hover:bg-white/10"
                }`}
              >
                <AiOutlineUsergroupAdd className="w-5 h-5" />
                {isMember ? "Đã tham gia" : "Tham gia cộng đồng"}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-orange-400">
                  {stats.members.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-300 mt-2">Thành viên</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-amber-400">
                  {stats.posts.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-300 mt-2">Bài viết</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                  {stats.likes.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-300 mt-2">Lượt thích</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liên kết xuống phần tạo bài đăng */}
      <div ref={createPostRef} className="pt-8"></div>
    </section>
  );
};

export default CommunityHeroSection;
