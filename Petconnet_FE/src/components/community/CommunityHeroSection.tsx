import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../../utils/toastUtils";
import useAuth from "../../hooks/useAuth";
import { AiOutlineClose, AiOutlineHeart, AiOutlineUserAdd, AiOutlineTrophy, AiOutlineCheckCircle } from "react-icons/ai";

const CommunityHeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const createPostRef = useRef<HTMLDivElement>(null);

  const handleShareNow = () => {
    createPostRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleJoinCommunity = () => {
    if (isAuthenticated) {
      showSuccess("Bạn đã là thành viên của cộng đồng!");
      return;
    }
    setShowJoinModal(true);
  };

  const handleConfirmJoin = () => {
    setShowJoinModal(false);
    navigate("/register");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden flex items-center">
      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-20 animate-float"
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

      <div className="container mx-auto px-6 lg:px-16 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-8">
          {/* Right Content - Social Feed Preview */}
          <div className="flex-1 w-full max-w-[450px]">
            <div className="bg-white rounded-3xl shadow-2xl p-4 space-y-3 border-4 border-teal-100 hover:shadow-3xl transition-shadow">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-gray-100">
                <h3 className="text-xl font-black text-gray-800">
                  📱 Bảng Tin Cộng Đồng
                </h3>
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse"></div>
                  <div
                    className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>

              {/* Mock Posts */}
              <div className="space-y-3 max-h-[320px] overflow-y-auto scrollbar-hide">
                {/* Post 1 */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-3 hover:shadow-lg transition-all border-l-4 border-teal-400">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1544568100-847a948585b9?w=100&h=100&fit=crop"
                      alt="Người dùng"
                      className="w-10 h-10 rounded-full object-cover border-2 border-teal-300"
                    />
                    <div>
                      <div className="font-bold text-gray-800 text-sm">Yêu Boss 🐕</div>
                      <div className="text-xs text-gray-500">2 giờ trước</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 font-medium">
                    Vừa nhận nuôi em này! Quyết định tốt nhất đời! 💕
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop"
                    alt="Bài đăng"
                    className="w-full h-28 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex gap-3 mt-2 text-xs text-gray-600 font-semibold">
                    <span>❤️ 234</span>
                    <span>💬 45</span>
                    <span>🔄 12</span>
                  </div>
                </div>

                {/* Post 2 */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-3 hover:shadow-lg transition-all border-l-4 border-emerald-400">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&h=100&fit=crop"
                      alt="Người dùng"
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-300"
                    />
                    <div>
                      <div className="font-bold text-gray-800 text-sm">Sen Mèo 😺</div>
                      <div className="text-xs text-gray-500">5 giờ trước</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 font-medium">
                    Ôm ấp buổi sáng là tuyệt nhất! Ai đồng ý không? 🥰
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop"
                    alt="Bài đăng"
                    className="w-full h-28 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex gap-3 mt-2 text-xs text-gray-600 font-semibold">
                    <span>❤️ 189</span>
                    <span>💬 32</span>
                    <span>🔄 8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Content */}
          <div className="flex-1 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 px-4 py-2 rounded-full border-2 border-teal-300 shadow-sm">
              <span className="text-xl animate-bounce">💚</span>
              <span className="text-teal-800 font-bold text-sm">
                Tham Gia 10K+ Thành Viên
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                <span className="text-gray-900">Chia Sẻ. </span>
                <br />
                <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  Kết Nối. Gắn Kết.
                </span>
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed max-w-xl font-medium">
                Tham gia cộng đồng yêu thú cưng hỗ trợ nhất, nơi mọi câu chuyện đều quan trọng và mọi dấu chân đều được trân trọng. 🐾
              </p>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-teal-100 hover:shadow-lg transition-all text-center">
                <div className="text-3xl font-black text-teal-600">10K+</div>
                <div className="text-sm text-gray-600 font-bold mt-1">Thành Viên</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-emerald-100 hover:shadow-lg transition-all text-center">
                <div className="text-3xl font-black text-emerald-600">50K+</div>
                <div className="text-sm text-gray-600 font-bold mt-1">Bài Viết</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-cyan-100 hover:shadow-lg transition-all text-center">
                <div className="text-3xl font-black text-cyan-600">24/7</div>
                <div className="text-sm text-gray-600 font-bold mt-1">Hoạt Động</div>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl border-2 border-teal-100 hover:border-teal-300 transition-all">
                <span className="text-2xl">📸</span>
                <span className="font-bold text-sm">Chia sẻ khoảnh khắc boss</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl border-2 border-emerald-100 hover:border-emerald-300 transition-all">
                <span className="text-2xl">💡</span>
                <span className="font-bold text-sm">Nhận lời khuyên từ chuyên gia</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl border-2 border-cyan-100 hover:border-cyan-300 transition-all">
                <span className="text-2xl">🤝</span>
                <span className="font-bold text-sm">Kết bạn suốt đời</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleJoinCommunity}
                disabled={isAuthenticated}
                className={`group ${
                  isAuthenticated 
                    ? "bg-gradient-to-r from-green-400 to-emerald-500 cursor-default" 
                    : "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 hover:shadow-lg"
                } text-white font-black px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
              >
                <span className="flex items-center gap-2 text-sm">
                  {isAuthenticated ? (
                    <>
                     
                      <span>Đã Tham Gia Cộng Đồng</span>
                    </>
                  ) : (
                    <>
                      <AiOutlineUserAdd className="w-5 h-5" />
                      <span>Tham Gia Ngay</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </span>
              </button>
              <button
                onClick={handleShareNow}
                className="group bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 text-gray-900 font-bold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg border-2 border-gray-200 hover:border-orange-300 text-sm flex items-center gap-2"
              >
                
                Đi tới bảng tin
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Join Community Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Overlay với animation */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-sm"
              aria-hidden="true"
              onClick={() => setShowJoinModal(false)}
            />

            {/* Modal panel */}
            <div className="relative inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              {/* Modal header với gradient */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white relative">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="absolute right-4 top-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <AiOutlineClose className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <AiOutlineHeart className="w-6 h-6" />
                  Tham gia Pet Connect
                </h3>
                <p className="mt-2 text-sm opacity-90">
                  Cộng đồng dành cho những người yêu thú cưng
                </p>
              </div>

              {/* Modal body */}
              <div className="bg-white px-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
                    <AiOutlineUserAdd className="w-6 h-6 text-teal-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Kết nối</h4>
                      <p className="text-sm text-gray-600">Gặp gỡ những người yêu thú cưng khác</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-xl">
                    <AiOutlineTrophy className="w-6 h-6 text-cyan-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Học hỏi</h4>
                      <p className="text-sm text-gray-600">Chia sẻ kinh nghiệm chăm sóc thú cưng</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                    <AiOutlineCheckCircle className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Hỗ trợ</h4>
                      <p className="text-sm text-gray-600">Được tư vấn từ các chuyên gia</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Để sau
                </button>
                <button
                  onClick={handleConfirmJoin}
                  className="group bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 px-6 py-2 text-sm font-medium text-white rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <AiOutlineUserAdd className="w-5 h-5" />
                  Tham Gia Ngay
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
