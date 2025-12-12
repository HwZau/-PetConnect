import React from "react";
import { FiCreditCard, FiShield } from "react-icons/fi";

interface PaymentMethodSelectorProps {
  paymentMethod: "payos" | "bank" | "wallet";
  onPaymentMethodChange: (method: "payos" | "bank" | "wallet") => void;
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
        {/* PayOS */}
        <label className="flex items-center p-4 border-2 border-teal-500 rounded-lg cursor-pointer hover:bg-teal-50 transition-colors bg-teal-50/50">
          <input
            type="radio"
            name="paymentMethod"
            value="payos"
            checked={paymentMethod === "payos"}
            onChange={(e) => {
              onPaymentMethodChange(e.target.value as "payos");
              onShowCardForm(false);
            }}
            className="mr-4"
          />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">PAY</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">PayOS</p>
                <p className="text-sm text-gray-600">
                  Thanh toán qua PayOS - Nhanh chóng & An toàn
                </p>
              </div>
            </div>
            <FiShield className="text-green-500" />
          </div>
        </label>

        {/* VNPay - Commented out */}
        {/* <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors opacity-50">
          <input type="radio" name="paymentMethod" value="vnpay" disabled className="mr-4" />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">VNP</span>
              </div>
              <div>
                <p className="font-semibold">VNPay (Tạm thời không khả dụng)</p>
                <p className="text-sm text-gray-600">Thanh toán qua VNPay QR</p>
              </div>
            </div>
          </div>
        </label> */}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
