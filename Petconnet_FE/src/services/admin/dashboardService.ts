// Dashboard Service - Aggregates data from all admin hooks
import type { AdminUser, AdminFreelancer, AdminBooking, AdminPayment } from './adminService';

export interface DashboardStats {
  totalFreelancers: number;
  totalCustomers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  activeFreelancers: number;
  successfulTransactions: number;
  averageRating: number;
  topFreelancers: Array<{ id: string; name: string; jobsCompleted: number; rating: number }>;
  recentBookings: AdminBooking[];
  recentTransactions: AdminPayment[];
}

/**
 * Calculate dashboard statistics from raw data
 */
export function calculateDashboardStats(
  users: AdminUser[] = [],
  freelancers: AdminFreelancer[] = [],
  bookings: AdminBooking[] = [],
  payments: AdminPayment[] = []
): DashboardStats {
  // Separate customers and freelancers from users
  const customers = users.filter((u) => u.role === 'Customer');
  const activeFreelancersList = freelancers.filter((f) => f.status === 'Active');

  // Calculate totals
  const totalFreelancers = freelancers.length;
  const totalCustomers = customers.length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;
  const activeFreelancersCount = activeFreelancersList.length;

  // Revenue calculations
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const successfulTransactions = payments.filter((p) => p.status === 'Success').length;

  // Rating calculation
  const totalRating = freelancers.reduce((sum, f) => sum + (f.rating || 0), 0);
  const averageRating =
    freelancers.length > 0 ? Number((totalRating / freelancers.length).toFixed(1)) : 0;

  // Top freelancers by jobs completed
  const topFreelancers = freelancers
    .sort((a, b) => (b.jobsCompleted || 0) - (a.jobsCompleted || 0))
    .slice(0, 5)
    .map((f) => ({
      id: f.id,
      name: f.name,
      jobsCompleted: f.jobsCompleted || 0,
      rating: f.rating || 0,
    }));

  // Recent bookings (last 3)
  const recentBookings = bookings.slice(-3).reverse();

  // Recent transactions (last 3)
  const recentTransactions = payments.slice(-3).reverse();

  return {
    totalFreelancers,
    totalCustomers,
    totalBookings,
    totalRevenue,
    pendingBookings,
    activeFreelancers: activeFreelancersCount,
    successfulTransactions,
    averageRating,
    topFreelancers,
    recentBookings,
    recentTransactions,
  };
}

/**
 * Format currency for display (Vietnamese)
 */
export function formatCurrency(value: number, currency: 'VND' | 'USD' = 'VND'): string {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

/**
 * Format large numbers with K, M suffixes
 */
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return String(value);
}
