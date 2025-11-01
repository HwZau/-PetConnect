// file: AdminLayout.tsx

import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { useSettings } from "../contexts/SettingsContext";
// import DashboardPage from "../pages/admin/DashboardPage";
import { SearchProvider } from "../contexts/SearchContext";
// THÊM: Import AdminHeader và AdminSidebar
// (Điều chỉnh đường dẫn nếu cần)

const AdminLayout = () => {
  const { theme } = useSettings();

  // base classes vary by theme
  const outerClass = theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900';
  const panelClass = theme === 'dark' ? 'bg-gray-900' : 'bg-white';

  return (
    // THAY ĐỔI: Thay đổi nền chung theo theme
    <div className={`flex min-h-screen ${outerClass}`}> 
      {/* 1. Sidebar */}
      <AdminSidebar /> 

      {/* 2. Main container */}
      <div className="flex-1 flex flex-col p-4"> 
        <div className={`${panelClass} rounded-2xl shadow-xl flex-1 flex flex-col overflow-hidden`}>
          <SearchProvider>
            <AdminHeader /> 
            <main className="flex-1 overflow-y-auto"> 
              <Outlet />
            </main>
          </SearchProvider>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;