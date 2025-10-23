import React, { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import StatCard from "../../components/admin/StatCard";
import UserCard from "../../components/admin/UserCard";

const FreelancersPage: React.FC = () => {
  const [filter, setFilter] = useState({ status: "All", service: "All", rating: "All" });

  // mock list (UI demo only)
  const freelancers = [
    { id: 1, name: "Nguyễn Thị Lan", subtitle: "Chuyên gia chăm sóc chó", meta: "5 năm kinh nghiệm • Hà Nội", avatar: "https://i.pravatar.cc/84?img=10", badge: "Active" },
    { id: 2, name: "Trần Văn Minh", subtitle: "Huấn luyện viên thú cưng", meta: "7 năm • TP.HCM", avatar: "https://i.pravatar.cc/84?img=12", badge: "Busy" },
    { id: 3, name: "Lê Thị Hương", subtitle: "Chuyên gia chăm sóc mèo", meta: "3 năm • Đà Nẵng", avatar: "https://i.pravatar.cc/84?img=14", badge: "Active" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Quản Lý Freelancer</h2>
              <p className="text-gray-500">Quản lý và theo dõi tất cả các freelancer chăm sóc thú cưng trên nền tảng của bạn.</p>
            </div>
            <div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md">+ Thêm Freelancer Mới</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Tổng Freelancer" value="1,247" />
            <StatCard title="Đang Hoạt Động" value="892" />
            <StatCard title="Đang Bận" value="156" />
            <StatCard title="Đánh Giá Trung Bình" value="4.8" />
          </div>

          <div className="bg-white border rounded p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select className="border rounded px-3 py-2" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                <option>All</option>
                <option>Active</option>
                <option>Busy</option>
                <option>Offline</option>
              </select>
              <select className="border rounded px-3 py-2" value={filter.service} onChange={(e) => setFilter({ ...filter, service: e.target.value })}>
                <option>All services</option>
                <option>Grooming</option>
                <option>Training</option>
                <option>Sitting</option>
              </select>
              <select className="border rounded px-3 py-2" value={filter.rating} onChange={(e) => setFilter({ ...filter, rating: e.target.value })}>
                <option>All ratings</option>
                <option>4+</option>
                <option>4.5+</option>
              </select>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 bg-gray-100 rounded">Reset</button>
                <button className="px-3 py-2 bg-green-600 text-white rounded">Apply</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {freelancers.map((f) => (
              <UserCard
                key={f.id}
                name={f.name}
                subtitle={f.subtitle}
                avatar={f.avatar}
                meta={f.meta}
                badge={f.badge}
                actionLabel="Xem Hồ Sơ"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FreelancersPage;
