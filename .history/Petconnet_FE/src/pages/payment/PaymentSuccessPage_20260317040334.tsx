import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { FiCheckCircle, FiDownload, FiHome, FiFileText, FiCreditCard } from "react-icons/fi";
import { paymentService } from "../../services/payment/paymentService";
import type { PaymentDetailResponse } from "../../services/payment/paymentService";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [paymentDetail, setPaymentDetail] =
    useState<PaymentDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if this is a manual payment
  const manualPayment = location.state?.manualPayment;
  const accountInfo = location.state?.accountInfo;
  const paymentMethod = location.state?.paymentMethod;

  useEffect(() => {
    // Skip fetching for manual payments
    if (manualPayment) {
      setIsLoading(false);
      return;
    }

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
  }, [searchParams, manualPayment]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce">
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {manualPayment ? "Đặt dịch vụ thành công!" : "Thanh toán thành công!"} 🎉
          </h1>
          <p className="text-lg text-gray-600">
            {manualPayment
              ? "Vui lòng chuyển khoản theo thông tin bên dưới"
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
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <FiCreditCard className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-semibold text-yellow-800">Hướng dẫn chuyển khoản</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  Vui lòng chuyển khoản theo thông tin bên dưới. Sau khi chuyển khoản thành công,
                  hệ thống sẽ xác nhận và kích hoạt dịch vụ của bạn trong vòng 24 giờ.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-4">Thông tin tài khoản</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Ngân hàng:</span>
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
