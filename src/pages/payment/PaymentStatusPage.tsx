import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { PaymentStatusData } from "../../types";
import {
  PaymentStatusHeader,
  TransactionDetails,
  BookingDetails,
  PaymentStatusActions,
} from "../../components/payment";
import { paymentService } from "../../services/payment/paymentService";
import type { PaymentDetailResponse } from "../../services/payment/paymentService";

const PaymentStatusPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialState = location.state as PaymentStatusData | undefined;
  const [statusData, setStatusData] = useState<PaymentStatusData | undefined>(initialState);
  const [transactionTime, setTransactionTime] = useState<string | undefined>(undefined);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const resolveFromServer = async () => {
      try {
        const bookingId = localStorage.getItem("last_payment_booking_id");
        const paymentId = localStorage.getItem("last_payment_id");
        let detail: PaymentDetailResponse | null = null;
        if (bookingId) {
          detail = await paymentService.getPaymentByBooking(bookingId);
        } else if (paymentId) {
          detail = await paymentService.getPaymentById(paymentId);
        }
        if (detail) {
          const normalized = String(detail.status || "").toLowerCase();
          const isSuccess = ["success", "completed", "paid"].some((k) => normalized.includes(k));
          const isFailed = ["failed", "canceled", "cancelled", "error"].some((k) => normalized.includes(k));
          const resolved: PaymentStatusData = {
            status: isSuccess ? "success" : isFailed ? "failed" : "pending",
            bookingData: initialState?.bookingData || ({} as any),
            totalAmount: Number(detail.amount ?? initialState?.totalAmount ?? 0),
            paymentMethod: String(detail.method ?? initialState?.paymentMethod ?? "vnpay"),
            transactionId: detail.paymentId || initialState?.transactionId || `TXN${Date.now()}`,
          };
          setStatusData(resolved);
          setTransactionTime(detail.updatedAt || detail.createdAt);
        }
      } catch (e) {
        // fallback to initial state
        setStatusData(initialState);
      }
    };

    if (!initialState || initialState.status === "pending") {
      resolveFromServer();
    } else {
      setStatusData(initialState);
    }

    if (statusData?.status === "success") {
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
  }, [initialState, statusData?.status, navigate]);

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
            timestamp={transactionTime}
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
