import React from "react";
import { FiCreditCard, FiShield } from "react-icons/fi";

interface PaymentMethodSelectorProps {
  paymentMethod: "vnpay" | "bank" | "wallet";
  onPaymentMethodChange: (method: "vnpay" | "bank" | "wallet") => void;
  onShowCardForm: (show: boolean) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  onPaymentMethodChange,
  onShowCardForm,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FiCreditCard className="mr-3 text-blue-500" />
        Chọn phương thức thanh toán
      </h2>

      <div className="space-y-4">
        {/* VNPay */}
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="vnpay"
            checked={paymentMethod === "vnpay"}
            onChange={(e) => {
              onPaymentMethodChange(e.target.value as "vnpay");
              onShowCardForm(false);
            }}
            className="mr-4"
          />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">VNP</span>
              </div>
              <div>
                <p className="font-semibold">VNPay</p>
                <p className="text-sm text-gray-600">Thanh toán qua VNPay QR</p>
              </div>
            </div>
            <FiShield className="text-green-500" />
          </div>
        </label>

        {/* Các phương thức khác đã tạm thời ẩn */}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
