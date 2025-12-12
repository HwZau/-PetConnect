import {
  FaCheckCircle,
  FaClock,
  FaShippingFast,
  FaTimes,
} from "react-icons/fa";

interface BookingStatusTrackerProps {
  currentStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  pickUpStatus?: "NotPickedUp" | "PickedUp" | "Delivered";
  createdAt: string;
  updatedAt: string;
}

const BookingStatusTracker = ({
  currentStatus,
  pickUpStatus,
  createdAt,
  updatedAt,
}: BookingStatusTrackerProps) => {
  const statuses = [
    { name: "Pending", icon: FaClock, color: "yellow" },
    { name: "Confirmed", icon: FaCheckCircle, color: "blue" },
    { name: "Completed", icon: FaCheckCircle, color: "green" },
  ];

  const getStatusIndex = (status: string) => {
    const index = statuses.findIndex((s) => s.name === status);
    return index !== -1 ? index : 0;
  };

  const currentIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === "Cancelled";

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Trạng thái đơn hàng
      </h3>

      {isCancelled ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <FaTimes className="text-2xl text-red-500" />
          <div>
            <p className="font-semibold text-red-700">Đã hủy</p>
            <p className="text-sm text-red-600">
              Đơn hàng đã bị hủy vào{" "}
              {new Date(updatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Status Timeline */}
          <div className="relative">
            {statuses.map((status, index) => {
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;
              const Icon = status.icon;

              return (
                <div
                  key={status.name}
                  className="flex items-start mb-6 last:mb-0"
                >
                  {/* Connector Line */}
                  {index < statuses.length - 1 && (
                    <div
                      className={`absolute left-5 top-12 w-0.5 h-16 ${
                        isActive
                          ? "bg-gradient-to-b from-teal-500 to-teal-300"
                          : "bg-gray-300"
                      }`}
                      style={{ marginTop: "-8px" }}
                    />
                  )}

                  {/* Status Icon */}
                  <div className="relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg"
                          : "bg-gray-300"
                      }`}
                    >
                      <Icon className="text-white text-lg" />
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className="ml-4 flex-1">
                    <h4
                      className={`font-semibold ${
                        isActive ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {status.name === "Pending" && "Chờ xác nhận"}
                      {status.name === "Confirmed" && "Đã xác nhận"}
                      {status.name === "Completed" && "Hoàn thành"}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {isCurrent && (
                        <>
                          {status.name === "Pending" &&
                            "Đơn hàng đang chờ người chăm sóc xác nhận"}
                          {status.name === "Confirmed" &&
                            "Người chăm sóc đã xác nhận và chuẩn bị dịch vụ"}
                          {status.name === "Completed" &&
                            "Dịch vụ đã được hoàn thành"}
                        </>
                      )}
                      {!isCurrent && isActive && (
                        <span className="text-teal-600">✓ Đã hoàn thành</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pickup Status */}
          {pickUpStatus && currentStatus === "Confirmed" && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaShippingFast className="text-teal-500" />
                Trạng thái đưa đón
              </h4>
              <div className="flex gap-3">
                <div
                  className={`flex-1 p-3 rounded-lg border-2 text-center transition-all ${
                    pickUpStatus === "NotPickedUp"
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <p className="text-sm font-medium">Chưa đón</p>
                </div>
                <div
                  className={`flex-1 p-3 rounded-lg border-2 text-center transition-all ${
                    pickUpStatus === "PickedUp"
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <p className="text-sm font-medium">Đã đón</p>
                </div>
                <div
                  className={`flex-1 p-3 rounded-lg border-2 text-center transition-all ${
                    pickUpStatus === "Delivered"
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <p className="text-sm font-medium">Đã trả</p>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">Ngày tạo:</span>{" "}
              {new Date(createdAt).toLocaleString("vi-VN")}
            </p>
            <p>
              <span className="font-medium">Cập nhật lần cuối:</span>{" "}
              {new Date(updatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingStatusTracker;
