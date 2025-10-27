import React, { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import StatCard from "../../components/admin/StatCard";
import JobCard from "../../components/admin/JobCard";

const JobsPage: React.FC = () => {
  const [filter, setFilter] = useState({ status: "All", type: "All" });

  const jobs = [
    { id: 1, title: "Chăm Sóc Tai Nhỏ - Buddy", client: "Nguyễn Thị Lan Anh", status: "Pending", date: "10/10/2025", price: "$30" },
    { id: 2, title: "Tắm Rửa & Cắt Tỉa - Mimi", client: "Trần Văn Minh", status: "Completed", date: "09/10/2025", price: "$45" },
    { id: 3, title: "Chăm Sóc Sức Khỏe - Luna", client: "Võ Thị Mai", status: "In Progress", date: "11/10/2025", price: "$60" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Quản Lý Công Việc</h2>
              <p className="text-gray-500">Quản lý và theo dõi tất cả các công việc trên nền tảng.</p>
            </div>
            <div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md">+ Tạo Công Việc Mới</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Tổng Công Việc" value="3,456" />
            <StatCard title="Đang Thực Hiện" value="234" />
            <StatCard title="Hoàn Thành" value="2,987" />
            <StatCard title="Doanh Thu" value="$245M" />
          </div>

          <div className="bg-white border rounded p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select className="border rounded px-3 py-2" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                <option>All</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <select className="border rounded px-3 py-2" value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                <option>All types</option>
                <option>Grooming</option>
                <option>Training</option>
                <option>Medical</option>
              </select>
              <div className="col-span-2 flex items-center gap-2 justify-end">
                <button className="px-3 py-2 bg-gray-100 rounded">Reset</button>
                <button className="px-3 py-2 bg-green-600 text-white rounded">Apply</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((j) => (
              <JobCard key={j.id} title={j.title} client={j.client} status={j.status as any} date={j.date} price={j.price} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobsPage;
