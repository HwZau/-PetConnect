import type {
  CardData,
  PaymentMethod,
  OrderSummaryItem,
  PromoCode,
  Transaction,
  PaymentBookingData,
} from "../domains/payment";

/* ===================================
 * PAYMENT COMPONENT PROPS
 * ================================= */

export interface PaymentCardFormProps {
  cardData: CardData;
  onCardDataChange: (field: keyof CardData, value: string) => void;
  isVisible: boolean;
  errors?: Partial<Record<keyof CardData, string>>;
}

export interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  availableMethods: PaymentMethod[];
  error?: string;
}

export interface PaymentStatusHeaderProps {
  status: "success" | "failed" | "pending";
  title?: string;
  subtitle?: string;
}

export interface PaymentStatusActionsProps {
  status: "success" | "failed" | "pending";
  onRetry?: () => void;
  onGoHome?: () => void;
  onViewBooking?: () => void;
  onDownloadReceipt?: () => void;
}

export interface OrderSummaryProps {
  items: OrderSummaryItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  currency?: string;
  promoCode?: PromoCode;
}

export interface PromoCodeSectionProps {
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onApplyPromoCode: () => void;
  isLoading?: boolean;
  error?: string;
  appliedDiscount?: number;
}

export interface BookingDetailsProps {
  bookingData: PaymentBookingData;
  showFreelancer?: boolean;
  showCustomer?: boolean;
  className?: string;
}

export interface TransactionDetailsProps {
  transaction: Transaction;
  showStatus?: boolean;
  showPaymentMethod?: boolean;
  className?: string;
}
