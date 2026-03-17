import React from "react";
import { NavLink } from "react-router-dom";
import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineFileText,
  AiOutlineProfile,
  AiOutlineDollar,
  AiOutlineSetting,
} from "react-icons/ai";

import { useSettings } from "../../contexts/SettingsContext";

import LogoImage from '/src/assets/image/Logo.png';
const AdminSidebar: React.FC = () => {
  const { theme } = useSettings();

  const items = [
    { to: "/admin/dashboard", label: 'Tổng Quan', icon: <AiOutlineDashboard /> },
    { to: "/admin/freelancers", label: 'Freelancer', icon: <AiOutlineUser /> },
    { to: "/admin/customers", label: 'Khách Hàng', icon: <AiOutlineFileText /> },
    { to: "/admin/jobs", label: 'Công Việc', icon: <AiOutlineProfile /> },
    { to: "/admin/payments", label: 'Thanh Toán', icon: <AiOutlineDollar /> },
    { to: "/admin/payment-approval", label: 'Xác Nhận TT', icon: <AiOutlineDollar /> },
    { to: "/admin/settings", label: 'Cài Đặt', icon: <AiOutlineSetting /> },
  ];

  return (
    // THAY ĐỔI: Tăng độ bo tròn và hỗ trợ theme (dark/light)
    <aside className={`w-64 h-screen sticky top-0 shadow-2xl z-20 shrink-0 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <div className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {/* THAY ĐỔI: Logo và Text */}
          <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-green-500' : 'bg-green-600'} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
            <img
              alt="Logo"
              
              src={LogoImage} // <--- Đã sửa: dùng biến import
            />
          </div>
          <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Pawnet Admin</div>
        </div>
      </div>

      {/* THAY ĐỔI: Giảm padding và điều chỉnh màu sắc NavLink */}
      <nav className="p-4 space-y-1">
        {items.map((it) => (
          <NavLink
            to={it.to}
            key={it.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                isActive
                  ? (theme === 'dark' ? "bg-green-800 text-green-200 font-semibold" : "bg-green-100 text-green-700 font-semibold")
                  : (theme === 'dark' ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-50")
              }`
            }
          >
            <div className="text-xl">{it.icon}</div>
            <div>{it.label}</div>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;