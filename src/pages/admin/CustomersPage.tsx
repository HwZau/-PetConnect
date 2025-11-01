// file: CustomersPage.tsx
import React, { useState } from "react";
import StatCard from "../../components/admin/StatCard";
import CustomerCard from "../../components/admin/CustomerCard";
import { AiOutlineUser, AiOutlineFileText, AiOutlineCalendar, AiOutlineTeam } from "react-icons/ai";

const ITEMS_PER_PAGE = 6;

// Định nghĩa cấu trúc dữ liệu khách hàng với các trường cần thiết cho lọc
interface Customer {
  id: number;
  name: string;
  subtitle: string;
  pet: string | undefined; // Thông tin Pet đầy đủ
  bookingCount: number; // Dùng cho lọc Số lần đặt
  totalSpent: string;
  lastBooking: string;
  region: string; // Dùng cho lọc Khu vực
  avatar: string;
  badge: "Hoạt động" | "Không hoạt động" | "VIP"; // Dùng cho lọc Trạng thái
  petTypeSimplified: 'Chó' | 'Mèo' | 'Khác/Chưa có'; // Dùng cho lọc Loại thú cưng
  joinDate: string; // YYYY-MM-DD, Dùng cho lọc Ngày tham gia
}

// MOCK DATA (Đã làm giàu để hỗ trợ 5 trường lọc)
const allCustomers: Customer[] = [
  { id: 1, name: "Nguyễn Thị Lan Anh", subtitle: "lananh@email.com", pet: "Buddy (Chó Golden)", bookingCount: 15, totalSpent: "12,500,000₫", lastBooking: "2 ngày trước", region: "Hà Nội", avatar: "https://i.pravatar.cc/84?img=15", badge: "Hoạt động", petTypeSimplified: 'Chó', joinDate: "2023-08-01" },
  { id: 2, name: "Trần Văn Minh", subtitle: "vanminh@email.com", pet: "Mimi (Mèo Ba Tư)", bookingCount: 28, totalSpent: "35,000,000₫", lastBooking: "1 tuần trước", region: "TP.HCM", avatar: "https://i.pravatar.cc/84?img=16", badge: "VIP", petTypeSimplified: 'Mèo', joinDate: "2023-03-10" },
  { id: 3, name: "Lê Thị Huệ", subtitle: "thihue@email.com", pet: undefined, bookingCount: 1, totalSpent: "500,000₫", lastBooking: "6 tháng trước", region: "Đà Nẵng", avatar: "https://i.pravatar.cc/84?img=17", badge: "Không hoạt động", petTypeSimplified: 'Khác/Chưa có', joinDate: "2024-05-25" },
  { id: 4, name: "Võ Thị Mai", subtitle: "votmai@email.com", pet: "Susu (Thỏ)", bookingCount: 7, totalSpent: "4,200,000₫", lastBooking: "1 tháng trước", region: "Hà Nội", avatar: "https://i.pravatar.cc/84?img=18", badge: "Hoạt động", petTypeSimplified: 'Khác/Chưa có', joinDate: "2024-07-15" },
  { id: 5, name: "Phạm Văn Lợi", subtitle: "pvanloi@email.com", pet: "Rex (Chó Alaska)", bookingCount: 40, totalSpent: "50,000,000₫", lastBooking: "3 ngày trước", region: "TP.HCM", avatar: "https://i.pravatar.cc/84?img=19", badge: "VIP", petTypeSimplified: 'Chó', joinDate: "2023-01-01" },
  { id: 6, name: "Đặng Tiến Dũng", subtitle: "tdzung@email.com", pet: "Kitty (Mèo Anh)", bookingCount: 10, totalSpent: "9,000,000₫", lastBooking: "4 tuần trước", region: "Hải Phòng", avatar: "https://i.pravatar.cc/84?img=20", badge: "Hoạt động", petTypeSimplified: 'Mèo', joinDate: "2024-02-20" },
  { id: 7, name: "Hoàng Ngọc Ánh", subtitle: "hna@email.com", pet: "Chưa có", bookingCount: 2, totalSpent: "1,500,000₫", lastBooking: "2 tháng trước", region: "Đà Nẵng", avatar: "https://i.pravatar.cc/84?img=21", badge: "Hoạt động", petTypeSimplified: 'Khác/Chưa có', joinDate: "2024-09-01" },
  { id: 8, name: "Trịnh Quang Hùng", subtitle: "tqh@email.com", pet: "Lucky (Chó Poodle)", bookingCount: 3, totalSpent: "2,000,000₫", lastBooking: "9 tháng trước", region: "Hà Nội", avatar: "https://i.pravatar.cc/84?img=22", badge: "Không hoạt động", petTypeSimplified: 'Chó', joinDate: "2023-06-12" },
  { id: 9, name: "Bùi Thị Yến", subtitle: "btyen@email.com", pet: "Gấu (Mèo Ragdoll)", bookingCount: 50, totalSpent: "70,000,000₫", lastBooking: "Hôm qua", region: "TP.HCM", avatar: "https://i.pravatar.cc/84?img=23", badge: "VIP", petTypeSimplified: 'Mèo', joinDate: "2023-11-20" },
  { id: 10, name: "Ngô Văn Phát", subtitle: "nvphat@email.com", pet: "Vẹt (Cockatiel)", bookingCount: 8, totalSpent: "5,800,000₫", lastBooking: "1 tháng trước", region: "Cần Thơ", avatar: "https://i.pravatar.cc/84?img=24", badge: "Hoạt động", petTypeSimplified: 'Khác/Chưa có', joinDate: "2024-04-05" },
];

