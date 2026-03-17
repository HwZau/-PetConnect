import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import {
  PaymentMethodSelector,
  PromoCodeSection,
  OrderSummary,
} from "../../components/payment";
import { ServiceManager } from "../../services/booking/serviceManager";
import {
  paymentService,
  PaymentMethodCode,
} from "../../services/payment/paymentService";
// import { apiClient } from "../../services/apiClient"; // Commented - not needed for PayOS
// import { API_ENDPOINTS } from "../../config/api"; // Commented - not needed for PayOS
import { showSuccess, showError } from "../../utils";
import type { PaymentBookingData } from "../../types";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData as PaymentBookingData;

  const [paymentMethod, setPaymentMethod] = useState<"momo" | "vnpay">("momo");
  const [promoCode, setPromoCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!bookingData) {
      navigate("/booking", { replace: true });
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

  const calculateTotal = () => {
    // Priority 1: Use totalPrice from location.state (from booking API)
    if (location.state?.totalPrice) {
      return Number(location.state.totalPrice);
    }

    // Priority 2: Use totalPrice from bookingData
    if (bookingData.totalPrice) {
      return Number(bookingData.totalPrice);
    }

    // Priority 3: Fallback to ServiceManager calculation (for old bookings)
    const petSizes = bookingData.petInfo.map((pet) => pet.petSize);

    if (bookingData.serviceIds && bookingData.serviceIds.length > 0) {
      return ServiceManager.calculateMultiServiceTotalPrice(
        bookingData.serviceIds,
        bookingData.petInfo.length,
        petSizes,
        bookingData.dateTime.recurringService
      );
    } else if (bookingData.service) {
      return ServiceManager.calculateTotalPrice(
        bookingData.service,
        bookingData.petInfo.length,
        petSizes,
        bookingData.dateTime.recurringService
      );
    }

    return 0;
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Validate bookingId exists
      if (!location.state?.bookingId) {
        showError("Không tìm thấy mã đặt dịch vụ. Vui lòng thử lại.");
        return;
      }

      const methodCode =
        paymentMethod === "momo"
          ? PaymentMethodCode.MOMO
          : PaymentMethodCode.VNPAY;

      const description =
        paymentMethod === "momo"
          ? "Thanh toán qua ví MoMo"
          : "Thanh toán qua VNPAY";

      const paymentPayload = {
        bookingId: location.state.bookingId,
        method: methodCode,
        returnUrl: `${window.location.origin}/payment-success`,
        description,
      };

      console.log("Creating payment with payload:", paymentPayload);

      const paymentRes = await paymentService.createPayment(paymentPayload);

      // Persist payment info so refresh won't break the instructions
      const storedPaymentData = {
        bookingId: location.state.bookingId,
        paymentId: paymentRes.paymentId,
        paymentMethod,
        totalAmount: calculateTotal(),
        manualPayment: true,
        accountInfo: {
          type:
            paymentRes.methodName ||
            (paymentMethod === "momo" ? "MoMo" : "VNPAY"),
          number: paymentRes.accountNumber,
          name: paymentRes.recipientName || "Nguyễn Hữu Giàu",
        },
        qrData: paymentRes.qrData,
      };

      localStorage.setItem(
        "last_manual_payment_data",
        JSON.stringify(storedPaymentData)
      );

      navigate("/payment-success", {
        state: storedPaymentData,
      });
    } catch (error: any) {
      showError(error.message || "Tạo thanh toán thất bại");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePromoCodeApply = () => {
    if (!promoCode.trim()) {
      showError("Vui lòng nhập mã giảm giá");
      return;
    }

    // Simulate promo code validation
    const validCodes = ["PETCONNECT20", "FIRSTTIME", "STUDENT15"];

    if (validCodes.includes(promoCode.toUpperCase())) {
      showSuccess(`Áp dụng mã giảm giá "${promoCode}" thành công! 🎉`);
    } else {
      showError("Mã giảm giá không hợp lệ hoặc đã hết hạn");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Back Button */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 backdrop-blur-sm"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Quay lại</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Thanh toán</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hoàn tất đặt dịch vụ chăm sóc thú cưng của bạn
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />

            <PromoCodeSection
              promoCode={promoCode}
              onPromoCodeChange={setPromoCode}
              onApplyPromoCode={handlePromoCodeApply}
            />
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              bookingData={bookingData}
              onPayment={handlePayment}
              isProcessing={isProcessing}
              totalPrice={calculateTotal()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
