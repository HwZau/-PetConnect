import React from "react";
import { FiCreditCard, FiShield } from "react-icons/fi";

interface PaymentMethodSelectorProps {
  paymentMethod: "momo" | "vnpay";
  onPaymentMethodChange: (method: "momo" | "vnpay") => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  onPaymentMethodChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FiCreditCard className="mr-3 text-blue-500" />
        Chọn phương thức thanh toán
      </h2>

      <div className="space-y-4">
        {/* MoMo */}
        <label className="flex items-center p-4 border-2 border-pink-500 rounded-lg cursor-pointer hover:bg-pink-50 transition-colors bg-pink-50/50">
          <input
            type="radio"
            name="paymentMethod"
            value="momo"
            checked={paymentMethod === "momo"}
            onChange={(e) => onPaymentMethodChange(e.target.value as "momo")}
            className="mr-4"
          />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">MOMO</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Ví MoMo</p>
                <p className="text-sm text-gray-600">
                  Số điện thoại: 0834339521 - Nguyễn Hữu Giàu
                </p>
              </div>
            </div>
            <FiShield className="text-green-500" />
          </div>
        </label>

        {/* VNPAY */}
        <label className="flex items-center p-4 border-2 border-blue-500 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors bg-blue-50/50">
          <input
            type="radio"
            name="paymentMethod"
            value="vnpay"
            checked={paymentMethod === "vnpay"}
            onChange={(e) => onPaymentMethodChange(e.target.value as "vnpay")}
            className="mr-4"
          />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">VNPAY</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">VNPAY</p>
                <p className="text-sm text-gray-600">
                  Quét mã QR bằng ứng dụng ngân hàng của bạn
                </p>
              </div>
            </div>
            <FiShield className="text-green-500" />
          </div>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
