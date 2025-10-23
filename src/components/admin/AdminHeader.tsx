import React from "react";
import { AiOutlineSearch, AiOutlineBell } from "react-icons/ai";

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-white  py-3 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4 w-full max-w-3xl">
        <div className="relative flex-1">
          <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search freelancers, customers, jobs..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative">
          <AiOutlineBell className="text-xl text-gray-600" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">3</span>
        </button>

        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/40" alt="avatar" className="w-8 h-8 rounded-full" />
          <div className="text-sm">
            <div className="font-medium">Admin User</div>
            <div className="text-xs text-gray-500">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
