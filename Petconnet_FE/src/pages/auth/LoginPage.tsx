import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginImage from "../../assets/image/login.png";
import logoImage from "../../assets/image/Logo.png";
import { FaHome } from "react-icons/fa";
import { useScrollToTop, useAuth } from "../../hooks";
import { showError } from "../../utils/toastUtils";
import { isAdminRole } from "../../utils/authUtils";

const LoginPage = () => {
  // Scroll to top when page loads
  useScrollToTop();

  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        setError("Vui lòng điền đầy đủ thông tin");
        setIsLoading(false);
        return;
      }

      // Call login with useAuth hook - this will handle API call and context update
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        // Navigate based on user role (case-insensitive)
        if (isAdminRole(result.user?.role)) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(
          "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin."
        );
      }
    } catch (err) {
      showError("Lỗi đăng nhập. Vui lòng thử lại.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main content */}
      <div className="flex w-full relative z-10">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col p-4 lg:p-6 overflow-y-auto">
          {/* Home Navigation Logo */}
          <div className="mb-4">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition-colors group"
            >
              <div className="flex items-center justify-center">
                <FaHome className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm ml-3">Về trang chủ</span>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-md w-full">
              {/* Logo and Welcome */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                  Chào mừng trở lại
                </h1>
                <p className="text-gray-600 text-sm">
                  Đăng nhập vào tài khoản Pet Connect của bạn
                </p>
              </div>

              {/* Form Container */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <p className="text-red-600 text-sm flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {error}
                    </p>
                  </div>
                )}

                {/* Social Login */}
                <button className="w-full flex items-center justify-center py-3 px-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-md transition-all duration-300 mb-4 group">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    Đăng nhập với Google
                  </span>
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      Hoặc tiếp tục với email
                    </span>
                  </div>
                </div>

                {/* Login Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                      placeholder="Nhập email của bạn"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Mật khẩu
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                      placeholder="Nhập mật khẩu"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="h-4 w-4 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label
                        htmlFor="rememberMe"
                        className="ml-2 block text-sm font-medium text-gray-700"
                      >
                        Ghi nhớ tôi
                      </label>
                    </div>
                    <Link
                      to="/auth/forgot-password"
                      className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-400 disabled:to-teal-400 disabled:cursor-not-allowed py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang đăng nhập...
                      </div>
                    ) : (
                      "Đăng nhập"
                    )}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                    >
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10"></div>
          <img
            src={
              loginImage ||
              "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&h=1200"
            }
            alt="Happy pets"
            className="w-full h-full object-cover"
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center mb-3">
                <div className="flex items-center justify-center">
                  <img
                    src={logoImage}
                    alt="Pet Connect Logo"
                    className="w-15 h-15"
                  />
                </div>
                <span className="text-white font-bold text-lg">Pet Connect</span>
              </div>
              <h2 className="text-white text-xl font-bold mb-1">
                Chăm sóc thú cưng với tình yêu thương
              </h2>
              <p className="text-white/80 text-base">
                Kết nối với những người chăm sóc thú cưng chuyên nghiệp nhất
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
