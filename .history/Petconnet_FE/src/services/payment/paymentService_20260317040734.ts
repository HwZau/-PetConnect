import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../../config/api";

export enum PaymentMethodCode {
  MOMO = 2,
  VNPAY = 3
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
  methodName?: string;
  accountNumber?: string;
  recipientName?: string;
  qrData?: string;
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

export const confirmPayment = async (
  paymentId: string
): Promise<PaymentDetailResponse> => {
  const response = await apiClient.post<PaymentDetailResponse>(
    API_ENDPOINTS.PAYMENT.CONFIRM(paymentId)
  );
  if (!response.success || !response.data) {
    throw new Error(response.error || "Không thể xác nhận thanh toán");
  }

  // API returns { payment } for confirmation endpoint
  const payload = (response.data as any).payment || response.data;
  return payload;
};

export const paymentService = {
  createPayment,
  getPaymentByBooking,
  getPaymentById,
  cancelPayment,
  getPaymentStatus,
  confirmPayment,
  extractRedirectUrl,
};
