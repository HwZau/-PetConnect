import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { FiCheckCircle, FiDownload, FiHome, FiFileText, FiCreditCard } from "react-icons/fi";
import { paymentService } from "../../services/payment/paymentService";
import { showError, showSuccess } from "../../utils";
import type { PaymentDetailResponse } from "../../services/payment/paymentService";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [paymentDetail, setPaymentDetail] =
    useState<PaymentDetailResponse | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrDataString, setQrDataString] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pollError, setPollError] = useState<string | null>(null);

  // Check if this is a manual payment
  const storedPaymentData = typeof window !== "undefined" ? localStorage.getItem("last_manual_payment_data") : null;
  const parsedStoredPaymentData = storedPaymentData ? JSON.parse(storedPaymentData) : null;

  const manualPayment = location.state?.manualPayment || !!parsedStoredPaymentData;
  const accountInfo = location.state?.accountInfo || parsedStoredPaymentData?.accountInfo;
  const paymentMethod = location.state?.paymentMethod || parsedStoredPaymentData?.paymentMethod;

  useEffect(() => {
    // Manual payment flow: generate QR code + poll status
    if (manualPayment) {
      const stored = localStorage.getItem("last_manual_payment_data");
      const parsed = stored ? JSON.parse(stored) : null;
      const bookingId = location.state?.bookingId ?? parsed?.bookingId;
      const qrData = location.state?.qrData ?? parsed?.qrData;
      const accountInfo = location.state?.accountInfo ?? parsed?.accountInfo;

      if (qrData) {
        setQrDataString(qrData);
      }

      if (qrData) {
        QRCode.toDataURL(qrData, { width: 280, margin: 2 })
          .then((url) => setQrCodeUrl(url))
          .catch((err) => console.error("QR generation error:", err));
      }

      setIsLoading(false);

      if (!bookingId) {
        return;
      }

      let intervalId: ReturnType<typeof setInterval>;

      const fetchStatus = async () => {
        try {
          const statusResponse = await paymentService.getPaymentStatus(bookingId);
          setPaymentDetail(statusResponse);
          setPollError(null); // Clear error on success
        } catch (error: any) {
          console.error("Error polling payment status:", error);
          
          // Stop polling on auth/validation errors (don't retry forever)
          const status = error.response?.status;
          if (status === 400 || status === 401 || status === 403 || status === 404) {
            clearInterval(intervalId);
            setPollError(
              `Không thể lấy trạng thái thanh toán (${error.message}). Vui lòng click "Tôi đã chuyển khoản" để xác nhận.`
            );
          }
          // For 429 (rate limit), just skip this one and retry later
          // For other errors, also retry but less frequently
        }
      };

      // Poll status every 15s (not 5s to avoid rate limit)
      fetchStatus();
      intervalId = setInterval(fetchStatus, 15000);

      // Keep account info in state for render
      if (accountInfo) {
        location.state = { ...location.state, accountInfo };
      }

      return () => clearInterval(intervalId);
    }

    // PayOS / redirect flow
    const fetchPaymentDetails = async () => {
      try {
        // Get payment info from URL params (PayOS callback)
        const orderCode = searchParams.get("orderCode");
        const id = searchParams.get("id");
        const status = searchParams.get("status");
        const bookingId = localStorage.getItem("last_payment_booking_id");
        const paymentId = id || localStorage.getItem("last_payment_id");

        console.log("Payment Success - Params:", {
          orderCode,
          id,
          status,
          bookingId,
          paymentId,
        });

        // Fetch payment details from backend
        let detail: PaymentDetailResponse | null = null;

        if (bookingId) {
          detail = await paymentService.getPaymentByBooking(bookingId);
        } else if (paymentId) {
          detail = await paymentService.getPaymentById(paymentId);
        }

        if (detail) {
          setPaymentDetail(detail);
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [searchParams, manualPayment, location.state]);

  const handleConfirmPayment = async () => {
    const storedPaymentData = typeof window !== "undefined" ? localStorage.getItem("last_manual_payment_data") : null;
    const parsedStoredPaymentData = storedPaymentData ? JSON.parse(storedPaymentData) : null;

    const paymentId = location.state?.paymentId || parsedStoredPaymentData?.paymentId;
    if (!paymentId) {
      showError("Không tìm thấy thông tin thanh toán. Vui lòng thử lại.");
      return;
    }

    setIsConfirming(true);
    try {
      const confirmed = await paymentService.confirmPayment(paymentId);
      setPaymentDetail(confirmed);
      showSuccess("Thanh toán đã được xác nhận.");
    } catch (error: any) {
      showError(error.message || "Không thể xác nhận thanh toán");
    } finally {
      setIsConfirming(false);
    }
  };

  // Remove auto-redirect countdown - user decides when to leave

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleString("vi-VN");
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const currentStatus = paymentDetail?.status || (manualPayment ? "pending" : "completed");
  const isCompleted = currentStatus === "completed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce">
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {manualPayment
              ? isCompleted
                ? "Thanh toán thành công!"
                : "Xác nhận thanh toán"
              : "Thanh toán thành công!"
            } 🎉
          </h1>
          <p className="text-lg text-gray-600">
            {manualPayment
              ? isCompleted
                ? "Cảm ơn bạn đã thanh toán. Dịch vụ sẽ được kích hoạt sớm."
                : "Quét mã QR hoặc chuyển khoản theo thông tin bên dưới để hoàn tất thanh toán."
              : "Cảm ơn bạn đã sử dụng dịch vụ Pet Connect"
            }
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {manualPayment ? "Thông tin chuyển khoản" : "Chi tiết thanh toán"}
          </h2>

          {manualPayment && accountInfo ? (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FiCreditCard className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-semibold text-yellow-800">Hướng dẫn thanh toán</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  Quét mã QR bằng ứng dụng ngân hàng hoặc ví MoMo/VNPAY rồi thực hiện chuyển khoản.
                  Sau khi thanh toán thành công, hệ thống sẽ tự động xác nhận và kích hoạt dịch vụ.
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                    Trạng thái: 
                    <span className={`ml-2 font-semibold ${isCompleted ? 'text-green-700' : 'text-yellow-800'}`}>
                      {currentStatus === 'completed' ? 'Đã thanh toán' : 'Chờ xác nhận'}
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Quét mã QR</h3>
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR code thanh toán"
                      className="mx-auto mb-4 w-48 h-48"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-48">
                      <span className="text-sm text-gray-500">Đang tạo mã QR...</span>
                    </div>
                  )}

                  {!qrCodeUrl && qrDataString && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
                      <p className="text-sm text-gray-700 font-semibold">QR payload:</p>
                      <pre className="text-xs text-gray-600 bg-white rounded p-2 overflow-x-auto">
                        {qrDataString}
                      </pre>
                    </div>
                  )}

                  {!qrCodeUrl && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <p className="text-red-700 font-semibold">
                        Không thể tạo mã QR. Vui lòng thử lại hoặc chuyển khoản theo thông tin bên dưới.
                      </p>
                      <p className="text-sm text-red-600 mt-2">
                        Nếu bạn đã làm mới trang, mã QR có thể bị mất do thiếu dữ liệu. Hãy thử truy cập lại từ trang thanh toán.
                      </p>
                    </div>
                  )}

              {pollError && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                  <p className="text-orange-700 font-semibold">⚠️ {pollError}</p>
                </div>
              )}
                      <span className="text-blue-700">Phương thức:</span>
                      <span className="font-semibold text-blue-900">{accountInfo.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Số tài khoản:</span>
                      <span className="font-semibold text-blue-900 font-mono">{accountInfo.number}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Chủ tài khoản:</span>
                      <span className="font-semibold text-blue-900">{accountInfo.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Số tiền:</span>
                      <span className="font-semibold text-blue-900 text-lg">
                        {formatPrice(location.state?.totalAmount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Nội dung:</span>
                      <span className="font-semibold text-blue-900 font-mono">
                        PET{location.state?.bookingId?.slice(-6) || 'XXXXXX'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {!isCompleted && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleConfirmPayment}
                    disabled={isConfirming}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {isConfirming ? 'Đang xác nhận...' : 'Tôi đã chuyển khoản'}
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Xem đơn hàng
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Mã giao dịch:</span>
              <span className="font-semibold text-gray-900">
                {paymentDetail?.paymentId || searchParams.get("id") || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-semibold text-gray-900">
                {paymentDetail?.bookingId ||
                  searchParams.get("orderCode") ||
                  "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Phương thức:</span>
              <span className="font-semibold text-gray-900">PayOS</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Thời gian:</span>
              <span className="font-semibold text-gray-900">
                {formatDate(
                  paymentDetail?.updatedAt || paymentDetail?.createdAt
                )}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                <FiCheckCircle className="w-4 h-4 mr-1" />
                Thành công
              </span>
            </div>

            {paymentDetail?.amount && (
              <div className="flex justify-between items-center py-4 bg-green-50 rounded-lg px-4 mt-4">
                <span className="text-lg font-semibold text-gray-700">
                  Tổng thanh toán:
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(paymentDetail.amount)}
                </span>
              </div>
            )}
          </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <FiFileText className="w-5 h-5 mr-2" />
            Xem đơn hàng
          </button>

          <button
            onClick={() => {
              window.print();
            }}
            className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            <FiDownload className="w-5 h-5 mr-2" />
            Tải hóa đơn
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            <FiHome className="w-5 h-5 mr-2" />
            Về trang chủ
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Lưu ý:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Hóa đơn điện tử đã được gửi đến email của bạn</li>
            <li>• Bạn có thể xem chi tiết đơn hàng trong phần "Hồ sơ"</li>
            <li>• Liên hệ hotline 1900-xxxx nếu cần hỗ trợ</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
