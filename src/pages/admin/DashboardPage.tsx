// file: DashboardPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom"; 
// Import icons cần thiết
import { AiOutlineDollar, AiOutlineUser, AiOutlineFileText, AiOutlineProfile } from "react-icons/ai";
import StatCard from "../../components/admin/StatCard";
// Import JobCardDashboard mới
import JobCardDashboard from "../../components/admin/JobCardDashboard"; 
import TransactionCard from "../../components/admin/TransactionCard"; // Giữ nguyên

const DashboardPage: React.FC = () => {
    const navigate = useNavigate(); 
    
    const handleViewAllJobs = () => {
        navigate("/admin/jobs"); // Chuyển hướng đến trang JobsPage
    };

    // Dữ liệu mock cho Recent Job Requests (Đã chuyển sang cấu trúc đơn giản)
    const recentJobs = [
        { 
            id: 1, 
            title: "Chăm Sóc Tai Nhỏ - Buddy", 
            client: "Nguyễn Thị Lan Anh", 
            status: "Pending", 
            date: "2 giờ trước", 
            price: "300,000₫" 
        },
        { 
            id: 2, 
            title: "Tắm Rửa & Cắt Tỉa - Mimi", 
            client: "Trần Văn Minh", 
            status: "Completed", 
            date: "1 ngày trước", 
            price: "450,000₫" 
        },
        { 
            id: 3, 
            title: "Huấn Luyện Cơ Bản - Kiki", 
            client: "Lê Văn Hải", 
            status: "In Progress", 
            date: "11/10/2025", 
            price: "800,000₫" 
        },
    ];

    // Dữ liệu mock cho Transaction Card (Giữ nguyên)
    const recentTransactions = [
        { id: 1, title: "Thanh toán Dịch vụ", customer: "Nguyễn Thị Lan", amount: "$120", status: "Success", date: "12/01/2025", freelancer: "Trần Văn B", service: "Cắt Tỉa", method: "Thẻ", platformFee: "$12" },
        { id: 2, title: "Yêu cầu rút tiền", customer: "Trần Văn Minh", amount: "$45", status: "Pending", date: "12/02/2025", freelancer: "Trần Văn Minh", service: "Rút tiền", method: "Chuyển khoản", platformFee: "$0" },
        { id: 3, title: "Thanh toán Dịch vụ", customer: "Võ Thị Mai", amount: "$200", status: "Failed", date: "12/03/2025", freelancer: "Lê Thị C", service: "Giữ Hộ", method: "Ví Điện Tử", platformFee: "$20" },
    ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1">
        <main className="p-6 ">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Tổng Quan Dashboard</h2>
          <p className="text-gray-500 mb-6">Chào mừng trở lại! Dưới đây là hoạt động hôm nay của thị trường thú cưng.</p>

          {/* STAT CARDS (Giữ nguyên) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Tổng Freelancers" value="247" delta="+12% so với tháng trước" icon={<AiOutlineUser />} />
            <StatCard title="Khách Hàng Hoạt Động" value="1,834" delta="+8% so với tháng trước" icon={<AiOutlineFileText />} />
            <StatCard title="Công Việc Đang Thực Hiện" value="89" delta="-3% so với tuần trước" icon={<AiOutlineProfile />} />
            <StatCard title="Tổng Doanh Thu" value="$48,392" delta="+22% so với tháng trước" icon={<AiOutlineDollar />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COLUMN 1: Revenue Chart */}
            <div className="lg:col-span-2 bg-white  rounded-2xl p-5 shadow-xl">
              <h3 className="font-bold text-xl mb-3">Tăng Trưởng Doanh Thu & Công Việc</h3>
              <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                [Biểu đồ Tăng Trưởng (Placeholder)]
              </div>
            </div>

            {/* COLUMN 2: Recent Job Requests - ĐÃ CẬP NHẬT SỬ DỤNG CARD ĐƠN GIẢN */}
            <div className="bg-white  rounded-2xl p-5 shadow-xl">
                <div className="flex justify-between items-center mb-4 pb-2 ">
                    <h3 className="font-bold text-xl">Yêu Cầu Công Việc Gần Đây</h3>
                    {/* NÚT XEM TẤT CẢ */}
                    <button 
                        onClick={handleViewAllJobs} 
                        className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                    >
                        Xem Tất Cả &rarr;
                    </button>
                </div>
              <div className="space-y-4">
                {recentJobs.map((j) => (
                    // Sử dụng JobCardDashboard với props đơn giản
                    <JobCardDashboard 
                        key={j.id} 
                        title={j.title} 
                        client={j.client} 
                        status={j.status as any} 
                        date={j.date}
                        price={j.price} 
                    />
                ))}
              </div>
            </div>
          </div>

          {/* RECENT TRANSACTIONS (Giữ nguyên) */}
          <h3 className="font-bold text-xl mt-8 mb-4">Giao Dịch Gần Đây</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTransactions.map((t) => (
              <TransactionCard 
                key={t.id} 
                title={t.title} 
                customer={t.customer} 
                amount={t.amount} 
                status={t.status as any} 
                date={t.date} 
                freelancer={t.freelancer}
                service={t.service}
                method={t.method}
                platformFee={t.platformFee}
              />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;