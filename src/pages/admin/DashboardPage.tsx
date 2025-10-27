import React from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import StatCard from "../../components/admin/StatCard";
import TransactionCard from "../../components/admin/TransactionCard";
import JobCard from "../../components/admin/JobCard";

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-2">Dashboard Overview</h2>
          <p className="text-gray-500 mb-6">Welcome back! Here's what's happening with your pet marketplace today.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Freelancers" value="247" delta="+12% from last month" />
            <StatCard title="Active Customers" value="1,834" delta="+8% from last month" />
            <StatCard title="Ongoing Jobs" value="89" delta="-3% from last week" />
            <StatCard title="Total Revenue" value="$48,392" delta="+22% from last month" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Revenue & Job Growth</h3>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">[Chart placeholder]</div>
            </div>

            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Recent Job Requests</h3>
              <div className="space-y-3">
                <JobCard title="Dog Walking" client="Sarah Johnson" status="Pending" date="2 hours ago" price="$20" />
                <JobCard title="Cat Sitting" client="Mike Chen" status="Assigned" date="4 hours ago" price="$35" />
                <JobCard title="Bird Care" client="Emma Davis" status="In Progress" date="6 hours ago" price="$18" />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <TransactionCard title="Service Payment" customer="Nguyen Thi Lan" amount="$120" status="Success" date="12/01/2025" />
            <TransactionCard title="Refund" customer="Le Thi Huong" amount="$45" status="Success" date="12/01/2025" />
            <TransactionCard title="Bank Transfer" customer="Võ Thị Mai" amount="$230" status="Pending" date="12/01/2025" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
