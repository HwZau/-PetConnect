import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookingHeader,
  ServiceSelection,
  DateTimeSelection,
  CustomerInformation,
  SpecialRequests,
} from "../../components/booking";
import Header from "../../components/profile/Header";
import { useAuth } from "../../hooks";
import {
  validateEmail,
  validatePhoneVN,
  showError,
  showSuccess,
  getPickUpTimeLabel,
} from "../../utils";
import { bookingService } from "../../services";
import type { Freelancer, DateTimeData, CustomerInfoData } from "../../types";

const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const freelancerData = location.state?.freelancer as Freelancer;

  // Debug freelancer data
  console.log('BookingPage Debug:', {
    freelancerData,
    hasServices: !!freelancerData?.services,
    servicesCount: freelancerData?.services?.length,
    services: freelancerData?.services?.map(s => ({ id: s.id, name: s.name }))
  });

  // State for selected pets (can select multiple pets)
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]); // Changed to array for multiple services
  const [dateTimeData, setDateTimeData] = useState<DateTimeData>({
    selectedDate: "",
    selectedTime: "",
    recurringService: false,
    frequency: "",
    // Backward compatibility
    date: "",
    time: "",
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfoData>({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: user?.address || "",
    emergencyContact: user?.phoneNumber || "",
  });
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: { message: "Vui lòng đăng nhập để đặt dịch vụ" },
      });
      return;
    }

    // Redirect if no freelancer data
    if (!freelancerData) {
      navigate("/freelancers", {
        replace: true,
        state: { message: "Vui lòng chọn freelancer trước khi đặt dịch vụ" },
      });
      return;
    }

    // Check if user has pets
    if (!user?.pets || user.pets.length === 0) {
      showError("Bạn cần thêm thú cưng trước khi đặt dịch vụ");
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated, freelancerData, user, navigate]);

  // Update customer info when user data changes
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        address: user.address || "",
        emergencyContact: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleServiceChange = (serviceId: string) => {
    // Toggle service selection (allow multiple)
    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        // Unselect service
        return prev.filter((id) => id !== serviceId);
      } else {
        // Select service
        return [...prev, serviceId];
      }
    });
    setErrors((prev) => ({ ...prev, selectedService: "" }));
  };

  // Handle pet selection (toggle)
  const handlePetSelection = (petId: string) => {
    setSelectedPetIds((prev) => {
      if (prev.includes(petId)) {
        // Unselect pet
        return prev.filter((id) => id !== petId);
      } else {
        // Select pet
        return [...prev, petId];
      }
    });
    setErrors((prev) => ({ ...prev, selectedPets: "" }));
  };

  const handleDateTimeChange = (field: string, value: string | boolean) => {
    setDateTimeData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleCustomerInfoChange = (field: string, value: string) => {
    // Real-time validation for phone and email
    if (field === "phone") {
      // Allow only digits, spaces, parentheses, and hyphens
      // eslint-disable-next-line no-useless-escape
      const cleanValue = value.replace(/[^\d\s\-\(\)]/g, "");
      setCustomerInfo((prev) => ({ ...prev, [field]: cleanValue }));

      // Validate phone number format
      if (cleanValue && !validatePhoneVN(cleanValue)) {
        setErrors((prev) => ({
          ...prev,
          [field]: "Số điện thoại không đúng định dạng (VD: 0901234567)",
        }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    } else if (field === "email") {
      setCustomerInfo((prev) => ({ ...prev, [field]: value }));

      // Validate email format
      if (value && !validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          [field]: "Email không đúng định dạng",
        }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    } else {
      setCustomerInfo((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSpecialRequestsChange = (value: string) => {
    setSpecialRequests(value);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedServiceIds.length === 0) {
      newErrors.selectedService = "Vui lòng chọn ít nhất một dịch vụ";
    }

    // Check if at least one pet is selected
    if (selectedPetIds.length === 0) {
      newErrors.selectedPets = "Vui lòng chọn ít nhất một thú cưng";
    }

    if (!dateTimeData.date) {
      newErrors.date = "Vui lòng chọn ngày";
    }
    if (!dateTimeData.time) {
      newErrors.time = "Vui lòng chọn giờ";
    }
    if (!customerInfo.fullName) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    // Validate email using utils
    if (!customerInfo.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!validateEmail(customerInfo.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    // Validate phone number using utils
    if (!customerInfo.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!validatePhoneVN(customerInfo.phone)) {
      newErrors.phone = "Số điện thoại không đúng định dạng (VD: 0901234567)";
    }

    if (!customerInfo.address) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("🔵 handleSubmit called!");
    console.log("📝 Current state:", {
      selectedServiceIds,
      selectedPetIds,
      dateTimeData,
      isSubmitting,
    });

    if (!validateForm()) {
      console.log("❌ Validation failed!");
      console.log("⚠️ Errors:", errors);
      // Show validation errors using toast
      const firstError = Object.values(errors)[0];
      showError(firstError || "Vui lòng kiểm tra lại thông tin đã nhập");
      return;
    }

    console.log("✅ Validation passed!");

    // Prevent double submission
    if (isSubmitting) {
      console.log("⏸️ Already submitting, skipping...");
      return;
    }

    try {
      setIsSubmitting(true);

      // Validate required fields before API call
      if (!dateTimeData.time || !dateTimeData.date) {
        showError("Vui lòng chọn đầy đủ ngày và giờ");
        return;
      }

      if (selectedServiceIds.length === 0) {
        showError("Vui lòng chọn ít nhất một dịch vụ");
        return;
      }

      if (selectedPetIds.length === 0) {
        showError("Vui lòng chọn ít nhất một thú cưng");
        return;
      }

      console.log("=== BOOKING DEBUG START ===");
      console.log("1. selectedServiceIds:", selectedServiceIds);
      console.log("2. selectedServiceIds type:", typeof selectedServiceIds);
      console.log("3. selectedServiceIds length:", selectedServiceIds.length);
      console.log("4. dateTimeData.time:", dateTimeData.time);
      console.log("5. dateTimeData.date:", dateTimeData.date);
      console.log("6. freelancerData.id:", freelancerData.id);
      console.log("7. selectedPetIds:", selectedPetIds);

      // Check for duplicate booking before creating
      console.log("🔍 Checking for duplicate booking...");
      const hasDuplicate = await bookingService.checkDuplicateBooking(
        selectedServiceIds,
        dateTimeData.date,
        freelancerData.id
      );

      if (hasDuplicate) {
        showError(
          "Bạn đã có lịch hẹn cho một hoặc nhiều dịch vụ này vào ngày đã chọn. Vui lòng chọn ngày khác hoặc dịch vụ khác."
        );
        return;
      }

      // Prepare booking data for API
      const bookingPayload = {
        pickUpTime: dateTimeData.time, // Slot1, Slot2, etc.
        bookingDate: dateTimeData.date, // YYYY-MM-DD
        serviceIds: selectedServiceIds, // Array of service IDs (multiple allowed)
        freelancerId: freelancerData.id,
        petIds: selectedPetIds, // Array of pet IDs
        customerInfo: {
          name: customerInfo.fullName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: {
            street: customerInfo.address,
          },
          emergencyContact: {
            name: customerInfo.emergencyContact,
            phone: customerInfo.emergencyContact,
          }
        },
        specialRequests: specialRequests,
      };

      console.log(
        "8. Final bookingPayload:",
        JSON.stringify(bookingPayload, null, 2)
      );
      console.log("=== BOOKING DEBUG END ===");

      // Call API to create booking
      const bookingResponse = await bookingService.createBooking(
        bookingPayload
      );

      console.log("Booking created successfully:", bookingResponse);

      // Show success message
      showSuccess("Đặt dịch vụ thành công! Chuyển đến trang thanh toán...");

      // Get selected pets data for payment page
      const selectedPets = user?.pets
        ?.map((pet: typeof user.pets[0]: typeof user.pets[0]) => ({
          ...pet,
          _petKey: pet.petId,
        }))
        .filter((pet) => pet._petKey && selectedPetIds.includes(pet._petKey));

      console.log("🔵 Preparing payment data...");
      console.log("🔵 selectedServiceIds:", selectedServiceIds);
      console.log("🔵 selectedPets:", selectedPets);
      console.log("🔵 freelancerData:", freelancerData);

      // Navigate to payment page with booking data
      setTimeout(() => {
        navigate("/payment", {
          state: {
            bookingId: bookingResponse.bookingId,
            totalPrice: bookingResponse.totalPrice || 0,
            bookingData: {
              freelancer: {
                id: freelancerData.id,
                name: freelancerData.name,
                rating: freelancerData.rating || 5.0,
                avatar: freelancerData.avatar || "",
                location: freelancerData.location || "",
              },
              serviceIds: selectedServiceIds, // Array of service IDs
              petInfo:
                selectedPets?.map((pet) => ({
                  petType: pet.species || "Unknown",
                  petName: pet.petName || "Pet",
                  petSize: "medium", // Default size since not in UserPet
                  duration: "1 hour",
                })) || [],
              dateTime: {
                date: dateTimeData.date || "",
                time: dateTimeData.time || "",
                recurringService: dateTimeData.recurringService || false,
                frequency: dateTimeData.frequency || "",
              },
              customer: {
                fullName: customerInfo.fullName || "",
                email: customerInfo.email || "",
                phone: customerInfo.phone || "",
                address: customerInfo.address || "",
              },
              specialRequests: specialRequests || "",
            },
          },
        });
      }, 1000);
    } catch (error: any) {
      console.error("Error creating booking:", error);

      // Show error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi tạo booking. Vui lòng thử lại!";

      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!freelancerData || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BookingHeader selectedFreelancer={freelancerData} />

          {/* User Info Banner */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Xin chào, {user.name}!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Thông tin của bạn đã được tự động điền sẵn
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {user.pets?.length || 0} thú cưng
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-8">
              <ServiceSelection
                selectedServiceIds={selectedServiceIds} // Changed to array
                onServiceChange={handleServiceChange}
                error={errors.selectedService}
                freelancer={freelancerData}
              />

              {/* Pet Selection */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  2. Chọn Thú Cưng
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Bạn có thể chọn nhiều thú cưng cho một dịch vụ
                </p>

                {user.pets && user.pets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.pets.map((pet) => {
                      const petKey = pet.petId || pet._id || pet.id;
                      const isSelected = petKey ? selectedPetIds.includes(petKey) : false;
                      return (
                        <div
                          key={petKey || "pet-unknown"}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            isSelected
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                          onClick={() => petKey && handlePetSelection(petKey)}
                        >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                              {pet.petName?.charAt(0) || "P"}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {pet.petName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {pet.species} • {pet.breed}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <svg
                              className="w-6 h-6 text-purple-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      Bạn chưa có thú cưng nào
                    </p>
                    <button
                      onClick={() => navigate("/profile")}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Thêm thú cưng
                    </button>
                  </div>
                )}

                {errors.selectedPets && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.selectedPets}
                  </p>
                )}
              </div>

              <DateTimeSelection
                dateTimeData={dateTimeData}
                onDateTimeChange={handleDateTimeChange}
                errors={errors}
              />

              <CustomerInformation
                customerInfo={customerInfo}
                onCustomerInfoChange={handleCustomerInfoChange}
                errors={errors}
              />

              <SpecialRequests
                specialRequests={specialRequests}
                onSpecialRequestsChange={handleSpecialRequestsChange}
              />
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Tóm tắt đặt dịch vụ
                </h3>

                {/* Selected Services */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Dịch vụ ({selectedServiceIds.length})
                  </h4>
                  {selectedServiceIds.length > 0 ? (
                    <div className="space-y-2">
                      {selectedServiceIds.map((serviceId) => {
                        const service = freelancerData.services?.find(
                          (s) => s.id === serviceId
                        );
                        return (
                          <div
                            key={serviceId}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-800">
                              {service?.name || serviceId}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Chưa chọn</p>
                  )}
                </div>

                {/* Selected Pets */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Thú cưng ({selectedPetIds.length})
                  </h4>
                  {selectedPetIds.length > 0 ? (
                    <div className="space-y-2">
                      {user.pets
                        ?.filter((pet) => {
                          const petKey = pet.petId || pet._id || pet.id;
                          return petKey && selectedPetIds.includes(petKey);
                        })
                        .map((pet) => {
                          const petKey = pet.petId || pet._id || pet.id;
                          return (
                            <div
                              key={petKey || "pet-summary-unknown"}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-gray-800">{pet.petName}</span>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Chưa chọn</p>
                  )}
                </div>

                {/* Date & Time */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Ngày & Giờ
                  </h4>
                  <p className="text-gray-800">
                    {dateTimeData.date || "Chưa chọn"}
                  </p>
                  {dateTimeData.time && (
                    <p className="text-sm text-gray-600 mt-1">
                      {getPickUpTimeLabel(dateTimeData.time)}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang xử lý..." : "Tiếp tục thanh toán"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
