import { useState, useEffect } from "react";
import { useAuth } from "../../hooks";
import { bookingService } from "../../services/booking/bookingService";
import { BookingDetailModal } from "../../components/booking";
import { showError } from "../../utils";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const FreelancerBookingPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const limit = 10;

  const timeSlotMap: Record<number, string> = {
    0: "8:00 AM - 10:00 AM",
    1: "10:00 AM - 12:00 PM",
    2: "12:00 PM - 2:00 PM",
    3: "2:00 PM - 4:00 PM",
    4: "4:00 PM - 6:00 PM",
  };

  const statusLabels: Record<string, string> = {
    Pending: "Chờ xác nhận",
    Confirmed: "Đã xác nhận",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
  };

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Confirmed: "bg-blue-100 text-blue-800 border-blue-300",
    Completed: "bg-green-100 text-green-800 border-green-300",
    Cancelled: "bg-red-100 text-red-800 border-red-300",
  };

  const loadBookings = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await bookingService.getFreelancerBookings(
        user.id,
        page,
        limit
      );
      setBookings(response.bookings);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error loading bookings:", error);
      showError("Không thể tải danh sách đặt chỗ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [page, user?.id]);

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === "all") return true;
    return booking.bookingStatus === statusFilter;
  });

  const handleViewDetail = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleStatusUpdate = async () => {
    await loadBookings();
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaCalendarAlt className="text-teal-500" />
            Quản lý đặt chỗ
          </h1>
          <p className="text-gray-600 mt-2">
            Xem và cập nhật trạng thái các đơn đặt dịch vụ
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-600" />
            <h2 className="font-semibold text-gray-800">Lọc theo trạng thái</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "Pending", "Confirmed", "Completed", "Cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    statusFilter === status
                      ? "bg-teal-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "all" ? "Tất cả" : statusLabels[status]}
                </button>
              )
            )}
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Danh sách đặt chỗ ({filteredBookings.length})
          </h2>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaCalendarAlt className="text-6xl mb-4 mx-auto text-gray-400" />
              <p className="text-lg font-medium">Không có đơn đặt chỗ nào</p>
              <p className="text-sm mt-2">
                {statusFilter === "all"
                  ? "Chưa có đơn đặt chỗ nào"
                  : `Không có đơn ${statusLabels[statusFilter]?.toLowerCase()}`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.bookingId}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${
                            statusColors[booking.bookingStatus]
                          }`}
                        >
                          {statusLabels[booking.bookingStatus]}
                        </span>
                        <span className="text-sm text-gray-500">
                          ID: {booking.bookingId.slice(0, 8)}...
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-gray-600 mt-3">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-teal-500" />
                          <span className="text-sm">
                            {new Date(booking.bookingDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-blue-500" />
                          <span className="text-sm">
                            {timeSlotMap[booking.pickUpTime]}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Dịch vụ:</span>{" "}
                          {booking.serviceIds.length} dịch vụ
                        </p>
                        <p>
                          <span className="font-medium">Thú cưng:</span>{" "}
                          {booking.petIds.length} thú cưng
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleViewDetail(booking)}
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium"
                      >
                        Xem chi tiết
                      </button>
                      {booking.bookingStatus === "Pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetail(booking)}
                            className="flex-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs"
                          >
                            <FaCheckCircle className="inline mr-1" />
                            Xác nhận
                          </button>
                          <button
                            onClick={() => handleViewDetail(booking)}
                            className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                          >
                            <FaTimes className="inline mr-1" />
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <FaChevronLeft />
                Trước
              </button>
              <span className="px-4 py-2 text-gray-600">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Sau
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          userRole="freelancer"
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default FreelancerBookingPage;
