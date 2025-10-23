import React from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

interface PaymentStatusHeaderProps {
  status: "success" | "failed" | "pending";
  countdown?: number;
}

const PaymentStatusHeader: React.FC<PaymentStatusHeaderProps> = ({
  status,
  countdown,
}) => {
  return (
    <div
      className={`px-8 py-12 text-center ${
        status === "success"
          ? "bg-gradient-to-br from-green-50 to-emerald-50"
          : "bg-gradient-to-br from-red-50 to-pink-50"
      }`}
    >
      <div
        className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
          status === "success"
            ? "bg-green-100 text-green-500"
            : "bg-red-100 text-red-500"
        }`}
      >
        {status === "success" ? (
          <FiCheckCircle className="w-10 h-10" />
        ) : (
          <FiXCircle className="w-10 h-10" />
        )}
      </div>

      <h1
        className={`text-3xl font-bold mb-3 ${
          status === "success" ? "text-green-800" : "text-red-800"
        }`}
      >
        {status === "success"
          ? "Thanh toán thành công!"
          : "Thanh toán thất bại!"}
      </h1>

      <p className="text-gray-600 text-lg">
        {status === "success"
          ? "Cảm ơn bạn đã tin tưởng dịch vụ PawNest"
          : "Đã xảy ra lỗi trong quá trình thanh toán"}
      </p>

      {status === "success" && countdown !== undefined && (
        <div className="mt-4 text-sm text-green-700 bg-green-100 rounded-lg px-4 py-2 inline-block">
          Tự động chuyển về trang chủ sau {countdown} giây
        </div>
      )}
    </div>
  );
};

export default PaymentStatusHeader;
