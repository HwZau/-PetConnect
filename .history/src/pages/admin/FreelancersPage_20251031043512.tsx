// file: FreelancersPage.tsx
import React, { useState } from "react";
import StatCard from "../../components/admin/StatCard";
import FreelancerCard from "../../components/admin/FreelancerCard";
import FiltersPanel from "../../components/admin/FiltersPanel";
import { AiOutlineUser, AiOutlineStar, AiOutlineDollar, AiOutlineTrophy } from "react-icons/ai";

const ITEMS_PER_PAGE = 6;

// Định nghĩa kiểu dữ liệu Freelancer để TypeScript nhận diện
interface Freelancer {
  id: number;
  name: string;
  subtitle: string;
  avatar: string;
  badge: "Hoạt động" | "Bận" | "Tạm ngưng"; // Trạng Thái
  experience: string; // Kinh nghiệm (dạng 'X năm')
  rating: number; // Đánh giá
  jobsCompleted: number;
  servicePrice: string;
  region: "Hà Nội" | "TP.HCM" | "Đà Nẵng" | "Hải Phòng" | "Cần Thơ"; // Khu vực
}

// MOCK DATA (10 items)
const allFreelancers: Freelancer[] = [
  { id: 1, name: "Nguyễn Thị Lan", subtitle: "Chuyên gia chăm sóc chó", avatar: "https://i.pravatar.cc/84?img=10", badge: "Hoạt động", experience: "5 năm", rating: 4.9, jobsCompleted: 155, servicePrice: "250,000₫/giờ", region: "Hà Nội" },
  { id: 2, name: "Trần Văn Minh", subtitle: "Huấn luyện viên thú cưng", avatar: "https://i.pravatar.cc/84?img=12", badge: "Bận", experience: "7 năm", rating: 4.7, jobsCompleted: 210, servicePrice: "350,000₫/buổi", region: "TP.HCM" },
  { id: 3, name: "Lê Thị Hương", subtitle: "Chuyên gia chăm sóc mèo", avatar: "https://i.pravatar.cc/84?img=14", badge: "Hoạt động", experience: "3 năm", rating: 4.5, jobsCompleted: 98, servicePrice: "200,000₫/ngày", region: "Đà Nẵng" },
  { id: 4, name: "Phạm Văn Tài", subtitle: "Bác sĩ Thú Y", avatar: "https://i.pravatar.cc/84?img=11", badge: "Tạm ngưng", experience: "10 năm", rating: 5.0, jobsCompleted: 450, servicePrice: "500,000₫/lần", region: "Hà Nội" },
  { id: 5, name: "Ngô Hoàng Phúc", subtitle: "Chuyên gia thú cưng ngoại lai", avatar: "https://i.pravatar.cc/84?img=25", badge: "Hoạt động", experience: "8 năm", rating: 4.8, jobsCompleted: 180, servicePrice: "400,000₫/buổi", region: "TP.HCM" },
  { id: 6, name: "Đào Thị Thu", subtitle: "Tắm rửa & Cắt tỉa", avatar: "https://i.pravatar.cc/84?img=26", badge: "Hoạt động", experience: "2 năm", rating: 4.6, jobsCompleted: 50, servicePrice: "150,000₫/lần", region: "Hải Phòng" },
  { id: 7, name: "Vũ Đình Sơn", subtitle: "Chăm sóc chim cảnh", avatar: "https://i.pravatar.cc/84?img=27", badge: "Bận", experience: "4 năm", rating: 4.9, jobsCompleted: 120, servicePrice: "100,000₫/ngày", region: "Hà Nội" },
  { id: 8, name: "Bùi Ngọc Mai", subtitle: "Chuyên gia dinh dưỡng thú cưng", avatar: "https://i.pravatar.cc/84?img=28", badge: "Hoạt động", experience: "6 năm", rating: 4.7, jobsCompleted: 300, servicePrice: "50,000₫/tư vấn", region: "Đà Nẵng" },
  { id: 9, name: "Lý Văn Hùng", subtitle: "Huấn luyện & Dạy bảo", avatar: "https://i.pravatar.cc/84?img=29", badge: "Hoạt động", experience: "9 năm", rating: 4.9, jobsCompleted: 350, servicePrice: "450,000₫/buổi", region: "TP.HCM" },
  { id: 10, name: "Trịnh Thị Thảo", subtitle: "Pet Sitter tại nhà", avatar: "https://i.pravatar.cc/84?img=30", badge: "Hoạt động", experience: "1 năm", rating: 4.4, jobsCompleted: 30, servicePrice: "180,000₫/ngày", region: "Cần Thơ" },
];

