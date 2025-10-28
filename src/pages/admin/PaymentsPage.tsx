// file: PaymentsPage.tsx
import React, { useState } from "react";
// Loại bỏ AdminHeader và AdminSidebar theo các phiên bản làm việc trước
import StatCard from "../../components/admin/StatCard";
import TransactionCard from "../../components/admin/TransactionCard";
import { AiOutlineDollarCircle, AiOutlineLineChart, AiOutlineSwap } from "react-icons/ai";

const ITEMS_PER_PAGE = 6;

// Định nghĩa kiểu dữ liệu chi tiết cho giao dịch
type UserType = "Customer" | "Freelancer";

interface Transaction {
  id: number;
  title: string;
  customer: string;
  freelancer: string;
  service: string;
  method: string;
  amount: string;
  platformFee: string;
  status: "Success" | "Pending" | "Failed"; // Kiểu chuỗi literal cho TransactionCard
  type: "Payment" | "Refund" | "Fee";
  date: string;
  userType: UserType;
  totalAmount: number;
}

const PaymentsPage: React.FC = () => {
  const [filter, setFilter] = useState({
    status: "All",
    method: "All",
    type: "All",
    amountRange: "All",
    dateRange: "All",
    userType: "All"
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Dữ liệu giả định đầy đủ chi tiết
  const allTransactions: Transaction[] = [
    { id: 1, title: "Thanh toán Dịch vụ Buddy", customer: "Nguyễn Thị Lan Anh", freelancer: "Nguyễn Văn A", service: "Grooming", method: "Credit Card", amount: "1,200,000₫", platformFee: "60,000₫", status: "Success", date: "10/10/2025", type: "Payment", userType: "Customer", totalAmount: 1200000 },
    { id: 2, title: "Hoàn tiền cho Mimi", customer: "Trần Văn Minh", freelancer: "Trần Văn A", service: "Sitting", method: "Bank Transfer", amount: "500,000₫", platformFee: "0₫", status: "Success", date: "09/10/2025", type: "Refund", userType: "Customer", totalAmount: 500000 },
    { id: 3, title: "Phí dịch vụ Rex (tháng 10)", customer: "Võ Thị Mai", freelancer: "Lê Thị B", service: "Training", method: "Wallet", amount: "80,000₫", platformFee: "80,000₫", status: "Pending", date: "11/10/2025", type: "Fee", userType: "Freelancer", totalAmount: 80000 },
    { id: 4, title: "Thanh toán Dịch vụ Kitty", customer: "Phạm Văn Lợi", freelancer: "Phạm Văn Lợi", service: "Sitting", method: "Credit Card", amount: "1,500,000₫", platformFee: "75,000₫", status: "Failed", date: "13/10/2025", type: "Payment", userType: "Customer", totalAmount: 1500000 },
    { id: 5, title: "Rút tiền hoa hồng (Freelancer A)", customer: "N/A", freelancer: "Nguyễn Văn A", service: "N/A", method: "Bank Transfer", amount: "4,000,000₫", platformFee: "5,000₫", status: "Success", date: "14/10/2025", type: "Refund", userType: "Freelancer", totalAmount: 4000000 },
    { id: 6, title: "Thanh toán Vệ sinh chuồng", customer: "Trịnh Quang Hùng", freelancer: "Lê Thị B", service: "Grooming", method: "Wallet", amount: "500,000₫", platformFee: "25,000₫", status: "Success", date: "05/10/2025", type: "Payment", userType: "Customer", totalAmount: 500000 },
    { id: 7, title: "Phí dịch vụ Gấu (tháng 10)", customer: "Bùi Thị Yến", freelancer: "Lê Thị B", service: "Grooming", method: "Wallet", amount: "55,000₫", platformFee: "55,000₫", status: "Pending", date: "15/10/2025", type: "Fee", userType: "Freelancer", totalAmount: 55000 },
    { id: 8, title: "Thanh toán Huấn luyện", customer: "Ngô Văn Phát", freelancer: "Nguyễn Văn A", service: "Training", method: "Credit Card", amount: "300,000₫", platformFee: "15,000₫", status: "Success", date: "16/10/2025", type: "Payment", userType: "Customer", totalAmount: 300000 },
    { id: 9, title: "Thanh toán cho dịch vụ Khác", customer: "Lê Văn Tám", freelancer: "Trần Văn A", service: "Medical", method: "Bank Transfer", amount: "750,000₫", platformFee: "37,500₫", status: "Success", date: "17/10/2025", type: "Payment", userType: "Customer", totalAmount: 750000 },
    { id: 10, title: "Rút tiền hoa hồng (Freelancer B)", customer: "N/A", freelancer: "Lê Thị B", service: "N/A", method: "Bank Transfer", amount: "1,500,000₫", platformFee: "5,000₫", status: "Success", date: "18/10/2025", type: "Refund", userType: "Freelancer", totalAmount: 1500000 },
  ];

  // LOGIC LỌC
  const filteredTransactions = allTransactions.filter(t => {
    if (filter.status !== "All" && t.status !== filter.status as Transaction['status']) return false;
    if (filter.method !== "All" && t.method !== filter.method) return false;
    if (filter.type !== "All" && t.type !== filter.type as Transaction['type']) return false;
    if (filter.amountRange !== "All") {
      const amount = t.totalAmount;
      if (filter.amountRange === "Low" && amount > 500000) return false;
      if (filter.amountRange === "Medium" && (amount <= 500000 || amount > 1500000)) return false;
      if (filter.amountRange === "High" && amount <= 1500000) return false;
    }
    if (filter.userType !== "All" && t.userType !== filter.userType as Transaction['userType']) return false;
    return true;
  });

  // LOGIC PHÂN TRANG (6 mục/trang)
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Tính toán số liệu thống kê (Đã sửa lỗi parseInt)
  const totalRevenue = allTransactions
    .filter(t => t.status === "Success" && t.type === "Payment")
    .reduce((sum, t) => sum + t.totalAmount, 0) / 1000000;

  const totalFees = allTransactions
    .filter(t => t.status === "Success" && t.platformFee !== "0₫")
    .map(t => {
      const cleanedFee = t.platformFee.replace(/[.,₫]/g, '');
      return parseInt(cleanedFee) || 0;
    })
    .reduce((sum, fee) => sum + fee, 0) / 1000;

  // UI Phân trang (Giữ nguyên)
  const renderPagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-xl bg-white disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
      >
        Trang Trước
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 rounded-xl font-semibold transition-colors ${currentPage === index + 1 ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'
            }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-xl bg-white disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
      >
        Trang Sau
      </button>
    </div>
  );


  return (
    // Đã thay đổi cấu trúc để phù hợp với phiên bản bạn cung cấp nhưng bỏ Sidebar/Header để độc lập
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Quản Lý Giao Dịch</h2>
          <p className="text-gray-500">Tổng quan về doanh thu và các hoạt động thanh toán.</p>
        </div>
        {/* Giữ lại nút tạo giao dịch từ template cũ của bạn */}
        <div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium">+ Tạo Giao Dịch</button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng Doanh Thu (Triệu)"
          value={`${totalRevenue.toFixed(1)}M ₫`}
          delta="+15% so với tháng trước"
          icon={<AiOutlineLineChart />}
        />
        <StatCard
          title="Tổng Phí Nền Tảng (Nghìn)"
          value={`${totalFees.toFixed(0)}K ₫`}
          delta="+20% so với tháng trước"
          icon={<AiOutlineDollarCircle />}
        />
        <StatCard
          title="Giao Dịch Đang Chờ"
          value={allTransactions.filter(t => t.status === 'Pending').length}
          delta="Cần xác nhận"
          icon={<AiOutlineSwap />}
        />
        <StatCard
          title="Giao Dịch Thành Công"
          value={allTransactions.filter(t => t.status === 'Success').length}
          delta="+5% so với tuần trước"
          icon={<AiOutlineDollarCircle />}
        />
      </div>

      {/* KHỐI LỌC (6 trường lọc) */}
      <div className="bg-white rounded-2xl shadow-xl  p-5 mb-8">
        <h3 className="text-lg font-semibold mb-4">Bộ Lọc Giao Dịch</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {/* 1. Trạng Thái */}
          <select
            className="border rounded-xl px-3 py-2 bg-white text-sm focus:ring-green-500 focus:border-green-500"
            value={filter.status}
            onChange={(e) => {
              setFilter({ ...filter, status: e.target.value });
              setCurrentPage(1); // RESET TRANG
            }}
          >
            <option value="All">Trạng Thái</option>
            <option value="Success">Thành Công</option>
            <option value="Pending">Đang Chờ</option>
            <option value="Failed">Thất Bại</option>
          </select>

          {/* 2. Phương Thức */}
          <select
            className=" rounded-xl px-3 py-2 bg-white text-sm focus:ring-green-500 focus:border-green-500"
            value={filter.method}
            onChange={(e) => {
              setFilter({ ...filter, method: e.target.value });
              setCurrentPage(1); // RESET TRANG
            }}
          >
            <option value="All">Phương Thức</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Chuyển Khoản</option>
            <option value="Wallet">Ví Điện Tử</option>
          </select>

          {/* 3. Loại Giao Dịch */}
          <select
            className=" rounded-xl px-3 py-2 bg-white text-sm focus:ring-green-500 focus:border-green-500"
            value={filter.type}
            onChange={(e) => {
              setFilter({ ...filter, type: e.target.value });
              setCurrentPage(1); // RESET TRANG
            }}
          >
            <option value="All">Loại Giao Dịch</option>
            <option value="Payment">Thanh Toán Dịch Vụ</option>
            <option value="Refund">Hoàn Tiền/Rút Tiền</option>
            <option value="Fee">Phí Nền Tảng</option>
          </select>

          {/* 4. Khoảng Tiền */}
          <select
            className=" rounded-xl px-3 py-2 bg-white text-sm focus:ring-green-500 focus:border-green-500"
            value={filter.amountRange}
            onChange={(e) => {
              setFilter({ ...filter, amountRange: e.target.value });
              setCurrentPage(1); // RESET TRANG
            }}
          >
            <option value="All">Khoảng Tiền</option>
            <option value="Low">Dưới 500K ₫</option>
            <option value="Medium">500K - 1.5M ₫</option>
            <option value="High">Trên 1.5M ₫</option>
          </select>

          {/* 5. Ngày Giao Dịch */}
          <select
            className=" rounded-xl px-3 py-2 bg-white text-sm focus:ring-green-500 focus:border-green-500"
            value={filter.dateRange}
            onChange={(e) => {
              setFilter({ ...filter, dateRange: e.target.value });
              setCurrentPage(1); // RESET TRANG
            }}
          >
            <option value="All">Ngày Giao Dịch</option>
            <option value="Today">Hôm nay</option>
            <option value="This Week">Tuần này</option>
            <option value="This Month">Tháng này</option>
          </select>

          {/* 6. Người Dùng */}
          <select
            className=" rounded-xl px-3 py-2 bg-white text-sm focus:ring-green-500 focus:border-green-500"
            value={filter.userType}
            onChange={(e) => {
              setFilter({ ...filter, userType: e.target.value });
              setCurrentPage(1); // RESET TRANG
            }}
          >
            <option value="All">Người Dùng</option>
            <option value="Customer">Khách Hàng</option>
            <option value="Freelancer">Freelancer</option>
          </select>
          
          {/* Nút thao tác */}
          <div className="col-span-2 md:col-span-6 flex items-center gap-2 justify-end mt-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors"
              onClick={() => setFilter({ status: "All", method: "All", type: "All", amountRange: "All", dateRange: "All", userType: "All" })}
            >
              Đặt Lại Bộ Lọc
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">Áp Dụng</button>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Danh Sách Giao Dịch ({filteredTransactions.length})</h3>

      {/* DANH SÁCH TRANSACTION CARD (ĐÃ SỬA: Truyền đủ các props chi tiết) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTransactions.length > 0 ? (
          currentTransactions.map((t) => (
            <TransactionCard
              key={t.id}
              title={t.title}
              customer={t.customer} // Khách hàng
              freelancer={t.freelancer} // Props mới
              service={t.service} // Props mới
              method={t.method} // Props mới
              date={t.date} // Thời gian
              amount={t.amount} // Tổng tiền giao dịch
              platformFee={t.platformFee} // Props mới
              status={t.status} // Props đã được Type Check chính xác
            />
          ))
        ) : (
          <div className="md:col-span-3 text-center py-10 bg-white rounded-2xl text-gray-500 shadow-md">
            Không tìm thấy giao dịch nào phù hợp với bộ lọc.
          </div>
        )}
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default PaymentsPage;