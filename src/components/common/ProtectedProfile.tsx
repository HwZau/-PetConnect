import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import UserProfilePage from "../../pages/user/UserProfilePage";
import FreelancerOwnProfilePage from "../../pages/freelancer/FreelancerOwnProfilePage";

const ProtectedProfile: React.FC = () => {
  const { user } = useContext(UserContext);

  // Nếu chưa đăng nhập, redirect về login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Dựa vào role để hiển thị trang profile phù hợp
  switch (user.role) {
    case "Freelancer":
      // Freelancer vào trang FreelancerOwnProfilePage (chỉnh sửa profile của chính mình)
      return <FreelancerOwnProfilePage />;
    case "Customer":
      // Customer vào trang UserProfilePage
      return <UserProfilePage />;
    default:
      // Role không xác định, mặc định là customer
      return <UserProfilePage />;
  }
};

export default ProtectedProfile;
