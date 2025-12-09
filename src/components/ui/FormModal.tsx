import type { ReactNode, FormEvent } from "react";
import Modal from "./Modal";

/**
 * Form Modal Component
 * Modal chuyên dụng cho forms với submit/cancel actions
 */
interface FormModalProps {
  // Modal props
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";

  // Form props
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  isValid?: boolean;

  // Styling
  submitButtonClassName?: string;
  cancelButtonClassName?: string;
}

const FormModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  onSubmit,
  submitText = "Lưu",
  cancelText = "Hủy",
  isSubmitting = false,
  isValid = true,
  submitButtonClassName,
  cancelButtonClassName,
}: FormModalProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className={
          cancelButtonClassName ||
          "px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        }
      >
        {cancelText}
      </button>
      <button
        type="submit"
        form="modal-form"
        disabled={isSubmitting || !isValid}
        className={
          submitButtonClassName ||
          "px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        }
      >
        {isSubmitting ? "Đang xử lý..." : submitText}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={footer}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
      footerClassName="flex gap-3"
    >
      <form id="modal-form" onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
};

export default FormModal;
