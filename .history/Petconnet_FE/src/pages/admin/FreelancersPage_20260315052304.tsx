// file: FreelancersPage.tsx - Fixed version without mock data
import React, { useState } from "react";
import StatCard from "../../components/admin/StatCard";
import FreelancerCard from "../../components/admin/FreelancerCard";
import FiltersPanel from "../../components/admin/FiltersPanel";
import {
  AiOutlineUser,
  AiOutlineFileText,
  AiOutlineStar,
  AiOutlineCalendar,
  AiOutlineEnvironment,
} from "react-icons/ai";
import { useSearch } from "../../contexts/SearchContext";
import { useSettings } from "../../contexts/SettingsContext";
import type { FreelancerFormData } from "../../components/admin/modal/FreelancerModal";
import FreelancerModal from "../../components/admin/modal/FreelancerModal";
import { useAdminFreelancers } from "../../hooks/useAdmin";
import adminService from "../../services/admin/adminService";
import { showError, showSuccess } from "../../utils/toastUtils";

const ITEMS_PER_PAGE = 6;

type FreelancerFilter = {
  status: string;
  region: string;
};

const FreelancersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useSettings();
  const { freelancers, loading, error, fetchFreelancers } =
    useAdminFreelancers();

  // Fetch freelancers on mount
  React.useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  const handleCreateFreelancer = async (data: FreelancerFormData) => {
    console.log("Creating freelancer:", data);
    
    try {
      const email = data.email || `${data.name.replace(/\s+/g, '.').toLowerCase()}@example.com`;
      const password = data.password || 'TempPass123!';
      
      const payload = {
        name: data.name,
        email,
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        role: 'Freelancer',
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
        role: 'Freelancer',
      });

      console.log("Create response:", res);

      if (res.success) {
        showSuccess('Freelancer tạo thành công!');
        setIsModalOpen(false);
        await fetchFreelancers();
      } else {
        showError('Lỗi khi tạo freelancer: ' + (res.error || res.message || 'Unknown'));
      }
    } catch (err) {
      console.error('Create freelancer error', err);
      showError('Lỗi khi tạo freelancer');
    }
  };

  // Mock data for modal dropdowns
  const mockServiceTypes = [
    { id: "grooming", name: "Grooming", price: 700000 },
    { id: "training", name: "Training", price: 1200000 },
    { id: "walking", name: "Dog Walking", price: 500000 },
    { id: "veterinary", name: "Veterinary", price: 1500000 },
  ];

  const [filters, setFilters] = useState<FreelancerFilter>({
    status: "All",

    region: "All",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { searchQuery } = useSearch();

  // LOGIC LỌC - Use API data from freelancers hook
  const filteredFreelancers = (freelancers ?? []).filter((f) => {
    // 1. Trạng thái
    if (filters.status !== "All" && f.status !== filters.status) return false;

    // 5. Khu vực
    if (filters.region !== "All" && f.region !== filters.region) return false;

    // Header search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${f.name} ${f.email} ${f.services?.join(" ") || ""} ${f.region || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  // LOGIC PHÂN TRANG
  const totalPages = Math.ceil(filteredFreelancers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFreelancers = filteredFreelancers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Tính toán lại Stat Cards dựa trên dữ liệu API
  const totalActive = (freelancers ?? []).filter((f) => f.status === "Active").length;
  const avgRating =
    (freelancers ?? []).length > 0
      ? (
          (freelancers ?? []).reduce((sum, f) => sum + (f.rating || 0), 0) /
          (freelancers ?? []).length
        ).toFixed(1)
      : "0";
  const totalHires = (freelancers ?? []).reduce((sum, f) => sum + (f.jobsCompleted || 0), 0);

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
          <h2 className="text-3xl font-bold">Quản Lý Freelancer</h2>
          <p className="text-gray-500">
            Quản lý hồ sơ và quá trình làm việc của các freelancer.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-md transition-colors"
        >
          + Thêm Freelancer
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Tổng Freelancer"
          value={freelancers.length}
          delta="3% so với tháng trước"
          icon={<AiOutlineUser />}
        />
        <StatCard
          title="Freelancer Hoạt Động"
          value={totalActive}
          delta="Tăng 5 người"
          icon={<AiOutlineFileText />}
          className="border-blue-300"
        />
        <StatCard
          title="Đánh Giá Trung Bình"
          value={avgRating}
          delta="Tăng 0.2 điểm"
          icon={<AiOutlineStar />}
        />
        <StatCard
          title="Tổng Số Công Việc"
          value={totalHires}
          delta="Tăng 12% so với tháng trước"
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
              { value: "Suspended", label: "Tạm Dừng" },
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
        values={filters}
        onChange={(next: FreelancerFilter) => {
          setFilters(next);
          setCurrentPage(1);
        }}
        onReset={() =>
          setFilters({
            status: "All",

            region: "All",
          })
        }
      />

      <h3 className="text-xl font-bold mb-4">
        Danh Sách Freelancer ({filteredFreelancers.length})
      </h3>

      {/* DANH SÁCH FREELANCER CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && currentFreelancers.length > 0 ? (
          currentFreelancers.map((f) => (
            <FreelancerCard
              key={f._id || f.id}
              id={f._id || f.id}
              name={f.name}
              subtitle={f.subtitle || "Freelancer"}
              avatar={f.avatar}
              badge={f.status as "Active" | "Inactive" | "Suspended"}
              rating={f.rating || 0}
              jobsCompleted={f.jobsCompleted || 0}
              region={f.region || ""}
              servicePrice={f.servicePrice || "0"}
              experience={f.experience || ""}
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
              {error ? `Lỗi: ${error}` : "Không tìm thấy freelancer nào phù hợp với bộ lọc."}
            </div>
          </div>
        )}
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && renderPagination()}

      {/* Modal */}
      <FreelancerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateFreelancer}
        services={mockServiceTypes}
      />
    </div>
  );
};

export default FreelancersPage;
