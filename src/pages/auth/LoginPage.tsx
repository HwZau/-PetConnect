import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext, type User } from "../../contexts/UserContext";
import loginImage from "../../assets/image/login.png";
import logoImage from "../../assets/image/Logo.png";

const LoginPage = () => {
  const { setUser } = useContext(UserContext);
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
        return;
      }

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login - replace with actual API response
      const userData: User = {
        id: "1",
        email: formData.email,
        name: "User Name",
        role: "user",
      };

      handleSuccessfulLogin(userData);
    } catch (err) {
      setError("Đăng nhập không thành công. Vui lòng thử lại.");
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

  const handleSuccessfulLogin = (userData: User) => {
    setUser(userData);
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Light blue header bar */}
      <div className="w-full h-1 bg-blue-400 flex-shrink-0"></div>

      {/* Main content - exactly fills available space */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-white overflow-y-auto">
          <div className="max-w-sm w-full">
            <div className="p-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Chào mừng đến PawNest
                </h2>
              </div>

              {error && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Login with Google button */}
              <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg mb-3 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 mr-3 text-blue-500" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium text-gray-700">
                  Login with Google
                </span>
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc</span>
                </div>
              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                    placeholder="Email hoặc Tên đăng nhập"
                  />
                </div>

                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                    placeholder="Mật khẩu"
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
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Ghi nhớ tôi
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-green-600 hover:text-green-500"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed py-2 rounded-lg font-medium transition-colors"
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>

              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-green-600 hover:text-green-500"
                  >
                    Đăng ký
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={loginImage || "/assets/image/login.png"}
            alt="Login"
            className="w-full h-full object-cover"
          />

          {/* Logo positioned at bottom right */}
          <div className="absolute bottom-4 right-4 flex items-center">
            <img
              src={logoImage || "/assets/image/Logo.png"}
              alt="PawNest Logo"
              className="w-8 h-8"
            />
            <span className="text-white font-bold ml-1">PawNest</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
