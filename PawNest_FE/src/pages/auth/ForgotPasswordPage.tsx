import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { authService } from "../../services";
import { showSuccess, showError } from "../../utils/toastUtils";
import { FaHome } from "react-icons/fa";
import logoImage from "../../assets/image/Logo.png";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showError("Vui lòng nhập email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Email không hợp lệ");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authService.forgotPassword(email);

      if (response.success) {
        showSuccess("Mã xác thực đã được gửi đến email của bạn!");
        // Navigate to verification page and pass email via state
        navigate("/auth/reset-password", { state: { email } });
      } else {
        showError(response.message || "Không thể gửi email xác thực");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      showError(error?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="flex w-full relative z-10 items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Home Navigation */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition-colors group"
            >
              <FaHome className="w-5 h-5" />
              <span className="font-semibold text-sm ml-3">Về trang chủ</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <img src={logoImage} alt="PawNest Logo" className="w-16 h-16" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Quên mật khẩu?
              </h1>
              <p className="text-gray-600">
                Nhập email của bạn để nhận mã xác thực đặt lại mật khẩu
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-sm text-blue-800">
                  💡 Mã xác thực sẽ được gửi đến email của bạn. Vui lòng kiểm
                  tra cả hộp thư spam.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-400 disabled:to-teal-400 disabled:cursor-not-allowed py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi mã xác thực"
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
