import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useContext } from "react";
import { UserProvider, UserContext } from "./contexts/UserContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import PageLoader from "./components/common/PageLoader";
import { isAdminRole } from "./utils/authUtils";
import DashboardPage from "./pages/admin/DashboardPage";
import FreelancersPage from "./pages/admin/FreelancersPage";
import CustomersPage from "./pages/admin/CustomersPage";
import JobsPage from "./pages/admin/JobsPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminLayout from "./layouts/AdminLayout";
import { SettingsProvider } from "./contexts/SettingsContext";
import ProtectedProfile from "./components/common/ProtectedProfile";

// Lazy load all pages
const HomePage = lazy(() => import("./pages/home/HomePage"));
const EventPage = lazy(() => import("./pages/event/EventPage"));
const FreelancerPage = lazy(() => import("./pages/freelancer/FreelancerPage"));
const CommunityPage = lazy(() => import("./pages/community/CommunityPage"));
const BookingPage = lazy(() => import("./pages/booking/BookingPage"));
const PaymentPage = lazy(() => import("./pages/payment/PaymentPage"));
const SupportPage = lazy(() => import("./pages/support/SupportPage"));
const PaymentStatusPage = lazy(
  () => import("./pages/payment/PaymentStatusPage")
);
const PaymentSuccessPage = lazy(
  () => import("./pages/payment/PaymentSuccessPage")
);
const PaymentFailurePage = lazy(
  () => import("./pages/payment/PaymentFailurePage")
);
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("./pages/auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const FreelancerProfilePage = lazy(
  () => import("./pages/freelancer/FreelancerProfilePage")
);

// Routes component that uses UserContext
const AppRoutes = () => {
  const context = useContext(UserContext);
  const { user, isLoading } = context || {};

  // While loading initial user state, show loading screen
  if (isLoading) {
    return <PageLoader text="Đang tải trang..." />;
  }

  return (
    <Suspense fallback={<PageLoader text="Đang tải trang..." />}>
      <Routes>
        {/* Public routes */}

        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/freelancers" element={<FreelancerPage />} />
        <Route path="/freelancers/:id" element={<FreelancerProfilePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/support" element={<SupportPage />} />

        {/* Payment routes */}
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-status" element={<PaymentStatusPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-failure" element={<PaymentFailurePage />} />
        <Route path="/payment-failed" element={<PaymentFailurePage />} />

        {/* Protected routes - requires authentication */}
        <Route path="/profile" element={<ProtectedProfile />} />
        <Route
          path="/booking"
          element={user ? <BookingPage /> : <Navigate to="/login" />}
        />

        {/* 🛡️ Admin routes - only allow admin role */}
        <Route
          path="/admin/*"
          element={
            isAdminRole(user?.role) ? <AdminLayout /> : <Navigate to="/" />
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="freelancers" element={<FreelancersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 - Not Found */}
        <Route
          path="*"
          element={
            <div className="p-10 text-center">
              <h1 className="text-4xl font-bold">404 - Không tìm thấy trang</h1>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <UserProvider>
      <SettingsProvider>
        <BrowserRouter>
          <WebSocketProvider>
            <AppRoutes />
          </WebSocketProvider>
        </BrowserRouter>
      </SettingsProvider>
    </UserProvider>
  );
}

export default App;
