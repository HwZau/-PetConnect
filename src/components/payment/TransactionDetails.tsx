import React from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

interface TransactionDetailsProps {
  transactionId: string;
  paymentMethod: string;
  totalAmount: number;
  status: "success" | "failed" | "pending";
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transactionId,
  paymentMethod,
  totalAmount,
  status,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getPaymentMethodName = (method: string) => {
    const methods = {
      vnpay: "VNPay",
      bank: "Thẻ tín dụng/ghi nợ",
      wallet: "Ví điện tử",
    };
    return methods[method as keyof typeof methods] || method;
  };

  return (
    <div className="px-8 py-6">
      <h2 className="text-xl font-semibold mb-6">Chi tiết giao dịch</h2>

      <div className="space-y-4">
        <div className="flex justify-between py-3 border-b border-gray-100">
          <span className="text-gray-600">Mã giao dịch</span>
          <span className="font-semibold font-mono">{transactionId}</span>
        </div>

        <div className="flex justify-between py-3 border-b border-gray-100">
          <span className="text-gray-600">Phương thức thanh toán</span>
          <span className="font-semibold">
            {getPaymentMethodName(paymentMethod)}
          </span>
        </div>

        <div className="flex justify-between py-3 border-b border-gray-100">
          <span className="text-gray-600">Số tiền</span>
          <span className="font-semibold text-lg text-blue-600">
            {formatPrice(totalAmount)}
          </span>
        </div>

        <div className="flex justify-between py-3 border-b border-gray-100">
          <span className="text-gray-600">Thời gian</span>
          <span className="font-semibold">
            {new Date().toLocaleString("vi-VN")}
          </span>
        </div>

        <div className="flex justify-between py-3">
          <span className="text-gray-600">Trạng thái</span>
          <span
            className={`font-semibold flex items-center ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status === "success" ? (
              <>
                <FiCheckCircle className="w-4 h-4 mr-1" />
                Thành công
              </>
            ) : (
              <>
                <FiXCircle className="w-4 h-4 mr-1" />
                Thất bại
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
