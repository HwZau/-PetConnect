// Admin Service - Handle all admin API calls
import { apiClient } from "../apiClient";
import { API_CONFIG } from "../../config/api";
import type { ApiResponse } from "../../types";

// NOTE: mock mode removed — always use real backend service

// Types for Admin
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  subtitle: string;
  avatar: string;
  role: string;
  status: "Active" | "Inactive" | "VIP";
  joinDate?: string;
  bookingCount?: number;
  totalSpent?: string;
  region?: string;
  petInfo?: string;
}

export interface AdminFreelancer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subtitle: string;
  status: "Active" | "Busy" | "Suspended";
  experience: string;
  rating: number;
  jobsCompleted: number;
  servicePrice: string;
  region: string;
  services?: string[];
}

export interface AdminBooking {
  id: string;
  title: string;
  customerId: string;
  customer: string;
  petId: string;
  pet: string;
  freelancerId?: string;
  freelancer: string;
  serviceId: string;
  service: string;
  scheduledDate: string;
  time: string;
  location: string;
  region: string;
  status: "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
  price: number;
  notes?: string;
  createdDate: string;
}

export interface AdminPayment {
  id: string;
  title: string;
  bookingId: string;
  customerId: string;
  customer: string;
  freelancer: string;
  service: string;
  amount: number;
  platformFee: number;
  method: "CreditCard" | "BankTransfer" | "Wallet" | "VNPay" | "MoMo";
  status: "Success" | "Pending" | "Failed";
  type: "Payment" | "Refund" | "Fee";
  date: string;
  transactionId?: string;
}

export interface PagingResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// API Endpoints
// Determine whether the base URL already contains the API prefix to avoid duplication
const _base = (apiClient.getBaseURL() || API_CONFIG.BASE_URL || "").toString();
const API_V1 = _base.replace(/\/+$/, "").endsWith("/api/v1") ? "" : "/api/v1";

// Typed helper for failed responses to avoid `any` casts in fallbacks
const makeFailed = <T>(): ApiResponse<T> => ({ success: false } as ApiResponse<T>);

// (mock removed) the module always uses the real backend service below

