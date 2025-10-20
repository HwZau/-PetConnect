import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, Suspense, lazy } from "react";
import { UserContext } from "./contexts/UserContext";
import PageLoader from "./components/common/PageLoader";
import type { User } from "./types";

// Lazy load all pages
const HomePage = lazy(() => import("./pages/home/HomePage"));
const EventPage = lazy(() => import("./pages/event/EventPage"));
const FreelancerPage = lazy(() => import("./pages/freelancer/FreelancerPage"));
const CommunityPage = lazy(() => import("./pages/community/CommunityPage"));
const BookingPage = lazy(() => import("./pages/booking/BookingPage"));
const PaymentPage = lazy(() => import("./pages/payment/PaymentPage"));
const SupportPage = lazy(() => import("./pages/support/SupportPage"))
const PaymentStatusPage = lazy(
  () => import("./pages/payment/PaymentStatusPage")
);
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const UserProfilePage = lazy(() => import("./pages/user/UserProfilePage"));

// Tạo context cho thông tin người dùng
// Import the UserContext from a separate file

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <div className="min-h-screen">
          <Suspense fallback={<PageLoader text="Đang tải trang..." />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventPage />} />
              <Route path="/freelancers" element={<FreelancerPage />} />
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
                // element={user ? <UserProfilePage /> : <Navigate to="/login" />}
                element={<UserProfilePage />}
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

              {/* Admin routes - requires admin role */}
              <Route
                path="/admin/*"
                element={
                  user?.role === "admin" ? (
                    <div>Admin Dashboard (To be implemented)</div>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />

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
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
