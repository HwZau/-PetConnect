import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineTeam,
  AiOutlineCalendar,
  AiOutlineQuestionCircle,
  AiOutlineDown,
  AiOutlineMenu,
} from "react-icons/ai";
import ReactCountryFlag from "react-country-flag";
import Logo from "../../assets/image/Logo.png";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg shadow-gray-300/30 border border-gray-100 rounded-4xl absolute top-8 left-1/2 transform -translate-x-1/2 w-[80%] z-50 overflow-visible">
      <div className="px-4">
        <div className="flex items-center justify-between h-14 relative">
          {/* Logo - taller than navbar, extending upward */}
          <div className="flex flex-col items-center -mt-4 ml-2 z-10">
            <div className="flex items-center justify-center">
              <img src={Logo} alt="Logo" className="w-15 h-15" />
            </div>
            <span className="text-xs font-bold text-emerald-600 -mt-1 ml-2">
              PawNest
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm"
            >
              <AiOutlineHome className="w-4 h-4" />
              <span>Trang chủ</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm"
            >
              <AiOutlineUser className="w-4 h-4" />
              <span>Tìm Người</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm"
            >
              <AiOutlineTeam className="w-4 h-4" />
              <span>Công Đồng</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm"
            >
              <AiOutlineCalendar className="w-4 h-4" />
              <span>Sự kiện</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm"
            >
              <AiOutlineQuestionCircle className="w-4 h-4" />
              <span>Hỗ Trợ</span>
            </a>
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

            {/* User Avatar */}
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">👤</span>
              </div>
              <AiOutlineDown className="w-3 h-3 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <AiOutlineMenu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
          <a
            href="#"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <AiOutlineHome className="w-4 h-4" />
            <span>Trang chủ</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <AiOutlineUser className="w-4 h-4" />
            <span>Tìm Người</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <AiOutlineTeam className="w-4 h-4" />
            <span>Công Đồng</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <AiOutlineCalendar className="w-4 h-4" />
            <span>Sự kiện</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <AiOutlineQuestionCircle className="w-4 h-4" />
            <span>Hỗ Trợ</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
