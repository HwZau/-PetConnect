import { useState, useEffect, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { showSuccess, showError } from "../../utils";
import { bookingService } from "../../services/booking/bookingService";
import { freelancerService } from "../../services/freelancer/freelancerService";
import { serviceService } from "../../services/service/serviceService";
import { UserContext } from "../../contexts/UserContext";

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
  const [freelancerData, setFreelancerData] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const { user } = useContext(UserContext);

  // Fetch details khi modal mở
  useEffect(() => {
    const fetchDetails = async () => {
      if (!isOpen) return;

      setIsLoadingDetails(true);
      try {
        // Nếu là CUSTOMER -> fetch freelancer info
        // Nếu là FREELANCER -> fetch customer info

        if (
          userRole === "customer" &&
          booking.freelancerId &&
          !booking.freelancer
        ) {
          // Customer xem booking của mình -> lấy thông tin freelancer
          try {
            const response = await freelancerService.getFreelancerById(
              booking.freelancerId
            );
            if (response.success && response.data) {
              setFreelancerData({
                name: response.data.name,
                phone: response.data.phoneNumber,
                email: response.data.email,
                avatar: response.data.avatarUrl,
              });
            }
          } catch (error) {
            console.error("Failed to fetch freelancer:", error);
          }
        }

        if (
          userRole === "freelancer" &&
          booking.customerId &&
          !booking.customer
        ) {
          // Freelancer xem booking khách hàng đặt -> lấy thông tin customer
          // TODO: Implement khi backend có API GET /api/v1/customer/{id}
          // const response = await customerService.getCustomerById(booking.customerId);
          // setCustomerData(...);
        }

        // Fetch service details nếu có serviceIds
        if (booking.serviceIds && !booking.services) {
          const serviceIds = Array.isArray(booking.serviceIds)
            ? booking.serviceIds
            : [booking.serviceIds];

          const servicePromises = serviceIds.map((id) =>
            serviceService.getServiceDetail(id).catch((err) => {
              console.error(`Failed to fetch service ${id}:`, err);
              return null;
            })
          );

          const serviceResponses = await Promise.all(servicePromises);
          const validServices = serviceResponses
            .filter((res) => res?.success && res?.data)
            .map((res) => ({
              serviceId: res?.data?.id || "",
              serviceName: res?.data?.title || "",
              description: res?.data?.description || "",
              price: res?.data?.price || 0,
              type: res?.data?.type || "",
            }));

          if (validServices.length > 0) {
            setServicesData(validServices);
          }
        }
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [
    isOpen,
    booking.freelancerId,
    booking.customerId,
    booking.serviceIds,
    userRole,
  ]);

  if (!isOpen) return null;

  // Logic hiển thị dựa trên userRole
  const displayFreelancer =
    userRole === "customer"
      ? freelancerData || booking.freelancer
      : {
          name: user?.name,
          phone: user?.phoneNumber,
          email: user?.email,
          avatar: user?.avatarUrl,
        };

  const displayCustomer =
    userRole === "freelancer"
      ? booking.customer
      : {
          name: user?.name,
          phone: user?.phoneNumber,
          email: user?.email,
          avatar: user?.avatarUrl,
        };

  const displayServices =
    servicesData.length > 0 ? servicesData : booking.services;

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
      await bookingService.updateBookingStatus(
        booking.bookingId,
        statusMap[newStatus]
      );
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

  const canUpdateStatus =
    userRole === "freelancer" && currentStatus !== "Cancelled";

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
                {booking.pets && booking.pets.length > 0 ? (
                  booking.pets.map((pet: any, index: number) => (
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
                      {new Date(booking.bookingDate).toLocaleDateString(
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
                      {timeSlotMap[booking.pickUpTime] || "Chưa chọn"}
                    </p>
                  </div>
                </div>
                {booking.pickUpStatus !== undefined && (
                  <div className="flex items-start">
                    <div className="w-20 text-xs text-gray-500 pt-0.5">
                      Đưa đón:
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-2.5 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700">
                        {pickUpStatusToString(booking.pickUpStatus)}
                      </span>
                    </div>
                  </div>
                )}
                {booking.address && (
                  <div className="flex items-start">
                    <div className="w-20 text-xs text-gray-500 pt-0.5">
                      Địa chỉ:
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{booking.address}</p>
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
                            {service.serviceName || "Dịch vụ không xác định"}
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
                  userId={booking.freelancerId}
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
                  userId={booking.customerId}
                  fallbackInitial="C"
                  avatarBgColor="bg-teal-100"
                  avatarTextColor="text-teal-600"
                  emptyMessage="Chưa có thông tin người đặt"
                />
              )}
            </div>

            {booking.notes && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  Ghi chú
                </h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                  <p className="text-sm text-gray-700">{booking.notes}</p>
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
                          {service.serviceName}
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
                      {Number(booking.totalPrice || 0).toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-600">
                    Trạng thái thanh toán:
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      booking.isPaid === true || booking.isPaid === "true"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {booking.isPaid === true || booking.isPaid === "true"
                      ? "✓ Đã thanh toán"
                      : "○ Chưa thanh toán"}
                  </span>
                </div>
                {booking.payment && (
                  <div className="bg-white rounded-lg p-3 mt-3 space-y-1">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Thông tin giao dịch
                    </p>
                    {booking.payment.method && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Phương thức:</span>
                        <span className="font-medium text-gray-900">
                          {booking.payment.method}
                        </span>
                      </div>
                    )}
                    {booking.payment.transactionId && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Mã giao dịch:</span>
                        <span className="font-mono text-gray-900">
                          {booking.payment.transactionId}
                        </span>
                      </div>
                    )}
                    {booking.payment.paidAt && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Thời gian:</span>
                        <span className="text-gray-900">
                          {new Date(booking.payment.paidAt).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {booking.updatedAt && (
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Cập nhật lần cuối:{" "}
                  {new Date(booking.updatedAt).toLocaleString("vi-VN")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="border-t border-gray-200 px-6 py-4 bg-white">
          {booking.isPaid === true || booking.isPaid === "true" ? (
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
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
              onClick={onClose}
            >
              Tiến hành thanh toán
            </button>
          )}

          {/* Nút hành động cho freelancer */}
          {canUpdateStatus && currentStatus === "Pending" && (
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleUpdateStatus("Confirmed")}
                disabled={isUpdating}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isUpdating ? "Đang xử lý..." : "Xác nhận"}
              </button>
              <button
                onClick={() => handleUpdateStatus("Cancelled")}
                disabled={isUpdating}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                Từ chối
              </button>
            </div>
          )}

          {canUpdateStatus && currentStatus === "Confirmed" && (
            <button
              onClick={() => handleUpdateStatus("Completed")}
              disabled={isUpdating}
              className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Đang xử lý..." : "Hoàn thành"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
