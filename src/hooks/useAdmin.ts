// Admin Hooks - Custom hooks for admin pages
import { useState, useCallback } from "react";
// Read env to see whether mock API is enabled (set in .env as VITE_ENABLE_MOCK_API)
// This file does not modify .env; it only reads the flag at build time.
const ENABLE_MOCK = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENABLE_MOCK_API === 'true';
if (ENABLE_MOCK) {
  console.debug("useAdmin: VITE_ENABLE_MOCK_API=true — using mock admin data");
}

import adminService, {
  type AdminUser,
  type AdminFreelancer,
  type AdminBooking,
  type AdminPayment,
  type PagingResponse,
} from "../services/admin/adminService";

// ==================== useAdminUsers ====================
export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    totalCount: 0,
    totalPages: 0,
  });

  const fetchUsers = useCallback(
    async (params?: {
      page?: number;
      pageSize?: number;
      role?: string;
      status?: string;
      region?: string;
      search?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await adminService.getUsers({
          page: params?.page || pagination.page,
          pageSize: params?.pageSize || pagination.pageSize,
          ...params,
        });

        if (response.success && response.data) {
          const data = response.data as PagingResponse<AdminUser>;
          setUsers(data.items);
          setPagination({
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            totalPages: data.totalPages,
          });
        } else {
          setError(response.error || "Failed to fetch users");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize]
  );

  const createUser = useCallback(
    async (userData: Partial<AdminUser> & { password: string; role: string }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await adminService.createUser(userData);

        if (response.success) {
          await fetchUsers({ page: 1 });
          return { success: true, data: response.data };
        } else {
          setError(response.error || "Failed to create user");
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  const updateUser = useCallback(
    async (userId: string, userData: Partial<AdminUser>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await adminService.updateUser(userId, userData);

        if (response.success) {
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, ...userData } : u))
          );
          return { success: true, data: response.data };
        } else {
          setError(response.error || "Failed to update user");
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
  };
}

// ==================== useAdminFreelancers ====================
export function useAdminFreelancers() {
  const [freelancers, setFreelancers] = useState<AdminFreelancer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    totalCount: 0,
    totalPages: 0,
  });

  const fetchFreelancers = useCallback(
    async (params?: {
      page?: number;
      size?: number;
      status?: string;
      experience?: string;
      rating?: string;
      region?: string;
      service?: string;
      search?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await adminService.getFreelancers({
          page: params?.page || pagination.page,
          size: params?.size || pagination.pageSize,
          ...params,
        });

        if (response.success && response.data) {
          const data = response.data as PagingResponse<AdminFreelancer>;
          setFreelancers(data.items);
          setPagination({
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            totalPages: data.totalPages,
          });
        } else {
          setError(response.error || "Failed to fetch freelancers");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize]
  );

  return {
    freelancers,
    loading,
    error,
    pagination,
    fetchFreelancers,
  };
}

// ==================== useAdminBookings ====================
export function useAdminBookings() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    totalCount: 0,
    totalPages: 0,
  });

  const fetchBookings = useCallback(
    async (params?: {
      page?: number;
      pageSize?: number;
      status?: string;
      serviceType?: string;
      petType?: string;
      freelancer?: string;
      region?: string;
      search?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await adminService.getBookings({
          page: params?.page || pagination.page,
          pageSize: params?.pageSize || pagination.pageSize,
          ...params,
        });

        if (response.success && response.data) {
          const data = response.data as PagingResponse<AdminBooking>;
          setBookings(data.items);
          setPagination({
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            totalPages: data.totalPages,
          });
        } else {
          setError(response.error || "Failed to fetch bookings");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize]
  );

  const createBooking = useCallback(
    async (bookingData: Omit<AdminBooking, "id" | "status">) => {
      setLoading(true);
      setError(null);

      try {
        const response = await adminService.createBooking(bookingData);

        if (response.success) {
          await fetchBookings({ page: 1 });
          return { success: true, data: response.data };
        } else {
          setError(response.error || "Failed to create booking");
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [fetchBookings]
  );

  const cancelBooking = useCallback(
    async (bookingId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await adminService.cancelBooking(bookingId);

        if (response.success) {
          setBookings((prev) =>
            prev.map((b) =>
              b.id === bookingId ? { ...b, status: "Cancelled" } : b
            )
          );
          return { success: true };
        } else {
          setError(response.error || "Failed to cancel booking");
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    createBooking,
    cancelBooking,
  };
}

// ==================== useAdminPayments ====================
export function useAdminPayments() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    totalCount: 0,
    totalPages: 0,
  });

  const fetchPayments = useCallback(
    async (params?: {
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
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await adminService.getPayments({
          page: params?.page || pagination.page,
          pageSize: params?.pageSize || pagination.pageSize,
          ...params,
        });

        if (response.success && response.data) {
          const data = response.data as PagingResponse<AdminPayment>;
          setPayments(data.items);
          setPagination({
            page: data.pageNumber,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            totalPages: data.totalPages,
          });
        } else {
          setError(response.error || "Failed to fetch payments");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize]
  );

  const createPayment = useCallback(
    async (paymentData: {
      bookingId: string;
      customerId: string;
      amount: number;
      method: string;
      notes?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await adminService.createPayment(paymentData);

        if (response.success) {
          await fetchPayments({ page: 1 });
          return { success: true, data: response.data };
        } else {
          setError(response.error || "Failed to create payment");
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [fetchPayments]
  );

  return {
    payments,
    loading,
    error,
    pagination,
    fetchPayments,
    createPayment,
  };
}

// ==================== useAdminDashboard ====================
export function useAdminDashboard() {
  const [stats, setStats] = useState({
    totalFreelancers: 0,
    totalCustomers: 0,
    activeJobs: 0,
    totalRevenue: 0,
    growthRate: 0,
  });
  const [recentBookings, setRecentBookings] = useState<AdminBooking[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<AdminPayment[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch stats
      const statsResponse = await adminService.getDashboardStats();
      if (statsResponse.success) {
        setStats(statsResponse.data as typeof stats);
      }

      // Fetch recent bookings
      const bookingsResponse = await adminService.getRecentBookings(3);
      if (bookingsResponse.success) {
        setRecentBookings(
          (bookingsResponse.data as AdminBooking[]) || []
        );
      }

      // Fetch recent transactions
      const transactionsResponse = await adminService.getRecentTransactions(3);
      if (transactionsResponse.success) {
        setRecentTransactions(
          (transactionsResponse.data as AdminPayment[]) || []
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const getRevenueChart = useCallback(
    async (period: number) => {
      try {
        const response = await adminService.getRevenueChart(period);
        if (response.success) {
          return response.data;
        }
        return null;
      } catch (err) {
        console.error("Failed to fetch revenue chart:", err);
        return null;
      }
    },
    []
  );

  return {
    stats,
    recentBookings,
    recentTransactions,
    loading,
    error,
    fetchDashboardData,
    getRevenueChart,
  };
}

// ==================== useAdminExport ====================
export function useAdminExport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToCsv = useCallback(
    async (params?: {
      status?: string;
      method?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const blob = await adminService.exportPaymentsCsv(params);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `payments_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Export failed";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const exportToPdf = useCallback(
    async (params?: {
      status?: string;
      method?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const blob = await adminService.exportPaymentsPdf(params);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `payments_${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Export failed";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    exportToCsv,
    exportToPdf,
  };
}
