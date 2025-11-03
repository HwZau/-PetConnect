import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Key,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { authService } from "../../services";
import { showSuccess, showError } from "../../utils/toastUtils";
import { FaHome } from "react-icons/fa";
import logoImage from "../../assets/image/Logo.png";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-fill email from previous page (forgot password)
  const emailFromState = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: emailFromState,
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });

  // Check password strength
  useEffect(() => {
    if (!formData.newPassword) {
      setPasswordStrength({ score: 0, label: "", color: "" });
      return;
    }

    let score = 0;
    if (formData.newPassword.length >= 8) score++;
    if (formData.newPassword.length >= 12) score++;
    if (
      /[a-z]/.test(formData.newPassword) &&
      /[A-Z]/.test(formData.newPassword)
    )
      score++;
    if (/\d/.test(formData.newPassword)) score++;
    if (/[^a-zA-Z0-9]/.test(formData.newPassword)) score++;

    const labels = ["Yếu", "Trung bình", "Khá", "Mạnh", "Rất mạnh"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    setPasswordStrength({
      score: Math.min(score, 5),
      label: labels[Math.min(score - 1, 4)] || "",
      color: colors[Math.min(score - 1, 4)] || "",
    });
  }, [formData.newPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.email ||
      !formData.code ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      showError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.code.length !== 6) {
      showError("Mã xác thực phải có 6 ký tự");
      return;
    }

    if (formData.newPassword.length < 8) {
      showError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (passwordStrength.score < 2) {
      showError("Mật khẩu quá yếu, vui lòng chọn mật khẩu mạnh hơn");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authService.verifiedEmailReset(
        formData.code,
        formData.email,
        formData.newPassword
      );

      if (response.success) {
        showSuccess("Đặt lại mật khẩu thành công!");
        // Show success message for 2 seconds then navigate to login
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } else {
        showError(response.message || "Không thể đặt lại mật khẩu");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      showError(error?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!formData.email) {
      showError("Vui lòng nhập email");
      return;
    }

    try {
      const response = await authService.forgotPassword(formData.email);
      if (response.success) {
        showSuccess("Đã gửi lại mã xác thực!");
      } else {
        showError("Không thể gửi lại mã");
      }
    } catch (error) {
      showError("Có lỗi xảy ra");
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
                Đặt lại mật khẩu
              </h1>
              <p className="text-gray-600">
                Nhập mã xác thực và mật khẩu mới của bạn
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
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
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {emailFromState && (
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Email đã được tự động điền từ bước trước
                  </p>
                )}
              </div>

              {/* Verification Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="code"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Mã xác thực
                  </label>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    Gửi lại mã
                  </button>
                </div>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="code"
                    name="code"
                    type="text"
                    placeholder="Nhập mã 6 ký tự"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300 tracking-widest text-center font-mono text-lg"
                    maxLength={6}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Kiểm tra email của bạn để lấy mã xác thực
                </p>
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= passwordStrength.score
                              ? passwordStrength.color
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength.label && (
                      <p className="text-xs text-gray-600">
                        Độ mạnh:{" "}
                        <span className="font-medium">
                          {passwordStrength.label}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                <ul className="text-xs text-gray-500 space-y-1 mt-2">
                  <li
                    className={
                      formData.newPassword.length >= 8 ? "text-green-600" : ""
                    }
                  >
                    • Ít nhất 8 ký tự
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(formData.newPassword) &&
                      /[a-z]/.test(formData.newPassword)
                        ? "text-green-600"
                        : ""
                    }
                  >
                    • Có chữ hoa và chữ thường
                  </li>
                  <li
                    className={
                      /\d/.test(formData.newPassword) ? "text-green-600" : ""
                    }
                  >
                    • Có số
                  </li>
                  <li
                    className={
                      /[^a-zA-Z0-9]/.test(formData.newPassword)
                        ? "text-green-600"
                        : ""
                    }
                  >
                    • Có ký tự đặc biệt
                  </li>
                </ul>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p
                    className={`text-xs mt-1 ${
                      formData.newPassword === formData.confirmPassword
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formData.newPassword === formData.confirmPassword
                      ? "✓ Mật khẩu khớp"
                      : "✗ Mật khẩu không khớp"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-400 disabled:to-teal-400 disabled:cursor-not-allowed py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center"
                disabled={isSubmitting || passwordStrength.score < 2}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Quay lại
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
