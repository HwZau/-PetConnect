import React from "react";
import { FiCreditCard, FiShield } from "react-icons/fi";

interface PaymentMethodSelectorProps {
  paymentMethod: "momo" | "vnpay" | "tpbank";
  onPaymentMethodChange: (method: "momo" | "vnpay" | "tpbank") => void;
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
                  Số điện thoại: 0834339521
                </p>
                <p className="text-sm text-gray-600">
                  Chủ tài khoản: Nguyễn Hữu Giàu
                </p>
              </div>
            </div>
            <FiShield className="text-green-500" />
          </div>
        </label>

        {/* TPBank */}
        <label className="flex items-center p-4 border-2 border-blue-500 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors bg-blue-50/50">
          <input
            type="radio"
            name="paymentMethod"
            value="tpbank"
            checked={paymentMethod === "tpbank"}
            onChange={(e) => onPaymentMethodChange(e.target.value as "tpbank")}
            className="mr-4"
          />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-xs">TPBANK</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Ngân hàng TPBank</p>
                <p className="text-sm text-gray-600">
                  Số tài khoản: 02600647401
                </p>
                <p className="text-sm text-gray-600">
                  Chủ tài khoản: richdesu
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
