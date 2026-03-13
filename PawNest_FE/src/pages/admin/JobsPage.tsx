// file: BookingPage.tsx - Booking management with full API integration
import React, { useState } from "react";
import StatCard from "../../components/admin/StatCard";
import BookingCard from "../../components/admin/BookingCard";
import {
  AiOutlineProfile,
  AiOutlineHourglass,
  AiOutlineCheckSquare,
  AiOutlineCalendar,
  
  AiOutlineFilePdf,
} from "react-icons/ai";
import FiltersPanel from "../../components/admin/FiltersPanel";
import { useSearch } from "../../contexts/SearchContext";
import { useSettings } from "../../contexts/SettingsContext";
import BookingModal from "../../components/admin/modal/BookingModal";
import type { BookingFormData } from "../../components/admin/modal/BookingModal";
import { useAdminBookings } from "../../hooks/useAdmin";
import adminService, { type AdminBooking } from "../../services/admin/adminService";
import { showSuccess, showError } from "../../utils/toastUtils";
import html2pdf from "html2pdf.js";

const ITEMS_PER_PAGE = 6;
// NOTE: API_V1 constant removed — use adminService for API calls

// Định nghĩa kiểu dữ liệu cho filter
type BookingFilter = {
  status: string;
  pickupStatus: string;
  paymentStatus: string;
  pickupTime: string;
};

// Use AdminBooking type returned by adminService/useAdminBookings
type Booking = AdminBooking;

const BookingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useSettings();
  const { bookings, loading, error, fetchBookings, createBooking, cancelBooking } = useAdminBookings();

  // Fetch bookings on mount
  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCreateBooking = async (data: BookingFormData) => {
    try {
      const payload = {
        pickUpTime: (() => {
          if (!data.pickupTime) return data.pickupTime;
          const m = String(data.pickupTime).match(/Slot(\d+)/i);
          if (m) return Number(m[1]) - 1; // Backend expects 0-based slot index
          const n = Number(String(data.pickupTime));
          return Number.isNaN(n) ? data.pickupTime : n;
        })(),
        bookingDate: data.bookingDate,
        serviceIds: Array.isArray(data.serviceIds) ? data.serviceIds : [data.serviceIds],
        freelancerId: data.freelancerId,
        petIds: Array.isArray(data.petIds) ? data.petIds : [data.petIds],
      };

      // Prefer the hook's createBooking which uses adminService internally
      if (createBooking) {
        const res = await createBooking(payload as any);
        if (res.success) {
          setIsModalOpen(false);
          showSuccess("Đặt lịch thành công!");
          await fetchBookings();
          return;
        }
        showError("Lỗi: " + (res.error || "Không thể tạo đặt lịch"));
        return;
      }

      // Fallback to adminService if hook not available
      const response = await adminService.createBooking(payload as any);
      if (response.success) {
        setIsModalOpen(false);
        showSuccess("Đặt lịch thành công!");
        await fetchBookings();
      } else {
        showError("Lỗi: " + (response.error || "Không thể tạo đặt lịch"));
      }
    } catch (err) {
      showError("Lỗi tạo đặt lịch: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!bookingId) {
      showError('Không tìm thấy booking id để hủy.');
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn hủy đặt lịch này?")) return;

    try {
      if (cancelBooking) {
        const res = await cancelBooking(bookingId);
        if (res && res.success) {
          showSuccess("Hủy đặt lịch thành công!");
          await fetchBookings();
          return;
        }
        showError("Lỗi: " + (res && (res as any).error ? (res as any).error : "Không thể hủy đặt lịch"));
        return;
      }

      const response = await adminService.cancelBooking(bookingId);
      if (response.success) {
        showSuccess("Hủy đặt lịch thành công!");
        await fetchBookings();
      } else {
        showError("Lỗi: " + (response.error || "Không thể hủy đặt lịch"));
      }
    } catch (err) {
      showError("Lỗi hủy đặt lịch: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    if (!bookingId) {
      showError('Không tìm thấy booking id để cập nhật.');
      return;
    }
    try {
      // Map UI status to backend enum number if necessary
      const statusMap: Record<string, number | string> = {
        Pending: 0,
        Confirmed: 1,
        Completed: 2,
        Cancelled: 3,
      };
      const backendStatus = statusMap[newStatus] ?? newStatus;
      const response = await adminService.updateBooking(bookingId, { status: backendStatus } as any);
      if (response.success) {
        showSuccess("Cập nhật trạng thái thành công!");
        await fetchBookings();
      } else {
        showError("Lỗi: " + (response.error || "Không thể cập nhật trạng thái"));
      }
    } catch (err) {
      showError("Lỗi cập nhật: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleUpdatePickupStatus = async (bookingId: string, newStatus: string) => {
    if (!bookingId) {
      showError('Không tìm thấy booking id để cập nhật trạng thái lấy.');
      return;
    }
    try {
      const pickupMap: Record<string, number | string> = {
        NotPickedUp: 0,
        PickedUp: 1,
        Delivered: 2,
      };
      const backendPickUp = pickupMap[newStatus] ?? newStatus;
      const response = await adminService.updateBooking(bookingId, { pickUpStatus: backendPickUp } as any);
      if (response.success) {
        showSuccess("Cập nhật trạng thái lấy hàng thành công!");
        await fetchBookings();
      } else {
        showError("Lỗi: " + (response.error || "Không thể cập nhật"));
      }
    } catch (err) {
      showError("Lỗi cập nhật: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const [filter, setFilter] = useState<BookingFilter>({
    status: "All",
    pickupStatus: "All",
    paymentStatus: "All",
    pickupTime: "All",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { searchQuery } = useSearch();

  // LOGIC LỌC
  const mapTimeToSlot = (timeStr?: string) => {
    if (!timeStr) return '';
    const t = String(timeStr).toLowerCase();
    // If backend already returns slot codes, pass-through
    if (/slot\d/.test(t)) return t.match(/slot\d/)?.[0] ?? '';
    // Try to parse hour from strings like "8:00" or "08:00 - 10:00" or "8 - 10"
    const m = t.match(/(\d{1,2})(?::\d{2})?/);
    if (!m) return '';
    const hour = Number(m[1]);
    if (hour >= 8 && hour < 10) return 'Slot1';
    if (hour >= 10 && hour < 12) return 'Slot2';
    if (hour >= 12 && hour < 14) return 'Slot3';
    if (hour >= 14 && hour < 16) return 'Slot4';
    if (hour >= 16 && hour < 18) return 'Slot5';
    return '';
  };

  const normalizeIsPaid = (b: any) => {
    if (typeof b.isPaid === 'boolean') return b.isPaid;
    if (typeof b.paid === 'boolean') return b.paid;
    if (typeof b.paymentStatus === 'string') return /success|paid/i.test(b.paymentStatus);
    return false;
  };

  const getPickupStatus = (b: any) => {
    return b.pickUpStatus || b.pickupStatus || b.pickUpState || b.pickUp || 'NotPickedUp';
  };

  const getStatus = (b: any) => {
    const s = (b.status || '').toString();
    if (/assigned|in progress/i.test(s)) return 'Confirmed';
    if (/pending/i.test(s)) return 'Pending';
    if (/completed|done/i.test(s)) return 'Completed';
    if (/cancelled|canceled/i.test(s)) return 'Cancelled';
    return s || 'Pending';
  };

  const filteredBookings = (bookings || []).filter((b: Booking) => {
    const any: any = b as any;

    // 1. Trạng thái đặt lịch (map some backend statuses to UI statuses)
    if (filter.status !== 'All') {
      const statusValue = getStatus(any);
      if (statusValue !== filter.status) return false;
    }

    // 2. Trạng thái lấy hàng (support multiple backend field names)
    if (filter.pickupStatus !== 'All') {
      const pStatus = getPickupStatus(any);
      if (pStatus !== filter.pickupStatus) return false;
    }

    // 3. Trạng thái thanh toán
    if (filter.paymentStatus !== 'All') {
      const paid = normalizeIsPaid(any);
      const paidStatus = paid ? 'Paid' : 'Unpaid';
      if (paidStatus !== filter.paymentStatus) return false;
    }

    // 4. Khung giờ (map time strings to slot codes)
    if (filter.pickupTime !== 'All') {
      const slot = mapTimeToSlot(any.pickUpTime || any.time || any.scheduledTime || any.scheduledDate || '');
      if (!slot || slot !== filter.pickupTime) return false;
    }

    // Header search across multiple possible fields
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const petNames = (any.pets && Array.isArray(any.pets)) ? any.pets.map((p: any) => p.petName || p.name || '').join(', ') : (any.pet || '');
      const hay = `${any.customerName || any.customer || ''} ${any.freelancerName || any.freelancer || ''} ${petNames} ${any.bookingDate || any.scheduledDate || any.createdDate || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  // LOGIC PHÂN TRANG
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Tính toán stats dựa trên dữ liệu API
  const totalPending = (bookings || []).filter((b: Booking) => b.status === "Pending").length;
  const totalConfirmed = (bookings || []).filter((b: Booking) => b.status === "Confirmed").length;
  const totalCompleted = (bookings || []).filter((b: Booking) => b.status === "Completed").length;
  const totalCancelled = (bookings || []).filter((b: Booking) => b.status === "Cancelled").length;

  const handleExportPdf = () => {
    try {
      const totalRevenue = filteredBookings.reduce((sum, b: Booking) => sum + (b.totalPrice || 0), 0);
      const paidCount = filteredBookings.filter((b: Booking) => b.isPaid).length;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h1 style="text-align: center; margin-bottom: 10px;">Báo Cáo Đặt Lịch</h1>
          <p style="text-align: center; margin-bottom: 20px; color: #666;">Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>Tổng doanh thu:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}</p>
            <p style="margin: 5px 0;"><strong>Tổng đặt lịch:</strong> ${filteredBookings.length}</p>
            <p style="margin: 5px 0;"><strong>Đã thanh toán:</strong> ${paidCount}</p>
            <p style="margin: 5px 0;"><strong>Chưa thanh toán:</strong> ${filteredBookings.length - paidCount}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background: #2c3e50; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Khách hàng</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Thú cưng</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Freelancer</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Ngày đặt</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Giá</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Trạng thái</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Thanh toán</th>
              </tr>
            </thead>
            <tbody>
              ${filteredBookings.map((b: Booking, idx: number) => `
                <tr style="background: ${idx % 2 === 0 ? '#fff' : '#f9f9f9'};">
                  <td style="padding: 10px; border: 1px solid #ddd;">${b.customerName || 'N/A'}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${(b.pets || []).map((p: any) => p.petName || p.name || '').join(', ')}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${b.freelancerName || 'N/A'}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${b.bookingDate || ''}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.totalPrice || 0)}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                    <span style="padding: 4px 8px; border-radius: 3px; ${
                      b.status === 'Completed' ? 'background: #d4edda; color: #155724;' :
                      b.status === 'Pending' ? 'background: #fff3cd; color: #856404;' :
                      b.status === 'Confirmed' ? 'background: #cce5ff; color: #004085;' :
                      'background: #f8d7da; color: #721c24;'
                    }">
                      ${b.status}
                    </span>
                  </td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                    <span style="padding: 4px 8px; border-radius: 3px; ${
                      b.isPaid ? 'background: #d4edda; color: #155724;' : 'background: #fff3cd; color: #856404;'
                    }">
                      ${b.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      const element = document.createElement('div');
      element.innerHTML = htmlContent;

      const opt = {
        margin: 10,
        filename: `bookings_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape' as const, unit: 'mm', format: 'a4' }
      };

      html2pdf().set(opt).from(element).save();
      showSuccess('PDF xuất thành công!');
    } catch (err) {
      showError('Lỗi xuất PDF: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

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
          <h2 className="text-3xl font-bold">Quản Lý Đặt Lịch</h2>
          <p className="text-gray-500">
            Quản lý danh sách đặt lịch và trạng thái thực hiện.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportPdf}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium shadow-md transition-colors flex items-center gap-2"
          >
            <AiOutlineFilePdf /> Xuất PDF
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-md transition-colors"
          >
            + Thêm Đặt Lịch
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Tổng Đặt Lịch"
          value={(bookings || []).length}
          delta="Tất cả trạng thái"
          icon={<AiOutlineProfile />}
        />
        <StatCard
          title="Chờ Xác Nhận"
          value={totalPending}
          delta="Cần xử lý"
          icon={<AiOutlineHourglass />}
          className="border-yellow-300"
        />
        <StatCard
          title="Đã Xác Nhận"
          value={totalConfirmed}
          delta="Đang chế biến"
          icon={<AiOutlineCheckSquare />}
          className="border-blue-300"
        />
        <StatCard
          title="Hoàn Thành"
          value={totalCompleted}
          delta={`Hủy: ${totalCancelled}`}
          icon={<AiOutlineCalendar />}
        />
      </div>

      {/* FILTER */}
      <FiltersPanel
        fields={[
          {
            key: "status",
            label: "Trạng Thái Đặt Lịch",
            type: "select",
            icon: <AiOutlineProfile />,
            options: [
              { value: "Pending", label: "Chờ Xác Nhận" },
              { value: "Confirmed", label: "Đã Xác Nhận" },
              { value: "Completed", label: "Hoàn Thành" },
              { value: "Cancelled", label: "Hủy Bỏ" },
            ],
          },
          {
            key: "pickupStatus",
            label: "Trạng Thái Lấy Hàng",
            type: "select",
            icon: <AiOutlineProfile />,
            options: [
              { value: "NotPickedUp", label: "Chưa Lấy" },
              { value: "PickedUp", label: "Đã Lấy" },
              { value: "Delivered", label: "Đã Giao" },
            ],
          },
          {
            key: "paymentStatus",
            label: "Trạng Thái Thanh Toán",
            type: "select",
            icon: <AiOutlineProfile />,
            options: [
              { value: "Paid", label: "Đã Thanh Toán" },
              { value: "Unpaid", label: "Chưa Thanh Toán" },
            ],
          },
          {
            key: "pickupTime",
            label: "Khung Giờ",
            type: "select",
            icon: <AiOutlineCalendar />,
            options: [
              { value: "Slot1", label: "8:00 - 10:00 AM" },
              { value: "Slot2", label: "10:00 - 12:00 PM" },
              { value: "Slot3", label: "12:00 - 2:00 PM" },
              { value: "Slot4", label: "2:00 - 4:00 PM" },
              { value: "Slot5", label: "4:00 - 6:00 PM" },
            ],
          },
        ]}
        values={filter}
        onChange={(next: BookingFilter) => {
          setFilter(next);
          setCurrentPage(1);
        }}
        onReset={() =>
          setFilter({
            status: "All",
            pickupStatus: "All",
            paymentStatus: "All",
            pickupTime: "All",
          })
        }
      />

      <h3 className="text-xl font-bold mb-4">
        Danh Sách Đặt Lịch ({filteredBookings.length})
      </h3>

      {/* DANH SÁCH BOOKING CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && currentBookings.length > 0 ? (
          currentBookings.map((b: Booking) => (
            <BookingCard
              key={b.bookingId}
              bookingId={b.bookingId || b.id || ''}
              customerName={b.customerName || "N/A"}
              freelancerName={b.freelancerName || "N/A"}
              petNames={(b.pets || []).map((p: any) => p.petName || p.name || '').join(", ")}
              bookingDate={b.bookingDate || ''}
              pickupTime={String(b.pickUpTime ?? b.time ?? '')}
              totalPrice={Number(b.totalPrice ?? b.price ?? 0)}
              status={b.status as "Pending" | "Confirmed" | "Completed" | "Cancelled"}
              pickupStatus={String(b.pickUpStatus ?? '')}
              isPaid={!!b.isPaid}
              onCancel={() => handleCancelBooking(b.bookingId || b.id || '')}
              onStatusChange={(newStatus) => handleUpdateStatus(b.bookingId || b.id || '', newStatus)}
              onPickupStatusChange={(newStatus) => handleUpdatePickupStatus(b.bookingId || b.id || '', newStatus)}
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
              {error ? `Lỗi: ${error}` : "Không tìm thấy đặt lịch nào phù hợp với bộ lọc."}
            </div>
          </div>
        )}
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && renderPagination()}

      {/* Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateBooking}
      />
    </div>
  );
};

export default BookingPage;
