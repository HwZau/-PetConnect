import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { showSuccess, showError } from "../../utils/toastUtils";
import adminService from "../../services/admin/adminService";

const ITEMS_PER_PAGE = 6;

type CustomerFilter = {
  status: string;
  region: string;
};

const CustomersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useSettings();
  const navigate = useNavigate();
  const { users, loading, error, pagination, fetchUsers } = useAdminUsers();

  const handleCreateCustomer = async (data: CustomerFormData) => {
    console.log("Creating customer:", data);
    
    try {
      const email = data.email || `${data.name.replace(/\s+/g, '.').toLowerCase()}@example.com`;
      const password = data.password || 'TempPass123!';
      
      const payload = {
        name: data.name,
        email,
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        role: 'Customer',
        password,
        confirmPassword: password,
      };

      console.log("Create user payload:", payload);
      const res = await adminService.createUser({
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        address: payload.address,
        password: payload.password,
        role: 'Customer',
      });

      console.log("Create response:", res);

      if (res.success) {
        showSuccess('Khách hàng tạo thành công!');
        setIsModalOpen(false);
        setCurrentPage(1);
        await fetchUsers({ role: "Customer", page: 1, pageSize: ITEMS_PER_PAGE });
      } else {
        showError('Lỗi khi tạo khách hàng: ' + (res.error || res.message || 'Unknown'));
      }
    } catch (err) {
      console.error('Create customer error', err);
      showError('Lỗi khi tạo khách hàng');
    }
  };

  const handleViewDetails = (customerId: string) => {
    navigate(`/admin/customers/${customerId}`);
  };

  const [filter, setFilter] = useState<CustomerFilter>({
    status: "All",
    region: "All",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { searchQuery } = useSearch();

  // Refetch when filters or search query or page change
  React.useEffect(() => {
    const params: Record<string, unknown> = { role: "Customer", page: currentPage, pageSize: ITEMS_PER_PAGE };
    if (filter.status && filter.status !== "All") params.status = filter.status;
    if (filter.region && filter.region !== "All") params.region = filter.region;
    if (searchQuery) params.search = searchQuery;

    fetchUsers(params);
  }, [filter, searchQuery, currentPage, fetchUsers]);

  // LOGIC LỌC - Use API data from users hook
  const filteredCustomers = (users ?? []).filter((c) => {
    // 1. Trạng thái
    // 1. Trạng thái: backend exposes IsActive (or isActive)
    const isActive = (c as any).isActive ?? (c as any).IsActive ?? ((c as any).status ? ((c as any).status === "Active") : undefined);
    if (filter.status !== "All") {
      if (filter.status === "Active" && isActive === false) return false;
      if (filter.status === "Inactive" && isActive === true) return false;
    }

    // 2. Khu vực/address - backend uses Address/AddressUrl fields
    const address = (c as any).address ?? (c as any).Address ?? (c as any).region ?? (c as any).Region ?? "";
    if (filter.region !== "All" && !address.includes(filter.region)) return false;

    // Header search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${c.name} ${c.email} ${c.petInfo || ""} ${c.region || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  // LOGIC PHÂN TRANG
  // Use server-provided pagination; fetchUsers is called with role=Customer.
  // Also guard by role in case API returns mixed results.
  const totalPages = pagination?.totalPages || 1;
  const customers = (users ?? []).filter((u) => u.role === "Customer");
  const currentCustomers = customers;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > (pagination?.totalPages || 1)) return;
    setCurrentPage(page);
    fetchUsers({ role: "Customer", page, pageSize: ITEMS_PER_PAGE });
  };

  // Tính toán lại Stat Cards dựa trên dữ liệu API
  const totalVip = customers.filter((c) => c.status === "VIP").length;
  const totalNewCustomers = customers.filter(
    (c) =>
      c.joinDate &&
      new Date(c.joinDate) >
        new Date(new Date().setMonth(new Date().getMonth() - 1))
  ).length;
  const totalBookings = customers.reduce(
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
          value={(users ?? []).length}
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
              id={c.id}
              name={c.name}
              subtitle={c.email}
              avatar={c.avatar}
              badge={c.status as "Active" | "Inactive" | "VIP"}
              pet={c.petInfo}
              bookingCount={c.bookingCount || 0}
              totalSpent={c.totalSpent}
              lastBooking={c.joinDate || ""}
              region={c.region || ""}
              onViewDetails={handleViewDetails}
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
      />
    </div>
  );
};

export default CustomersPage;
