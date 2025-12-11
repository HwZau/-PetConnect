// file: JobsPage.tsx - Fixed version without mock data and duplicate imports
import React, { useState } from "react";
import StatCard from "../../components/admin/StatCard";
import JobCard from "../../components/admin/JobCard";
import {
  AiOutlineProfile,
  AiOutlineHourglass,
  AiOutlineCheckSquare,
  AiOutlineCalendar,
  AiOutlineEnvironment,
} from "react-icons/ai";
import FiltersPanel from "../../components/admin/FiltersPanel";
import { useSearch } from "../../contexts/SearchContext";
import { useSettings } from "../../contexts/SettingsContext";
import JobModal from "../../components/admin/modal/JobModal";
import type { JobFormData } from "../../components/admin/modal/JobModal";
import { useAdminBookings } from "../../hooks/useAdmin";

const ITEMS_PER_PAGE = 6;

// Mock data constants for dropdowns only
const MOCK_SERVICES = [
  { id: "grooming", name: "Grooming", price: 700000 },
  { id: "training", name: "Training", price: 1200000 },
  { id: "sitting", name: "Pet Sitting", price: 500000 },
  { id: "medical", name: "Medical Care", price: 850000 },
];

// Định nghĩa kiểu dữ liệu cho filter
type JobFilter = {
  status: string;
  type: string;
  petType: string;
  freelancer: string;
  createdDate: string;
  region: string;
};

const JobsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useSettings();
  const { bookings, loading, error, fetchBookings, createBooking } = useAdminBookings();

  // Mock data for dropdowns
  const mockCustomers = [
    { id: "cust1", name: "Nguyễn Thị Lan Anh" },
    { id: "cust2", name: "Trần Văn Minh" },
    { id: "cust3", name: "Võ Thị Mai" },
  ];

  const mockFreelancers = [
    { id: "freelancer1", name: "Ngô Hữu Trí" },
    { id: "freelancer2", name: "Nguyễn Thị Lan" },
    { id: "freelancer3", name: "Trần Văn Minh" },
  ];

  // Fetch bookings on mount
  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCreateJob = async (data: JobFormData) => {
    console.log("Creating job:", data);

    // Map form data to API parameters
    const result = await createBooking({
      title: data.title,
      customerId: data.customer,
      customer: data.customer,
      petId: data.pet,
      pet: data.pet,
      freelancerId: data.freelancer,
      freelancer: data.freelancer,
      serviceId: data.serviceType,
      service: data.serviceType,
      scheduledDate: data.date,
      time: data.time,
      location: data.location,
      region: "Unknown",
      price: typeof data.price === "string" ? parseFloat(data.price) : data.price || 0,
      notes: data.note,
      createdDate: new Date().toISOString(),
    });

    if (result.success) {
      setIsModalOpen(false);
      alert("Công việc tạo thành công!");
      await fetchBookings();
    } else {
      alert("Lỗi: " + (result.error || "Không thể tạo công việc"));
    }
  };

  const [filter, setFilter] = useState<JobFilter>({
    status: "All",
    type: "All",
    petType: "All",
    freelancer: "All",
    createdDate: "All",
    region: "All",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { searchQuery } = useSearch();

  // LOGIC LỌC - Use API data from bookings hook
  const filteredJobs = bookings.filter((j) => {
    // 1. Trạng thái
    if (filter.status !== "All" && j.status !== filter.status) return false;

    // 2. Loại dịch vụ
    if (filter.type !== "All" && j.service !== filter.type) return false;

    // 3. Loại thú cưng
    if (filter.petType !== "All" && j.pet !== filter.petType) return false;

    // 4. Freelancer
    if (filter.freelancer !== "All" && j.freelancer !== filter.freelancer)
      return false;

    // 5. Ngày tạo
    if (filter.createdDate !== "All" && j.createdDate) {
      const date = new Date(j.createdDate);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      if (filter.createdDate === "Recent" && date < sevenDaysAgo) return false;
      if (filter.createdDate === "Old" && date >= sevenDaysAgo) return false;
    }

    // 6. Khu vực
    if (filter.region !== "All" && j.region !== filter.region) return false;

    // Header search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${j.title} ${j.customer} ${j.pet} ${j.freelancer} ${j.location || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  // LOGIC PHÂN TRANG
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Tính toán lại Stat Cards dựa trên dữ liệu API
  const totalPending = bookings.filter((j) => j.status === "Pending").length;
  const totalInProgress = bookings.filter(
    (j) => j.status === "In Progress"
  ).length;
  const totalCompleted = bookings.filter((j) => j.status === "Completed").length;

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
          <h2 className="text-3xl font-bold">Quản Lý Công Việc</h2>
          <p className="text-gray-500">
            Quản lý danh sách công việc và tiến trình thực hiện.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-md transition-colors"
        >
          + Thêm Công Việc
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Tổng Công Việc"
          value={bookings.length}
          delta="5% so với tháng trước"
          icon={<AiOutlineProfile />}
        />
        <StatCard
          title="Chờ Xử Lý"
          value={totalPending}
          delta="Tăng 3 việc"
          icon={<AiOutlineHourglass />}
          className="border-yellow-300"
        />
        <StatCard
          title="Đang Thực Hiện"
          value={totalInProgress}
          delta="Tăng 2 việc"
          icon={<AiOutlineCheckSquare />}
          className="border-blue-300"
        />
        <StatCard
          title="Hoàn Thành"
          value={totalCompleted}
          delta="Tăng 8 việc"
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
            icon: <AiOutlineProfile />,
            options: [
              { value: "Pending", label: "Chờ Xử Lý" },
              { value: "Assigned", label: "Đã Phân Công" },
              { value: "In Progress", label: "Đang Thực Hiện" },
              { value: "Completed", label: "Hoàn Thành" },
              { value: "Cancelled", label: "Hủy Bỏ" },
            ],
          },
          {
            key: "type",
            label: "Loại Dịch Vụ",
            type: "select",
            icon: <AiOutlineProfile />,
            options: [
              { value: "Grooming", label: "Grooming" },
              { value: "Training", label: "Training" },
              { value: "Sitting", label: "Pet Sitting" },
              { value: "Medical", label: "Medical Care" },
            ],
          },
          {
            key: "petType",
            label: "Loại Thú Cưng",
            type: "select",
            icon: <AiOutlineProfile />,
            options: [
              { value: "Dog", label: "Chó" },
              { value: "Cat", label: "Mèo" },
              { value: "Other", label: "Khác" },
            ],
          },
          {
            key: "freelancer",
            label: "Freelancer",
            type: "select",
            icon: <AiOutlineProfile />,
            options: [
              { value: "Assigned", label: "Đã Phân Công" },
              { value: "Unassigned", label: "Chưa Phân Công" },
            ],
          },
          {
            key: "createdDate",
            label: "Ngày Tạo",
            type: "select",
            icon: <AiOutlineCalendar />,
            options: [
              { value: "Recent", label: "7 Ngày Gần Nhất" },
              { value: "Old", label: "Trước 7 Ngày" },
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
        onChange={(next: JobFilter) => {
          setFilter(next);
          setCurrentPage(1);
        }}
        onReset={() =>
          setFilter({
            status: "All",
            type: "All",
            petType: "All",
            freelancer: "All",
            createdDate: "All",
            region: "All",
          })
        }
      />

      <h3 className="text-xl font-bold mb-4">
        Danh Sách Công Việc ({filteredJobs.length})
      </h3>

      {/* DANH SÁCH JOB CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && currentJobs.length > 0 ? (
          currentJobs.map((j) => (
            <JobCard
              key={j.id}
              title={j.title}
              customer={j.customer}
              pet={j.pet}
              freelancer={j.freelancer}
              time={j.time}
              location={j.location}
              status={j.status as "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled"}
              price={j.price.toString()}
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
              {error ? `Lỗi: ${error}` : "Không tìm thấy công việc nào phù hợp với bộ lọc."}
            </div>
          </div>
        )}
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && renderPagination()}

      {/* Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJob}
        services={MOCK_SERVICES}
        customers={mockCustomers}
        freelancers={mockFreelancers}
      />
    </div>
  );
};

export default JobsPage;
