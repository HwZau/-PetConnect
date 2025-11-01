import React, { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookingHeader,
  ServiceSelection,
  PetInformation,
  DateTimeSelection,
  CustomerInformation,
  SpecialRequests,
  BookingSummary,
} from "../../components/booking";
import Header from "../../components/profile/Header";
// UserContext intentionally not imported here (not used in this page)
import {
  validateEmail,
  validatePhoneVN,
  showError,
  showSuccess,
} from "../../utils";
import type {
  Freelancer,
  PetInfoData,
  DateTimeData,
  CustomerInfoData,
  UserPet,
} from "../../types";

const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // user context is available via UserContext but not used in this page; keep hook if we need it later
  // const { user } = useContext(UserContext);
  const freelancerData = location.state?.freelancer as Freelancer;

  // Mock user data - always use for demo
  const mockUser = {
    id: "1",
    fullName: "Lý Hồng Thư",
    email: "lyhongthu@example.com",
    phone: "0901234567",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    pets: [
      {
        id: "1",
        name: "Buddy",
        type: "dog",
        age: "2",
        gender: "Đực",
        breed: "Golden Retriever",
      },
      {
        id: "2",
        name: "Luna",
        type: "cat",
        age: "1",
        gender: "Cái",
        breed: "Persian",
      },
    ] as UserPet[],
  };

  const [selectedService, setSelectedService] = useState<string>("");
  const [petInfo, setPetInfo] = useState<PetInfoData[]>([
    {
      petType: mockUser.pets.length > 0 ? mockUser.pets[0].type : "",
      petSize: "",
      duration: "",
      petName: mockUser.pets.length > 0 ? mockUser.pets[0].name : "",
      petAge: mockUser.pets.length > 0 ? mockUser.pets[0].age || "" : "",
      petWeight: "",
    },
  ]);
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
    fullName: mockUser.fullName,
    email: mockUser.email,
    phone: mockUser.phone,
    address: mockUser.address,
    emergencyContact: mockUser.phone,
  });
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userPets] = useState<UserPet[]>(mockUser.pets);

  useEffect(() => {
    // Redirect if no freelancer data
    if (!freelancerData) {
      navigate("/freelancers", {
        replace: true,
        state: { message: "Vui lòng chọn freelancer trước khi đặt dịch vụ" },
      });
    }
  }, [freelancerData, navigate]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    setErrors((prev) => ({ ...prev, selectedService: "" }));
  };

  const handleAddPet = () => {
    setPetInfo((prev) => [
      ...prev,
      {
        petType: "",
        petSize: "",
        duration: "",
        petName: "",
        petAge: "",
        petWeight: "",
      },
    ]);
  };

  const handleRemovePet = (petIndex: number) => {
    setPetInfo((prev) => prev.filter((_, index) => index !== petIndex));
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

  // Validate pet weight
  const validatePetWeight = (weight: string): string | null => {
    if (!weight) return null; // Optional field

    // eslint-disable-next-line no-useless-escape
    const cleanWeight = weight.replace(/[^\d\.]/g, "");
    const weightNum = parseFloat(cleanWeight);

    if (isNaN(weightNum)) {
      return "Cân nặng phải là số";
    }

    if (weightNum <= 0) {
      return "Cân nặng phải lớn hơn 0";
    }

    if (weightNum > 200) {
      return "Cân nặng không hợp lệ (tối đa 200kg)";
    }

    return null;
  };

  // Validate pet age - simplified to numbers only
  const validatePetAge = (age: string): string | null => {
    if (!age) return null; // Optional field

    const ageNum = parseFloat(age);

    if (isNaN(ageNum)) {
      return "Tuổi phải là số";
    }

    if (ageNum <= 0) {
      return "Tuổi phải lớn hơn 0";
    }

    if (ageNum > 30) {
      return "Tuổi thú cưng không được quá 30 tuổi";
    }

    return null;
  };

  const handlePetInfoChange = (
    petIndex: number,
    field: string,
    value: string
  ) => {
    // For weight field, validate and format input
    if (field === "petWeight") {
      // Allow only numbers and decimal point
      // eslint-disable-next-line no-useless-escape
      const cleanValue = value.replace(/[^\d\.]/g, "");
      setPetInfo((prev) =>
        prev.map((pet, index) =>
          index === petIndex ? { ...pet, [field]: cleanValue } : pet
        )
      );

      // Validate weight in real-time
      if (cleanValue) {
        const weightError = validatePetWeight(cleanValue);
        setErrors((prev) => ({
          ...prev,
          [`${field}_${petIndex}`]: weightError || "",
        }));
      } else {
        setErrors((prev) => ({ ...prev, [`${field}_${petIndex}`]: "" }));
      }
    } else if (field === "petAge") {
      // Handle pet age - only allow numbers and decimal point
      // eslint-disable-next-line no-useless-escape
      const cleanValue = value.replace(/[^\d\.]/g, "");
      setPetInfo((prev) =>
        prev.map((pet, index) =>
          index === petIndex ? { ...pet, [field]: cleanValue } : pet
        )
      );

      // Validate age in real-time
      if (cleanValue) {
        const ageError = validatePetAge(cleanValue);
        setErrors((prev) => ({
          ...prev,
          [`${field}_${petIndex}`]: ageError || "",
        }));
      } else {
        setErrors((prev) => ({ ...prev, [`${field}_${petIndex}`]: "" }));
      }
    } else {
      setPetInfo((prev) =>
        prev.map((pet, index) =>
          index === petIndex ? { ...pet, [field]: value } : pet
        )
      );
      setErrors((prev) => ({ ...prev, [`${field}_${petIndex}`]: "" }));
    }
  };

  const handleSpecialRequestsChange = (value: string) => {
    setSpecialRequests(value);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedService) {
      newErrors.selectedService = "Vui lòng chọn dịch vụ";
    }

    // Check if we have at least one pet
    if (petInfo.length === 0) {
      newErrors.petInfo = "Vui lòng thêm ít nhất một thú cưng";
    }

    // Validate each pet
    petInfo.forEach((pet, index) => {
      if (!pet.petType) {
        newErrors[`petType_${index}`] = "Vui lòng chọn loại thú cưng";
      }
      if (!pet.petSize) {
        newErrors[`petSize_${index}`] = "Vui lòng chọn kích thước thú cưng";
      }

      // Validate pet weight if provided
      if (pet.petWeight) {
        const weightError = validatePetWeight(pet.petWeight);
        if (weightError) {
          newErrors[`petWeight_${index}`] = weightError;
        }
      }

      // Validate pet age if provided
      if (pet.petAge) {
        const ageError = validatePetAge(pet.petAge);
        if (ageError) {
          newErrors[`petAge_${index}`] = ageError;
        }
      }
    });

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

  const handleSubmit = () => {
    if (!validateForm()) {
      // Show validation errors using toast
      const firstError = Object.values(errors)[0];
      showError(firstError || "Vui lòng kiểm tra lại thông tin đã nhập");
      return;
    }

    // Process booking
    const bookingData = {
      freelancer: freelancerData,
      service: selectedService,
      petInfo,
      dateTime: dateTimeData,
      customer: customerInfo,
      specialRequests,
    };

    // Show success message
    showSuccess("Đặt dịch vụ thành công! Chuyển đến trang thanh toán...");

    // Navigate to payment page with booking data
    navigate("/payment", {
      state: {
        bookingData: bookingData,
      },
    });
  };

  if (!freelancerData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BookingHeader selectedFreelancer={freelancerData} />

          {/* User Info Banner - Always show for demo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {mockUser.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Xin chào, {mockUser.fullName}!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Thông tin của bạn đã được tự động điền sẵn
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {userPets.length} thú cưng
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-8">
              <ServiceSelection
                selectedService={selectedService}
                onServiceChange={handleServiceChange}
                error={errors.selectedService}
              />

              <PetInformation
                petInfo={petInfo}
                onPetInfoChange={handlePetInfoChange}
                onAddPet={handleAddPet}
                onRemovePet={handleRemovePet}
                errors={errors}
              />

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
              <BookingSummary
                selectedFreelancer={freelancerData}
                selectedService={selectedService}
                petInfo={petInfo}
                date={dateTimeData.date}
                time={dateTimeData.time}
                recurringService={dateTimeData.recurringService}
                frequency={dateTimeData.frequency}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
