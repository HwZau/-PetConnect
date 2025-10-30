// file: AdminLayout.tsx

import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
// import DashboardPage from "../pages/admin/DashboardPage";
import { SearchProvider } from "../contexts/SearchContext";
// THÊM: Import AdminHeader và AdminSidebar
// (Điều chỉnh đường dẫn nếu cần)

const AdminLayout = () => {
  return (
    // THAY ĐỔI: Thay đổi nền chung sang màu xám nhẹ
    <div className="flex min-h-screen bg-gray-100"> 
      
      {/* 1. Sidebar đứng độc lập */}
      <AdminSidebar /> 

      {/* 2. Container chính (Header + Nội dung) - nằm trên nền xám */}
      <div className="flex-1 flex flex-col p-4"> 
        {/* Container chính to, bo tròn, shadow */}
        
        <div className="bg-white rounded-2xl shadow-xl flex-1 flex flex-col overflow-hidden">
          {/* Wrap header + main with SearchProvider so header and pages share the same search state */}
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