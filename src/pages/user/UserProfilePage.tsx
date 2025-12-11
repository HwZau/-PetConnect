import { useState, useEffect } from "react";
import { isAdminRole } from "../../utils/authUtils";
import { useScrollToTop, useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils";
import { petService, profileService, bookingService } from "../../services";
import {
  FaUser,
  FaPaw,
  FaChartLine,
  FaBriefcase,
  FaStar,
  FaCalendarAlt,
  FaGift,
  FaDog,
  FaCat,
  FaTrash,
  FaBolt,
  FaAward,
  FaCheckCircle,
  FaHeadset,
  FaBullseye,
  FaCalendarCheck,
  FaEdit,
} from "react-icons/fa";

import Header from "../../components/profile/Header";
import UpgradePlanCard from "../../components/profile/UpgradePlanCard";
import FreelancerContactsCard from "../../components/profile/FreelancerContactsCard";
import EditProfileModal from "../../components/profile/EditProfileModal";
import UpgradeModal from "../../components/profile/UpgradeModal";
import ChatBox from "../../components/profile/ChatBox";
import AddPetModal, {
  type PetFormData,
} from "../../components/profile/AddPetModal";
import EditPetModal from "../../components/profile/EditPetModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { BookingDetailModal } from "../../components/booking";
import {
  getBookingStatusLabel,
  getBookingStatusColor,
  getPickUpTimeLabel,
} from "../../utils/bookingUtils";
import {
  paymentService,
  PaymentMethodCode,
} from "../../services/payment/paymentService";
import { apiClient } from "../../services/apiClient";
import { API_ENDPOINTS } from "../../config/api";
import { freelancerService } from "../../services/freelancer/freelancerService";
import type { FreelancerData } from "../../services/freelancer/freelancerService";

interface EditFormData {
  name: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string;
}

interface Freelancer {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
}

const UserProfilePage = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [activityFilter, setActivityFilter] = useState<
    "all" | "upcoming" | "completed" | "cancelled"
  >("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showAddPetModal, setShowAddPetModal] = useState<boolean>(false);
  const [showEditPetModal, setShowEditPetModal] = useState<boolean>(false);
  const [showDeletePetConfirm, setShowDeletePetConfirm] =
    useState<boolean>(false);
  const [petToDelete, setPetToDelete] = useState<{
    petId: string;
    petName: string;
  } | null>(null);
  const [selectedPet, setSelectedPet] = useState<{
    petId: string;
    petName: string;
    species: string;
    breed: string;
  } | null>(null);
  const [selectedFreelancer, setSelectedFreelancer] =
    useState<Freelancer | null>(null);
  const [bookingsPage, setBookingsPage] = useState<number>(1);
  const [bookingsPerPage] = useState<number>(5);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showBookingDetail, setShowBookingDetail] = useState<boolean>(false);
  const [latestFreelancer, setLatestFreelancer] = useState<Freelancer | null>(
    null
  );
  const [freelancersList, setFreelancersList] = useState<Freelancer[]>([]);
  const [bookingsHistory, setBookingsHistory] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    name: "",
    phoneNumber: "",
    address: "",
    avatarUrl: "",
  });

  useScrollToTop();

  // Calculate total spent from bookings
  const statusToString = (s: number | string): string => {
    if (typeof s === "string") return s;
    const map: Record<number, string> = {
      0: "Pending",
      1: "Confirmed",
      2: "Completed",
      3: "Cancelled",
    };
    return map[s] ?? String(s);
  };

  const totalSpent =
    user?.bookings?.reduce((sum, b) => sum + (b.totalPrice || 0), 0) || 0;
  const completedBookings =
    user?.bookings?.filter((b) => statusToString(b.status) === "Completed")
      .length || 0;

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
        // Set edit form with user data
        setEditForm({
          name: user?.name || "",
          phoneNumber: user?.phoneNumber || "",
          address: user?.address || "",
          avatarUrl: user?.avatar || "",
        });
        const bookings = user?.bookings || [];
        if (bookings.length > 0) {
          // Get unique freelancer IDs from bookings
          const freelancerIds = [
            ...new Set(
              bookings.map((b: any) => b.freelancerId).filter((id: any) => id)
            ),
          ];

          // Fetch all freelancers
          const freelancersData: Freelancer[] = [];
          for (const freelancerId of freelancerIds) {
            try {
              const res = await freelancerService.getFreelancerById(
                freelancerId
              );
              if (res.success && res.data) {
                const f = res.data as FreelancerData;
                freelancersData.push({
                  id: f.id,
                  name: f.name,
                  avatar: f.avatarUrl || "",
                  online: true,
                });
              }
            } catch (err) {
              console.error(`Failed to fetch freelancer ${freelancerId}:`, err);
            }
          }

          setFreelancersList(freelancersData);

          // Set latest freelancer
          if (freelancersData.length > 0) {
            const latest = [...bookings].sort(
              (a: any, b: any) =>
                new Date(b.bookingDate).getTime() -
                new Date(a.bookingDate).getTime()
            )[0];
            const latestFreelancerId = (latest as any)?.freelancerId;
            const latestFreelancerData = freelancersData.find(
              (f) => f.id === latestFreelancerId
            );
            if (latestFreelancerData) {
              setLatestFreelancer(latestFreelancerData);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [user?.id, user?.name, user?.phoneNumber, user?.address]);

  // Fetch bookings history when Activity tab is active
  useEffect(() => {
    const loadBookingsHistory = async () => {
      if (activeTab !== "activity") return;

      setLoadingBookings(true);
      try {
        const data = await bookingService.getMyBookingHistory();
        setBookingsHistory(data || []);
      } catch (error) {
        console.error("Error loading bookings history:", error);
        setBookingsHistory([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    loadBookingsHistory();
  }, [activeTab]);

  // Reset pagination when filter changes
  useEffect(() => {
    setBookingsPage(1);
  }, [activityFilter]);

  const handleFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      // Call API to update customer profile
      const response = await profileService.updateCustomerProfile({
        name: editForm.name,
        phoneNumber: editForm.phoneNumber,
        address: editForm.address,
        avatarUrl: editForm.avatarUrl,
      });

      if (response.success) {
        showSuccess("Đã cập nhật hồ sơ thành công!");
        setShowEditModal(false);
        // Refresh user data
        await refreshUser();
      } else {
        showError(response.message || "Cập nhật hồ sơ thất bại");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      showError(error.message || "Đã xảy ra lỗi khi cập nhật hồ sơ");
    }
  };

  const handleUpgrade = (plan: "monthly" | "yearly") => {
    console.log("Upgrading to:", plan);
    showSuccess(
      `Đã nâng cấp gói ${plan === "monthly" ? "tháng" : "năm"} thành công!`
    );
    setShowUpgradeModal(false);
  };

  const handleAddPet = async (petData: PetFormData) => {
    if (!user?.id) {
      showError("Không tìm thấy thông tin người dùng");
      return;
    }

    try {
      // Map form data to API format - only 3 fields needed
      const createPetData = {
        petName: petData.petName,
        species: petData.species,
        breed: petData.breed,
      };

      // Use addPet endpoint: POST /api/v1/pet/add/{id}
      const response = await petService.addPet(user.id, createPetData);

      if (response.success) {
        showSuccess("Thêm thú cưng thành công!");
        setShowAddPetModal(false);
        // Refresh user data to get updated pets list
        await refreshUser();
      } else {
        showError(response.error || "Thêm thú cưng thất bại");
      }
    } catch (error) {
      console.error("Error adding pet:", error);
      showError("Đã xảy ra lỗi khi thêm thú cưng");
    }
  };

  const handleEditPet = (pet: {
    petId: string;
    petName: string;
    species: string;
    breed: string;
  }) => {
    setSelectedPet(pet);
    setShowEditPetModal(true);
  };

  const handleUpdatePet = async (petId: string, petData: PetFormData) => {
    try {
      console.log("🔵 Updating pet:", petId, petData);

      // Use editPet endpoint: PUT /api/v1/pet/edit/{petId}
      const editData = {
        petName: petData.petName,
        species: petData.species,
        breed: petData.breed,
      };

      const response = await petService.editPet(petId, editData);

      if (response.success) {
        showSuccess("Cập nhật thú cưng thành công!");
        setShowEditPetModal(false);
        setSelectedPet(null);
        // Refresh user data to get updated pets list
        await refreshUser();
      } else {
        showError(response.error || "Cập nhật thú cưng thất bại");
      }
    } catch (error: any) {
      console.error("Error updating pet:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi khi cập nhật thú cưng";
      showError(errorMessage);
    }
  };

  const handleDeletePet = (petId: string) => {
    const pet = user?.pets?.find((p) => p.petId === petId);
    if (pet) {
      setPetToDelete({ petId: pet.petId, petName: pet.petName });
      setShowDeletePetConfirm(true);
    }
  };

  const confirmDeletePet = async () => {
    if (!user?.id || !petToDelete) {
      showError("Không tìm thấy thông tin user");
      return;
    }

    try {
      // Use deletePet endpoint: DELETE /api/v1/pet/delete/{userId}
      const response = await petService.deletePet(user.id, petToDelete.petId);

      if (response.success) {
        showSuccess("Xóa thú cưng thành công!");
        setShowDeletePetConfirm(false);
        setPetToDelete(null);
        setShowEditPetModal(false);
        setSelectedPet(null);
        // Refresh user data to get updated pets list
        await refreshUser();
      } else {
        showError(response.error || "Xóa thú cưng thất bại");
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
      showError("Đã xảy ra lỗi khi xóa thú cưng");
    }
  };

  const handleSelectFreelancer = async (freelancerId: string) => {
    // Find in existing list first
    const existingFreelancer = freelancersList.find(
      (f) => f.id === freelancerId
    );
    if (existingFreelancer) {
      setSelectedFreelancer(existingFreelancer);
      return;
    }

    // Fetch from API if not in list
    try {
      const res = await freelancerService.getFreelancerById(freelancerId);
      if (res.success && res.data) {
        const f = res.data as FreelancerData;
        const freelancer: Freelancer = {
          id: f.id,
          name: f.name,
          avatar: f.avatarUrl || "",
          online: true,
        };
        setSelectedFreelancer(freelancer);
      }
    } catch (error) {
      console.error("Failed to fetch freelancer:", error);
      showError("Đã xảy ra lỗi khi tải thông tin freelancer");
    }
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
                      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400"
                    }
                    alt={user?.name || "User"}
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400";
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
                      {user?.name || "Người dùng"}
                    </h1>
                    <p className="text-teal-100 text-sm mb-3">
                      {user?.email || "user@example.com"}
                    </p>
                    <div className="flex items-center gap-6 text-sm mt-3">
                      <div className="flex items-center gap-2">
                        <FaDog className="text-orange-300" />
                        <span>{user?.pets?.length || 0} thú cưng</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarCheck className="text-green-300" />
                        <span>{user?.bookings?.length || 0} lượt đặt</span>
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
                      onClick={() => setActiveTab("pets")}
                      className={`px-6 py-4 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeTab === "pets"
                          ? "text-teal-600 border-b-3 border-teal-600 bg-gradient-to-r from-teal-50 to-emerald-50"
                          : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaPaw className="text-lg" />
                      <span>Thú cưng</span>
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
                      onClick={() => setActiveTab("freelancers")}
                      className={`px-6 py-4 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeTab === "freelancers"
                          ? "text-teal-600 border-b-3 border-teal-600 bg-gradient-to-r from-teal-50 to-emerald-50"
                          : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaBriefcase className="text-lg" />
                      <span>Freelancer</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("upgrade")}
                      className={`px-6 py-4 font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeTab === "upgrade"
                          ? "text-purple-600 border-b-3 border-purple-600 bg-gradient-to-r from-purple-50 to-pink-50"
                          : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaStar className="text-lg" />
                      <span>Nâng cấp</span>
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
                        <FaEdit /> Chỉnh sửa
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
                            {user?.name || (
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
                            {user?.phoneNumber || (
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
                            {user?.address || (
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

                {activeTab === "pets" && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <FaPaw className="mr-3 text-2xl text-teal-600" />
                        Thú cưng của tôi
                      </h3>
                      <button
                        onClick={() => setShowAddPetModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all shadow-md flex items-center gap-2 font-medium"
                      >
                        <FaPaw /> Thêm thú cưng
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {user?.pets && user.pets.length > 0 ? (
                        user.pets.map((pet) => (
                          <div
                            key={pet.petId}
                            className="bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200 rounded-xl p-4 hover:shadow-lg transition-all relative group"
                          >
                            {/* Action Buttons */}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button
                                onClick={() => handleEditPet(pet)}
                                className="w-8 h-8 bg-white hover:bg-teal-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center shadow-md transition-all"
                                title="Chỉnh sửa thú cưng"
                              >
                                <FaEdit className="text-sm" />
                              </button>
                              <button
                                onClick={() => handleDeletePet(pet.petId)}
                                className="w-8 h-8 bg-white hover:bg-red-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center shadow-md transition-all"
                                title="Xóa thú cưng"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <div
                                className={`w-16 h-16 bg-gradient-to-br ${
                                  pet.species.toLowerCase() === "cat"
                                    ? "from-purple-400 to-pink-400"
                                    : "from-orange-400 to-amber-400"
                                } rounded-full flex items-center justify-center text-3xl shadow-lg`}
                              >
                                {pet.species.toLowerCase() === "cat" ? (
                                  <FaCat className="text-white" />
                                ) : (
                                  <FaDog className="text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-lg">
                                  {pet.petName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {pet.species} - {pet.breed}
                                </p>
                                <span className="inline-flex items-center gap-1 mt-1 text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium">
                                  <FaCheckCircle /> Khỏe mạnh
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-12 text-gray-500">
                          <FaPaw className="text-6xl mb-4 mx-auto text-gray-400" />
                          <p className="text-lg font-medium">
                            Chưa có thú cưng nào
                          </p>
                          <button
                            onClick={() => setShowAddPetModal(true)}
                            className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full hover:from-orange-600 hover:to-pink-600 transition-all shadow-md"
                          >
                            + Thêm thú cưng
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "activity" && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <FaChartLine className="mr-3 text-2xl text-teal-600" />
                      Hoạt động gần đây
                    </h3>
                    <div className="flex gap-2 mb-4">
                      {[
                        { id: "all", label: "Tất cả" },
                        { id: "upcoming", label: "Sắp tới" },
                        { id: "completed", label: "Hoàn thành" },
                        { id: "cancelled", label: "Đã hủy" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActivityFilter(t.id as any)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border ${
                            activityFilter === t.id
                              ? "bg-teal-600 text-white border-teal-600"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {loadingBookings ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">
                          Đang tải dữ liệu...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookingsHistory && bookingsHistory.length > 0 ? (
                          (() => {
                            const filteredBookings = [...bookingsHistory]
                              .sort((a: any, b: any) => {
                                const da = new Date(a.bookingDate).getTime();
                                const db = new Date(b.bookingDate).getTime();
                                return db - da;
                              })
                              .filter((b) => {
                                if (activityFilter === "all") return true;
                                const status = statusToString(b.status);
                                if (activityFilter === "completed")
                                  return status === "Completed";
                                if (activityFilter === "cancelled")
                                  return status === "Cancelled";
                                if (activityFilter === "upcoming")
                                  return (
                                    status === "Confirmed" ||
                                    status === "Pending"
                                  );
                                return true;
                              });
                            const paginatedBookings = filteredBookings.slice(
                              (bookingsPage - 1) * bookingsPerPage,
                              bookingsPage * bookingsPerPage
                            );
                            return paginatedBookings.map((booking: any) => (
                              <div
                                key={booking.bookingId}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                                  <FaCalendarAlt className="text-white text-xl" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">
                                    {Array.isArray(booking.services) &&
                                    booking.services.length > 0
                                      ? `Dịch vụ (${booking.services.length})`
                                      : "Đặt dịch vụ"}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <p className="text-sm text-gray-500">
                                      {new Date(
                                        booking.bookingDate
                                      ).toLocaleDateString("vi-VN")}{" "}
                                      •{" "}
                                      {getPickUpTimeLabel(
                                        `Slot${(booking.pickUpTime ?? 0) + 1}`
                                      )}
                                    </p>
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full font-medium ${getBookingStatusColor(
                                        statusToString(booking.status)
                                      )}`}
                                    >
                                      {getBookingStatusLabel(
                                        statusToString(booking.status)
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                  {String(booking.isPaid) === "false" &&
                                  statusToString(booking.status) !==
                                    "Cancelled" ? (
                                    <button
                                      onClick={async () => {
                                        try {
                                          const savedUrlKey = `payment_url_${booking.bookingId}`;
                                          const savedUrl =
                                            localStorage.getItem(savedUrlKey);
                                          if (savedUrl) {
                                            let invalid = false;
                                            try {
                                              const u = new URL(savedUrl);
                                              const tmn =
                                                u.searchParams.get(
                                                  "vnp_TmnCode"
                                                );
                                              const ret =
                                                u.searchParams.get(
                                                  "vnp_ReturnUrl"
                                                );
                                              if (
                                                !tmn ||
                                                tmn.toUpperCase() ===
                                                  "YOUR_TMN_CODE"
                                              )
                                                invalid = true;
                                              if (
                                                !ret ||
                                                ret.toLowerCase() === "string"
                                              )
                                                invalid = true;
                                            } catch {
                                              invalid = true;
                                            }
                                            if (invalid) {
                                              showError(
                                                "Liên kết VNPAY cũ không hợp lệ. Đang tạo liên kết mới..."
                                              );
                                            } else {
                                              window.location.href = savedUrl;
                                              return;
                                            }
                                          }

                                          const returnUrl = `${apiClient.getBaseURL()}${
                                            API_ENDPOINTS.PAYMENT.PAYOS_CALLBACK
                                          }`;
                                          const res =
                                            await paymentService.createPayment({
                                              bookingId: booking.bookingId,
                                              method: PaymentMethodCode.PAYOS,
                                              returnUrl,
                                              description: `Thanh toán đặt lịch ${new Date(
                                                booking.bookingDate
                                              ).toLocaleDateString("vi-VN")}`,
                                            });
                                          const redirectUrl =
                                            paymentService.extractRedirectUrl(
                                              res
                                            );
                                          if (!redirectUrl) {
                                            showError(
                                              "Không nhận được liên kết thanh toán"
                                            );
                                            return;
                                          }
                                          let invalid = false;
                                          try {
                                            const u = new URL(redirectUrl);
                                            const tmn =
                                              u.searchParams.get("vnp_TmnCode");
                                            const ret =
                                              u.searchParams.get(
                                                "vnp_ReturnUrl"
                                              );
                                            if (
                                              !tmn ||
                                              tmn.toUpperCase() ===
                                                "YOUR_TMN_CODE"
                                            )
                                              invalid = true;
                                            if (
                                              !ret ||
                                              ret.toLowerCase() === "string"
                                            )
                                              invalid = true;
                                          } catch {
                                            invalid = true;
                                          }
                                          if (invalid) {
                                            showError(
                                              "Cấu hình VNPAY chưa hợp lệ. Vui lòng kiểm tra TmnCode và ReturnUrl trên backend."
                                            );
                                            return;
                                          }
                                          localStorage.setItem(
                                            "last_payment_booking_id",
                                            booking.bookingId
                                          );
                                          if (res.paymentId) {
                                            localStorage.setItem(
                                              "last_payment_id",
                                              res.paymentId
                                            );
                                          }
                                          localStorage.setItem(
                                            savedUrlKey,
                                            redirectUrl
                                          );
                                          window.location.href = redirectUrl;
                                        } catch (e: any) {
                                          showError(
                                            e?.message ||
                                              "Tạo thanh toán thất bại"
                                          );
                                        }
                                      }}
                                      className="inline-flex flex-col items-center px-2 py-2 text-sm rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-all"
                                    >
                                      <span className="text-xs font-small">
                                        {Number(
                                          booking.totalPrice || 0
                                        ).toLocaleString("vi-VN")}{" "}
                                        ₫
                                      </span>
                                      <span className="font-semibold">
                                        Thanh toán
                                      </span>
                                    </button>
                                  ) : (
                                    <p className="font-bold text-teal-600">
                                      {Number(
                                        booking.totalPrice || 0
                                      ).toLocaleString("vi-VN")}{" "}
                                      ₫
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={async () => {
                                    try {
                                      // Fetch full booking details with payment, services, and pets info
                                      const detailsData =
                                        await bookingService.getBookingDetails(
                                          booking.bookingId
                                        );
                                      setSelectedBooking(
                                        detailsData || booking
                                      );
                                      setShowBookingDetail(true);
                                    } catch (error) {
                                      console.error(
                                        "Error loading booking details:",
                                        error
                                      );
                                      // Fallback to basic booking data
                                      setSelectedBooking(booking);
                                      setShowBookingDetail(true);
                                    }
                                  }}
                                  className="ml-auto px-4 py-2 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                                >
                                  Xem chi tiết
                                </button>
                              </div>
                            ));
                          })()
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <FaCalendarAlt className="text-6xl mb-4 mx-auto text-gray-400" />
                            <p className="text-lg font-medium">
                              Chưa có hoạt động nào
                            </p>
                            <p className="text-sm mt-2">
                              Đặt dịch vụ đầu tiên của bạn ngay hôm nay!
                            </p>
                          </div>
                        )}

                        {/* Pagination */}
                        {(() => {
                          const filteredCount = [...bookingsHistory].filter(
                            (b) => {
                              if (activityFilter === "all") return true;
                              const status = statusToString(b.status);
                              if (activityFilter === "completed")
                                return status === "Completed";
                              if (activityFilter === "cancelled")
                                return status === "Cancelled";
                              if (activityFilter === "upcoming")
                                return (
                                  status === "Confirmed" || status === "Pending"
                                );
                              return true;
                            }
                          ).length;
                          const totalPages = Math.ceil(
                            filteredCount / bookingsPerPage
                          );
                          return (
                            filteredCount > bookingsPerPage && (
                              <div className="flex items-center justify-center gap-2 mt-6 pb-4">
                                <button
                                  onClick={() =>
                                    setBookingsPage((p) => Math.max(1, p - 1))
                                  }
                                  disabled={bookingsPage === 1}
                                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Trước
                                </button>
                                <span className="px-4 py-2 text-sm text-gray-600">
                                  Trang {bookingsPage} / {totalPages}
                                </span>
                                <button
                                  onClick={() =>
                                    setBookingsPage((p) =>
                                      Math.min(totalPages, p + 1)
                                    )
                                  }
                                  disabled={bookingsPage >= totalPages}
                                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Sau
                                </button>
                              </div>
                            )
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "freelancers" && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <FaBriefcase className="mr-3 text-2xl text-teal-600" />
                      Freelancer đã liên hệ
                    </h3>
                    {latestFreelancer && (
                      <div
                        className="flex items-center gap-4 p-4 mb-4 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setSelectedFreelancer(latestFreelancer)}
                      >
                        <img
                          src={
                            latestFreelancer.avatar ||
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100"
                          }
                          alt={latestFreelancer.name}
                          className="w-12 h-12 rounded-full object-cover"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/freelancers/${latestFreelancer.id}`);
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {latestFreelancer.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Freelancer từ booking gần nhất
                          </p>
                        </div>
                        <button className="px-3 py-1.5 text-sm rounded-full bg-teal-600 text-white">
                          Chat
                        </button>
                      </div>
                    )}
                    <FreelancerContactsCard
                      freelancers={freelancersList.map((f) => ({
                        id: f.id,
                        name: f.name,
                        title: "Chuyên gia chăm sóc thú cưng",
                        avatar: f.avatar,
                        online: f.online,
                      }))}
                      onSelectFreelancer={handleSelectFreelancer}
                    />
                  </div>
                )}

                {activeTab === "upgrade" && (
                  <div className="space-y-6">
                    <UpgradePlanCard
                      onUpgrade={() => setShowUpgradeModal(true)}
                    />
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg border-2 border-purple-200 p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaAward className="mr-3 text-2xl text-purple-600" />
                        Đặc quyền VIP
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { Icon: FaGift, text: "Quà tặng hàng tháng" },
                          { Icon: FaCalendarAlt, text: "Ưu tiên đặt lịch" },
                          { Icon: FaStar, text: "Giảm 20% tất cả dịch vụ" },
                          {
                            Icon: FaBullseye,
                            text: "Freelancer chất lượng cao",
                          },
                          { Icon: FaHeadset, text: "Hỗ trợ 24/7" },
                          { Icon: FaAward, text: "Huy hiệu VIP độc quyền" },
                        ].map((benefit, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 hover:shadow-md transition-all"
                          >
                            <benefit.Icon className="text-2xl text-purple-600" />
                            <span className="font-medium text-gray-700">
                              {benefit.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT Column - Chat & Freelancers (3/12) */}
              <div className="lg:col-span-3">
                <div className="space-y-6">
                  {/* Chat Box */}
                  <ChatBox
                    isOpen={!!selectedFreelancer}
                    selectedFreelancer={selectedFreelancer}
                    onClose={() => setSelectedFreelancer(null)}
                  />

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                      <FaBolt className="mr-2" />
                      Thống kê nhanh
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-teal-100">Tổng đặt lịch:</span>
                        <span className="font-bold text-2xl">
                          {user?.bookings?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-teal-100">Hoàn thành:</span>
                        <span className="font-bold text-2xl">
                          {completedBookings}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-teal-100">Số thú cưng:</span>
                        <span className="font-bold text-2xl">
                          {user?.pets?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-teal-400 pt-3">
                        <span className="text-teal-100">Tổng chi tiêu:</span>
                        <span className="font-bold text-xl">
                          {totalSpent.toLocaleString("vi-VN")} ₫
                        </span>
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

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onConfirm={handleUpgrade}
        />

        {/* Add Pet Modal */}
        <AddPetModal
          isOpen={showAddPetModal}
          onClose={() => setShowAddPetModal(false)}
          onSave={handleAddPet}
        />

        {/* Edit Pet Modal */}
        <EditPetModal
          isOpen={showEditPetModal}
          onClose={() => {
            setShowEditPetModal(false);
            setSelectedPet(null);
          }}
          onSave={handleUpdatePet}
          petData={selectedPet}
        />

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <BookingDetailModal
            isOpen={showBookingDetail}
            onClose={() => {
              setShowBookingDetail(false);
              setSelectedBooking(null);
            }}
            booking={selectedBooking}
            userRole="customer"
            onStatusUpdate={async () => {
              await refreshUser();
            }}
          />
        )}

        {/* Delete Pet Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeletePetConfirm}
          title="Xác nhận xóa thú cưng"
          message={`Bạn có chắc chắn muốn xóa "${petToDelete?.petName}"? Hành động này không thể hoàn tác.`}
          confirmText="Xóa"
          cancelText="Hủy"
          type="danger"
          onConfirm={confirmDeletePet}
          onCancel={() => {
            setShowDeletePetConfirm(false);
            setPetToDelete(null);
          }}
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
