// file: JobsPage.tsx
import React, { useState } from "react";
// Đã loại bỏ AdminHeader/AdminSidebar để trang hoạt động độc lập
import StatCard from "../../components/admin/StatCard"; // Sử dụng StatCard chính thức
import JobCard from "../../components/admin/JobCard"; // Sử dụng JobCard chi tiết
import { AiOutlineProfile, AiOutlineHourglass, AiOutlineCheckSquare, AiOutlineCalendar, AiOutlineEnvironment } from "react-icons/ai";
import FiltersPanel from "../../components/admin/FiltersPanel";
import { useSearch } from "../../contexts/SearchContext";
import { useSettings } from "../../contexts/SettingsContext";
import JobModal from "../../components/admin/modal/JobModal";
import type { JobFormData } from "../../components/admin/modal/JobModal";

const ITEMS_PER_PAGE = 6;

// Mock data constants
const MOCK_SERVICES = [
  { id: 'grooming', name: 'Grooming', price: 700000 },
  { id: 'training', name: 'Training', price: 1200000 },
  { id: 'sitting', name: 'Pet Sitting', price: 500000 },
  { id: 'medical', name: 'Medical Care', price: 850000 }
];

// Định nghĩa kiểu dữ liệu cho job
type JobStatus = "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
interface Job {
  id: number;
  title: string;
  customer: string;
  pet: string;
  freelancer: string;
  time: string;
  location: string;
  status: JobStatus;
  price: string;
  type: string; // Loại dịch vụ
  petType: string; // Loại thú cưng (Dog/Cat/Other)
  createdDate: string; // Ngày tạo cho bộ lọc
  region: string; // Khu vực cho bộ lọc
}

// MOCK DATA ĐÃ CẬP NHẬT ĐẦY ĐỦ
const allJobs: Job[] = [
  { id: 1, title: "Chăm Sóc Tai Nhỏ - Buddy", customer: "Nguyễn Thị Lan Anh", pet: "Chó Golden", freelancer: "Chưa phân công", time: "10:00, 10/10", location: "Quận 1, TP.HCM", status: "Pending", price: "700,000₫", type: "Grooming", petType: "Dog", createdDate: "10/10/2025", region: "TP.HCM" },
  { id: 2, title: "Tắm Rửa & Cắt Tỉa - Mimi", customer: "Trần Văn Minh", pet: "Mèo Ba Tư", freelancer: "Nguyễn Thị Lan", time: "14:00, 09/10", location: "Quận Ba Đình, Hà Nội", status: "Completed", price: "900,000₫", type: "Grooming", petType: "Cat", createdDate: "09/10/2025", region: "Hà Nội" },
  { id: 3, title: "Huấn luyện cơ bản - Rex", customer: "Võ Thị Mai", pet: "Chó Alaska", freelancer: "Trần Văn Minh", time: "17:00, 11/10", location: "Quận 1, TP.HCM", status: "In Progress", price: "1,200,000₫", type: "Training", petType: "Dog", createdDate: "11/10/2025", region: "TP.HCM" },
  { id: 4, title: "Dịch vụ Sitter 3 ngày - Kitty", customer: "Phạm Văn Lợi", pet: "Mèo Anh", freelancer: "Ngô Hữu Trí", time: "13/10 - 15/10", location: "Quận Hải Châu, Đà Nẵng", status: "Assigned", price: "1,500,000₫", type: "Sitting", petType: "Cat", createdDate: "13/10/2025", region: "Đà Nẵng" },
  { id: 5, title: "Khám định kỳ & Tiêm phòng", customer: "Đặng Tiến Dũng", pet: "Thỏ", freelancer: "Chưa phân công", time: "09:00, 14/10", location: "Quận Ba Đình, Hà Nội", status: "Pending", price: "850,000₫", type: "Medical", petType: "Other", createdDate: "14/10/2025", region: "Hà Nội" },
  { id: 6, title: "Vệ sinh chuồng chim - Vẹt", customer: "Trịnh Quang Hùng", pet: "Vẹt", freelancer: "Nguyễn Thị Lan", time: "11:00, 05/10", location: "Quận 1, TP.HCM", status: "Completed", price: "500,000₫", type: "Grooming", petType: "Other", createdDate: "05/10/2025", region: "TP.HCM" },
  { id: 7, title: "Chăm sóc lông dài - Gấu", customer: "Bùi Thị Yến", pet: "Mèo Ragdoll", freelancer: "Trần Văn Minh", time: "16:00, 15/10", location: "Quận Ba Đình, Hà Nội", status: "In Progress", price: "1,100,000₫", type: "Grooming", petType: "Cat", createdDate: "15/10/2025", region: "Hà Nội" },
  { id: 8, title: "Huấn luyện nâng cao - Rex", customer: "Ngô Văn Phát", pet: "Chó Poodle", freelancer: "Nguyễn Thị Lan", time: "18:00, 16/10", location: "Quận Hải Châu, Đà Nẵng", status: "Assigned", price: "300,000₫", type: "Training", petType: "Dog", createdDate: "16/10/2025", region: "Đà Nẵng" },
  { id: 9, title: "Massage trị liệu - Rex", customer: "Phạm Văn Lợi", pet: "Chó Alaska", freelancer: "Ngô Hữu Trí", time: "10:30, 17/10", location: "Quận 1, TP.HCM", status: "Cancelled", price: "2,000,000₫", type: "Medical", petType: "Dog", createdDate: "17/10/2025", region: "TP.HCM" },
  { id: 10, title: "Cắt móng & Vệ sinh tai", customer: "Nguyễn Thị Lan Anh", pet: "Chó Golden", freelancer: "Trần Văn Minh", time: "14:30, 18/10", location: "Quận Ba Đình, Hà Nội", status: "Pending", price: "400,000₫", type: "Grooming", petType: "Dog", createdDate: "18/10/2025", region: "Hà Nội" },
];

