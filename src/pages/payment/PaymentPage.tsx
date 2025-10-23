import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import {
  PaymentMethodSelector,
  PaymentCardForm,
  PromoCodeSection,
  OrderSummary,
} from "../../components/payment";
import { ServiceManager } from "../../services/booking/serviceManager";
import { showSuccess, showError, showPromise } from "../../utils";
import type { PaymentBookingData } from "../../types";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData as PaymentBookingData;

  const [paymentMethod, setPaymentMethod] = useState<
    "vnpay" | "bank" | "wallet"
  >("vnpay");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  useEffect(() => {
    if (!bookingData) {
      navigate("/booking", { replace: true });
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

  const calculateTotal = () => {
    const petSizes = bookingData.petInfo.map((pet) => pet.petSize);
    return ServiceManager.calculateTotalPrice(
      bookingData.service,
      bookingData.petInfo.length,
      petSizes,
      bookingData.dateTime.recurringService
    );
  };

  const handlePayment = async () => {
    if (paymentMethod === "bank" && showCardForm) {
      // Validate card data
      if (
        !cardData.cardNumber ||
        !cardData.expiryDate ||
        !cardData.cvv ||
        !cardData.cardHolder
      ) {
        showError("Vui lòng điền đầy đủ thông tin thẻ");
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Create payment promise for toast
      const paymentPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          const isSuccess = Math.random() > 0.2; // 80% success rate
          if (isSuccess) {
            resolve("success");
          } else {
            reject(new Error("Payment failed"));
          }
        }, 2000);
      });

      // Show promise toast
      await showPromise(paymentPromise, {
        pending: "Đang xử lý thanh toán...",
        success: "Thanh toán thành công! 🎉",
        error: "Thanh toán thất bại. Vui lòng thử lại.",
      });

      // Navigate to success page
      navigate("/payment-status", {
        state: {
          status: "success",
          bookingData,
          totalAmount: calculateTotal(),
          paymentMethod,
          transactionId: `TXN${Date.now()}`,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Navigate to failed page
      navigate("/payment-status", {
        state: {
          status: "failed",
          bookingData,
          totalAmount: calculateTotal(),
          paymentMethod,
          transactionId: `TXN${Date.now()}`,
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePromoCodeApply = () => {
    if (!promoCode.trim()) {
      showError("Vui lòng nhập mã giảm giá");
      return;
    }

    // Simulate promo code validation
    const validCodes = ["PAWNEST20", "FIRSTTIME", "STUDENT15"];

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
              onShowCardForm={setShowCardForm}
            />

            <PaymentCardForm
              cardData={cardData}
              onCardDataChange={handleCardInputChange}
              isVisible={showCardForm && paymentMethod === "bank"}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