const CustomersPage: React.FC = () => {
  // 5 trường lọc mới
  const [filter, setFilter] = useState({
    status: "All",
    petType: "All",
    bookingCount: "All",
    joinDate: "All",
    region: "All"
  });
  const [currentPage, setCurrentPage] = useState(1);

  // LOGIC LỌC
  const filteredCustomers = allCustomers.filter(c => {
    // 1. Trạng thái
    if (filter.status !== "All" && c.badge !== filter.status) return false;

    // 2. Loại thú cưng
    if (filter.petType !== "All" && c.petTypeSimplified !== filter.petType) return false;

    // 3. Số lần đặt
    if (filter.bookingCount !== "All") {
      const count = c.bookingCount;
      if (filter.bookingCount === "Low" && count > 5) return false; // Dưới 5 lần
      if (filter.bookingCount === "Medium" && (count <= 5 || count > 15)) return false; // 6-15 lần
      if (filter.bookingCount === "High" && count <= 15) return false; // Trên 15 lần
    }

    // 4. Ngày tham gia (Lọc đơn giản: Mới vs Cũ, dùng 6 tháng)
    if (filter.joinDate !== "All") {
      const date = new Date(c.joinDate);
      const sixMonthsAgo = new Date();
      // Lấy ngày hiện tại trừ đi 6 tháng
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      if (filter.joinDate === "New" && date < sixMonthsAgo) return false; // Mới: Tham gia trong 6 tháng gần nhất
      if (filter.joinDate === "Old" && date >= sixMonthsAgo) return false; // Cũ: Tham gia trước 6 tháng
    }

    // 5. Khu vực
    if (filter.region !== "All" && c.region !== filter.region) return false;

    return true;
  });


  // LOGIC PHÂN TRANG
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // END LOGIC PHÂN TRANG

  // Tính toán lại Stat Cards dựa trên dữ liệu thật
  const totalVip = allCustomers.filter(c => c.badge === 'VIP').length;
  const totalNewCustomers = allCustomers.filter(c => new Date(c.joinDate) > new Date(new Date().setMonth(new Date().getMonth() - 1))).length; // Khách hàng mới trong 1 tháng
  const totalBookings = allCustomers.reduce((sum, c) => sum + c.bookingCount, 0);

  const renderPagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-xl bg-white disabled:bg-gray-100 disabled:text-gray-400"
      >
        Trang Trước
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 rounded-xl font-semibold ${currentPage === index + 1 ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-xl bg-white disabled:bg-gray-100 disabled:text-gray-400"
      >
        Trang Sau
      </button>
    </div>
  );

  return (

    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Quản Lý Khách Hàng</h2>
          <p className="text-gray-500">Quản lý hồ sơ và lịch sử giao dịch của khách hàng.</p>
        </div>
        <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-md transition-colors">+ Thêm Khách Hàng</button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Tổng Khách Hàng"
          value={allCustomers.length}
          delta="8% so với tháng trước"
          icon={<AiOutlineUser />}
        />
        <StatCard
          title="Khách Hàng VIP"
          value={totalVip}
          delta="Tăng 15 người"
          icon={<AiOutlineFileText />}
          className="border-yellow-300"
        />
        <StatCard
          title="Tổng Lần Đặt Lịch"
          value={totalBookings}
          delta="Tăng 18% so với tháng trước"
          icon={<AiOutlineTeam />}
        />
        <StatCard
          title="Khách Hàng Mới (1 tháng)"
          value={totalNewCustomers}
          delta="Giảm 3%"
          icon={<AiOutlineCalendar />}
        />
      </div>

      {/* KHỐI LỌC (5 trường lọc mới) */}
      <div className="bg-white rounded-2xl shadow-xl  p-5 mb-8">
        <h3 className="text-lg font-semibold mb-3">Bộ Lọc Khách Hàng</h3>
        {/* Đã sửa grid thành 5 cột cho 5 trường lọc */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

          {/* 1. Trạng Thái */}
          <select
            className=" rounded-xl px-3 py-2 bg-white text-sm focus:ring-green-500 focus:border-green-500"
            value={filter.status}
            onChange={(e) => {
              setFilter({ ...filter, status: e.target.value });
              setCurrentPage(1); // RESET TRANG
            }}
          >
            <option value="All">Trạng Thái</option>
            <option value="Hoạt động">Hoạt Động</option>
            <option value="Không hoạt động">Không Hoạt Động</option>
            <option value="VIP">VIP</option>
          </select>

          {/* 2. Loại thú cưng (Sử dụng petTypeSimplified) */}
          <select
            className=" rounded-xl px-3 py-2 bg-white text-sm focus:ring-green-500 focus:border-green-500"
            value={filter.petType}
            onChange={(e) => {
              setFilter({ ...filter, petType: e.target.value });
              setCurrentPage(1); // RESET TRANG
            }}
          >
            <option value="All">Loại Thú Cưng</option>
            <option value="Chó">Chó</option>
            <option value="Mèo">Mèo</option>
            <option value="Khác/Chưa có">Khác/Chưa có</option>
          </select>

          {/* 3. Số lần đặt */}
          <select
            className=" rounded-xl px-3 py-2 bg-white text-sm focus:ring-green-500 focus:border-green-500"
            value={filter.bookingCount}
            onChange={(e) => {
              setFilter({ ...filter, bookingCount: e.target.value });
              setCurrentPage(1); // RESET TRANG
            }}
          >
            <option value="All">Số Lần Đặt</option>
            <option value="Low">Dưới 5 lần</option>
            <option value="Medium">6 - 15 lần</option>
            <option value="High">Trên 15 lần</option>
          </select>

          {/* 4. Ngày tham gia */}
          <select
            className=" rounded-xl px-3 py-2 bg-white text-sm focus:ring-green-500 focus:border-green-500"
            value={filter.joinDate}
            onChange={(e) => {
              setFilter({ ...filter, joinDate: e.target.value });
              setCurrentPage(1); // RESET TRANG
            }}
          >
            <option value="All">Ngày Tham Gia</option>
            <option value="New">6 Tháng Gần Nhất</option>
            <option value="Old">Trên 6 Tháng</option>
          </select>

          {/* 5. Khu vực */}
          <select
            className=" rounded-xl px-3 py-2 bg-white text-sm focus:ring-green-500 focus:border-green-500"
            value={filter.region}
            onChange={(e) => {
              setFilter({ ...filter, region: e.target.value });
              setCurrentPage(1); // RESET TRANG
            }}
          >
            <option value="All">Khu Vực</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP.HCM">TP.HCM</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Khác">Khác</option>
          </select>

          {/* Nút thao tác (Dùng col-span-5 để chiếm toàn bộ hàng mới) */}
          <div className="col-span-2 md:col-span-5 flex items-center gap-2 justify-end mt-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors"
              onClick={() => setFilter({ status: "All", petType: "All", bookingCount: "All", joinDate: "All", region: "All" })}
            >
              Đặt Lại Bộ Lọc
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">Áp Dụng</button>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Danh Sách Khách Hàng ({filteredCustomers.length})</h3>

      {/* DANH SÁCH CUSTOMER CARD (Đã cập nhật để dùng dữ liệu đã lọc) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCustomers.length > 0 ? (
          currentCustomers.map((c) => (
            <CustomerCard
              key={c.id}
              name={c.name}
              subtitle={c.subtitle}
              avatar={c.avatar}
              badge={c.badge}
              pet={c.pet}
              bookingCount={c.bookingCount}
              totalSpent={c.totalSpent}
              lastBooking={c.lastBooking}
              region={c.region}
            />
          ))
        ) : (
          <div className="md:col-span-3 text-center py-10 bg-white rounded-2xl text-gray-500 shadow-md">
            Không tìm thấy khách hàng nào phù hợp với bộ lọc.
          </div>
        )}
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default CustomersPage;