import { useState, useEffect } from "react";
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
  const [user] = useState<null | { name: string; avatar: string }>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll để thay đổi navbar style
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100); // Thay đổi style khi scroll > 100px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      {/* Spacer để tránh content jump khi navbar becomes fixed */}
      <div
        className={`transition-all duration-300 ${
          isScrolled ? "h-16 scale-100" : "h-0 scale-95"
        }`}
      />

      <nav
        className={`bg-white shadow-lg shadow-gray-300/30 border border-gray-100 z-50 overflow-visible transition-all duration-300 ${
          isScrolled
            ? "fixed top-0 left-0 w-full rounded-none scale-100"
            : "absolute top-8 left-1/2 -translate-x-1/2 w-[80%] rounded-4xl scale-95"
        }`}
      >
        <div className={`${isScrolled ? "px-6" : "px-4"}`}>
          <div
            className={`flex items-center justify-between relative ${
              isScrolled ? "h-16" : "h-14"
            }`}
          >
            {/* Logo */}
            <Link
              to="/"
              className={`flex items-center z-10 transition-all duration-300 ${
                isScrolled
                  ? "flex-row space-x-2 scale-100"
                  : "flex-col -mt-4 ml-2 scale-110"
              }`}
            >
              <div className="flex items-center justify-center">
                <img
                  src={Logo}
                  alt="Logo"
                  className={`transition-all duration-300 ${
                    isScrolled ? "w-8 h-8 scale-100" : "w-15 h-15 scale-105"
                  }`}
                />
              </div>
              <span
                className={`font-bold text-emerald-600 transition-all duration-300 ${
                  isScrolled
                    ? "text-lg ml-0 scale-100"
                    : "text-xs -mt-1 ml-2 scale-110"
                }`}
              >
                PawNest
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-150 text-sm"
              >
                <AiOutlineHome className="w-4 h-4" />
                <span>Trang chủ</span>
              </Link>
              <Link
                to="/freelancers"
                className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-150 text-sm"
              >
                <AiOutlineUser className="w-4 h-4" />
                <span>Tìm Người</span>
              </Link>
              <Link
                to="/community"
                className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-150 text-sm"
              >
                <AiOutlineTeam className="w-4 h-4" />
                <span>Công Đồng</span>
              </Link>
              <Link
                to="/events"
                className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-150 text-sm"
              >
                <AiOutlineCalendar className="w-4 h-4" />
                <span>Sự kiện</span>
              </Link>
              <Link
                to="/support"
                className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-150 text-sm"
              >
                <AiOutlineQuestionCircle className="w-4 h-4" />
                <span>Hỗ Trợ</span>
              </Link>
            </div>

            {/* Language & User */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors duration-150">
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
                  <AiOutlineDown className="w-3 h-3 text-gray-500 group-hover:text-gray-700 transition-colors duration-150" />
                </div>
              ) : (
                <button
                  onClick={handleAuthAction}
                  className="flex items-center space-x-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors duration-150 text-sm font-medium"
                >
                  <AiOutlineLogin className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <AiOutlineMenu className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden border-t border-gray-200 overflow-hidden transition-all duration-200 ease-out ${
              showMobileMenu ? "max-h-96 py-4" : "max-h-0 py-0"
            }`}
          >
            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                onClick={() => setShowMobileMenu(false)}
              >
                <AiOutlineHome className="w-4 h-4" />
                <span>Trang chủ</span>
              </Link>
              <Link
                to="/freelancers"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                onClick={() => setShowMobileMenu(false)}
              >
                <AiOutlineUser className="w-4 h-4" />
                <span>Tìm Người</span>
              </Link>
              <Link
                to="/community"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                onClick={() => setShowMobileMenu(false)}
              >
                <AiOutlineTeam className="w-4 h-4" />
                <span>Công Đồng</span>
              </Link>
              <Link
                to="/events"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                onClick={() => setShowMobileMenu(false)}
              >
                <AiOutlineCalendar className="w-4 h-4" />
                <span>Sự kiện</span>
              </Link>
              <Link
                to="#"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                onClick={() => setShowMobileMenu(false)}
              >
                <AiOutlineQuestionCircle className="w-4 h-4" />
                <span>Hỗ Trợ</span>
              </Link>

              {/* Login/Profile in mobile menu */}
              {!user && (
                <button
                  onClick={handleAuthAction}
                  className="flex items-center w-full space-x-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-colors duration-150"
                >
                  <AiOutlineLogin className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </button>
              )}
              {user && (
                <div
                  className="flex items-center space-x-2 px-4 py-2 cursor-pointer group transition-colors duration-150"
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
                  <AiOutlineDown className="w-3 h-3 text-gray-500 group-hover:text-gray-700 transition-colors duration-150" />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
