import {
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info" | "success";
  showIcon?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  type = "warning",
  showIcon = true,
}: ConfirmDialogProps) => {
  const typeConfig = {
    danger: {
      icon: FaExclamationTriangle,
      iconColor: "text-red-600",
      iconBg: "bg-gradient-to-br from-red-50 to-red-100",
      iconRing: "ring-4 ring-red-100",
      buttonColor:
        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      headerGradient: "bg-gradient-to-r from-red-50 to-pink-50",
    },
    warning: {
      icon: FaExclamationTriangle,
      iconColor: "text-yellow-600",
      iconBg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      iconRing: "ring-4 ring-yellow-100",
      buttonColor:
        "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
      headerGradient: "bg-gradient-to-r from-yellow-50 to-orange-50",
    },
    info: {
      icon: FaInfoCircle,
      iconColor: "text-teal-600",
      iconBg: "bg-gradient-to-br from-teal-50 to-teal-100",
      iconRing: "ring-4 ring-teal-100",
      buttonColor:
        "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
      headerGradient: "bg-gradient-to-r from-teal-50 to-cyan-50",
    },
    success: {
      icon: FaCheckCircle,
      iconColor: "text-green-600",
      iconBg: "bg-gradient-to-br from-green-50 to-green-100",
      iconRing: "ring-4 ring-green-100",
      buttonColor:
        "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      headerGradient: "bg-gradient-to-r from-green-50 to-emerald-50",
    },
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay with blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-all duration-300"
        onClick={onCancel}
      />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative w-full max-w-md transform transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with gradient */}
            <div className={`relative ${config.headerGradient} px-6 pt-8 pb-6`}>
              {/* Close Button */}
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-all duration-200 group"
                aria-label="Đóng"
              >
                <FiX className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>

              {/* Icon and Title */}
              <div className="flex flex-col items-center text-center">
                {showIcon && (
                  <div
                    className={`w-16 h-16 ${config.iconBg} ${config.iconRing} rounded-2xl flex items-center justify-center mb-4 transform transition-transform duration-300 hover:scale-110`}
                  >
                    <IconComponent className={`text-3xl ${config.iconColor}`} />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <p className="text-gray-600 text-center leading-relaxed text-base">
                {message}
              </p>
            </div>

            {/* Footer with buttons */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 active:scale-95 transition-all duration-200 border border-gray-200"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-6 py-3.5 ${config.buttonColor} text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 transform`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
