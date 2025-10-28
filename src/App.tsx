import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useContext } from "react";
import { UserProvider, UserContext } from "./contexts/UserContext";
import PageLoader from "./components/common/PageLoader";
import DashboardPage from "./pages/admin/DashboardPage";
import FreelancersPage from "./pages/admin/FreelancersPage";
import CustomersPage from "./pages/admin/CustomersPage";
import JobsPage from "./pages/admin/JobsPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import AdminLayout from "./layouts/AdminLayout";

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
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const UserProfilePage = lazy(() => import("./pages/user/UserProfilePage"));
const FreelancerProfilePage = lazy(
  () => import("./pages/freelancer/FreelancerProfilePage")
);

// Routes component that uses UserContext
const AppRoutes = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen">
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
          <Route path="/support" element={<SupportPage />} />
          {/* Booking route - only accessible via freelancer selection */}
          <Route path="/booking" element={<BookingPage />} />

          {/* Payment routes */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-status" element={<PaymentStatusPage />} />

          {/* Protected routes - requires authentication */}
          <Route
            path="/profile"
            element={user ? <UserProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/bookings"
            element={
              user ? (
                <div>Bookings Page (To be implemented)</div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* 🛠️ Admin routes */}
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="freelancers" element={<FreelancersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
          </Route>

          {/* 🛠️ Admin routes neu co usecontext */}
          {/* <Route
  path="/admin/*"
  element={
    user?.role === "admin" ? <AdminLayout /> : <Navigate to="/" />
  }
>
  <Route index element={<DashboardPage />} />
  <Route path="freelancers" element={<FreelancersPage />} />
  <Route path="customers" element={<CustomersPage />} />
  <Route path="jobs" element={<JobsPage />} />
  <Route path="payments" element={<PaymentsPage />} />
</Route> */}


          {/* 404 - Not Found */}
          <Route
            path="*"
            element={
              <div className="p-10 text-center">
                <h1 className="text-4xl font-bold">
                  404 - Không tìm thấy trang
                </h1>
              </div>
            }
          />

        </Routes>
      </Suspense>
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
