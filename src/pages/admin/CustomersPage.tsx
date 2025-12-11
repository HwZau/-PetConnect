// file: CustomersPage.tsx - Fixed version without mock data
import React, { useState } from "react";
import StatCard from "../../components/admin/StatCard";
import CustomerCard from "../../components/admin/CustomerCard";
import FiltersPanel from "../../components/admin/FiltersPanel";
import {
  AiOutlineUser,
  AiOutlineFileText,
  AiOutlineCalendar,
  AiOutlineTeam,
  AiOutlineEnvironment,
} from "react-icons/ai";
import { useSearch } from "../../contexts/SearchContext";
import { useSettings } from "../../contexts/SettingsContext";
import type { CustomerFormData } from "../../components/admin/modal/CustomerModal";
import CustomerModal from "../../components/admin/modal/CustomerModal";
import { useAdminUsers } from "../../hooks/useAdmin";

const ITEMS_PER_PAGE = 6;

type CustomerFilter = {
  status: string;
  petType: string;
  bookingCount: string;
  joinDate: string;
  region: string;
};

const CustomersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useSettings();
  const { users, loading, error, fetchUsers, createUser } = useAdminUsers();

  // Fetch users on mount
  React.useEffect(() => {
    fetchUsers({ role: "Customer" });
  }, [fetchUsers]);

  const handleCreateCustomer = async (data: CustomerFormData) => {
    console.log("Creating customer:", data);
    const result = await createUser({
      name: data.name || "",
      email: data.email,
      phone: data.phone || "",
      role: "Customer",
      status: "Active",
      password: "TempPassword123!", // Should be generated on backend
    });

    if (result.success) {
      setIsModalOpen(false);
      alert("Khách hàng tạo thành công!");
      await fetchUsers({ role: "Customer" });
    } else {
      alert("Lỗi: " + (result.error || "Không thể tạo khách hàng"));
    }
  };

  // Mock data for modal dropdowns
  const mockPetTypes = [
    { id: "dog", name: "Chó" },
    { id: "cat", name: "Mèo" },
    { id: "other", name: "Khác" },
  ];

  const mockPetBreeds = [
    { id: "golden", name: "Golden Retriever", petTypeId: "dog" },
    { id: "alaska", name: "Alaska", petTypeId: "dog" },
    { id: "poodle", name: "Poodle", petTypeId: "dog" },
    { id: "persian", name: "Ba Tư", petTypeId: "cat" },
    { id: "british", name: "Anh Lông Ngắn", petTypeId: "cat" },
    { id: "ragdoll", name: "Ragdoll", petTypeId: "cat" },
  ];

  const [filter, setFilter] = useState<CustomerFilter>({
    status: "All",
    petType: "All",
    bookingCount: "All",
    joinDate: "All",
    region: "All",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { searchQuery } = useSearch();

  // LOGIC LỌC - Use API data from users hook
  const filteredCustomers = users.filter((c) => {
    // 1. Trạng thái
    if (filter.status !== "All" && c.status !== filter.status) return false;

    // 2. Loại thú cưng
    if (filter.petType !== "All" && c.petInfo && !c.petInfo.includes(filter.petType))
      return false;

    // 3. Số lần đặt
    if (filter.bookingCount !== "All" && c.bookingCount !== undefined) {
      const count = c.bookingCount;
      if (filter.bookingCount === "Low" && count > 5) return false;
      if (filter.bookingCount === "Medium" && (count <= 5 || count > 15))
        return false;
      if (filter.bookingCount === "High" && count <= 15) return false;
    }

    // 4. Ngày tham gia
    if (filter.joinDate !== "All" && c.joinDate) {
      const date = new Date(c.joinDate);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      if (filter.joinDate === "New" && date < sixMonthsAgo) return false;
      if (filter.joinDate === "Old" && date >= sixMonthsAgo) return false;
    }

    // 5. Khu vực
    if (filter.region !== "All" && c.region !== filter.region) return false;

    // Header search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${c.name} ${c.email} ${c.petInfo || ""} ${c.region || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

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

  // Tính toán lại Stat Cards dựa trên dữ liệu API
  const totalVip = users.filter((c) => c.status === "VIP").length;
  const totalNewCustomers = users.filter(
    (c) =>
      c.joinDate &&
      new Date(c.joinDate) >
        new Date(new Date().setMonth(new Date().getMonth() - 1))
  ).length;
  const totalBookings = users.reduce(
    (sum, c) => sum + (c.bookingCount || 0),
    0
  );

  const renderPagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-xl ${
          theme === "dark"
            ? "bg-gray-800 text-gray-200 disabled:bg-gray-700 disabled:text-gray-400"
            : "bg-white disabled:bg-gray-100 disabled:text-gray-400"
        }`}
      >
        Trang Trước
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 rounded-xl font-semibold ${
            currentPage === index + 1
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-xl ${
          theme === "dark"
            ? "bg-gray-800 text-gray-200 disabled:bg-gray-700 disabled:text-gray-400"
            : "bg-white disabled:bg-gray-100 disabled:text-gray-400"
        }`}
      >
        Trang Sau
      </button>
    </div>
  );

  return (
    <div
      className={`p-8 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-800"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Quản Lý Khách Hàng</h2>
          <p className="text-gray-500">
            Quản lý hồ sơ và lịch sử giao dịch của khách hàng.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-md transition-colors"
        >
          + Thêm Khách Hàng
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Tổng Khách Hàng"
          value={users.length}
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

      {/* FILTER */}
      <FiltersPanel
        fields={[
          {
            key: "status",
            label: "Trạng Thái",
            type: "select",
            icon: <AiOutlineUser />,
            options: [
              { value: "Active", label: "Hoạt Động" },
              { value: "Inactive", label: "Không Hoạt Động" },
              { value: "VIP", label: "VIP" },
            ],
          },
          {
            key: "petType",
            label: "Loại Thú Cưng",
            type: "select",
            icon: <AiOutlineFileText />,
            options: [
              { value: "Chó", label: "Chó" },
              { value: "Mèo", label: "Mèo" },
              { value: "Khác", label: "Khác" },
            ],
          },
          {
            key: "bookingCount",
            label: "Số Lần Đặt",
            type: "select",
            icon: <AiOutlineTeam />,
            options: [
              { value: "Low", label: "Dưới 5" },
              { value: "Medium", label: "6-15" },
              { value: "High", label: "Trên 15" },
            ],
          },
          {
            key: "joinDate",
            label: "Ngày Tham Gia",
            type: "select",
            icon: <AiOutlineCalendar />,
            options: [
              { value: "New", label: "6 Tháng Gần Nhất" },
              { value: "Old", label: "Trên 6 Tháng" },
            ],
          },
          {
            key: "region",
            label: "Khu Vực",
            type: "select",
            icon: <AiOutlineEnvironment />,
            options: [
              { value: "Hà Nội", label: "Hà Nội" },
              { value: "TP.HCM", label: "TP.HCM" },
              { value: "Đà Nẵng", label: "Đà Nẵng" },
            ],
          },
        ]}
        values={filter}
        onChange={(next: CustomerFilter) => {
          setFilter(next);
          setCurrentPage(1);
        }}
        onReset={() =>
          setFilter({
            status: "All",
            petType: "All",
            bookingCount: "All",
            joinDate: "All",
            region: "All",
          })
        }
      />

      <h3 className="text-xl font-bold mb-4">
        Danh Sách Khách Hàng ({filteredCustomers.length})
      </h3>

      {/* DANH SÁCH CUSTOMER CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && currentCustomers.length > 0 ? (
          currentCustomers.map((c) => (
            <CustomerCard
              key={c.id}
              name={c.name}
              subtitle={c.email}
              avatar={c.avatar}
              badge={c.status as "Active" | "Inactive" | "VIP"}
              pet={c.petInfo}
              bookingCount={c.bookingCount || 0}
              totalSpent={c.totalSpent}
              lastBooking={c.joinDate || ""}
              region={c.region || ""}
            />
          ))
        ) : loading ? (
          <div className="md:col-span-3 text-center py-10">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="md:col-span-3 text-center py-10 rounded-2xl shadow-md px-6">
            <div
              className={`${
                theme === "dark"
                  ? "bg-gray-800 text-gray-300"
                  : "bg-white text-gray-500"
              } rounded-2xl py-6`}
            >
              {error ? `Lỗi: ${error}` : "Không tìm thấy khách hàng nào phù hợp với bộ lọc."}
            </div>
          </div>
        )}
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && renderPagination()}

      {/* Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCustomer}
        petTypes={mockPetTypes}
        petBreeds={mockPetBreeds}
      />
    </div>
  );
};

export default CustomersPage;