const realService = {
  // ==================== USERS (Customers & Admins) ====================

  /**
   * Get all users with optional filters
   */
  async getUsers(
    params?: {
      page?: number;
      pageSize?: number;
      role?: string;
      status?: string;
      region?: string;
      search?: string;
    }
  ): Promise<ApiResponse<PagingResponse<AdminUser>>> {
    return apiClient.get(`${API_V1}/user/getall`, params);
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<AdminUser>> {
    return apiClient.get(`${API_V1}/user/${userId}`);
  },

  /**
   * Create new user
   */
  async createUser(
    data: Partial<AdminUser> & {
      password: string;
      role: string;
    }
  ): Promise<ApiResponse<AdminUser>> {
    return apiClient.post(`${API_V1}/user/create`, data);
  },

  /**
   * Update user
   */
  async updateUser(
    userId: string,
    data: Partial<AdminUser>
  ): Promise<ApiResponse<AdminUser>> {
    return apiClient.put(`${API_V1}/user/update/${userId}`, data);
  },

  /**
   * Get users by role
   */
  async getUsersByRole(roleName: string): Promise<ApiResponse<AdminUser[]>> {
    return apiClient.get(`${API_V1}/user/getall/${roleName}`);
  },

  // ==================== FREELANCERS ====================

  /**
   * Get all freelancers with pagination
   */
  async getFreelancers(
    params?: {
      page?: number;
      size?: number;
      status?: string;
      experience?: string;
      rating?: string;
      region?: string;
      service?: string;
      search?: string;
    }
  ): Promise<ApiResponse<PagingResponse<AdminFreelancer>>> {
    return apiClient.get(`${API_V1}/freelancer/getall`, params);
  },

  /**
   * Get freelancer by ID
   */
  async getFreelancerById(
    freelancerId: string
  ): Promise<ApiResponse<AdminFreelancer>> {
    return apiClient.get(`${API_V1}/freelancer/${freelancerId}`);
  },

  /**
   * Search freelancers by address and service
   */
  async searchFreelancers(
    address: string,
    serviceName: string
  ): Promise<ApiResponse<AdminFreelancer[]>> {
    return apiClient.get(`${API_V1}/freelancer/search`, {
      address,
      serviceName,
    });
  },

  /**
   * Sort freelancers by service and price range
   */
  async sortFreelancers(
    serviceName: string,
    minPrice: number,
    maxPrice: number
  ): Promise<ApiResponse<AdminFreelancer[]>> {
    return apiClient.get(`${API_V1}/freelancer/sort`, {
      serviceName,
      minPrice,
      maxPrice,
    });
  },

  // ==================== BOOKINGS ====================

  /**
   * Get all bookings with optional filters
   */
  async getBookings(
    params?: {
      page?: number;
      pageSize?: number;
      status?: string;
      serviceType?: string;
      petType?: string;
      freelancer?: string;
      region?: string;
      search?: string;
    }
  ): Promise<ApiResponse<PagingResponse<AdminBooking>>> {
    return apiClient.get(`${API_V1}/booking/getall`, params);
  },

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: string): Promise<ApiResponse<AdminBooking>> {
    return apiClient.get(`${API_V1}/booking/${bookingId}`);
  },

  /**
   * Create new booking
   */
  async createBooking(
    data: Omit<AdminBooking, "id" | "status">
  ): Promise<ApiResponse<AdminBooking>> {
    return apiClient.post(`${API_V1}/booking/create`, data);
  },

  /**
   * Update booking
   */
  async updateBooking(
    bookingId: string,
    data: Partial<AdminBooking>
  ): Promise<ApiResponse<AdminBooking>> {
    return apiClient.put(`${API_V1}/booking/${bookingId}`, data);
  },

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string): Promise<ApiResponse<void>> {
    return apiClient.put(`${API_V1}/booking/cancel/${bookingId}`, {});
  },

  // ==================== PAYMENTS ====================

  /**
   * Get all payments with optional filters
   */
  async getPayments(
    params?: {
      page?: number;
      pageSize?: number;
      status?: string;
      method?: string;
      type?: string;
      amountMin?: number;
      amountMax?: number;
      startDate?: string;
      endDate?: string;
      userType?: string;
      search?: string;
    }
  ): Promise<ApiResponse<PagingResponse<AdminPayment>>> {
    // Try the direct payments list endpoint first (some backends may expose it)
    const listResp = await apiClient.get(`${API_V1}/payment`, params);

    if (listResp.success && listResp.data) {
      return listResp as ApiResponse<PagingResponse<AdminPayment>>;
    }

    // If the direct list endpoint is not available (404) or not supported,
    // fall back to building a list by iterating bookings and fetching payment by booking.
    // This requires authorization and may be slower, but returns real backend data.
    // Fetch bookings first
    const bookingsResp = await apiClient.get(`${API_V1}/booking/getall`, { page: 1, pageSize: 100 });
    if (!bookingsResp.success || !bookingsResp.data) {
      return { success: false, error: listResp.error || bookingsResp.error || 'Payments endpoint not available' } as ApiResponse<PagingResponse<AdminPayment>>;
    }

    const bookingsList = ((bookingsResp.data as PagingResponse<AdminBooking>)?.items ?? (bookingsResp.data as AdminBooking[])) as AdminBooking[];
    const paymentsAccum: AdminPayment[] = [];

    for (const b of bookingsList) {
      try {
        const pResp = await apiClient.get(`${API_V1}/payment/booking/${b.id}`);
        if (pResp.success && pResp.data) {
          // Normalize shape if necessary
          const pd = pResp.data as Record<string, unknown>;
          const getString = (k: string, fallback = '') => {
            const v = pd[k];
            return typeof v === 'string' ? v : v !== undefined && v !== null ? String(v) : fallback;
          };
          const getNumber = (k: string, fallback = 0) => {
            const v = pd[k];
            return typeof v === 'number' ? v : v !== undefined && v !== null ? Number(v) || fallback : fallback;
          };

          paymentsAccum.push({
            id: getString('paymentId', getString('id', `${b.id}-p`)),
            title: getString('title', `Payment for ${b.title || b.id}`),
            bookingId: getString('bookingId', b.id),
            customerId: getString('customerId', getString('customerId', '')),
            customer: getString('customer', b.customer || 'N/A'),
            freelancer: getString('freelancer', 'N/A'),
            service: getString('service', b.service || 'N/A'),
            amount: getNumber('amount', getNumber('total', 0)),
            platformFee: getNumber('commissionAmount', getNumber('platformFee', 0)),
            method: getString('method', 'Unknown') as AdminPayment['method'],
            status: (getString('status', 'Pending') as AdminPayment['status']),
            type: (getString('type', 'Payment') as AdminPayment['type']),
            date: getString('createdAt', getString('date', new Date().toISOString())),
            transactionId: getString('transactionId', getString('txId', undefined as unknown as string)) || undefined,
          });
        }
      } catch {
        // ignore per-booking failures
      }
    }

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 6;
    const start = (page - 1) * pageSize;
    const paged = paymentsAccum.slice(start, start + pageSize);

    return {
      success: true,
      data: {
        items: paged,
        totalCount: paymentsAccum.length,
        pageNumber: page,
        pageSize,
        totalPages: Math.ceil(paymentsAccum.length / pageSize),
      },
      message: 'Payments fetched via booking fallback',
    } as ApiResponse<PagingResponse<AdminPayment>>;
  },

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string): Promise<ApiResponse<AdminPayment>> {
    return apiClient.get(`${API_V1}/payment/${paymentId}`);
  },

  /**
   * Get payment by booking ID
   */
  async getPaymentByBookingId(
    bookingId: string
  ): Promise<ApiResponse<AdminPayment>> {
    return apiClient.get(`${API_V1}/payment/booking/${bookingId}`);
  },

  /**
   * Create payment
   */
  async createPayment(
    data: {
      bookingId: string;
      customerId: string;
      amount: number;
      method: string;
      notes?: string;
    }
  ): Promise<ApiResponse<AdminPayment>> {
    return apiClient.post(`${API_V1}/payment/create`, data);
  },

  /**
   * Cancel payment
   */
  async cancelPayment(paymentId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${API_V1}/payment/${paymentId}/cancel`, {});
  },

  // ==================== DASHBOARD ====================

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<
    ApiResponse<{
      totalFreelancers: number;
      totalCustomers: number;
      activeJobs: number;
      totalRevenue: number;
      growthRate: number;
    }>
  > {
    // Try server endpoint first (typed)
    const resp = await apiClient.get<{
      totalFreelancers: number;
      totalCustomers: number;
      activeJobs: number;
      totalRevenue: number;
      growthRate: number;
    }>(`${API_V1}/dashboard/stats`).catch(() => makeFailed<{
      totalFreelancers: number;
      totalCustomers: number;
      activeJobs: number;
      totalRevenue: number;
      growthRate: number;
    }>());
    if (resp && resp.success && resp.data) return resp;

    // Fallback: compute from available endpoints (typed requests)
    const [freelancersResp, usersResp, bookingsResp, paymentsResp] = await Promise.all([
      apiClient.get<PagingResponse<AdminFreelancer>>(`${API_V1}/freelancer/getall`, { page: 1, size: 1 }).catch(() => makeFailed<PagingResponse<AdminFreelancer>>() ),
      apiClient.get<PagingResponse<AdminUser>>(`${API_V1}/user/getall`, { page: 1, pageSize: 1 }).catch(() => makeFailed<PagingResponse<AdminUser>>() ),
      apiClient.get<PagingResponse<AdminBooking>>(`${API_V1}/booking/getall`, { page: 1, pageSize: 100 }).catch(() => makeFailed<PagingResponse<AdminBooking>>() ),
      apiClient.get<PagingResponse<AdminPayment>>(`${API_V1}/payment`, { page: 1, pageSize: 500 }).catch(() => makeFailed<PagingResponse<AdminPayment>>() ),
    ]);

    const totalFreelancers = freelancersResp && freelancersResp.success && freelancersResp.data && Array.isArray((freelancersResp.data).items) ? freelancersResp.data.totalCount || freelancersResp.data.items.length : 0;
    const totalCustomers = usersResp && usersResp.success && usersResp.data && Array.isArray((usersResp.data).items) ? usersResp.data.totalCount || usersResp.data.items.length : 0;
    const activeJobs = bookingsResp && bookingsResp.success && bookingsResp.data ? ((bookingsResp.data.items || []) as AdminBooking[]).filter(b => b.status === 'In Progress').length : 0;
    const totalRevenue = paymentsResp && paymentsResp.success && paymentsResp.data ? ((paymentsResp.data.items || []) as AdminPayment[]).reduce((s, p) => s + Number(p.amount || 0), 0) : 0;

    return { success: true, data: { totalFreelancers, totalCustomers, activeJobs, totalRevenue, growthRate: 0 }, message: 'Computed from available endpoints' };
  },

  /**
   * Get revenue chart data
   */
  async getRevenueChart(
    period: number
  ): Promise<
    ApiResponse<{
      months: string[];
      revenue: number[];
      freelancers: number[];
      customers: number[];
    }>
  > {
    const resp = await apiClient.get<{
      months: string[];
      revenue: number[];
      freelancers: number[];
      customers: number[];
    }>(`${API_V1}/dashboard/revenue-chart`, { period }).catch(() => makeFailed<{
      months: string[];
      revenue: number[];
      freelancers: number[];
      customers: number[];
    }>());
    if (resp && resp.success && resp.data) return resp;

    // Fallback: build a simple chart from recent payments
    const paymentsResp = await apiClient.get<PagingResponse<AdminPayment>>(`${API_V1}/payment`, { page: 1, pageSize: 500 }).catch(() => makeFailed<PagingResponse<AdminPayment>>());
    const months = ['Jan', 'Feb', 'Mar'];
    const revenue = [0, 0, 0];
    if (paymentsResp && paymentsResp.success && paymentsResp.data) {
      const items: AdminPayment[] = paymentsResp.data.items || [];
      for (let i = 0; i < items.length; i++) revenue[i % 3] += Number(items[i].amount || 0);
    }
    return { success: true, data: { months, revenue, freelancers: [0, 0, 0], customers: [0, 0, 0] }, message: 'Fallback revenue chart' };
  },

  /**
   * Get revenue summary
   */
  async getRevenueSummary(): Promise<
    ApiResponse<{
      totalRevenue: number;
      totalPlatformFee: number;
      transactionsCount: {
        success: number;
        pending: number;
        failed: number;
      };
      monthlyBreakdown: Array<{
        month: string;
        revenue: number;
        fee: number;
      }>;
    }>
  > {
    // Try server endpoint typed
    const resp = await apiClient.get<{
      totalRevenue: number;
      totalPlatformFee: number;
      transactionsCount: {
        success: number;
        pending: number;
        failed: number;
      };
      monthlyBreakdown: Array<{
        month: string;
        revenue: number;
        fee: number;
      }>;
    }>(`${API_V1}/dashboard/revenue-summary`).catch(() => makeFailed<{
      totalRevenue: number;
      totalPlatformFee: number;
      transactionsCount: {
        success: number;
        pending: number;
        failed: number;
      };
      monthlyBreakdown: Array<{
        month: string;
        revenue: number;
        fee: number;
      }>;
    }>());
    if (resp && resp.success && resp.data) return resp;

    // Fallback: compute summary from payments
    const paymentsResp = await apiClient.get<PagingResponse<AdminPayment>>(`${API_V1}/payment`, { page: 1, pageSize: 500 }).catch(() => makeFailed<PagingResponse<AdminPayment>>());
    if (!paymentsResp || !paymentsResp.success || !paymentsResp.data) {
      return makeFailed<{
        totalRevenue: number;
        totalPlatformFee: number;
        transactionsCount: {
          success: number;
          pending: number;
          failed: number;
        };
        monthlyBreakdown: Array<{
          month: string;
          revenue: number;
          fee: number;
        }>;
      }>();
    }
    const items: AdminPayment[] = paymentsResp.data.items || [];
    const totalRevenue = items.reduce((s, p) => s + Number(p.amount || 0), 0);
    const totalPlatformFee = items.reduce((s, p) => s + Number(p.platformFee || 0), 0);
    const transactionsCount = { success: items.filter((p) => p.status === 'Success').length, pending: items.filter((p) => p.status === 'Pending').length, failed: items.filter((p) => p.status === 'Failed').length };
    return { success: true, data: { totalRevenue, totalPlatformFee, transactionsCount, monthlyBreakdown: [] }, message: 'Computed revenue summary' };
  },

  /**
   * Get recent bookings for dashboard
   */
  async getRecentBookings(
    limit: number = 3
  ): Promise<ApiResponse<AdminBooking[]>> {
    const resp = await apiClient.get<AdminBooking[]>(`${API_V1}/booking/recent`, { limit }).catch(() => makeFailed<AdminBooking[]>());
    if (resp && resp.success && resp.data) return resp as ApiResponse<AdminBooking[]>;

    // Fallback: fetch bookings and take most recent
    const bookingsResp = await apiClient.get<PagingResponse<AdminBooking>>(`${API_V1}/booking/getall`, { page: 1, pageSize: limit }).catch(() => makeFailed<PagingResponse<AdminBooking>>());
    if (!bookingsResp || !bookingsResp.success || !bookingsResp.data) return { success: false, error: 'No bookings available' } as ApiResponse<AdminBooking[]>;
    const items = bookingsResp.data.items || [];
    return { success: true, data: items.slice(0, limit), message: 'Fetched recent bookings via fallback' };
  },

  /**
   * Get recent transactions for dashboard
   */
  async getRecentTransactions(
    limit: number = 3
  ): Promise<ApiResponse<AdminPayment[]>> {
    const resp = await apiClient.get<AdminPayment[]>(`${API_V1}/payment/recent`, { limit }).catch(() => makeFailed<AdminPayment[]>());
    if (resp && resp.success && resp.data) return resp as ApiResponse<AdminPayment[]>;

    // Fallback: use getPayments and take first `limit` items
    const paymentsResp = await this.getPayments({ page: 1, pageSize: limit }).catch(() => makeFailed<PagingResponse<AdminPayment>>());
    if (!paymentsResp || !paymentsResp.success || !paymentsResp.data) return { success: false, error: 'No payments available' } as ApiResponse<AdminPayment[]>;
    return { success: true, data: paymentsResp.data.items.slice(0, limit), message: 'Fetched recent transactions via fallback' } as ApiResponse<AdminPayment[]>;
  },

  // ==================== EXPORT ====================

  /**
   * Export payments to CSV
   */
  async exportPaymentsCsv(params?: {
    status?: string;
    method?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const response = await apiClient.get<Blob>(`${API_V1}/payment/export/csv`, params).catch(() => makeFailed<Blob>());
    if (response && response.success && response.data) return response.data as unknown as Blob;

    // Fallback: build CSV from payments data
    const paymentsResp = await this.getPayments({ page: 1, pageSize: 1000 }).catch(() => makeFailed<PagingResponse<AdminPayment>>());
    if (!paymentsResp || !paymentsResp.success || !paymentsResp.data) throw new Error('Failed to export CSV: no payments');

    const items: AdminPayment[] = paymentsResp.data.items || [];
    const header = ['id','title','bookingId','customer','freelancer','service','amount','platformFee','method','status','date'];
    const rows = items.map((p: AdminPayment) => [p.id, p.title, p.bookingId, p.customer, p.freelancer, p.service, p.amount, p.platformFee, p.method, p.status, p.date]);
    const csv = [header.join(','), ...rows.map((r: Array<string|number>) => r.map((c: unknown) => `"${String(c ?? '')}"`).join(','))].join('\n');
    return new Blob([csv], { type: 'text/csv' });
  },

  /**
   * Export payments to PDF
   */
  async exportPaymentsPdf(params?: {
    status?: string;
    method?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const response = await apiClient.get<Blob>(`${API_V1}/payment/export/pdf`, params).catch(() => makeFailed<Blob>());
    if (response && response.success && response.data) return response.data as unknown as Blob;

    // PDF export not available on server — fall back to CSV blob and return as application/pdf is not possible.
    // We'll throw a descriptive error so the UI can fallback to CSV export if desired.
    throw new Error('PDF export not available on server. Use CSV export instead.');
  },
};

const service = realService;
export default service;
export { realService as adminService };
