import { useState, useEffect } from "react";
import { useScrollToTop, useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import {
  showSuccess,
  showError,
  getBookingStatusLabel,
  getBookingStatusColor,
  getPickUpTimeLabel,
} from "../../utils";
import { serviceService } from "../../services";
import {
  FaUser,
  FaBriefcase,
  FaChartLine,
  FaStar,
  FaCalendarAlt,
  FaPencilAlt,
  FaDog,
  FaBolt,
  FaCog,
  FaCalendarCheck,
  FaPlus,
} from "react-icons/fa";

import Header from "../../components/profile/Header";
import ProfileMainContent from "../../components/profile/ProfileMainContent";
import FreelancerServiceCard from "../../components/freelancer/profile/FreelancerServiceCard";
import EditProfileModal from "../../components/profile/EditProfileModal";
import ChatBox from "../../components/profile/ChatBox";
import AddServiceModal from "../../components/freelancer/profile/AddServiceModal";
import EditServiceModal from "../../components/freelancer/profile/EditServiceModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

interface EditFormData {
  name: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string;
}

interface Customer {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
}

const FreelancerOwnProfilePage = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddingService, setIsAddingService] = useState<boolean>(false);
  const [isUpdatingService, setIsUpdatingService] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddServiceModal, setShowAddServiceModal] =
    useState<boolean>(false);
  const [showEditServiceModal, setShowEditServiceModal] =
    useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [editForm, setEditForm] = useState<EditFormData>({
    name: "",
    phoneNumber: "",
    address: "Hồ Chí Minh",
    avatarUrl: "",
  });

  useScrollToTop();

  // Get services from user context (from API response)
  const services = user?.services || [];

  // Calculate stats from user bookings
  const completedBookings =
    user?.bookings?.filter((b) => b.status === "Completed").length || 0;
  const totalEarnings =
    user?.bookings
      ?.filter((b) => b.status === "Completed")
      .reduce((sum, booking) => sum + booking.totalPrice, 0) || 0;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        // Load edit form data from user
        setEditForm({
          name: user?.name || "",
          phoneNumber: user?.phoneNumber || "",
          address: user?.address || "Hồ Chí Minh",
          avatarUrl: user?.avatarUrl || "",
        });
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [user?.id, user?.name, user?.phoneNumber, user?.address]);

  const handleFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: API call to update profile
      showSuccess("Cập nhật hồ sơ thành công!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleAddService = async (data: {
    name: string;
    description: string;
    price: string;
    type: string;
  }) => {
    setIsAddingService(true);
    try {
      // Call API to create service
      const response = await serviceService.createService({
        title: data.name,
        description: data.description,
        type: Number(data.type),
        price: Number(data.price),
      });

      if (response.success && response.data) {
        showSuccess("Thêm dịch vụ thành công!");
        setShowAddServiceModal(false);

        // Refresh user profile to get updated services list
        if (refreshUser) {
          await refreshUser();
        }
      } else {
        showError(response.message || "Không thể thêm dịch vụ");
      }
    } catch (error) {
      console.error("Failed to create service:", error);
      showError("Đã xảy ra lỗi khi thêm dịch vụ");
    } finally {
      setIsAddingService(false);
    }
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setShowEditServiceModal(true);
  };

  const handleUpdateService = async (
    serviceId: string,
    data: {
      title: string;
      description: string;
      type: string;
      price: number;
    }
  ) => {
    setIsUpdatingService(true);
    try {
      const response = await serviceService.updateService(serviceId, {
        title: data.title,
        description: data.description,
        type: Number(data.type),
        price: data.price,
      });

      if (response.success) {
        showSuccess("Cập nhật dịch vụ thành công!");
        setShowEditServiceModal(false);
        setSelectedService(null);

        // Refresh user profile to get updated services
        if (refreshUser) {
          await refreshUser();
        }
      } else {
        showError(response.message || "Không thể cập nhật dịch vụ");
      }
    } catch (error) {
      console.error("Failed to update service:", error);
      showError("Đã xảy ra lỗi khi cập nhật dịch vụ");
    } finally {
      setIsUpdatingService(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    setServiceToDelete(serviceId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await serviceService.deleteService(serviceToDelete);

      if (response.success) {
        showSuccess("Xóa dịch vụ thành công!");

        // Refresh user profile to get updated services
        if (refreshUser) {
          await refreshUser();
        }
      } else {
        showError(response.message || "Không thể xóa dịch vụ");
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
      showError("Đã xảy ra lỗi khi xóa dịch vụ");
    } finally {
      setShowDeleteConfirm(false);
      setServiceToDelete(null);
    }
  };

  // Helper function is no longer needed since we get services from API
  // const getCategoryLabel = (type: number): string => { ... }

  const handleSelectCustomer = (customerId: string) => {
    const customer: Customer = {
      id: customerId,
      name: "Khách hàng A",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
      online: true,
    };
    setSelectedCustomer(customer);
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-cyan-50">
      <Header />

      {/* Pet Background Section - Covers top half */}
      <div className="relative w-full">
        {/* Pet Image Background with Teal Overlay */}
        <div className="absolute top-0 left-0 right-0 h-[350px] rounded-b-[3rem] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1920&q=80')`,
            }}
          ></div>
          {/* Teal/Cyan Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/90 via-cyan-500/85 to-emerald-500/90"></div>
        </div>

        {/* Profile Header on Pet Background */}
        <div className="relative z-20 w-full px-6 pt-8 pb-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-2xl shadow-xl p-3">
                  <img
                    src={
                      user?.avatar ||
                      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400"
                    }
                    alt={user?.name || "Freelancer"}
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400";
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {user?.name || "Freelancer"}
                    </h1>
                    <p className="text-teal-100 text-sm mb-3">
                      Freelancer - Chuyên gia thú cưng
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                        <FaStar className="text-yellow-300" /> Chuyên gia được
                        xác minh
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                        {user?.email || "user@example.com"}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <FaBriefcase className="text-orange-300" />
                        <span>5 năm kinh nghiệm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarCheck className="text-green-300" />
                        <span>{completedBookings} dự án hoàn thành</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-300" />
                        <span>4.9 đánh giá</span>
                      </div>
                    </div>
                  </div>

                  {/* Edit Profile Button */}
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-white hover:bg-gray-50 text-teal-600 font-semibold px-6 py-2.5 rounded-lg transition-all shadow-lg flex items-center gap-2"
                  >
                    <FaPencilAlt /> CHỈNH SỬA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 2 Column Layout with elevated cards */}
        <div className="relative z-10 w-full px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* MIDDLE Column - Main Content (9/12) */}
              <div className="lg:col-span-9 space-y-6">
                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                  <div className="flex border-b border-gray-200 overflow-x-auto">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`px-6 py-4 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeTab === "profile"
                          ? "text-teal-600 border-b-3 border-teal-600 bg-gradient-to-r from-teal-50 to-emerald-50"
                          : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaUser className="text-lg" />
                      <span>Hồ sơ</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("services")}
                      className={`px-6 py-4 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeTab === "services"
                          ? "text-teal-600 border-b-3 border-teal-600 bg-gradient-to-r from-teal-50 to-emerald-50"
                          : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaBriefcase className="text-lg" />
                      <span>Dịch vụ</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className={`px-6 py-4 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeTab === "activity"
                          ? "text-teal-600 border-b-3 border-teal-600 bg-gradient-to-r from-teal-50 to-emerald-50"
                          : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaChartLine className="text-lg" />
                      <span>Hoạt động</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("customers")}
                      className={`px-6 py-4 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeTab === "customers"
                          ? "text-teal-600 border-b-3 border-teal-600 bg-gradient-to-r from-teal-50 to-emerald-50"
                          : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaDog className="text-lg" />
                      <span>Khách hàng</span>
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === "profile" && (
                  <ProfileMainContent
                    bio="Chuyên gia chăm sóc thú cưng với nhiều năm kinh nghiệm."
                    onEdit={() => setShowEditModal(true)}
                  />
                )}

                {activeTab === "services" && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <FaBriefcase className="mr-3 text-2xl text-teal-600" />
                        Dịch vụ của tôi
                      </h3>
                      <button
                        onClick={() => setShowAddServiceModal(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                      >
                        <FaPlus /> Thêm dịch vụ
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {services.length > 0 ? (
                        services.map((service) => (
                          <FreelancerServiceCard
                            key={service.id}
                            service={service}
                            onEdit={handleEditService}
                            onDelete={handleDeleteService}
                          />
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-12 text-gray-500">
                          <FaBriefcase className="text-6xl mb-4 mx-auto text-gray-400" />
                          <p className="text-lg font-medium">
                            Chưa có dịch vụ nào
                          </p>
                          <button
                            onClick={() => setShowAddServiceModal(true)}
                            className="mt-4 px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md"
                          >
                            + Thêm dịch vụ đầu tiên
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "activity" && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <FaChartLine className="mr-3 text-2xl text-teal-600" />
                      Dịch vụ đã làm
                    </h3>
                    <div className="space-y-4">
                      {user?.bookings && user.bookings.length > 0 ? (
                        user.bookings.map((booking) => (
                          <div
                            key={booking.bookingId}
                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                              <FaCalendarAlt className="text-white text-xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-semibold text-gray-800">
                                  {booking.serviceType}
                                </h4>
                                <span
                                  className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${getBookingStatusColor(
                                    booking.status
                                  )}`}
                                >
                                  {getBookingStatusLabel(booking.status)}
                                </span>
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>
                                  📅{" "}
                                  {new Date(
                                    booking.scheduledDate
                                  ).toLocaleDateString("vi-VN")}
                                </p>
                                {booking.pickUpTime && (
                                  <p>
                                    🕐 {getPickUpTimeLabel(booking.pickUpTime)}
                                  </p>
                                )}
                                <p className="font-semibold text-teal-600">
                                  💰{" "}
                                  {booking.totalPrice.toLocaleString("vi-VN")} ₫
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <FaCalendarAlt className="text-6xl mb-4 mx-auto text-gray-400" />
                          <p className="text-lg font-medium">
                            Chưa có dịch vụ nào
                          </p>
                          <p className="text-sm mt-2">
                            Các dịch vụ bạn đã làm sẽ hiển thị ở đây
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "customers" && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <FaDog className="mr-3 text-2xl text-teal-600" />
                      Khách hàng đã liên hệ
                    </h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectCustomer(`customer-${i}`)}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-teal-50 transition-all cursor-pointer border border-transparent hover:border-teal-200"
                        >
                          <img
                            src={`https://images.unsplash.com/photo-${
                              1500648767791 + i
                            }-00dcc994a43e?auto=format&fit=crop&w=100&h=100`}
                            alt={`Customer ${i}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              Khách hàng {i}
                            </p>
                            <p className="text-sm text-gray-500">
                              Tin nhắn gần nhất...
                            </p>
                          </div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT Column - Chat & Stats (3/12) */}
              <div className="lg:col-span-3">
                <div className="space-y-6">
                  {/* Chat Box */}
                  <ChatBox
                    isOpen={!!selectedCustomer}
                    selectedFreelancer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                  />

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                      <FaBolt className="mr-2" />
                      Thống kê nhanh
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-teal-100">Dự án hoàn thành:</span>
                        <span className="font-bold text-2xl">
                          {completedBookings}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-teal-100">Tổng thu nhập:</span>
                        <span className="font-bold text-lg">
                          {totalEarnings.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-teal-100">Số dịch vụ:</span>
                        <span className="font-bold text-2xl">
                          {services.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-teal-100">Đánh giá:</span>
                        <span className="font-bold text-xl flex items-center gap-2">
                          <FaStar /> 4.9
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                      <FaCog className="mr-2" />
                      Thao tác nhanh
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowAddServiceModal(true)}
                        className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg transition-all flex items-center gap-3 border border-blue-200"
                      >
                        <FaPlus className="text-xl text-blue-600" />
                        <span className="font-medium text-gray-700">
                          Thêm dịch vụ mới
                        </span>
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 rounded-lg transition-all flex items-center gap-3 border border-teal-200">
                        <FaBriefcase className="text-xl text-teal-600" />
                        <span className="font-medium text-gray-700">
                          Quản lý dịch vụ
                        </span>
                      </button>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="w-full text-left px-4 py-3 bg-gradient-to-r from-orange-50 to-pink-50 hover:from-orange-100 hover:to-pink-100 rounded-lg transition-all flex items-center gap-3 border border-orange-200"
                      >
                        <FaPencilAlt className="text-xl text-orange-600" />
                        <span className="font-medium text-gray-700">
                          Chỉnh sửa hồ sơ
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
        formData={editForm}
        onChange={handleFormChange}
      />

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={showAddServiceModal}
        onClose={() => setShowAddServiceModal(false)}
        onSubmit={handleAddService}
        isLoading={isAddingService}
      />

      {/* Edit Service Modal */}
      <EditServiceModal
        isOpen={showEditServiceModal}
        onClose={() => {
          setShowEditServiceModal(false);
          setSelectedService(null);
        }}
        onSubmit={handleUpdateService}
        isLoading={isUpdatingService}
        service={selectedService}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Xác nhận xóa dịch vụ"
        message="Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        onConfirm={confirmDeleteService}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setServiceToDelete(null);
        }}
      />
    </div>
  );
};

export default FreelancerOwnProfilePage;
