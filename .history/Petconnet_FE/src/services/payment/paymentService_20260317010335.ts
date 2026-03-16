import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../../config/api";

export enum PaymentMethodCode {
  PAYOS = 0,
  BANK_TRANSFER = 1,
  MOMO = 2,
  // VNPAY = 0, // Commented - using PayOS
  // MOMO = 1,
}

export interface CreatePaymentRequest {
  bookingId: string;
  method: number;
  returnUrl: string;
  description?: string;
}

export interface CreatePaymentResponse {
  paymentId?: string;
  bookingId?: string;
  method?: number;
  status?: string;
  amount?: number;
  currency?: string;
  redirectUrl?: string;
  url?: string;
  paymentUrl?: string;
}

export interface PaymentDetailResponse {
  paymentId: string;
  bookingId: string;
  status: string;
  method: number;
  amount?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

const extractRedirectUrl = (
  data: CreatePaymentResponse
): string | undefined => {
  return data.redirectUrl || data.paymentUrl || data.url;
};

export const createPayment = async (
  payload: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  const response = await apiClient.post<CreatePaymentResponse>(
    API_ENDPOINTS.PAYMENT.CREATE,
    payload
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Không thể tạo thanh toán");
  }

  return response.data;
};

export const getPaymentByBooking = async (
  bookingId: string
): Promise<PaymentDetailResponse> => {
  const response = await apiClient.get<PaymentDetailResponse>(
    API_ENDPOINTS.PAYMENT.BY_BOOKING(bookingId)
  );

  if (!response.success || !response.data) {
    throw new Error(
      response.error || "Không thể lấy thông tin thanh toán theo booking"
    );
  }
  return response.data;
};

export const getPaymentById = async (
  paymentId: string
): Promise<PaymentDetailResponse> => {
  const response = await apiClient.get<PaymentDetailResponse>(
    API_ENDPOINTS.PAYMENT.DETAIL(paymentId)
  );
  if (!response.success || !response.data) {
    throw new Error(response.error || "Không thể lấy thông tin thanh toán");
  }
  return response.data;
};

export const cancelPayment = async (paymentId: string): Promise<void> => {
  const response = await apiClient.post<void>(
    API_ENDPOINTS.PAYMENT.CANCEL(paymentId)
  );
  if (!response.success) {
    throw new Error(response.error || "Không thể hủy thanh toán");
  }
};

export const getPaymentStatus = async (
  bookingId: string
): Promise<PaymentDetailResponse> => {
  const response = await apiClient.get<PaymentDetailResponse>(
    API_ENDPOINTS.PAYMENT.STATUS(bookingId)
  );
  if (!response.success || !response.data) {
    throw new Error(response.error || "Không thể lấy trạng thái thanh toán");
  }
  return response.data;
};

export const paymentService = {
  createPayment,
  getPaymentByBooking,
  getPaymentById,
  cancelPayment,
  getPaymentStatus,
  extractRedirectUrl,
};