import { useSearch } from "../../contexts/SearchContext";
import { useSettings } from "../../contexts/SettingsContext";
import type { FreelancerFormData } from "../../components/admin/modal/FreelancerModal";
import { AiOutlineEnvironment } from 'react-icons/ai';
import FreelancerModal from "../../components/admin/modal/FreelancerModal";

const FreelancersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useSettings();

  const handleCreateFreelancer = (data: FreelancerFormData) => {
    console.log('Creating freelancer:', data);
    // TODO: Implement freelancer creation
  };

  // Mock data for modal dropdowns
  const mockServices = [
    { id: 'grooming', name: 'Grooming', price: 250000 },
    { id: 'training', name: 'Training', price: 350000 },
    { id: 'sitting', name: 'Pet Sitting', price: 200000 },
    { id: 'medical', name: 'Medical Care', price: 500000 }
  ];
  // Kiểu cho bộ lọc của trang Freelancers
  type FreelancerFilter = {
    status: string
    service: string
    experience: string
    rating: string
    region: string
  }

  const [filter, setFilter] = useState<FreelancerFilter>({
    status: "All",
    service: "All",
    experience: "All",
    rating: "All",
    region: "All"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { searchQuery } = useSearch();

  // LOGIC LỌC
  const filteredFreelancers = allFreelancers.filter(f => {
    // 1. Trạng Thái
    if (filter.status !== "All" && f.badge !== filter.status) return false;

    // 2. Dịch vụ (Sử dụng subtitle để lọc gần đúng)
    if (filter.service !== "All") {
      const subtitle = f.subtitle.toLowerCase();
      if (filter.service === "Grooming" && !subtitle.includes("tắm rửa") && !subtitle.includes("cắt tỉa")) return false;
      if (filter.service === "Training" && !subtitle.includes("huấn luyện") && !subtitle.includes("dạy bảo")) return false;
      if (filter.service === "Sitting" && !subtitle.includes("chăm sóc") && !subtitle.includes("pet sitter")) return false;
      if (filter.service === "Medical" && !subtitle.includes("bác sĩ") && !subtitle.includes("dinh dưỡng")) return false;
    }

    // 3. Kinh nghiệm
    if (filter.experience !== "All") {
      const expValue = parseInt(f.experience.split(' ')[0]); // Lấy số năm
      if (filter.experience === "1+" && expValue > 1) return false;
      if (filter.experience === "3+" && (expValue < 1 || expValue > 5)) return false; // 1-5 năm
      if (filter.experience === "5+" && expValue <= 5) return false;
    }

    // 4. Đánh giá
    if (filter.rating !== "All") {
      if (filter.rating === "4+" && f.rating < 4.0) return false;
      if (filter.rating === "4.5+" && f.rating < 4.5) return false;
    }

    // 5. Khu vực
    if (filter.region !== "All" && f.region !== filter.region) return false;

    // Header search (toàn cục) - tìm theo tên, subtitle hoặc khu vực
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${f.name} ${f.subtitle} ${f.region}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  // LOGIC PHÂN TRANG (Cập nhật để dùng filteredFreelancers)
  const totalPages = Math.ceil(filteredFreelancers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  // Dùng dữ liệu đã lọc
  const currentFreelancers = filteredFreelancers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    // Đặt lại trang hiện tại sau khi lọc để tránh lỗi out-of-bounds
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  // END LOGIC PHÂN TRANG

  // Tính toán lại Stat Cards dựa trên dữ liệu thật
  const activeFreelancers = allFreelancers.filter(f => f.badge === 'Hoạt động').length;
  const avgRating = (allFreelancers.reduce((sum, f) => sum + f.rating, 0) / allFreelancers.length).toFixed(2);
  const totalJobsCompleted = allFreelancers.reduce((sum, f) => sum + f.jobsCompleted, 0);

  const renderPagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200 disabled:bg-gray-700 disabled:text-gray-400' : 'bg-white disabled:bg-gray-100 disabled:text-gray-400'} transition-colors`}
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
        className={`px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200 disabled:bg-gray-700 disabled:text-gray-400' : 'bg-white disabled:bg-gray-100 disabled:text-gray-400'} transition-colors`}
      >
        Trang Sau
      </button>
    </div>
  );

  const resetFilters = () => {
    setFilter({ status: "All", service: "All", experience: "All", rating: "All", region: "All" });
    setCurrentPage(1); // Reset về trang 1 khi đặt lại bộ lọc
  };


  return (
    <div className={`p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Quản Lý Freelancers</h2>
          <p className="text-gray-500">Quản lý hồ sơ, dịch vụ và hiệu suất của freelancers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-md transition-colors"
        >
          + Thêm Freelancer
        </button>
      </div>
  {/* STAT CARDS (Đã cập nhật số liệu thật) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Tổng Freelancers" value={allFreelancers.length} delta="12% so với tháng trước" icon={<AiOutlineUser />} />
        <StatCard title="Đánh Giá Trung Bình" value={`${avgRating}/5`} delta="Tăng 0.1 điểm" icon={<AiOutlineStar />} />
        <StatCard title="Tổng Việc Hoàn Thành" value={totalJobsCompleted} delta="25% so với tháng trước" icon={<AiOutlineTrophy />} />
        <StatCard title="Hoạt Động/Tổng" value={`${activeFreelancers}/${allFreelancers.length}`} delta="Cần xem xét" icon={<AiOutlineDollar />} className="border-red-300" />
      </div>
      {/* Filters: use shared FiltersPanel component */}
      <FiltersPanel
        fields={[
          { key: 'status', label: 'Trạng Thái', type: 'select', icon: <AiOutlineUser />, options: [{ value: 'Hoạt động', label: 'Hoạt Động' }, { value: 'Bận', label: 'Bận' }, { value: 'Tạm ngưng', label: 'Tạm Ngưng' }] },
          { key: 'service', label: 'Dịch vụ', type: 'select', icon: <AiOutlineDollar />, options: [{ value: 'Grooming', label: 'Grooming' }, { value: 'Training', label: 'Training' }, { value: 'Sitting', label: 'Sitting' }, { value: 'Medical', label: 'Medical' }] },
          { key: 'experience', label: 'Kinh nghiệm', type: 'select', icon: <AiOutlineTrophy />, options: [{ value: '1+', label: 'Dưới 1 năm' }, { value: '3+', label: '1-5 năm' }, { value: '5+', label: 'Trên 5 năm' }] },
          { key: 'rating', label: 'Đánh Giá', type: 'select', icon: <AiOutlineStar />, options: [{ value: '4+', label: '4.0+' }, { value: '4.5+', label: '4.5+' }] },
          { key: 'region', label: 'Khu Vực', type: 'select', icon: <AiOutlineEnvironment />, options: [{ value: 'Hà Nội', label: 'Hà Nội' }, { value: 'TP.HCM', label: 'TP.HCM' }, { value: 'Đà Nẵng', label: 'Đà Nẵng' }, { value: 'Khác', label: 'Khác' }] },
        ]}
          values={filter}
          onChange={(next: FreelancerFilter) => { setFilter(next); setCurrentPage(1); }}
        onReset={() => { resetFilters(); }}
      />

  <h3 className="text-xl font-bold mb-4">Danh Sách Freelancer ({filteredFreelancers.length})</h3>

      {/* DANH SÁCH FREELANCER CARD (Sử dụng dữ liệu đã lọc) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentFreelancers.length > 0 ? (
          currentFreelancers.map((f) => (
            <FreelancerCard
              key={f.id}
              name={f.name}
              subtitle={f.subtitle}
              avatar={f.avatar}
              badge={f.badge}
              experience={f.experience}
              rating={f.rating}
              jobsCompleted={f.jobsCompleted}
              servicePrice={f.servicePrice}
              region={f.region}
            />
          ))
        ) : (
          <div className="md:col-span-3 text-center py-10 rounded-2xl shadow-md px-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'} rounded-2xl py-6`}>Không tìm thấy freelancer nào phù hợp với bộ lọc.</div>
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
        services={mockServices}
      />
    </div>
  );
};

export default FreelancersPage;