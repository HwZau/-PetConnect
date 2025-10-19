import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { PaymentStatusData } from "../../types";
import {
  PaymentStatusHeader,
  TransactionDetails,
  BookingDetails,
  PaymentStatusActions,
} from "../../components/payment";

const PaymentStatusPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const statusData = location.state as PaymentStatusData;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!statusData) {
      navigate("/", { replace: true });
      return;
    }

    // Auto redirect after countdown for success
    if (statusData.status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [statusData, navigate]);

  if (!statusData) {
    return null;
  }

  const handleRetryPayment = () => {
    navigate("/payment", {
      state: {
        bookingData: statusData.bookingData,
      },
    });
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    alert("Tính năng tải xuống hóa đơn sẽ được triển khai sớm!");
  };

  const handleShareReceipt = () => {
    if (navigator.share) {
      navigator.share({
        title: "PawNest - Hóa đơn thanh toán",
        text: `Đã thanh toán thành công ${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(statusData.totalAmount)} cho dịch vụ chăm sóc thú cưng`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép liên kết!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <PaymentStatusHeader
            status={statusData.status}
            countdown={countdown}
          />

          <TransactionDetails
            transactionId={statusData.transactionId}
            paymentMethod={statusData.paymentMethod}
            totalAmount={statusData.totalAmount}
            status={statusData.status}
          />

          {statusData.status === "success" && (
            <BookingDetails
              bookingData={statusData.bookingData}
              isVisible={statusData.status === "success"}
            />
          )}

          <PaymentStatusActions
            status={statusData.status}
            onRetryPayment={handleRetryPayment}
            onDownloadReceipt={handleDownloadReceipt}
            onShareReceipt={handleShareReceipt}
            onGoHome={() => navigate("/")}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
