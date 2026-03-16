import { useState, useEffect } from "react";
import { isAdminRole } from "../../utils/authUtils";
import { useScrollToTop, useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils";
import { serviceService, profileService } from "../../services";
import { apiClient } from "../../services/apiClient";
import { API_ENDPOINTS } from "../../config/api";
import {
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaPencilAlt,
  FaBolt,
  FaCalendarCheck,
  FaPlus,
  FaClipboardList,
  FaClock,
  FaDollarSign,
  FaPaw,
  FaComment,
  FaCheckCircle,
} from "react-icons/fa";
import BookingDetailModal from "../../components/booking/BookingDetailModal";

import Header from "../../components/profile/Header";
import FreelancerServiceCard from "../../components/freelancer/profile/FreelancerServiceCard";
import EditProfileModal from "../../components/profile/EditProfileModal";
import ChatBox from "../../components/profile/ChatBox";
import AddServiceModal from "../../components/freelancer/profile/AddServiceModal";
import EditServiceModal from "../../components/freelancer/profile/EditServiceModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Avatar from "../../components/common/Avatar";

// Utility function to check if booking is upcoming soon (within 24 hours)
const isUpcomingSoon = (bookingDate: string): boolean => {
  const now = new Date();
  const booking = new Date(bookingDate);
  const diffHours = (booking.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours <= 24;
};

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
  const [bookingsHistory, setBookingsHistory] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [freelancerProfile, setFreelancerProfile] = useState<any>(null);
  const [bookingsFilter, setBookingsFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [bookingsPage, setBookingsPage] = useState<number>(1);
  const [bookingsPerPage] = useState<number>(5);

  useScrollToTop();

  // Get services from freelancer profile or user context
  const services = freelancerProfile?.services || user?.services || [];

  // Fetch freelancer profile on mount to get full data including services and bookings
  useEffect(() => {
    const loadFreelancerProfile = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        const response = await apiClient.get<any>(
          API_ENDPOINTS.USERS.FREELANCER_PROFILE
        );

        if (response.success && response.data) {
          setFreelancerProfile(response.data);

          if (response.data.bookings) {
            setBookingsHistory(response.data.bookings);
          }
        }
      } catch (error) {
        console.error("Error loading freelancer profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFreelancerProfile();
  }, [user?.id]);

  // Update bookings whenever freelancerProfile changes
  useEffect(() => {
    if (freelancerProfile?.bookings) {
      setBookingsHistory(freelancerProfile.bookings);
    }
  }, [freelancerProfile]);

  // Filter and paginate bookings
  const filteredBookings = bookingsHistory.filter((booking: any) => {
    const statusNum = Number(booking.status);

    // Status filter
    if (bookingsFilter !== "all") {
      if (bookingsFilter === "pending" && statusNum !== 0) return false;
      if (bookingsFilter === "confirmed" && statusNum !== 1) return false;
      if (bookingsFilter === "completed" && statusNum !== 2) return false;
      if (bookingsFilter === "cancelled" && statusNum !== 3) return false;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      const bookingDate = new Date(booking.bookingDate);
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        if (bookingDate < fromDate) return false;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        if (bookingDate > toDate) return false;
      }
    }

    return true;
  });

  const totalBookingsPages = Math.ceil(
    filteredBookings.length / bookingsPerPage
  );
  const paginatedBookings = filteredBookings.slice(
    (bookingsPage - 1) * bookingsPerPage,
    bookingsPage * bookingsPerPage
  );

  // Calculate stats from freelancer profile bookings
  const completedBookings =
    freelancerProfile?.bookings?.filter((b: any) => Number(b.status) === 2)
      .length || 0;
  const totalEarnings =
    freelancerProfile?.bookings
      ?.filter((b: any) => Number(b.status) === 2)
      .reduce(
        (sum: number, booking: any) => sum + (booking.totalPrice || 0),
        0
      ) || 0;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user && isAdminRole(user.role)) {
      window.location.replace("/admin/dashboard");
      return;
    }
  }, [isAuthenticated, navigate, user]);

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
      // Call API to update freelancer profile
      const response = await profileService.updateFreelancerProfile({
        name: editForm.name,
        phoneNumber: editForm.phoneNumber,
        address: editForm.address,
        avatarUrl: editForm.avatarUrl,
      });

      if (response.success) {
        showSuccess("Đã cập nhật hồ sơ thành công!");
        setShowEditModal(false);
        // Refresh user data
        if (refreshUser) {
          await refreshUser();
        }
        // Reload freelancer profile
        const profileResponse = await apiClient.get<any>(
          API_ENDPOINTS.USERS.FREELANCER_PROFILE
        );
        if (profileResponse.success && profileResponse.data) {
          setFreelancerProfile(profileResponse.data);
        }
      } else {
        showError(response.message || "Cập nhật hồ sơ thất bại");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      showError(error.message || "Đã xảy ra lỗi khi cập nhật hồ sơ");
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
        name: data.name,
        description: data.description,
        category: data.type,
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
    // Ensure we always pass an ID to the edit modal (backend uses _id)
    setSelectedService({ ...service, id: service._id || service.id });
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
        name: data.name,
        description: data.description,
        category: data.category,
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
                <Avatar
                  src={user?.avatarUrl || user?.avatar}
                  name={user?.name || "Freelancer"}
                  size="xl"
                  className="shadow-xl"
                />
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
                      Freelancer - Chuyên gia chăm sóc thú cưng
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <FaBriefcase className="text-orange-300" />
                        <span>{services.length} dịch vụ</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarCheck className="text-green-300" />
                        <span>{completedBookings} dự án hoàn thành</span>
                      </div>
                    </div>
                  </div>
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
                      onClick={() => setActiveTab("bookings")}
                      className={`px-6 py-4 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeTab === "bookings"
                          ? "text-teal-600 border-b-3 border-teal-600 bg-gradient-to-r from-teal-50 to-emerald-50"
                          : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaClipboardList className="text-lg" />
                      <span>Đơn hàng</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("customers")}
                      className={`px-6 py-4 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeTab === "customers"
                          ? "text-teal-600 border-b-3 border-teal-600 bg-gradient-to-r from-teal-50 to-emerald-50"
                          : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaUser className="text-lg" />
                      <span>Khách hàng</span>
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === "profile" && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <FaUser className="mr-3 text-2xl text-teal-600" />
                        Thông tin cá nhân
                      </h3>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md flex items-center gap-2 font-medium"
                      >
                        <FaPencilAlt /> Chỉnh sửa
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaUser className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-semibold text-gray-600">
                            Họ và tên
                          </label>
                          <p className="text-gray-900 text-base font-medium mt-1">
                            {freelancerProfile?.name || user?.name || (
                              <span className="text-gray-400 italic">
                                Chưa cập nhật
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaCalendarAlt className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-semibold text-gray-600">
                            Số điện thoại
                          </label>
                          <p className="text-gray-900 text-base font-medium mt-1">
                            {freelancerProfile?.phoneNumber ||
                              user?.phoneNumber || (
                                <span className="text-gray-400 italic">
                                  Chưa cập nhật
                                </span>
                              )}
                          </p>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaBriefcase className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-semibold text-gray-600">
                            Địa chỉ
                          </label>
                          <p className="text-gray-900 text-base font-medium mt-1">
                            {freelancerProfile?.address || user?.address || (
                              <span className="text-gray-400 italic">
                                Chưa cập nhật
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                      {services && services.length > 0 ? (
                        services.map((service: any) => (
                          <FreelancerServiceCard
                            key={service._id || service.id}
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

                {activeTab === "bookings" && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <FaClipboardList className="mr-3 text-2xl text-teal-600" />
                      Quản lý đơn hàng
                    </h3>

                    {/* Filter buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        {
                          id: "all",
                          label: "Tất cả",
                          icon: "📋",
                          count: bookingsHistory.length,
                        },
                        {
                          id: "pending",
                          label: "Chờ xác nhận",
                          icon: "⏳",
                          count: bookingsHistory.filter(
                            (b: any) => Number(b.status) === 0
                          ).length,
                        },
                        {
                          id: "confirmed",
                          label: "Đã xác nhận",
                          icon: "✅",
                          count: bookingsHistory.filter(
                            (b: any) => Number(b.status) === 1
                          ).length,
                        },
                        {
                          id: "completed",
                          label: "Hoàn thành",
                          icon: "🎉",
                          count: bookingsHistory.filter(
                            (b: any) => Number(b.status) === 2
                          ).length,
                        },
                        {
                          id: "cancelled",
                          label: "Đã hủy",
                          icon: "❌",
                          count: bookingsHistory.filter(
                            (b: any) => Number(b.status) === 3
                          ).length,
                        },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setBookingsFilter(t.id as any);
                            setBookingsPage(1);
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                            bookingsFilter === t.id
                              ? "bg-teal-600 text-white border-teal-600 shadow-md"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-teal-300"
                          }`}
                        >
                          {t.label} ({t.count})
                        </button>
                      ))}
                    </div>

                    {/* Date Range Filter */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700">
                          Lọc theo ngày:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Từ ngày"
                          />
                          <span className="text-gray-500">→</span>
                          <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Đến ngày"
                          />
                        </div>
                        {(dateFrom || dateTo) && (
                          <button
                            onClick={() => {
                              setDateFrom("");
                              setDateTo("");
                            }}
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            Xóa bộ lọc
                          </button>
                        )}
                      </div>
                    </div>

                    {loading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Đang tải...</p>
                      </div>
                    ) : paginatedBookings && paginatedBookings.length > 0 ? (
                      <>
                        <div className="space-y-4">
                          {paginatedBookings.map((booking: any) => {
                            const statusNum = Number(booking.status);
                            const isPaid =
                              booking.isPaid === true ||
                              booking.isPaid === "true";
                            const pets = booking.pets || [];

                            const isUpcoming = isUpcomingSoon(
                              booking.bookingDate
                            );
                            // Only highlight if status is Pending or Confirmed
                            const shouldHighlight =
                              isUpcoming &&
                              (statusNum === 0 || statusNum === 1);

                            return (
                              <div
                                key={booking.bookingId}
                                className={`relative flex items-start gap-4 p-4 rounded-lg transition-all border cursor-pointer ${
                                  shouldHighlight
                                    ? "bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 shadow-md hover:shadow-lg"
                                    : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                                }`}
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowBookingModal(true);
                                }}
                              >
                                {shouldHighlight && (
                                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse z-10">
                                    <FaClock className="text-xs" />
                                    Sắp tới!
                                  </div>
                                )}
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    shouldHighlight
                                      ? "bg-gradient-to-br from-amber-400 to-orange-400"
                                      : "bg-gradient-to-br from-teal-400 to-cyan-400"
                                  }`}
                                >
                                  <FaCalendarAlt className="text-white text-xl" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                      <h4 className="font-semibold text-gray-800">
                                        Đơn hàng #
                                        {booking.bookingId.slice(0, 8)}
                                      </h4>
                                      <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <FaCalendarAlt className="text-gray-500" />{" "}
                                        {booking.bookingDate}
                                      </p>
                                      {pets.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                          <FaPaw className="text-gray-400" />
                                          {pets
                                            .map((p: any) => p.petName)
                                            .join(", ")}
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <span
                                        className={`inline-block text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                                          statusNum === 0
                                            ? "bg-yellow-100 text-yellow-800"
                                            : statusNum === 1
                                            ? "bg-blue-100 text-blue-800"
                                            : statusNum === 2
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {statusNum === 0
                                          ? "Chờ xác nhận"
                                          : statusNum === 1
                                          ? "Đã xác nhận"
                                          : statusNum === 2
                                          ? "Hoàn thành"
                                          : "Đã hủy"}
                                      </span>
                                      {isPaid && (
                                        <span className="mt-1 text-xs text-green-600 font-medium flex items-center gap-1">
                                          <FaCheckCircle /> Đã thanh toán
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center gap-1">
                                      <FaClock className="text-gray-500" /> Slot{" "}
                                      {booking.pickUpTime || 0} (
                                      {8 + (booking.pickUpTime || 0) * 2}:00 -{" "}
                                      {10 + (booking.pickUpTime || 0) * 2}:00)
                                    </span>
                                    <span className="font-semibold text-teal-600 flex items-center gap-1">
                                      <FaDollarSign className="text-teal-600" />
                                      {(booking.totalPrice || 0).toLocaleString(
                                        "vi-VN"
                                      )}{" "}
                                      ₫
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Pagination */}
                        {totalBookingsPages > 1 && (
                          <div className="flex justify-center items-center gap-2 mt-6">
                            <button
                              onClick={() =>
                                setBookingsPage((p) => Math.max(1, p - 1))
                              }
                              disabled={bookingsPage === 1}
                              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Trước
                            </button>
                            {Array.from(
                              { length: totalBookingsPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <button
                                key={page}
                                onClick={() => setBookingsPage(page)}
                                className={`px-4 py-2 rounded-lg font-medium ${
                                  bookingsPage === page
                                    ? "bg-teal-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() =>
                                setBookingsPage((p) =>
                                  Math.min(totalBookingsPages, p + 1)
                                )
                              }
                              disabled={bookingsPage === totalBookingsPages}
                              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Tiếp
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FaClipboardList className="text-6xl mb-4 mx-auto text-gray-400" />
                        <p className="text-lg font-medium">
                          Chưa có đơn hàng nào
                        </p>
                        <p className="text-sm mt-2">
                          Các đơn hàng từ khách hàng sẽ hiển thị ở đây
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "customers" && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <FaUser className="mr-3 text-2xl text-teal-600" />
                      Danh sách khách hàng
                    </h3>
                    {bookingsHistory && bookingsHistory.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {Array.from(
                          new Set(bookingsHistory.map((b: any) => b.customerId))
                        ).map((customerId: any) => {
                          const customerBookings = bookingsHistory.filter(
                            (b: any) => b.customerId === customerId
                          );
                          const latestBooking = customerBookings[0];
                          const completedCount = customerBookings.filter(
                            (b: any) => Number(b.status) === 2
                          ).length;
                          const pets = latestBooking.pets || [];

                          return (
                            <div
                              key={customerId}
                              onClick={() => handleSelectCustomer(customerId)}
                              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-teal-50 transition-colors border border-gray-200 cursor-pointer hover:border-teal-300"
                            >
                              <Avatar
                                src={
                                  latestBooking?.customer?.avatarUrl ||
                                  latestBooking?.customer?.avatar ||
                                  ""
                                }
                                name={
                                  latestBooking?.customer?.name ||
                                  latestBooking?.customerName ||
                                  "Khách hàng"
                                }
                                size="lg"
                                className="flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 mb-1">
                                  {latestBooking?.customer?.name ||
                                    latestBooking?.customerName ||
                                    `Khách hàng #${customerId.slice(0, 8)}`}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {customerBookings.length} đơn hàng •{" "}
                                  <FaCheckCircle className="inline text-green-600" />{" "}
                                  {completedCount} hoàn thành
                                </p>
                                {pets.length > 0 && (
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <FaPaw className="text-gray-400" />
                                    {pets.map((p: any) => p.petName).join(", ")}
                                  </p>
                                )}
                                <button className="mt-2 text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
                                  <FaComment /> Nhắn tin
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FaUser className="text-6xl mb-4 mx-auto text-gray-400" />
                        <p className="text-lg font-medium">
                          Chưa có khách hàng nào
                        </p>
                        <p className="text-sm mt-2">
                          Khách hàng đặt dịch vụ của bạn sẽ hiển thị ở đây
                        </p>
                      </div>
                    )}
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
                        <span className="text-teal-100">Khách hàng:</span>
                        <span className="font-bold text-2xl">
                          {bookingsHistory
                            ? Array.from(
                                new Set(
                                  bookingsHistory.map((b: any) => b.customerId)
                                )
                              ).length
                            : 0}
                        </span>
                      </div>
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          userRole="freelancer"
          onStatusUpdate={async () => {
            // Reload freelancer profile to get updated bookings
            try {
              const response = await apiClient.get<any>(
                API_ENDPOINTS.USERS.FREELANCER_PROFILE
              );
              if (response.success && response.data) {
                setFreelancerProfile(response.data);
                if (response.data.bookings) {
                  setBookingsHistory(response.data.bookings);
                }
              }
            } catch (error) {
              console.error("Error reloading profile:", error);
            }
          }}
        />
      )}
    </div>
  );
};

export default FreelancerOwnProfilePage;
