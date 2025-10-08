import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineTeam,
  AiOutlineCalendar,
  AiOutlineQuestionCircle,
  AiOutlineDown,
  AiOutlineMenu,
  AiOutlineLogin,
} from "react-icons/ai";
import ReactCountryFlag from "react-country-flag";
import Logo from "../../assets/image/Logo.png";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  // Giả lập thông tin user, khi có API thì lấy từ backend
  const [user, setUser] = useState<null | { name: string; avatar: string }>(
    null
  );
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

  return (
    <nav className="bg-white shadow-lg shadow-gray-300/30 border border-gray-100 rounded-4xl absolute top-8 left-1/2 transform -translate-x-1/2 w-[80%] z-50 overflow-visible">
      <div className="px-4">
        <div className="flex items-center justify-between h-14 relative">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center -mt-4 ml-2 z-10">
            <div className="flex items-center justify-center">
              <img src={Logo} alt="Logo" className="w-15 h-15" />
            </div>
            <span className="text-xs font-bold text-emerald-600 -mt-1 ml-2">
              PawNest
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm"
            >
              <AiOutlineHome className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
            <Link
              to="#"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm"
            >
              <AiOutlineUser className="w-4 h-4" />
              <span>Tìm Người</span>
            </Link>
            <Link
              to="#"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm"
            >
              <AiOutlineTeam className="w-4 h-4" />
              <span>Công Đồng</span>
            </Link>
            <Link
              to="/events"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm"
            >
              <AiOutlineCalendar className="w-4 h-4" />
              <span>Sự kiện</span>
            </Link>
            <Link
              to="#"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm"
            >
              <AiOutlineQuestionCircle className="w-4 h-4" />
              <span>Hỗ Trợ</span>
            </Link>
          </div>

          {/* Language & User */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
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

            {/* Conditional User Avatar or Login Button */}
            {user ? (
              <div
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={handleAuthAction}
              >
                <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <AiOutlineDown className="w-3 h-3 text-gray-500 group-hover:text-gray-700 transition-colors" />
              </div>
            ) : (
              <button
                onClick={handleAuthAction}
                className="flex items-center space-x-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <AiOutlineLogin className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineHome className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
            <Link
              to="#"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineUser className="w-4 h-4" />
              <span>Tìm Người</span>
            </Link>
            <Link
              to="#"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineTeam className="w-4 h-4" />
              <span>Công Đồng</span>
            </Link>
            <Link
              to="/events"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineCalendar className="w-4 h-4" />
              <span>Sự kiện</span>
            </Link>
            <Link
              to="#"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineQuestionCircle className="w-4 h-4" />
              <span>Hỗ Trợ</span>
            </Link>

            {/* Login/Profile in mobile menu */}
            {!user && (
              <button
                onClick={handleAuthAction}
                className="flex items-center w-full space-x-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium"
              >
                <AiOutlineLogin className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>
            )}
            {user && (
              <div
                className="flex items-center space-x-2 px-4 py-2 cursor-pointer group"
                onClick={handleAuthAction}
              >
                <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="font-medium text-gray-700">{user.name}</span>
                <AiOutlineDown className="w-3 h-3 text-gray-500 group-hover:text-gray-700 transition-colors" />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
