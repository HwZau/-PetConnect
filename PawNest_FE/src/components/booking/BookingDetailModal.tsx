import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { showSuccess, showError } from "../../utils";
import { bookingService } from "../../services/booking/bookingService";
import {
  paymentService,
  PaymentMethodCode,
} from "../../services/payment/paymentService";
import ConfirmDialog from "../common/ConfirmDialog";

// Reusable Components
interface SectionHeaderProps {
  number: string | number;
  title: string;
  bgColor: string;
  textColor: string;
}

const SectionHeader = ({
  number,
  title,
  bgColor,
  textColor,
}: SectionHeaderProps) => (
  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
    <span
      className={`${bgColor} ${textColor} rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2`}
    >
      {number}
    </span>
    {title}
  </h3>
);

interface UserInfoCardProps {
  user?: {
    avatar?: string;
    name?: string;
    phone?: string;
    email?: string;
  };
  userId?: string;
  fallbackInitial: string;
  avatarBgColor: string;
  avatarTextColor: string;
  emptyMessage: string;
}

const UserInfoCard = ({
  user,
  userId,
  fallbackInitial,
  avatarBgColor,
  avatarTextColor,
  emptyMessage,
}: UserInfoCardProps) => {
  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full ${avatarBgColor} flex items-center justify-center ${avatarTextColor} font-bold text-lg border-2 border-white shadow-sm`}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : fallbackInitial}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">
            {user.name || "Chưa có tên"}
          </p>
          {user.phone && (
            <p className="text-xs text-gray-600 mt-0.5">SĐT: {user.phone}</p>
          )}
          {user.email && (
            <p className="text-xs text-gray-600 mt-0.5">Email: {user.email}</p>
          )}
          {userId && (
            <p className="text-xs text-gray-400 mt-1 font-mono">
              ID: {userId.slice(0, 8)}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    bookingId: string;
    bookingDate: string;
    pickUpTime: number;
    bookingStatus?: string;
    status?: number | string;
    pickUpStatus?: string;
    serviceIds: string[] | string;
    petIds: string[] | string;
    freelancerId: string;
    createdAt?: string;
    updatedAt?: string;
    totalPrice?: number;
    isPaid?: boolean | string;
    services?: any[];
    pets?: any[];
    freelancer?: any;
    customerId?: string;
    customer?: any;
    address?: string;
    notes?: string;
    payment?: {
      paymentId?: string;
      amount?: number;
      status?: string;
      method?: string;
      transactionId?: string;
      paidAt?: string;
      createdAt?: string;
    };
  };
  userRole: "customer" | "freelancer";
  onStatusUpdate?: () => void;
}

const BookingDetailModal = ({
  isOpen,
  onClose,
  booking,
  userRole,
  onStatusUpdate,
}: BookingDetailModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [fullBookingData, setFullBookingData] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  // Fetch full booking details khi modal mở
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!isOpen || !booking.bookingId) return;

      setIsLoadingDetails(true);
      try {
        // Call API to get full booking details with payment, services, pets, customer, freelancer
        const details = await bookingService.getBookingDetails(
          booking.bookingId
        );
        console.log("Full booking details from API:", details);
        setFullBookingData(details);
      } catch (error) {
        console.error("Failed to fetch booking details:", error);
        showError("Không thể tải chi tiết đơn hàng");
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchBookingDetails();
  }, [isOpen, booking.bookingId]);

  if (!isOpen) return null;

  // Use data from fullBookingData if available, otherwise fall back to booking prop
  const bookingData = fullBookingData || booking;

  // Logic hiển thị dựa trên userRole
  const displayFreelancer =
    bookingData.freelancer || booking.freelancer || null;
  const displayCustomer = bookingData.customer || booking.customer || null;
  const displayServices = bookingData.services || booking.services || [];
  const displayPets = bookingData.pets || booking.pets || [];
  const displayPayment = bookingData.payment || booking.payment || null;

  const statusMap: Record<string, number> = {
    Pending: 0,
    Confirmed: 1,
    Completed: 2,
    Cancelled: 3,
  };

  const statusToString = (s: number | string | undefined): string => {
    if (typeof s === "string") return s;
    if (s === undefined) return "Pending";
    const map: Record<number, string> = {
      0: "Pending",
      1: "Confirmed",
      2: "Completed",
      3: "Cancelled",
    };
    return map[s] ?? "Pending";
  };

  const currentStatus = booking.bookingStatus || statusToString(booking.status);

  const timeSlotMap: Record<number, string> = {
    0: "8:00 - 10:00",
    1: "10:00 - 12:00",
    2: "12:00 - 14:00",
    3: "14:00 - 16:00",
    4: "16:00 - 18:00",
  };

  const pickUpStatusToString = (
    status: number | string | undefined
  ): string => {
    if (typeof status === "string") return status;
    if (status === undefined) return "Chưa đón";
    const map: Record<number, string> = {
      0: "Chưa đón",
      1: "Đã đón",
      2: "Đã trả",
    };
    return map[status as number] ?? "Chưa đón";
  };

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const statusValue = statusMap[newStatus];
      console.log(`Updating booking status to ${newStatus} (${statusValue})`);
      await bookingService.updateBookingStatus(booking.bookingId, statusValue);
      showSuccess(`Đã cập nhật trạng thái thành ${newStatus}`);
      onStatusUpdate?.();
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      showError("Không thể cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(booking.bookingId);
      showSuccess("Đã hủy đơn thành công");
      onStatusUpdate?.();
      onClose();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      showError("Không thể hủy đơn");
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  const handleUpdatePickupStatus = async (newPickupStatus: number) => {
    setIsUpdating(true);
    try {
      console.log(`Updating pickup status to ${newPickupStatus}`);
      await bookingService.updatePickUpStatus(
        booking.bookingId,
        newPickupStatus
      );
      const statusText =
        newPickupStatus === 0
          ? "Chưa đón"
          : newPickupStatus === 1
          ? "Đã đón"
          : "Đã trả";
      showSuccess(`Đã cập nhật trạng thái đưa đón thành ${statusText}`);
      onStatusUpdate?.();
      onClose();
    } catch (error) {
      console.error("Error updating pickup status:", error);
      showError("Không thể cập nhật trạng thái đưa đón");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteBooking = async () => {
    setIsUpdating(true);
    try {
      // Cập nhật trạng thái pickup thành Delivered (2)
      await bookingService.updatePickUpStatus(booking.bookingId, 2);
      // Cập nhật trạng thái booking thành Completed
      await bookingService.updateBookingStatus(
        booking.bookingId,
        statusMap["Completed"]
      );
      showSuccess("Đã hoàn thành đơn và giao thú cưng lại cho khách hàng");
      onStatusUpdate?.();
      onClose();
    } catch (error) {
      console.error("Error completing booking:", error);
      showError("Không thể hoàn thành đơn");
    } finally {
      setIsUpdating(false);
      setShowCompleteConfirm(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> =
      {
        Pending: {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          label: "Chờ xác nhận",
        },
        Confirmed: {
          bg: "bg-blue-100",
          text: "text-blue-800",
          label: "Đã xác nhận",
        },
        Completed: {
          bg: "bg-green-100",
          text: "text-green-800",
          label: "Hoàn thành",
        },
        Cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Đã hủy" },
      };
    const badge = badges[status] || badges.Pending;
    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Chi tiết đặt chỗ</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            {/* Booking ID & Created Date */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Mã đặt chỗ</p>
                  <p className="text-sm font-mono font-semibold text-blue-700 break-all">
                    {booking.bookingId}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(currentStatus)}
                </div>
              </div>
              {booking.createdAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Tạo lúc: {new Date(booking.createdAt).toLocaleString("vi-VN")}
                </p>
              )}
            </div>

            <div className="h-px bg-gray-200"></div>

            {/* Thông tin thú cưng */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">
                  1
                </span>
                Thông tin thú cưng
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {displayPets && displayPets.length > 0 ? (
                  displayPets.map((pet: any, index: number) => (
                    <div
                      key={pet.petId || index}
                      className="bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-base font-semibold text-gray-900">
                            {pet.petName || "Chưa có tên"}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {pet.species || "Chưa rõ loài"} •{" "}
                            {pet.breed || "Chưa rõ giống"}
                          </p>
                        </div>
                        {pet.petId && (
                          <span className="text-xs text-gray-400 font-mono">
                            #{pet.petId.slice(0, 8)}
                          </span>
                        )}
                      </div>
                      {pet.age && (
                        <p className="text-xs text-gray-500">Tuổi: {pet.age}</p>
                      )}
                      {pet.weight && (
                        <p className="text-xs text-gray-500">
                          Cân nặng: {pet.weight} kg
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">
                    Không có thông tin thú cưng
                  </p>
                )}
              </div>
            </div>

            <div className="h-px bg-gray-200"></div>

            {/* Thời gian & Địa điểm */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">
                  2
                </span>
                Thời gian & Địa điểm
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start">
                  <div className="w-20 text-xs text-gray-500 pt-0.5">
                    Ngày đặt:
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(bookingData.bookingDate).toLocaleDateString(
                        "vi-VN",
                        {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-20 text-xs text-gray-500 pt-0.5">
                    Khung giờ:
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {timeSlotMap[bookingData.pickUpTime] || "Chưa chọn"}
                    </p>
                  </div>
                </div>
                {bookingData.pickUpStatus !== undefined && (
                  <div className="flex items-start">
                    <div className="w-20 text-xs text-gray-500 pt-0.5">
                      Đưa đón:
                    </div>
                    <div className="flex-1">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${
                          bookingData.pickUpStatus === 0
                            ? "bg-gray-100 text-gray-700 border border-gray-300"
                            : bookingData.pickUpStatus === 1
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "bg-green-100 text-green-700 border border-green-300"
                        }`}
                      >
                        {pickUpStatusToString(bookingData.pickUpStatus)}
                      </span>
                    </div>
                  </div>
                )}
                {bookingData.address && (
                  <div className="flex items-start">
                    <div className="w-20 text-xs text-gray-500 pt-0.5">
                      Địa chỉ:
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        {bookingData.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-gray-200"></div>

            {/* Dịch vụ đã chọn */}
            <div>
              <SectionHeader
                number={3}
                title="Dịch vụ đã chọn"
                bgColor="bg-purple-100"
                textColor="text-purple-700"
              />
              {isLoadingDetails && !displayServices ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Đang tải dịch vụ...</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {displayServices && displayServices.length > 0 ? (
                    displayServices.map((service: any, index: number) => (
                      <div
                        key={service.serviceId || index}
                        className="bg-white rounded-lg p-3 border border-gray-200 flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {service.title ||
                              service.serviceName ||
                              "Dịch vụ thú cưng"}
                          </p>
                          {service.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {service.description}
                            </p>
                          )}
                          {service.duration && (
                            <p className="text-xs text-gray-500 mt-1">
                              Thời gian: {service.duration}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-base font-bold text-gray-900">
                            {Number(service.price || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">VNĐ</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">
                      Chưa có dịch vụ nào
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="h-px bg-gray-200"></div>

            {/* Thông tin Freelancer */}
            <div>
              <SectionHeader
                number={4}
                title="Người thực hiện dịch vụ"
                bgColor="bg-orange-100"
                textColor="text-orange-700"
              />
              {isLoadingDetails && !displayFreelancer ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              ) : (
                <UserInfoCard
                  user={displayFreelancer}
                  userId={bookingData.freelancerId}
                  fallbackInitial="F"
                  avatarBgColor="bg-orange-100"
                  avatarTextColor="text-orange-600"
                  emptyMessage="Chưa có thông tin người thực hiện"
                />
              )}
            </div>

            <div className="h-px bg-gray-200"></div>

            {/* Thông tin Khách hàng */}
            <div>
              <SectionHeader
                number={5}
                title="Thông tin người đặt"
                bgColor="bg-teal-100"
                textColor="text-teal-700"
              />
              {isLoadingDetails && !displayCustomer ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              ) : (
                <UserInfoCard
                  user={displayCustomer}
                  userId={bookingData.customerId}
                  fallbackInitial="C"
                  avatarBgColor="bg-teal-100"
                  avatarTextColor="text-teal-600"
                  emptyMessage="Chưa có thông tin người đặt"
                />
              )}
            </div>

            {bookingData.notes && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  Ghi chú
                </h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                  <p className="text-sm text-gray-700">{bookingData.notes}</p>
                </div>
              </div>
            )}

            <div className="h-px bg-gray-200"></div>

            {/* Thanh toán */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-pink-100 text-pink-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">
                  $
                </span>
                Chi tiết thanh toán
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-3">
                {displayServices && displayServices.length > 0 && (
                  <div className="space-y-2">
                    {displayServices.map((service: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {service.title || service.serviceName || "Dịch vụ"}
                        </span>
                        <span className="font-medium text-gray-900">
                          {Number(service.price || 0).toLocaleString()} VNĐ
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-bold text-indigo-700">
                      {Number(bookingData.totalPrice || 0).toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-600">
                    Trạng thái thanh toán:
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      bookingData.isPaid === true ||
                      bookingData.isPaid === "true"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {bookingData.isPaid === true ||
                    bookingData.isPaid === "true"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </span>
                </div>
                {displayPayment && (
                  <div className="bg-white rounded-lg p-3 mt-3 space-y-1">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Thông tin giao dịch
                    </p>
                    {displayPayment.method && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Phương thức:</span>
                        <span className="font-medium text-gray-900">
                          {displayPayment.method}
                        </span>
                      </div>
                    )}
                    {displayPayment.transactionId && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Mã giao dịch:</span>
                        <span className="font-mono text-gray-900">
                          {displayPayment.transactionId}
                        </span>
                      </div>
                    )}
                    {displayPayment.paidAt && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Thời gian:</span>
                        <span className="text-gray-900">
                          {new Date(displayPayment.paidAt).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {bookingData.updatedAt && (
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Cập nhật lần cuối:{" "}
                  {new Date(bookingData.updatedAt).toLocaleString("vi-VN")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="border-t border-gray-200 px-6 py-4 bg-white">
          {userRole === "freelancer" ? (
            // FREELANCER: Chỉ hiển thị nút quản lý đơn hàng
            <>
              {currentStatus === "Cancelled" ? (
                <button
                  className="w-full bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Đã hủy
                </button>
              ) : currentStatus === "Completed" ? (
                <button
                  className="w-full bg-green-100 text-green-600 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Đã hoàn thành
                </button>
              ) : currentStatus === "Pending" ? (
                <div className="space-y-3">
                  {/* Nút đón/trả pet động dựa trên pickupStatus */}
                  {bookingData.pickUpStatus === 0 ? (
                    // Chưa đón -> Hiện nút "Đón pet"
                    <button
                      onClick={() => handleUpdatePickupStatus(1)}
                      disabled={isUpdating}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Đang xử lý..." : "Đón pet"}
                    </button>
                  ) : bookingData.pickUpStatus === 1 ? (
                    // Đã đón -> Hiện nút "Trả pet"
                    <button
                      onClick={() => handleUpdatePickupStatus(0)}
                      disabled={isUpdating}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Đang xử lý..." : "Trả pet"}
                    </button>
                  ) : (
                    // Đã trả -> Disabled
                    <button
                      className="w-full bg-green-100 text-green-600 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Đã trả pet
                    </button>
                  )}
                  {/* Nút xác nhận/từ chối ở dưới */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdateStatus("Confirmed")}
                      disabled={isUpdating}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Đang xử lý..." : "Xác nhận"}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus("Cancelled")}
                      disabled={isUpdating}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ) : currentStatus === "Confirmed" ? (
                <button
                  onClick={() => setShowCompleteConfirm(true)}
                  disabled={isUpdating}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Đang xử lý..." : "Hoàn thành"}
                </button>
              ) : null}
            </>
          ) : (
            // CUSTOMER: Hiển thị thanh toán và hủy đơn
            <>
              {bookingData.isPaid === true || bookingData.isPaid === "true" ? (
                <button
                  className="w-full bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Đã thanh toán
                </button>
              ) : currentStatus === "Cancelled" ? (
                <button
                  className="w-full bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Đã hủy
                </button>
              ) : (
                <>
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isProcessingPayment}
                    onClick={async () => {
                      setIsProcessingPayment(true);
                      try {
                        // Call API to create payment
                        const returnUrl =
                          import.meta.env.VITE_PAYMENT_SUCCESS_URL ||
                          `${window.location.origin}/payment-success`;

                        console.log(
                          "Creating payment for booking:",
                          booking.bookingId
                        );

                        const paymentRes = await paymentService.createPayment({
                          bookingId: booking.bookingId,
                          method: PaymentMethodCode.PAYOS,
                          returnUrl: returnUrl,
                          description: "DV cham soc thu cung",
                        });

                        const redirectUrl =
                          paymentService.extractRedirectUrl(paymentRes);

                        // Save to localStorage for later reference
                        if (paymentRes.paymentId) {
                          localStorage.setItem(
                            "last_payment_id",
                            paymentRes.paymentId
                          );
                        }
                        localStorage.setItem(
                          "last_payment_booking_id",
                          booking.bookingId
                        );

                        if (redirectUrl) {
                          localStorage.setItem(
                            `payment_url_${booking.bookingId}`,
                            redirectUrl
                          );

                          // Redirect to payment gateway
                          window.location.href = redirectUrl;
                        } else {
                          showError("Không nhận được liên kết thanh toán");
                          setIsProcessingPayment(false);
                        }
                      } catch (error: any) {
                        console.error("Payment creation error:", error);
                        showError(
                          error.message ||
                            "Tạo thanh toán thất bại. Vui lòng thử lại."
                        );
                        setIsProcessingPayment(false);
                      }
                    }}
                  >
                    {isProcessingPayment
                      ? "Đang xử lý..."
                      : "Tiến hành thanh toán"}
                  </button>

                  {/* Nút hủy đơn cho customer - chỉ cho phép hủy khi Pending */}
                  {currentStatus === "Pending" && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      disabled={isCancelling || isProcessingPayment}
                      className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCancelling ? "Đang hủy..." : "Hủy đơn"}
                    </button>
                  )}
                  {currentStatus === "Confirmed" && (
                    <p className="mt-3 text-sm text-gray-500 text-center">
                      Đơn đã xác nhận không thể hủy
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={showCancelConfirm}
        onCancel={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelBooking}
        title="Xác nhận hủy đơn"
        message="Bạn có chắc muốn hủy đơn này?"
        confirmText="Hủy đơn"
        cancelText="Quay lại"
        type="danger"
      />

      <ConfirmDialog
        isOpen={showCompleteConfirm}
        onCancel={() => setShowCompleteConfirm(false)}
        onConfirm={handleCompleteBooking}
        title="Xác nhận hoàn thành"
        message="Đánh dấu hoàn thành đơn này? Thú cưng sẽ được đánh dấu đã giao lại cho khách hàng."
        confirmText="Hoàn thành"
        cancelText="Quay lại"
        type="success"
      />
    </div>
  );
};

export default BookingDetailModal;
