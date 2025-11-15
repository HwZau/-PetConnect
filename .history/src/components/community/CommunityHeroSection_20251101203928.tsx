import React, { useState, useRef } from "react";
import { showSuccess } from "../../utils/toastUtils";
import { AiOutlineClose, AiOutlineHeart, AiOutlineUserAdd, AiOutlineTrophy, AiOutlineCheckCircle } from "react-icons/ai";

const CommunityHeroSection: React.FC = () => {
  const [isMember, setIsMember] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const createPostRef = useRef<HTMLDivElement>(null);

  const handleShareNow = () => {
    createPostRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleJoinCommunity = () => {
    if (isMember) return;
    setShowJoinModal(true);
  };

  const handleConfirmJoin = () => {
    setIsMember(true);
    setShowJoinModal(false);
    showSuccess("🐾 Chào mừng bạn đến với cộng đồng PawNest!");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden flex items-center">
      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {["❤️", "💚", "🐾", "💬", "⭐", "🌟", "💕", "✨"][i]}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-16 py-2 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-4">
          {/* Right Content - Social Feed Preview */}
          <div className="flex-1 w-full max-w-[450px]">
            <div className="bg-white rounded-3xl shadow-2xl p-3 space-y-2 border-4 border-teal-100">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b-2 border-gray-100">
                <h3 className="text-lg font-black text-gray-800">
                  Bảng Tin Cộng Đồng
                </h3>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>

              {/* Mock Posts */}
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {/* Post 1 */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-2 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1544568100-847a948585b9?w=100&h=100&fit=crop"
                      alt="Người dùng"
                      className="w-9 h-9 rounded-full object-cover border-2 border-teal-300"
                    />
                    <div>
                      <div className="font-bold text-gray-800 text-xs">
                        Yêu Boss 🐕
                      </div>
                      <div className="text-xs text-gray-500">2 giờ trước</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 mb-1.5">
                    Vừa nhận nuôi em này! Quyết định tốt nhất đời! 💕
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop"
                    alt="Bài đăng"
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <div className="flex gap-2.5 mt-1.5 text-xs text-gray-600">
                    <span>❤️ 234</span>
                    <span>💬 45</span>
                    <span>🔄 12</span>
                  </div>
                </div>

                {/* Post 2 */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-2.5 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&h=100&fit=crop"
                      alt="Người dùng"
                      className="w-9 h-9 rounded-full object-cover border-2 border-emerald-300"
                    />
                    <div>
                      <div className="font-bold text-gray-800 text-xs">
                        Sen Mèo 😺
                      </div>
                      <div className="text-xs text-gray-500">5 giờ trước</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 mb-1.5">
                    Ôm ấp buổi sáng là tuyệt nhất! Ai đồng ý không? 🥰
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop"
                    alt="Bài đăng"
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <div className="flex gap-2.5 mt-1.5 text-xs text-gray-600">
                    <span>❤️ 189</span>
                    <span>💬 32</span>
                    <span>🔄 8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Content */}
          <div className="flex-1 space-y-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 px-3 py-1 rounded-full border-2 border-teal-200">
              <span className="text-lg animate-bounce">💚</span>
              <span className="text-teal-800 font-bold text-xs">
                Tham Gia 10K+ Thành Viên
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-1">
              <h1 className="text-5xl lg:text-5xl xl:text-6xl font-black leading-tight">
                <span className="text-gray-900">Chia Sẻ </span>

                <span className="text-gray-900">Kết Nối.</span>
                <br />
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Gắn Kết.
                </span>
              </h1>
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed max-w-xl font-medium">
                Tham gia cộng đồng yêu thú cưng hỗ trợ nhất, nơi mọi câu chuyện
                đều quan trọng và mọi dấu chân đều được trân trọng.
              </p>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-2xl font-black text-teal-600">10K+</div>
                <div className="text-xs text-gray-600 font-semibold">
                  Thành Viên
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-600">50K+</div>
                <div className="text-xs text-gray-600 font-semibold">
                  Bài Viết
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-cyan-600">24/7</div>
                <div className="text-xs text-gray-600 font-semibold">
                  Hoạt Động
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">📸</span>
                <span className="font-semibold text-xs">
                  Chia sẻ khoảnh khắc boss
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">💡</span>
                <span className="font-semibold text-xs">
                  Nhận lời khuyên từ chuyên gia
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">🤝</span>
                <span className="font-semibold text-xs">Kết bạn suốt đời</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-2">
              {!isMember ? (
                <button
                  onClick={handleJoinCommunity}
                  className="group bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-black px-5 py-2 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <span className="flex items-center gap-2 text-xs">
                    Tham Gia Ngay
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </span>
                </button>
              ) : (
                <button className="bg-green-600 text-white font-black px-5 py-2 rounded-2xl shadow-xl cursor-default text-xs">
                  ✓ Chào Mừng Bạn!
                </button>
              )}
              <button
                onClick={handleShareNow}
                className="bg-white hover:bg-gray-50 text-gray-900 font-bold px-5 py-2 rounded-2xl transition-all duration-300 shadow-lg border-2 border-gray-200 text-xs"
              >
                Khám Phá
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Anchor */}
      <div ref={createPostRef} className="absolute bottom-0"></div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
            opacity: 0.5;
          }
        }
      `}</style>
    </section>
  );
};

export default CommunityHeroSection;
