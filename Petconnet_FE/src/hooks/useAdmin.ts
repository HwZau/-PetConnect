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
        // Call the paged getUsers endpoint and pass role as a query parameter when provided.
        // Some backends expose a path-based role endpoint that may be misconfigured (method/route mismatch),
        // so we use query param `role` to avoid 400 responses.
        const response = await adminService.getUsers({
          page: params?.page || pagination.page,
          pageSize: params?.pageSize || pagination.pageSize,
          role: params?.role,
          status: params?.status,
          region: params?.region,
          search: params?.search,
        });

        if (response.success && response.data) {
          const dataAny: any = response.data;
          // Normalize backend responses: some endpoints return a PagingResponse, others return a plain array of users
          let items: AdminUser[] = [];
          let pageNumber = params?.page || pagination.page;
          let pageSize = params?.pageSize || pagination.pageSize;
          let totalCount = 0;
          let totalPages = 1;

          if (Array.isArray(dataAny)) {
            items = dataAny as AdminUser[];
            totalCount = items.length;
            totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
          } else {
            // Assume PagingResponse shape
            const data = dataAny as PagingResponse<AdminUser>;
            items = data.items ?? [];
            pageNumber = data.pageNumber ?? pageNumber;
            pageSize = data.pageSize ?? pageSize;
            totalCount = data.totalCount ?? items.length;
            totalPages = data.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));
          }

          // If caller requested a role, additionally filter client-side to be safe
          if (params?.role) {
            items = items.filter((u) => (u.role ?? (u as any).Role ?? "").toString() === params.role);
            totalCount = items.length;
            totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
          }

          // Transform backend data: map _id to id for users
          items = items.map((user: any) => ({
            ...user,
            id: user._id || user.id,
            _id: user._id || user.id, // Also set _id for backward compatibility
          }));

          setUsers(items);
          setPagination({
            page: pageNumber,
            pageSize,
            totalCount,
            totalPages,
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
    async (userData: {
      name: string;
      email: string;
      phoneNumber: string;
      address: string;
      password: string;
      role: string;
    }) => {
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
          // Transform backend data: map _id to id for freelancers
          const transformedItems = (data.items ?? []).map((freelancer: any) => ({
            ...freelancer,
            id: freelancer._id || freelancer.id,
            _id: freelancer._id || freelancer.id, // Also set _id for backward compatibility
            // Map other fields that might be different
            name: freelancer.name,
            email: freelancer.email,
            avatar: freelancer.avatar || freelancer.profileImage,
            subtitle: freelancer.subtitle || freelancer.bio,
            status: freelancer.status || 'Active',
            experience: freelancer.experience || '',
            rating: freelancer.rating || 0,
            jobsCompleted: freelancer.jobsCompleted || freelancer.stats?.completedJobs || 0,
            servicePrice: freelancer.servicePrice || freelancer.price || '0',
            region: freelancer.region || freelancer.location || '',
            services: freelancer.services || [],
          }));
          setFreelancers(transformedItems);
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
          // Handle both array and PagingResponse shapes from backend
          let items: any[] = [];
          if (Array.isArray(response.data)) {
            items = response.data;
          } else {
            const data = response.data as PagingResponse<AdminBooking>;
            items = data.items || [];
          }

          // Normalize booking items to support varying backend shapes used across endpoints
          const normalized = items.map((it: any) => {
            const bookingId = it.bookingId || it.BookingId || it.id || it._id || '';

            // customer / freelancer names may be nested or absent
            const customerName = it.customerName || it.customer?.name || it.Customer?.Name || it.customerFullName || '';
            const freelancerName = it.freelancerName || it.freelancer?.name || it.Freelancer?.Name || '';

            // Normalize pets array to objects with `petName` property
            const rawPets = it.pets || it.Pets || [];
            const pets = Array.isArray(rawPets)
              ? rawPets.map((p: any) => ({ petName: p.petName || p.PetName || p.name || '' }))
              : (it.pet ? [{ petName: it.pet }] : []);

            const totalPrice = Number(it.totalPrice ?? it.TotalPrice ?? it.price ?? it.amount ?? 0);

            // Map pickup time enum: backend sends 0..4, convert to Slot1..Slot5
            const rawPickUpTime = it.pickUpTime ?? it.PickUpTime ?? it.time ?? it.scheduledTime ?? '';
            let pickUpTime = '';
            if (rawPickUpTime === 0 || rawPickUpTime === 1 || rawPickUpTime === 2 || rawPickUpTime === 3 || rawPickUpTime === 4) {
              pickUpTime = `Slot${Number(rawPickUpTime) + 1}`;
            } else if (typeof rawPickUpTime === 'string' && /^\d+$/.test(rawPickUpTime)) {
              const n = Number(rawPickUpTime);
              if (n >= 0 && n <= 4) pickUpTime = `Slot${n + 1}`;
            } else if (typeof rawPickUpTime === 'string') {
              pickUpTime = rawPickUpTime;
            }

            // Map pickup status enum: 0=NotPickedUp, 1=PickedUp, 2=Delivered
            const rawPickUpStatus = it.pickUpStatus ?? it.PickUpStatus ?? it.pickupStatus ?? it.pickUpState ?? it.pickUp ?? 0;
            let pickUpStatus = 'NotPickedUp';
            if (rawPickUpStatus === 0) {
              pickUpStatus = 'NotPickedUp';
            } else if (rawPickUpStatus === 1) {
              pickUpStatus = 'PickedUp';
            } else if (rawPickUpStatus === 2) {
              pickUpStatus = 'Delivered';
            } else if (typeof rawPickUpStatus === 'string' && /^\d+$/.test(rawPickUpStatus)) {
              const n = Number(rawPickUpStatus);
              pickUpStatus = n === 1 ? 'PickedUp' : n === 2 ? 'Delivered' : 'NotPickedUp';
            } else if (rawPickUpStatus && typeof rawPickUpStatus === 'string') {
              pickUpStatus = rawPickUpStatus;
            }

            // isPaid boolean (handle capitalized or different fields)
            const isPaid = typeof it.isPaid === 'boolean' ? it.isPaid : (typeof it.IsPaid === 'boolean' ? it.IsPaid : !!it.paid || !!it.paidStatus || false);

            // booking date normalization
            const bookingDate = it.bookingDate || it.BookingDate || it.scheduledDate || it.CreatedAt || it.createdDate || it.date || '';

            // Normalize status enum: 0=Pending, 1=Confirmed, 2=Completed, 3=Cancelled
            const rawStatus = it.status ?? it.Status ?? it.bookingStatus ?? 0;
            let status = 'Pending';
            if (rawStatus === 0) {
              status = 'Pending';
            } else if (rawStatus === 1) {
              status = 'Confirmed';
            } else if (rawStatus === 2) {
              status = 'Completed';
            } else if (rawStatus === 3) {
              status = 'Cancelled';
            } else if (typeof rawStatus === 'string' && /^\d+$/.test(rawStatus)) {
              const n = Number(rawStatus);
              status = n === 1 ? 'Confirmed' : n === 2 ? 'Completed' : n === 3 ? 'Cancelled' : 'Pending';
            } else if (rawStatus && typeof rawStatus === 'string') {
              const s = rawStatus;
              if (/assigned|in progress/i.test(s)) status = 'Confirmed';
              else if (/pending/i.test(s)) status = 'Pending';
              else if (/completed|done/i.test(s)) status = 'Completed';
              else if (/cancelled|canceled/i.test(s)) status = 'Cancelled';
              else status = s;
            }

            return {
              ...it,
              id: it._id || it.id || bookingId, // Set id field
              bookingId,
              customerName,
              freelancerName,
              pets,
              totalPrice,
              pickUpTime,
              pickUpStatus,
              isPaid,
              bookingDate,
              status,
            } as AdminBooking;
          });

          setBookings(normalized);
          // Set pagination defaults or from response if available
          const pageData = Array.isArray(response.data) 
            ? { page: 1, pageSize: 100, totalCount: items.length, totalPages: 1 }
            : { page: (response.data as PagingResponse<AdminBooking>).pageNumber || 1, pageSize: (response.data as PagingResponse<AdminBooking>).pageSize || 100, totalCount: (response.data as PagingResponse<AdminBooking>).totalCount || items.length, totalPages: (response.data as PagingResponse<AdminBooking>).totalPages || 1 };
          setPagination(pageData);
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
              // Match by normalized bookingId or original id to reflect cancel in UI
              (b.bookingId === bookingId || b.id === bookingId) ? { ...b, status: "Cancelled" } : b
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
          // Transform backend data: map _id to id for payments
          const transformedItems = (data.items ?? []).map((payment: any) => ({
            ...payment,
            id: payment._id || payment.id,
            _id: payment._id || payment.id, // Also set _id for backward compatibility
          }));
          setPayments(transformedItems);
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
