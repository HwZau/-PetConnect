import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import UserProfilePage from "../../pages/user/UserProfilePage";
import FreelancerProfilePage from "../../pages/freelancer/FreelancerProfilePage";

const ProtectedProfile: React.FC = () => {
  const { user } = useContext(UserContext);

  // Nếu chưa đăng nhập, redirect về login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Dựa vào role để hiển thị trang profile phù hợp
  switch (user.role) {
    case "Freelancer":
      // Freelancer vào trang FreelancerProfilePage
      return <FreelancerProfilePage />;
    case "Customer":
      // Customer vào trang UserProfilePage
      return <UserProfilePage />;
    default:
      // Role không xác định, mặc định là customer
      return "Không xác định role người dùng.";
  }
};

export default ProtectedProfile;
