import React, { useState } from "react";
import { FaTimes, FaCrown, FaCheck } from "react-icons/fa";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (plan: "monthly" | "yearly") => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "yearly"
  );

  if (!isOpen) return null;

  const plans = {
    monthly: {
      price: "299.000",
      period: "tháng",
      total: "299.000đ",
      save: null,
    },
    yearly: {
      price: "249.000",
      period: "tháng",
      total: "2.990.000đ",
      save: "Tiết kiệm 17%",
    },
  };

  const features = [
    "Giảm 20% cho tất cả dịch vụ chăm sóc",
    "Huy hiệu VIP độc quyền trên hồ sơ",
    "Đặt lịch ưu tiên, không giới hạn",
    "Quà tặng hàng tháng cho thú cưng",
    "Tích điểm gấp đôi mỗi lần sử dụng",
    "Tư vấn sức khỏe thú cưng miễn phí",
    "Giao hàng miễn phí toàn quốc",
    "Hỗ trợ khẩn cấp 24/7",
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <FaCrown className="text-3xl" />
            <h2 className="text-2xl font-bold">Nâng cấp lên Premium</h2>
          </div>
          <p className="text-teal-50">
            Mở khóa toàn bộ tính năng và phát triển sự nghiệp
          </p>
        </div>

        <div className="p-6">
          {/* Plan Selection */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedPlan === "monthly"
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-teal-300"
              }`}
            >
              <div className="text-left">
                <div className="text-sm text-gray-600 mb-1">Gói tháng</div>
                <div className="text-2xl font-bold text-gray-800">
                  {plans.monthly.price}đ
                  <span className="text-sm font-normal text-gray-500">
                    /tháng
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Thanh toán hàng tháng
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`p-4 rounded-xl border-2 transition-all relative ${
                selectedPlan === "yearly"
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-teal-300"
              }`}
            >
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Tiết kiệm nhất
              </span>
              <div className="text-left">
                <div className="text-sm text-gray-600 mb-1">Gói năm</div>
                <div className="text-2xl font-bold text-gray-800">
                  {plans.yearly.price}đ
                  <span className="text-sm font-normal text-gray-500">
                    /tháng
                  </span>
                </div>
                <div className="text-sm text-teal-600 font-medium mt-1">
                  {plans.yearly.save} - Chỉ {plans.yearly.total}/năm
                </div>
              </div>
            </button>
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Tính năng Premium bao gồm:
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <FaCheck className="text-teal-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">
                Tổng thanh toán:
              </span>
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600">
                  {plans[selectedPlan].total}
                </div>
                <div className="text-xs text-gray-600">
                  {selectedPlan === "yearly"
                    ? "Thanh toán một lần/năm"
                    : "Hàng tháng"}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Để sau
            </button>
            <button
              onClick={() => onConfirm(selectedPlan)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              Xác nhận nâng cấp
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Bạn có thể hủy đăng ký bất cứ lúc nào. Không có phí ẩn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
