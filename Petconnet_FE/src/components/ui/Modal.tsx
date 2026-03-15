import type { ReactNode } from "react";
import { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

/**
 * Universal Modal Component Props
 * Có thể tái sử dụng cho mọi modal trong app
 */
interface ModalProps {
  // Core props
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;

  // Size & Layout
  size?: "sm" | "md" | "lg" | "xl" | "full";
  maxWidth?: string; // Custom max-width, override size

  // Header customization
  showHeader?: boolean;
  showCloseButton?: boolean;
  headerContent?: ReactNode; // Custom header content
  headerClassName?: string;

  // Footer
  footer?: ReactNode;
  footerClassName?: string;

  // Behavior
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;

  // Styling
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;

  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  maxWidth,
  showHeader = true,
  showCloseButton = true,
  headerContent,
  headerClassName = "",
  footer,
  footerClassName = "",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventScroll = true,
  className = "",
  contentClassName = "",
  overlayClassName = "",
  ariaLabel,
  ariaDescribedBy,
}: ModalProps) => {
  // Size mapping
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full mx-4",
  };

  const modalWidth = maxWidth || sizeClasses[size];

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (!isOpen || !preventScroll) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, preventScroll]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby={title ? "modal-title" : ariaLabel}
      aria-describedby={ariaDescribedBy}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${overlayClassName}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      ></div>

      {/* Modal Panel */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={`relative w-full ${modalWidth} bg-white rounded-2xl shadow-xl transform transition-all ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {showHeader && (
            <div
              className={`flex items-center justify-between p-6 border-b ${headerClassName}`}
            >
              {headerContent || (
                <h3
                  id="modal-title"
                  className="text-xl font-semibold text-gray-800"
                >
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Đóng"
                >
                  <AiOutlineClose className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className={`p-6 ${contentClassName}`}>{children}</div>

          {/* Footer */}
          {footer && (
            <div
              className={`flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl ${footerClassName}`}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
