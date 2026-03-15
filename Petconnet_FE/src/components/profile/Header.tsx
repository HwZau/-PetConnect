import { useState, useEffect, useRef } from "react";
import {
  AiOutlineHome,
  AiOutlineBell,
  AiOutlineCalendar,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { FaPaw } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/image/Logo.png";
import { useAuth } from "../../hooks";
import Avatar from "../common/Avatar";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  // Function to get user avatar with fallback
  const getUserAvatar = () => {
    if (user?.avatarUrl) {
      return user.avatarUrl;
    }
    if (user?.avatar) {
      return user.avatar;
    }
    return null; // Return null to show initials
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Check if current route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src={Logo} alt="Pet Connect" className="h-8 w-8" />
            <span className="text-xl font-bold text-emerald-600">Pet Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <AiOutlineHome className="w-4 h-4" />
                <span>Trang chủ</span>
              </div>
            </Link>

            <Link
              to="/freelancers"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/freelancers")
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <AiOutlineUser className="w-4 h-4" />
                <span>Tìm Người</span>
              </div>
            </Link>

            <Link
              to="/community"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/community")
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <FaPaw className="w-4 h-4" />
                <span>Cộng Đồng</span>
              </div>
            </Link>

            <Link
              to="/events"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/events")
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <AiOutlineCalendar className="w-4 h-4" />
                <span>Sự kiện</span>
              </div>
            </Link>

            <Link
              to="/support"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/support")
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <AiOutlineSetting className="w-4 h-4" />
                <span>Hỗ Trợ</span>
              </div>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="hidden md:flex items-center space-x-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors">
              <img
                src="https://flagcdn.com/w40/vn.png"
                alt="Vietnam"
                className="w-5 h-3 object-cover"
              />
              <span className="text-gray-700 font-medium text-sm">VI</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <AiOutlineBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <AiOutlineSetting className="w-5 h-5" />
            </button>

            {/* User Profile */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Avatar
                    src={getUserAvatar()}
                    name={getUserDisplayName()}
                    size="sm"
                  />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {getUserDisplayName()}
                      </p>
                      {user.email && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user.email}
                        </p>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <AiOutlineUser className="w-4 h-4 mr-3 text-gray-400" />
                      Hồ sơ của tôi
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <AiOutlineSetting className="w-4 h-4 mr-3 text-gray-400" />
                      Cài đặt
                    </Link>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <AiOutlineLogout className="w-4 h-4 mr-3" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Đăng nhập
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              {showMobileMenu ? (
                <AiOutlineClose className="w-6 h-6" />
              ) : (
                <AiOutlineMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineHome className="w-5 h-5" />
              <span>Trang chủ</span>
            </Link>
            <Link
              to="/freelancers"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineUser className="w-5 h-5" />
              <span>Tìm Người</span>
            </Link>
            <Link
              to="/community"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              <FaPaw className="w-5 h-5" />
              <span>Cộng Đồng</span>
            </Link>
            <Link
              to="/events"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineCalendar className="w-5 h-5" />
              <span>Sự kiện</span>
            </Link>
            <Link
              to="/support"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineSetting className="w-5 h-5" />
              <span>Hỗ Trợ</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
