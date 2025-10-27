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

const AdminSidebar: React.FC = () => {
  const items = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <AiOutlineDashboard /> },
    { to: "/admin/freelancers", label: "Freelancers", icon: <AiOutlineUser /> },
    { to: "/admin/customers", label: "Customers", icon: <AiOutlineFileText /> },
    { to: "/admin/jobs", label: "Jobs", icon: <AiOutlineProfile /> },
    { to: "/admin/payments", label: "Payments", icon: <AiOutlineDollar /> },
    { to: "/admin/settings", label: "Settings", icon: <AiOutlineSetting /> },
  ];

  return (
    <aside className="w-72 bg-white border-r h-screen sticky top-0">
      <div className="px-6 py-3 ">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-200 rounded flex items-center justify-center text-green-700 font-bold">PA</div>
          <div>
            <div className="text-lg font-semibold">PetAdmin</div>

          </div>
        </div>
      </div>

      <nav className="px-4 py-6 space-y-1">
        {items.map((it) => (
          <NavLink
            to={it.to}
            key={it.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <div className="text-lg">{it.icon}</div>
            <div>{it.label}</div>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