const JobsPage: React.FC = () => {
  // Kiểu cho bộ lọc trang Jobs
  type JobFilter = {
    status: string
    type: string
    petType: string
    freelancer: string
    createdDate: string
    region: string
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useSettings();

  const handleCreateJob = (data: JobFormData) => {
    console.log('Creating job:', data);
    setIsModalOpen(false);
    // TODO: Implement job creation
  };



  const [filter, setFilter] = useState<JobFilter>({
    status: "All",
    type: "All",
    petType: "All",
    freelancer: "All",
    createdDate: "All",
    region: "All"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { searchQuery } = useSearch();


  // LOGIC LỌC
  const filteredJobs = allJobs.filter(job => {
    // Lọc theo Status
    if (filter.status !== "All" && job.status !== filter.status) return false;
    // Lọc theo Loại Dịch Vụ
    if (filter.type !== "All" && job.type !== filter.type) return false;
    // Lọc theo Loại Thú Cưng
    if (filter.petType !== "All" && job.petType !== filter.petType) return false;
    // Lọc theo Freelancer
    if (filter.freelancer !== "All" && job.freelancer !== filter.freelancer) return false;
    // Lọc theo Khu Vực
    if (filter.region !== "All" && job.region !== filter.region) return false;
    // Bỏ qua lọc Ngày Tạo (createdDate) vì chỉ là mock data

    // Header search (toàn cục) - tìm theo title, customer, freelancer, pet, location
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${job.title} ${job.customer} ${job.freelancer} ${job.pet} ${job.location}`.toLowerCase();
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
    // Đảm bảo trang nằm trong giới hạn
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  // END LOGIC PHÂN TRANG

  const renderPagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4  rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200 disabled:bg-gray-700 disabled:text-gray-400' : 'bg-white disabled:bg-gray-100 disabled:text-gray-400'} transition-colors`}
      >
        Trang Trước
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 rounded-xl font-semibold transition-colors ${currentPage === index + 1 ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
          className={`px-4  rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200 disabled:bg-gray-700 disabled:text-gray-400' : 'bg-white disabled:bg-gray-100 disabled:text-gray-400'} transition-colors`}
      >
          Trang Sau
      </button>
    </div>
  );

  return (
    // Dùng div độc lập để chứa nội dung trang
    <div className={`p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Quản Lý Công Việc</h2>
          <p className="text-gray-500">Theo dõi trạng thái và tiến độ của tất cả công việc.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-md transition-colors"
        >
          + Tạo Công Việc Mới
        </button>
      </div>

      <JobModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJob}
        services={MOCK_SERVICES}
        customers={Array.from(new Set(
          allJobs.map(job => ({
            id: job.id.toString(),
            name: job.customer
          }))
        ))}
        freelancers={Array.from(new Set(
          allJobs
            .filter(job => job.freelancer !== 'Chưa phân công')
            .map(job => ({
              id: job.id.toString(),
              name: job.freelancer
            }))
        ))}
      />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Tổng Công Việc" value={allJobs.length} delta="+10% so với tháng trước" icon={<AiOutlineProfile />} />
        <StatCard title="Đang Chờ Phân Công" value={allJobs.filter(j => j.status === 'Pending').length} delta="Cần xử lý gấp" icon={<AiOutlineHourglass />} />
        <StatCard title="Đang Tiến Hành" value={allJobs.filter(j => j.status === 'In Progress').length} delta="+5% so với tháng trước" icon={<AiOutlineProfile />} />
        <StatCard title="Đã Hoàn Thành" value={allJobs.filter(j => j.status === 'Completed').length} delta="+12% so với tháng trước" icon={<AiOutlineCheckSquare />} />
      </div>
    {/* FILTER */}
      <FiltersPanel
        fields={[
          { key: 'status', label: 'Trạng Thái', type: 'select', icon: <AiOutlineHourglass />, options: [{ value: 'Pending', label: 'Đang Chờ' }, { value: 'Assigned', label: 'Đã Phân Công' }, { value: 'In Progress', label: 'Đang Tiến Hành' }, { value: 'Completed', label: 'Đã Hoàn Thành' }, { value: 'Cancelled', label: 'Đã Hủy' }] },
          { key: 'type', label: 'Loại Dịch Vụ', type: 'select', icon: <AiOutlineCheckSquare />, options: [{ value: 'Grooming', label: 'Grooming' }, { value: 'Training', label: 'Training' }, { value: 'Sitting', label: 'Sitting' }, { value: 'Medical', label: 'Medical' }] },
          { key: 'petType', label: 'Loại Thú Cưng', type: 'select', icon: <AiOutlineEnvironment />, options: [{ value: 'Dog', label: 'Chó' }, { value: 'Cat', label: 'Mèo' }, { value: 'Other', label: 'Khác' }] },
          { key: 'freelancer', label: 'Freelancer', type: 'select', icon: <AiOutlineProfile />, options: [{ value: 'Trần Văn Minh', label: 'Trần Văn Minh' }, { value: 'Nguyễn Thị Lan', label: 'Nguyễn Thị Lan' }, { value: 'Ngô Hữu Trí', label: 'Ngô Hữu Trí' }, { value: 'Chưa phân công', label: 'Chưa phân công' }] },
          { key: 'createdDate', label: 'Ngày Tạo', type: 'select', icon: <AiOutlineCalendar />, options: [{ value: 'Today', label: 'Hôm nay' }, { value: 'This Week', label: 'Tuần này' }, { value: 'This Month', label: 'Tháng này' }] },
          { key: 'region', label: 'Khu Vực', type: 'select', icon: <AiOutlineEnvironment />, options: [{ value: 'Hà Nội', label: 'Hà Nội' }, { value: 'TP.HCM', label: 'TP.HCM' }, { value: 'Đà Nẵng', label: 'Đà Nẵng' }] },
        ]}
  values={filter}
  onChange={(next: JobFilter) => { setFilter(next); setCurrentPage(1); }}
        onReset={() => setFilter({ status: "All", type: "All", petType: "All", freelancer: "All", createdDate: "All", region: "All" })}
      />

  <h3 className="text-xl font-bold mb-4">Danh Sách Công Việc ({filteredJobs.length})</h3>

      {/* DANH SÁCH JOB CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentJobs.length > 0 ? (
          currentJobs.map((j) => (
            <JobCard
              key={j.id}
              title={j.title}
              customer={j.customer}
              pet={j.pet}
              freelancer={j.freelancer}
              time={j.time}
              location={j.location}
              status={j.status}
              price={j.price}
            />
          ))
        ) : (
          <div className="md:col-span-3 text-center py-10 rounded-2xl shadow-md px-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'} rounded-2xl py-6`}>{t('Không tìm thấy công việc nào phù hợp với bộ lọc.','No jobs match the filters.')}</div>
          </div>
        )}
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default JobsPage;