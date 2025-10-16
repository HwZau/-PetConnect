import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineTeam,
  AiOutlineCalendar,
  AiOutlineQuestionCircle,
  AiOutlineMenu,
  AiOutlineLogin,
  AiOutlineBell,
  AiOutlineSetting,
} from "react-icons/ai";
import ReactCountryFlag from "react-country-flag";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/image/Logo.png";

const Header = () => {
  const navigate = useNavigate();
  // Giả lập thông tin user, khi có API thì lấy từ backend
  const [user] = useState<null | { name: string; avatar: string }>({
    name: "Lý Hồng Thư",
    avatar: "/images/avatars/user-1.jpg",
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Xử lý đăng nhập: chuyển sang login page hoặc cập nhật user giả lập
  const handleAuthAction = () => {
    if (user) {
      // Hiển thị menu profile hoặc logout
      console.log("Toggling profile menu");
    } else {
      // Chuyển hướng sang trang /login với React Router
      navigate("/login");
    }
  };

  // Function to get random avatar

  // Function to get fixed avatar image
  const getFixedAvatar = () => {
    return "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100";
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-100 w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Logo" className="w-8 h-8" />
              <span className="text-lg font-bold text-emerald-600 ml-2">
                PawNest
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
            >
              <AiOutlineHome className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
            <Link
              to="/freelancers"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
            >
              <AiOutlineUser className="w-4 h-4" />
              <span>Tìm Người</span>
            </Link>
            <Link
              to="/community"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
            >
              <AiOutlineTeam className="w-4 h-4" />
              <span>Cộng Đồng</span>
            </Link>
            <Link
              to="/events"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
            >
              <AiOutlineCalendar className="w-4 h-4" />
              <span>Sự kiện</span>
            </Link>
            <Link
              to="/support"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
            >
              <AiOutlineQuestionCircle className="w-4 h-4" />
              <span>Hỗ Trợ</span>
            </Link>
          </div>

          {/* Right Section - Notifications, Settings & User */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="text-gray-600 hover:text-gray-800">
              <AiOutlineBell className="w-5 h-5" />
            </button>

            {/* Settings */}
            <button className="text-gray-600 hover:text-gray-800">
              <AiOutlineSetting className="w-5 h-5" />
            </button>

            {/* Language Selector */}
            <div className="hidden md:flex items-center space-x-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors">
              <ReactCountryFlag
                countryCode="VN"
                svg
                style={{
                  width: "1.5rem",
                  height: "1rem",
                }}
                title="Vietnam"
              />
              <span className="text-gray-700 font-medium text-sm">VI</span>
            </div>

            {/* User Avatar */}
            {user ? (
              <div
                className="flex items-center space-x-1 cursor-pointer group"
                onClick={handleAuthAction}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={user.avatar || getFixedAvatar()}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100";
                    }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={handleAuthAction}
                className="flex items-center space-x-1 bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <AiOutlineLogin className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100 transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <AiOutlineMenu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
            >
              <AiOutlineHome className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
            <Link
              to="/find"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
            >
              <AiOutlineUser className="w-4 h-4" />
              <span>Tìm Người</span>
            </Link>
            <Link
              to="/community"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
            >
              <AiOutlineTeam className="w-4 h-4" />
              <span>Cộng Đồng</span>
            </Link>
            <Link
              to="/events"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
            >
              <AiOutlineCalendar className="w-4 h-4" />
              <span>Sự kiện</span>
            </Link>
            <Link
              to="/support"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
            >
              <AiOutlineQuestionCircle className="w-4 h-4" />
              <span>Hỗ Trợ</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
