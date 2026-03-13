import React from "react";
import { FiHome, FiRefreshCw, FiDownload, FiShare2 } from "react-icons/fi";

interface PaymentStatusActionsProps {
  status: "success" | "failed" | "pending";
  onRetryPayment: () => void;
  onGoHome: () => void;
  onDownloadReceipt: () => void;
  onShareReceipt: () => void;
}

const PaymentStatusActions: React.FC<PaymentStatusActionsProps> = ({
  status,
  onRetryPayment,
  onGoHome,
  onDownloadReceipt,
  onShareReceipt,
}) => {
  return (
    <div className="px-8 py-6 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        {status === "success" ? (
          <>
            <button
              onClick={onGoHome}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiHome className="mr-2" />
              Về trang chủ
            </button>

            <button
              onClick={onDownloadReceipt}
              className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiDownload className="mr-2" />
              Tải hóa đơn
            </button>

            <button
              onClick={onShareReceipt}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiShare2 />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onRetryPayment}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiRefreshCw className="mr-2" />
              Thử lại thanh toán
            </button>

            <button
              onClick={onGoHome}
              className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiHome className="mr-2" />
              Về trang chủ
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusActions;
