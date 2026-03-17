import { useEffect, useState } from "react";
import * as QRCode from "qrcode";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { FiCheckCircle, FiDownload, FiHome, FiFileText, FiCreditCard, FiClock, FiAlertCircle } from "react-icons/fi";
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
  
  // Countdown timer: 2 minutes = 120 seconds
  const [countdownSeconds, setCountdownSeconds] = useState<number>(120);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Check if this is a manual payment
  const storedPaymentData = typeof window !== "undefined" ? localStorage.getItem("last_manual_payment_data") : null;
  const parsedStoredPaymentData = storedPaymentData ? JSON.parse(storedPaymentData) : null;

  const manualPayment = location.state?.manualPayment || !!parsedStoredPaymentData;
  const accountInfo = location.state?.accountInfo || parsedStoredPaymentData?.accountInfo;
  const paymentMethod = location.state?.paymentMethod || parsedStoredPaymentData?.paymentMethod;

  useEffect(() => {
    // Manual payment flow: generate QR code + poll status + countdown
    if (manualPayment) {
      const stored = localStorage.getItem("last_manual_payment_data");
      const parsed = stored ? JSON.parse(stored) : null;
      const bookingId = location.state?.bookingId ?? parsed?.bookingId;
      const qrData = location.state?.qrData ?? parsed?.qrData;
      const paymentId = location.state?.paymentId ?? parsed?.paymentId;
      const accountInfo = location.state?.accountInfo ?? parsed?.accountInfo;

      // DEBUG: Log all data sources
      console.log("=== QR Generation Debug ===");
      console.log("Location state:", location.state);
      console.log("LocalStorage data:", parsed);
      console.log("Final qrData:", qrData);
      console.log("Final bookingId:", bookingId);
      console.log("Final accountInfo:", accountInfo);
      console.log("===========================");

      if (qrData) {
        setQrDataString(qrData);
        
        // Check if qrData is already an image URL (starts with /) or data URL
        if (qrData.startsWith('/') || qrData.startsWith('http')) {
          // It's already an image URL, use it directly
          console.log("QR Code URL detected (direct image):", qrData);
          setQrCodeUrl(qrData);
        } else if (qrData.startsWith('data:') || qrData.includes('://')) {
          // It's a data URL, use it directly
          console.log("QR Code data URL detected:", qrData.substring(0, 50));
          setQrCodeUrl(qrData);
        } else {
          // It's raw data (text format), try to generate QR code
          QRCode.toDataURL(qrData, { width: 280, margin: 2 })
            .then((url: string) => {
              console.log("QR Code generated successfully, URL length:", url.length);
              setQrCodeUrl(url);
            })
            .catch((err: Error) => {
              console.error("❌ QR generation error:", err);
              console.error("Error message:", err.message);
              console.error("Error details:", err);
            });
        }
      } else {
        console.warn("⚠️ No qrData provided for QR generation");
      }

      setIsLoading(false);

      if (!bookingId) {
        return;
      }

      let pollIntervalId: ReturnType<typeof setInterval>;
      let countdownIntervalId: ReturnType<typeof setInterval>;
      let hasAutoConfirmed = false;

      // Countdown timer - starts at 120 seconds (2 minutes)
      countdownIntervalId = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalId);
            clearInterval(pollIntervalId);
            setHasTimedOut(true);
            console.warn("⏱️ Payment timeout - 2 minutes elapsed");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const fetchStatus = async () => {
        if (hasAutoConfirmed) return; // Don't poll after auto-confirm

        try {
          const statusResponse = await paymentService.getPaymentStatus(bookingId);
          console.log("Payment status:", statusResponse);
          
          setPaymentDetail(statusResponse);
          setPollError(null);

          // Auto-confirm if payment is detected as completed
          if (statusResponse?.status === "completed" && !hasAutoConfirmed) {
            hasAutoConfirmed = true;
            clearInterval(pollIntervalId);
            clearInterval(countdownIntervalId);
            
            console.log("✅ Payment completed! Auto-confirming...");
            showSuccess("Thanh toán thành công! Đang chuyển hướng...");
            
            // Wait 1.5 seconds then redirect
            setTimeout(() => {
              navigate("/profile", { replace: true });
            }, 1500);
          }
        } catch (error: any) {
          console.error("Error polling payment status:", error);
          
          const status = error.response?.status;
          if (status === 400 || status === 401 || status === 403 || status === 404) {
            clearInterval(pollIntervalId);
            setPollError(
              `Không thể lấy trạng thái thanh toán. Vui lòng click "Tôi đã chuyển khoản" để xác nhận.`
            );
          }
        }
      };

      // Poll status every 5 seconds
      fetchStatus();
      pollIntervalId = setInterval(fetchStatus, 5000);

      // Keep account info in state for render
      if (accountInfo) {
        location.state = { ...location.state, accountInfo };
      }

      return () => {
        clearInterval(pollIntervalId);
        clearInterval(countdownIntervalId);
      };
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
      showSuccess("Thanh toán đã được xác nhận. Đang chuyển hướng...");
      
      // Redirect to profile after 1.5 seconds
      setTimeout(() => {
        navigate("/profile", { replace: true });
      }, 1500);
    } catch (error: any) {
      showError(error.message || "Không thể xác nhận thanh toán");
      setIsConfirming(false);
    }
  };

  // Handle timeout - redirect to booking page after 2 minutes if not confirmed
  useEffect(() => {
    if (hasTimedOut && manualPayment) {
      showError("Thanh toán đã hết thời gian. Vui lòng thử lại.");
      
      // Redirect to booking page after 2 seconds
      const timeoutId = setTimeout(() => {
        navigate("/booking", { replace: true });
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [hasTimedOut, manualPayment, navigate]);

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
  const adminApprovalStatus = (paymentDetail as any)?.adminApprovalStatus || "pending";
  // Payment is only completed if both payment status AND admin approval are done
  const isCompleted = currentStatus === "completed" && adminApprovalStatus === "approved";

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
                      {currentStatus === 'completed' && adminApprovalStatus === 'pending'
                        ? 'Chờ admin xác nhận'
                        : currentStatus === 'completed'
                        ? 'Đã thanh toán'
                        : 'Chờ xác nhận'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Admin Approval Pending */}
              {currentStatus === 'completed' && adminApprovalStatus === 'pending' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FiAlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-blue-700 text-sm">
                      ✓ Thanh toán của bạn đã được ghi nhận. Đang chờ quản trị viên xác nhận. Vui lòng chờ...
                    </p>
                  </div>
                </div>
              )}

              {/* Admin Rejected */}
              {adminApprovalStatus === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FiAlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-semibold text-red-800">Lý do từ chối:</span>
                  </div>
                  <p className="text-red-700 text-sm">
                    {(paymentDetail as any)?.rejectionReason || 'Không có thông tin chi tiết'}
                  </p>
                </div>
              )}

              {/* Countdown Timer */}
              {manualPayment && !isCompleted && (
                <div className={`rounded-lg p-4 border-2 flex items-center justify-between ${
                  hasTimedOut
                    ? 'bg-red-50 border-red-300'
                    : countdownSeconds <= 30
                    ? 'bg-orange-50 border-orange-300'
                    : 'bg-blue-50 border-blue-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <FiClock className={`w-6 h-6 ${
                      hasTimedOut ? 'text-red-600' : countdownSeconds <= 30 ? 'text-orange-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <p className={`font-semibold ${
                        hasTimedOut ? 'text-red-800' : countdownSeconds <= 30 ? 'text-orange-800' : 'text-blue-800'
                      }`}>
                        {hasTimedOut ? 'Hết thời gian thanh toán' : 'Thời gian còn lại'}
                      </p>
                      <p className={`text-sm ${
                        hasTimedOut ? 'text-red-700' : countdownSeconds <= 30 ? 'text-orange-700' : 'text-blue-700'
                      }`}>
                        {hasTimedOut
                          ? 'Thanh toán đã hết thời gian. Vui lòng thử lại.'
                          : `${Math.floor(countdownSeconds / 60)}:${String(countdownSeconds % 60).padStart(2, '0')}`}
                      </p>
                    </div>
                  </div>
                  {!hasTimedOut && (
                    <div className="text-sm font-semibold">
                      {countdownSeconds <= 30 ? (
                        <span className="text-orange-600">⚠️ Sắp hết thời gian</span>
                      ) : (
                        <span className="text-blue-600">⏳ Đang chờ...</span>
                      )}
                    </div>
                  )}
                </div>
              )}

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

                  <p className="text-sm text-gray-600 mt-4">
                    Mở ứng dụng ngân hàng hoặc ví, quét mã QR để thanh toán tự động.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-800 mb-4">Thông tin thanh toán</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
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

              {pollError && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-700 font-semibold">⚠️ {pollError}</p>
                </div>
              )}

              {hasTimedOut ? (
                <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-semibold">Thanh toán đã hết thời gian</p>
                      <p className="text-red-700 text-sm mt-1">
                        Hãy thục hiện thanh toán lại từ đầu hoặc liên hệ hỗ trợ nếu cần giúp đỡ.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <button
                          onClick={() => navigate('/booking', { replace: true })}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                          Quay lại đặt dịch vụ
                        </button>
                        <button
                          onClick={() => navigate('/', { replace: true })}
                          className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                          Về trang chủ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
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
                </>
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
