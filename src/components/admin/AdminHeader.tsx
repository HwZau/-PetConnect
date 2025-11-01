// file: AdminHeader.tsx

import React from "react";
import { AiOutlineSearch, AiOutlineBell } from "react-icons/ai";

const AdminHeader: React.FC = () => {
  return (
    // THAY ĐỔI: Dùng py-4 để có khoảng cách lớn hơn, bỏ border-b, dùng shadow-sm
    <header className="bg-white py-4 px-8 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-4 w-full max-w-lg">
        <div className="relative flex-1">
          <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            placeholder="Tìm kiếm freelancers, customers, jobs..."
            // THAY ĐỔI: Bo tròn góc lớn hơn (rounded-xl), border nhẹ, focus ring màu xanh
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Nút thông báo */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <AiOutlineBell className="text-2xl text-gray-600" />
          <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button>

        {/* Avatar Admin */}
        <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors">
          <img src="https://i.pravatar.cc/40" alt="avatar" className="w-10 h-10 rounded-full border-2 border-green-500" />
          <div className="text-sm hidden sm:block">
            <div className="font-medium text-gray-800">Quản Trị Viên</div>
            <div className="text-xs text-gray-500">Admin User</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;