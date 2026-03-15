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
  const [statusData, setStatusData] = useState<PaymentStatusData | undefined>(
    initialState
  );
  const [transactionTime, setTransactionTime] = useState<string | undefined>(
    undefined
  );
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveFromServer = async () => {
      try {
        // Parse PayOS callback parameters from URL
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get("code");
        const status = searchParams.get("status");
        const orderCode = searchParams.get("orderCode");
        const cancel = searchParams.get("cancel");
        const id = searchParams.get("id"); // Payment ID from PayOS

        console.log("PayOS Callback params:", {
          code,
          status,
          orderCode,
          cancel,
          id,
        });

        // Determine payment status from PayOS params
        let paymentStatus: "success" | "failed" | "pending" = "pending";
        if (cancel === "true" || status === "CANCELLED") {
          paymentStatus = "failed";
        } else if (status === "PAID" || code === "00") {
          paymentStatus = "success";
        } else if (status === "PENDING") {
          paymentStatus = "pending";
        }

        const bookingId = localStorage.getItem("last_payment_booking_id");
        const paymentId = id || localStorage.getItem("last_payment_id");

        console.log("Fetching payment details:", { bookingId, paymentId });

        let detail: PaymentDetailResponse | null = null;

        // Try to get payment detail from backend
        try {
          if (bookingId) {
            detail = await paymentService.getPaymentByBooking(bookingId);
            console.log("Payment detail from booking:", detail);
          } else if (paymentId) {
            detail = await paymentService.getPaymentById(paymentId);
            console.log("Payment detail from paymentId:", detail);
          }
        } catch (apiError) {
          console.error("Failed to fetch payment details from API:", apiError);
          // Continue with URL params if API fails
        }

        if (detail) {
          const normalized = String(detail.status || "").toLowerCase();
          const isSuccess = ["success", "completed", "paid", "true"].some((k) =>
            normalized.includes(k)
          );
          const isFailed = [
            "failed",
            "canceled",
            "cancelled",
            "error",
            "false",
          ].some((k) => normalized.includes(k));

          // Override with API status if available
          if (isSuccess) paymentStatus = "success";
          if (isFailed) paymentStatus = "failed";

          console.log("Final payment status:", paymentStatus);

          const resolved: PaymentStatusData = {
            status: paymentStatus,
            bookingData: initialState?.bookingData || ({} as any),
            totalAmount: Number(
              detail.amount ?? initialState?.totalAmount ?? 0
            ),
            paymentMethod: "PayOS",
            transactionId:
              orderCode ||
              detail.paymentId ||
              initialState?.transactionId ||
              `TXN${Date.now()}`,
          };
          setStatusData(resolved);
          setTransactionTime(detail.updatedAt || detail.createdAt);
        } else {
          // No detail from API, use URL params
          console.log("Using URL params for payment status:", paymentStatus);
          const resolved: PaymentStatusData = {
            status: paymentStatus,
            bookingData: initialState?.bookingData || ({} as any),
            totalAmount: initialState?.totalAmount ?? 0,
            paymentMethod: "PayOS",
            transactionId:
              orderCode ||
              paymentId ||
              initialState?.transactionId ||
              `TXN${Date.now()}`,
          };
          setStatusData(resolved);
        }
      } catch (e) {
        console.error("Error resolving payment status:", e);
        // fallback to initial state
        setStatusData(
          initialState || {
            status: "failed",
            bookingData: {} as any,
            totalAmount: 0,
            paymentMethod: "PayOS",
            transactionId: `TXN${Date.now()}`,
          }
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialState || initialState.status === "pending") {
      resolveFromServer();
    } else {
      setStatusData(initialState);
      setIsLoading(false);
    }
  }, [initialState, location.search]);

  // Separate useEffect for countdown to avoid race condition
  useEffect(() => {
    if (statusData?.status === "success" && !isLoading) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/profile"); // Redirect to profile/bill page
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [statusData?.status, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang xử lý thanh toán...</p>
        </div>
      </div>
    );
  }

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
        title: "Pet Connect - Hóa đơn thanh toán",
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
