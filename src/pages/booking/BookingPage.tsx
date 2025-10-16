import React, { useEffect, useState, useContext } from "react";
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
import { UserContext } from "../../contexts/UserContext";
import type {
  Freelancer,
  PetInfoData,
  DateTimeData,
  CustomerInfoData,
  UserPet,
} from "../../types";

const BookingPage: React.FC = () => {
  console.log("BookingPage component loaded");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const freelancerData = location.state?.freelancer as Freelancer;
  console.log("Location state:", location.state);
  console.log("Current user:", user);

  // Mock user data - in real app this would come from context/API
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
        age: "2 tuổi",
        gender: "Đực",
        breed: "Golden Retriever",
      },
      {
        id: "2",
        name: "Luna",
        type: "cat",
        age: "1 tuổi",
        gender: "Cái",
        breed: "Persian",
      },
    ] as UserPet[],
  };

  const [selectedService, setSelectedService] = useState<string>("");
  const [petInfo, setPetInfo] = useState<PetInfoData[]>([
    {
      petType: user && mockUser.pets.length > 0 ? mockUser.pets[0].type : "",
      petSize: "",
      duration: "",
      petName: user && mockUser.pets.length > 0 ? mockUser.pets[0].name : "",
      petAge: user && mockUser.pets.length > 0 ? mockUser.pets[0].age : "",
      petWeight: "",
    },
  ]);
  const [dateTimeData, setDateTimeData] = useState<DateTimeData>({
    date: "",
    time: "",
    recurringService: false,
    frequency: "",
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfoData>({
    fullName: user ? mockUser.fullName : "",
    email: user ? mockUser.email : "",
    phone: user ? mockUser.phone : "",
    address: user ? mockUser.address : "",
    emergencyContact: user ? mockUser.phone : "",
  });
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userPets] = useState<UserPet[]>(user ? mockUser.pets : []);

  useEffect(() => {
    console.log("BookingPage freelancerData:", freelancerData);
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

  const handlePetInfoChange = (
    petIndex: number,
    field: keyof PetInfoData,
    value: string
  ) => {
    setPetInfo((prev) => {
      const updated = [...prev];
      updated[petIndex] = { ...updated[petIndex], [field]: value };
      return updated;
    });
    setErrors((prev) => ({ ...prev, [`${field}_${petIndex}`]: "" }));
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
    if (petInfo.length > 1) {
      setPetInfo((prev) => prev.filter((_, index) => index !== petIndex));
      // Clean up related errors
      setErrors((prev) => {
        const newErrors = { ...prev };
        Object.keys(newErrors).forEach((key) => {
          if (key.endsWith(`_${petIndex}`)) {
            delete newErrors[key];
          }
        });
        return newErrors;
      });
    }
  };

  const handleDateTimeChange = (
    field: keyof DateTimeData,
    value: string | boolean
  ) => {
    setDateTimeData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleCustomerInfoChange = (
    field: keyof CustomerInfoData,
    value: string
  ) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSpecialRequestsChange = (value: string) => {
    setSpecialRequests(value);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedService) {
      newErrors.selectedService = "Vui lòng chọn dịch vụ";
    }

    // Validate each pet
    petInfo.forEach((pet, index) => {
      if (!pet.petType) {
        newErrors[`petType_${index}`] = "Vui lòng chọn loại thú cưng";
      }
      if (!pet.petSize) {
        newErrors[`petSize_${index}`] = "Vui lòng chọn kích thước thú cưng";
      }
      if (!pet.duration) {
        newErrors[`duration_${index}`] = "Vui lòng chọn thời gian dịch vụ";
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
    if (!customerInfo.email) {
      newErrors.email = "Vui lòng nhập email";
    }
    if (!customerInfo.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    }
    if (!customerInfo.address) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
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

    console.log("Booking Data:", bookingData);
    alert("Đặt dịch vụ thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
    navigate("/");
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

          {/* User Info Banner */}
          {user && (
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
          )}

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
