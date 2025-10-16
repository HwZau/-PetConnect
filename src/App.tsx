import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  HomePage,
  EventPage,
  FreelancerPage,
  CommunityPage,
  BookingPage,
} from "./pages";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { useState } from "react";
import { UserContext, type User } from "./contexts/UserContext";
import UserProfilePage from "./pages/user/UserProfilePage";

// Tạo context cho thông tin người dùng
// Import the UserContext from a separate file

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/freelancers" element={<FreelancerPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Booking route - only accessible via freelancer selection */}
            <Route path="/booking" element={<BookingPage />} />

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
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
