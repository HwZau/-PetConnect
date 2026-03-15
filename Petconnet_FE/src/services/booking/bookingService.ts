import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../../config/api";

// Helper function to convert PickUpTime enum to number for API
const convertPickUpTimeToNumber = (pickUpTime: string): number => {
  const timeMap: Record<string, number> = {
    Slot1: 0,
    Slot2: 1,
    Slot3: 2,
    Slot4: 3,
    Slot5: 4,
  };
  return timeMap[pickUpTime] ?? 0;
};

export interface CreateBookingRequest {
  pickUpTime: number; // 0-4 for Slot1-Slot5
  bookingDate: string; // YYYY-MM-DD
  serviceIds: string[]; // Array of service IDs
  freelancerId: string;
  petIds: string[]; // Array of pet IDs
}

export interface CreateBookingResponse {
  bookingId: string;
  pickUpTime: number;
  bookingDate: string;
  serviceIds: string[];
  freelancerId: string;
  petIds: string[];
  bookingStatus: string;
  pickUpStatus: string;
  createdAt: string;
  updatedAt: string;
  totalPrice?: number;
}

/**
 * Check if user already has a booking for the given services and date
 */
export const checkDuplicateBooking = async (
  serviceIds: string[],
  bookingDate: string,
  freelancerId: string
): Promise<boolean> => {
  try {
    const bookings = await getUserBookings();

    // Check if any existing booking matches
    const hasDuplicate = bookings.some((booking) => {
      // Check if booking date matches
      if (booking.bookingDate !== bookingDate) return false;

      // Check if freelancer matches
      if (booking.freelancerId !== freelancerId) return false;

      // Check if any service overlaps
      const hasOverlappingService = serviceIds.some((serviceId) =>
        booking.serviceIds.includes(serviceId)
      );

      return hasOverlappingService;
    });

    return hasDuplicate;
  } catch (error) {
    console.error("Error checking duplicate booking:", error);
    return false; // If check fails, allow user to proceed (backend will validate)
  }
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData: {
  pickUpTime: string; // Slot1, Slot2, etc.
  bookingDate: string;
  serviceIds: string[];
  freelancerId: string;
  petIds: string[];
}): Promise<CreateBookingResponse> => {
  // Convert pickUpTime from "Slot1" to number (0-4)
  const pickUpTimeNumber = convertPickUpTimeToNumber(bookingData.pickUpTime);

  // Prepare data directly (no wrapper)
  const data: CreateBookingRequest = {
    pickUpTime: pickUpTimeNumber,
    bookingDate: bookingData.bookingDate,
    serviceIds: bookingData.serviceIds,
    freelancerId: bookingData.freelancerId,
    petIds: bookingData.petIds,
  };

  console.log("Sending booking data:", JSON.stringify(data, null, 2));

  const response = await apiClient.post<CreateBookingResponse>(
    API_ENDPOINTS.BOOKINGS.CREATE,
    data
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to create booking");
  }

  return response.data;
};

/**
 * Get booking by ID
 */
export const getBookingById = async (
  bookingId: string
): Promise<CreateBookingResponse> => {
  const response = await apiClient.get<CreateBookingResponse>(
    API_ENDPOINTS.BOOKINGS.DETAIL(bookingId)
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to get booking");
  }

  return response.data;
};

/**
 * Get user's bookings
 */
export const getUserBookings = async (): Promise<CreateBookingResponse[]> => {
  const response = await apiClient.get<CreateBookingResponse[]>(
    API_ENDPOINTS.BOOKINGS.USER_BOOKINGS
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to get user bookings");
  }

  return response.data;
};

/**
 * Get current user's booking history (optimized API)
 */
export const getMyBookingHistory = async (): Promise<any[]> => {
  const response = await apiClient.get<any>(
    API_ENDPOINTS.BOOKINGS.MY_HISTORY
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to get booking history");
  }

  // Backend returns { bookings: [...] }, so extract the bookings array
  return response.data.bookings || [];
};

/**
 * Get booking details with full information (payment, services, pets)
 */
export const getBookingDetails = async (bookingId: string): Promise<any> => {
  const response = await apiClient.get<any>(
    API_ENDPOINTS.BOOKINGS.DETAIL_FULL(bookingId)
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to get booking details");
  }

  return response.data;
};

/**
 * Cancel booking
 */
export const cancelBooking = async (bookingId: string): Promise<void> => {
  const response = await apiClient.put<void>(
    API_ENDPOINTS.BOOKINGS.CANCEL(bookingId)
  );

  if (!response.success) {
    throw new Error(response.error || "Failed to cancel booking");
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (
  bookingId: string,
  status: number
): Promise<void> => {
  const response = await apiClient.put<void>(
    `${API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(bookingId)}?status=${status}`,
    {} // Empty body
  );

  if (!response.success) {
    throw new Error(response.error || "Failed to update booking status");
  }
};

/**
 * Update pickup status
 */
export const updatePickUpStatus = async (
  bookingId: string,
  status: number
): Promise<void> => {
  const response = await apiClient.put<void>(
    `${API_ENDPOINTS.BOOKINGS.UPDATE_PICKUP_STATUS(
      bookingId
    )}?status=${status}`,
    {} // Empty body
  );

  if (!response.success) {
    throw new Error(response.error || "Failed to update pickup status");
  }
};

export interface PaginatedBookingsResponse {
  bookings: CreateBookingResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get customer bookings with pagination
 */
export const getCustomerBookings = async (
  customerId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedBookingsResponse> => {
  const response = await apiClient.get<PaginatedBookingsResponse>(
    API_ENDPOINTS.BOOKINGS.CUSTOMER_BOOKINGS(customerId, page, limit)
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to get customer bookings");
  }

  return response.data;
};

/**
 * Get freelancer bookings with pagination
 */
export const getFreelancerBookings = async (
  freelancerId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedBookingsResponse> => {
  const response = await apiClient.get<PaginatedBookingsResponse>(
    API_ENDPOINTS.BOOKINGS.FREELANCER_BOOKINGS(freelancerId, page, limit)
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to get freelancer bookings");
  }

  return response.data;
};

export const bookingService = {
  createBooking,
  getBookingById,
  getUserBookings,
  getMyBookingHistory,
  getBookingDetails,
  cancelBooking,
  checkDuplicateBooking,
  updateBookingStatus,
  updatePickUpStatus,
  getCustomerBookings,
  getFreelancerBookings,
};
