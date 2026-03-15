const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐾</span>
              </div>
              <span className="text-2xl font-bold">Pet Connect</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Nền tảng tin cậy kết nối chủ thú cưng với những người chăm sóc
              được xác minh. Vì những người bạn lông xù xứng đáng được yêu
              thương.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <span>📧</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <span>📘</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <span>📱</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <span>🐦</span>
              </a>
            </div>
          </div>

          {/* For Pet Owners */}
          <div>
            <h3 className="text-lg font-semibold mb-6">
              Dành cho chủ thú cưng
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Tìm người chăm sóc
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Cách thức hoạt động
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  An toàn & Tin cậy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Bảng giá
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Bảo hiểm thú cưng
                </a>
              </li>
            </ul>
          </div>

          {/* For Caregivers */}
          <div>
            <h3 className="text-lg font-semibold mb-6">
              Dành cho người chăm sóc
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Trở thành người chăm sóc
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Tài nguyên hữu ích
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Cộng đồng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Câu chuyện thành công
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Tài khoản của tôi
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Hỗ trợ</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Liên hệ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                Đăng ký nhận tin tức
              </h3>
              <p className="text-gray-400">
                Nhận những mẹo chăm sóc thú cưng, ưu đãi đặc biệt và tin tức mới
                nhất từ Pet Connect.
              </p>
            </div>
            <div className="flex space-x-4">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="btn bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold whitespace-nowrap">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Pet Connect. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Điều khoản
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
