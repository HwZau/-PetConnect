import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiXCircle, FiRefreshCw, FiHome, FiPhone } from "react-icons/fi";

const PaymentFailurePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFailureDetails = async () => {
      try {
        const cancel = searchParams.get("cancel");
        const status = searchParams.get("status");
        const orderCode = searchParams.get("orderCode");
        const bookingId = localStorage.getItem("last_payment_booking_id");

        console.log("Payment Failure - Params:", {
          cancel,
          status,
          orderCode,
          bookingId,
        });

        // Determine error message
        if (cancel === "true") {
          setErrorMessage("Bạn đã hủy giao dịch");
        } else if (status === "CANCELLED") {
          setErrorMessage("Giao dịch bị hủy bởi hệ thống");
        } else {
          setErrorMessage("Thanh toán không thành công");
        }
      } catch (error) {
        console.error("Error processing failure:", error);
        setErrorMessage("Có lỗi xảy ra trong quá trình thanh toán");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFailureDetails();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang xử lý...</p>
        </div>
      </div>
    );
  }

  const handleRetryPayment = () => {
    const bookingId = localStorage.getItem("last_payment_booking_id");

    if (bookingId) {
      // Navigate back to payment page with booking data
      navigate("/payment", {
        state: {
          bookingId: bookingId,
          retry: true,
        },
      });
    } else {
      // If no booking found, go to booking page
      navigate("/booking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Failure Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
            <FiXCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Thanh toán thất bại
          </h1>
          <p className="text-lg text-gray-600">{errorMessage}</p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Thông tin giao dịch
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-semibold text-gray-900">
                {searchParams.get("orderCode") ||
                  localStorage.getItem("last_payment_booking_id") ||
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
                {new Date().toLocaleString("vi-VN")}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                <FiXCircle className="w-4 h-4 mr-1" />
                Thất bại
              </span>
            </div>
          </div>
        </div>

        {/* Reasons */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-3">
            ⚠️ Các lý do có thể:
          </h3>
          <ul className="text-sm text-yellow-800 space-y-2">
            <li>• Số dư tài khoản không đủ</li>
            <li>• Thông tin thẻ không chính xác</li>
            <li>• Giao dịch bị hủy bởi người dùng</li>
            <li>• Vượt quá hạn mức giao dịch</li>
            <li>• Lỗi kết nối với cổng thanh toán</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleRetryPayment}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw className="w-5 h-5 mr-2" />
            Thử lại
          </button>

          <button
            onClick={() => navigate("/support")}
            className="flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            <FiPhone className="w-5 h-5 mr-2" />
            Hỗ trợ
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            <FiHome className="w-5 h-5 mr-2" />
            Về trang chủ
          </button>
        </div>

        {/* Support Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💬 Cần hỗ trợ?</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>📞 Hotline: 1900-xxxx (24/7)</p>
            <p>📧 Email: support@pawnest.com</p>
            <p>💬 Chat: Nhấn vào biểu tượng chat góc dưới bên phải</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
