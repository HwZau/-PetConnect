import React, { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import StatCard from "../../components/admin/StatCard";
import UserCard from "../../components/admin/UserCard";

const CustomersPage: React.FC = () => {
  const [filter, setFilter] = useState({ status: "All", region: "All" });

  const customers = [
    { id: 1, name: "Nguyễn Thị Lan Anh", subtitle: "lananh@email.com", meta: "Buddy (Chó Golden) • Hà Nội", avatar: "https://i.pravatar.cc/84?img=15", badge: "Active" },
    { id: 2, name: "Trần Văn Minh", subtitle: "vanminh@email.com", meta: "Mimi (Mèo Ba Tư) • TP.HCM", avatar: "https://i.pravatar.cc/84?img=16", badge: "VIP" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Quản Lý Khách Hàng</h2>
              <p className="text-gray-500">Quản lý và theo dõi tất cả khách hàng và thú cưng của họ trên nền tảng.</p>
            </div>
            <div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md">+ Thêm Khách Hàng Mới</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Tổng Khách Hàng" value="2,847" />
            <StatCard title="Khách Hàng Hoạt Động" value="1,923" />
            <StatCard title="Tổng Thú Cưng" value="4,156" />
            <StatCard title="Đặt Lịch Tháng Này" value="1,234" />
          </div>

          <div className="bg-white border rounded p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select className="border rounded px-3 py-2" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <select className="border rounded px-3 py-2" value={filter.region} onChange={(e) => setFilter({ ...filter, region: e.target.value })}>
                <option>All regions</option>
                <option>Hà Nội</option>
                <option>TP.HCM</option>
              </select>
              <div className="col-span-2 flex items-center gap-2 justify-end">
                <button className="px-3 py-2 bg-gray-100 rounded">Reset</button>
                <button className="px-3 py-2 bg-green-600 text-white rounded">Apply</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customers.map((c) => (
              <UserCard key={c.id} name={c.name} subtitle={c.subtitle} avatar={c.avatar} meta={c.meta} badge={c.badge} actionLabel="Xem Chi Tiết" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomersPage;
