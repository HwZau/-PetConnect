/* ===================================
 * PAYMENT DATA INTERFACES
 * ================================= */

export interface CardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
}

export interface PaymentMethod {
  id: string;
  type: "credit_card" | "debit_card" | "paypal" | "bank_transfer";
  name: string;
  icon?: string;
  isDefault?: boolean;
  cardData?: CardData;
}

export interface Transaction {
  id: string;
  bookingId?: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: PaymentMethod;
  createdAt: Date;
  completedAt?: Date;
  description?: string;
}

export interface PromoCode {
  code: string;
  discount: number;
  type: "percentage" | "fixed_amount";
  isValid: boolean;
  expiresAt?: Date;
  description?: string;
}

export interface OrderSummaryItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

export interface PaymentBookingData {
  totalPrice?: number; // Total price from booking API
  freelancer: {
    id: string;
    name: string;
    rating: number;
    avatar: string;
    location: string;
  };
  service?: string; // Deprecated - for backward compatibility
  serviceIds?: string[]; // New - support multiple services
  petInfo: Array<{
    petType: string;
    petName: string;
    petSize: string;
    duration: string;
  }>;
  dateTime: {
    date: string;
    time: string;
    recurringService: boolean;
    frequency?: string;
  };
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  specialRequests?: string;
}

export interface PaymentStatusData {
  status: "success" | "failed" | "pending";
  bookingData: PaymentBookingData;
  totalAmount: number;
  paymentMethod: string;
  transactionId: string;
  errorMessage?: string;
}
