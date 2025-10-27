import React, { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import StatCard from "../../components/admin/StatCard";
import TransactionCard from "../../components/admin/TransactionCard";

const PaymentsPage: React.FC = () => {
  const [filter, setFilter] = useState({ status: "All", method: "All" });

  const transactions = [
    { id: 1, title: "Payment for Buddy", customer: "Nguyễn Thị Lan", amount: "$120", status: "Success", date: "12/01/2025" },
    { id: 2, title: "Refund for Mimi", customer: "Trần Văn Minh", amount: "$45", status: "Success", date: "12/02/2025" },
    { id: 3, title: "Bank Transfer", customer: "Võ Thị Mai", amount: "$200", status: "Pending", date: "12/03/2025" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Quản Lý Thanh Toán</h2>
              <p className="text-gray-500">Theo dõi tất cả giao dịch và lịch sử thanh toán trên nền tảng.</p>
            </div>
            <div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md">+ Tạo Giao Dịch</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Tổng Doanh Thu" value="$2.45B" />
            <StatCard title="Giao Dịch Thành Công" value="3,245" />
            <StatCard title="Giao Dịch Lỗi" value="89" />
            <StatCard title="Hoa Hồng Nền Tảng" value="$245M" />
          </div>

          <div className="bg-white border rounded p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select className="border rounded px-3 py-2" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                <option>All</option>
                <option>Success</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
              <select className="border rounded px-3 py-2" value={filter.method} onChange={(e) => setFilter({ ...filter, method: e.target.value })}>
                <option>All methods</option>
                <option>Credit Card</option>
                <option>Bank Transfer</option>
                <option>Wallet</option>
              </select>
              <div className="col-span-2 flex items-center gap-2 justify-end">
                <button className="px-3 py-2 bg-gray-100 rounded">Reset</button>
                <button className="px-3 py-2 bg-green-600 text-white rounded">Apply</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {transactions.map((t) => (
              <TransactionCard key={t.id} title={t.title} customer={t.customer} amount={t.amount} status={t.status as any} date={t.date} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentsPage;
