import { toast, type ToastOptions } from "react-toastify";

/**
 * Toast utility functions with pre-configured options for Pet Connect
 */

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Success toast notification
 * @param message - Success message to display
 * @param options - Optional toast configuration
 */
export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Error toast notification
 * @param message - Error message to display
 * @param options - Optional toast configuration
 */
export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Warning toast notification
 * @param message - Warning message to display
 * @param options - Optional toast configuration
 */
export const showWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Info toast notification
 * @param message - Info message to display
 * @param options - Optional toast configuration
 */
export const showInfo = (message: string, options?: ToastOptions) => {
  toast.info(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Loading toast notification with promise
 * @param promise - Promise to track
 * @param messages - Success, error, and pending messages
 */
export const showPromise = <T>(
  promise: Promise<T>,
  messages: {
    pending: string;
    success: string;
    error: string;
  },
  options?: ToastOptions
) => {
  return toast.promise(promise, messages, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Custom toast with any content
 * @param message - Message to display
 * @param options - Toast configuration
 */
export const showToast = (message: string, options?: ToastOptions) => {
  toast(message, {
    ...defaultOptions,
    ...options,
  });
};

// Export toast instance for advanced usage
export { toast };
