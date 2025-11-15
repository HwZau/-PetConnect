import type { FreelancerProfile } from "../../../types/domains/profile";
import type {
  Review,
  FreelancerService,
} from "../../../types/domains/freelancer";

/* ===================================
 * MOCK DATA SERVICE
 * ================================= */

export const mockFreelancerProfile: FreelancerProfile = {
  // UserProfile base fields
  id: "freelancer-001",
  email: "mai.petcare@gmail.com",
  name: "Nguyễn Thị Mai",
  avatar:
    "https://images.unsplash.com/photo-1494790108755-2616b60b2bb4?w=300&h=300&fit=crop&crop=face",
  phone: "+84 987 654 321",
  role: "Freelancer",
  isVerified: true,
  createdAt: new Date("2023-01-15"),
  lastLoginAt: new Date(),
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      showProfile: true,
      showEmail: false,
      showPhone: true,
    },
    language: "vi",
    currency: "VND",
    theme: "light",
  },
  address: "123 Nguyễn Văn Cừ, Hồ Chí Minh, 700000, Vietnam",

  // FreelancerProfile specific fields
  businessName: "Mai's Pet Care Service",
  description:
    "Có 5 năm kinh nghiệm chăm sóc chó mèo với tình yêu thương và sự tận tâm. Được chứng nhận bởi Hiệp hội Thú y Việt Nam. Chuyên cung cấp dịch vụ chăm sóc, huấn luyện và chữa trị cơ bản cho thú cưng. Cam kết mang lại sự an tâm tuyệt đối cho chủ nuôi và sự chăm sóc tốt nhất cho các bé cưng.",
  specializations: [
    "Chăm sóc chó nhỏ & vừa",
    "Chăm sóc mèo",
    "Sơ cứu thú y cơ bản",
    "Huấn luyện hành vi",
    "Tắm rửa & grooming",
    "Chăm sóc thú cưng có tuổi",
    "Cho ăn thuốc & vitamin",
  ],
  experience: 5,
  certifications: [
    {
      id: "cert-001",
      name: "Chứng chỉ Chăm sóc Thú cưng Cấp độ A",
      issuedBy: "Hiệp hội Thú y Việt Nam",
      issuedDate: new Date("2020-06-15"),
      expiryDate: new Date("2025-06-15"),
      credentialUrl: "https://vetassociation.vn/cert/001",
      isVerified: true,
    },
    {
      id: "cert-002",
      name: "Chứng chỉ Sơ cứu Thú y Cơ bản",
      issuedBy: "Trường Đại học Thú y Hà Nội",
      issuedDate: new Date("2021-03-20"),
      expiryDate: new Date("2026-03-20"),
      isVerified: true,
    },
    {
      id: "cert-003",
      name: "Chứng chỉ Huấn luyện Chó Cơ bản",
      issuedBy: "Trung tâm Huấn luyện K9",
      issuedDate: new Date("2022-08-10"),
      isVerified: true,
    },
  ],
  portfolio: [
    {
      id: "portfolio-001",
      title: "Chăm sóc Golden Retriever - Max",
      description:
        "Chăm sóc toàn diện cho Max trong 2 tuần khi chủ đi công tác. Bao gồm ăn uống đúng giờ, vệ sinh hàng ngày, dạo chơi 2 lần/ngày, và huấn luyện cơ bản. Max đã cải thiện đáng kể về hành vi và sức khỏe.",
      imageUrls: [
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=400&fit=crop",
      ],
      serviceType: "Chăm sóc dài hạn",
      completedDate: new Date("2024-09-15"),
      clientTestimonial:
        "Mai rất tận tâm và yêu thương Max như con của mình. Max rất hạnh phúc và khỏe mạnh suốt thời gian tôi đi vắng. Tôi hoàn toàn yên tâm!",
    },
    {
      id: "portfolio-002",
      title: "Spa & Grooming cho mèo Ba Tư - Luna",
      description:
        "Dịch vụ spa hoàn chỉnh cho Luna bao gồm tắm với sữa tắm chuyên dụng, sấy khô nhẹ nhàng, cắt tỉa lông theo kiểu dáng, chăm sóc móng và vệ sinh tai mũi.",
      imageUrls: [
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1570458740266-b3b3fb9574b9?w=600&h=400&fit=crop",
      ],
      serviceType: "Grooming & Spa",
      completedDate: new Date("2024-10-01"),
      clientTestimonial:
        "Luna trở nên xinh đẹp và thơm tho. Lông mượt mà hơn hẳn. Mai rất kiên nhẫn với Luna khó tính. Dịch vụ tuyệt vời!",
    },
    {
      id: "portfolio-003",
      title: "Huấn luyện Corgi - Mochi",
      description:
        "Huấn luyện hành vi cơ bản cho Mochi 3 tháng tuổi: ngồi, nằm, đi vệ sinh đúng chỗ, không cắn phá đồ đạc. Kết quả rất tích cực sau 4 tuần training.",
      imageUrls: [
        "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&h=400&fit=crop",
      ],
      serviceType: "Huấn luyện",
      completedDate: new Date("2024-08-20"),
      clientTestimonial:
        "Mochi đã ngoan hơn rất nhiều! Mai rất kiên trì và có phương pháp huấn luyện hiệu quả. Cảm ơn Mai rất nhiều!",
    },
  ],
  availability: {
    schedule: {
      monday: {
        isAvailable: true,
        timeSlots: [
          { startTime: "08:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "18:00" },
        ],
      },
      tuesday: {
        isAvailable: true,
        timeSlots: [
          { startTime: "08:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "18:00" },
        ],
      },
      wednesday: {
        isAvailable: true,
        timeSlots: [
          { startTime: "08:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "18:00" },
        ],
      },
      thursday: {
        isAvailable: true,
        timeSlots: [
          { startTime: "08:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "18:00" },
        ],
      },
      friday: {
        isAvailable: true,
        timeSlots: [
          { startTime: "08:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "18:00" },
        ],
      },
      saturday: {
        isAvailable: true,
        timeSlots: [{ startTime: "09:00", endTime: "17:00" }],
      },
      sunday: {
        isAvailable: true,
        timeSlots: [{ startTime: "10:00", endTime: "16:00" }],
      },
    },
    exceptions: [
      {
        date: new Date("2024-12-25"),
        isAvailable: false,
        reason: "Nghỉ lễ Giáng sinh",
      },
      {
        date: new Date("2024-12-31"),
        isAvailable: false,
        reason: "Nghỉ Tết Dương lịch",
      },
    ],
    advanceBooking: 7,
    timezone: "Asia/Ho_Chi_Minh",
  },
  pricing: [
    {
      serviceType: "Chăm sóc hàng ngày",
      basePrice: 200000,
      currency: "VND",
      unit: "day",
      description: "Chăm sóc cơ bản tại nhà: ăn uống, vệ sinh, dạo chơi",
    },
    {
      serviceType: "Dắt chó đi dạo",
      basePrice: 150000,
      currency: "VND",
      unit: "session",
      description: "Dắt chó đi dạo 45 phút, bao gồm vệ sinh sau dạo",
    },
    {
      serviceType: "Tắm rửa & grooming",
      basePrice: 300000,
      currency: "VND",
      unit: "session",
      description: "Tắm rửa, sấy khô, cắt tỉa lông, vệ sinh tai mũi",
    },
    {
      serviceType: "Chăm sóc qua đêm",
      basePrice: 500000,
      currency: "VND",
      unit: "session",
      description: "Chăm sóc tại nhà khách hàng qua đêm (18h-8h)",
    },
    {
      serviceType: "Huấn luyện cơ bản",
      basePrice: 400000,
      currency: "VND",
      unit: "session",
      description: "Huấn luyện hành vi cơ bản 60 phút/buổi",
    },
  ],
  rating: 4.9,
  reviewsCount: 127,
  completedBookings: 156,
  responseTime: 2, // 2 hours
  serviceArea: {
    type: "radius",
    radius: 15,
    centerLocation: {
      latitude: 10.8231,
      longitude: 106.6297,
      address: "Quận 1, Hồ Chí Minh",
    },
  },
  isActive: true,
};

export const mockReviews: Review[] = [
  {
    id: 1,
    userName: "Trần Văn An",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment:
      "Mai rất tận tâm chăm sóc bé Lucky của tôi. Lucky rất thích Mai và luôn vui vẻ khi gặp cô ấy. Dịch vụ tuyệt vời, tôi sẽ book lại!",
    date: "2024-10-15",
    service: "Chăm sóc hàng ngày",
    bookingId: "booking-001",
  },
  {
    id: 2,
    userName: "Nguyễn Thị Hoa",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment:
      "Dịch vụ grooming cho mèo Miu của tôi rất chuyên nghiệp. Miu rất sạch sẽ và xinh đẹp sau khi được Mai chăm sóc. Giá cả hợp lý, sẽ quay lại!",
    date: "2024-10-10",
    service: "Tắm rửa & grooming",
    bookingId: "booking-002",
  },
  {
    id: 3,
    userName: "Lê Minh Tuấn",
    userAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    comment:
      "Mai huấn luyện rất kiên nhẫn cho bé Buddy. Buddy đã biết ngồi và nằm sau 2 tuần. Mai cũng hướng dẫn tôi cách tương tác với Buddy tốt hơn.",
    date: "2024-09-28",
    service: "Huấn luyện cơ bản",
    bookingId: "booking-003",
  },
  {
    id: 4,
    userName: "Phạm Thị Lan",
    userAvatar:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment:
      "Tôi đi công tác dài hạn và Mai đã chăm sóc 2 bé mèo của tôi rất chu đáo. Gửi report hàng ngày, hình ảnh các bé ăn uống vui vẻ. Rất recommend!",
    date: "2024-09-20",
    service: "Chăm sóc dài hạn",
    bookingId: "booking-004",
  },
  {
    id: 5,
    userName: "Đỗ Văn Nam",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment:
      "Dịch vụ dắt chó của Mai rất tốt. Bé Rex được vận động đầy đủ và Mai còn chụp hình gửi tôi trong quá trình dạo chơi. Giá cả phải chăng!",
    date: "2024-09-15",
    service: "Dắt chó đi dạo",
    bookingId: "booking-005",
  },
];

export const mockServices: FreelancerService[] = [
  {
    id: "service-001",
    name: "Chăm sóc thú cưng tại nhà",
    description:
      "Chăm sóc thú cưng tại nhà chủ nuôi bao gồm: cho ăn đúng giờ, vệ sinh, dọn dẹp, dắt dạo (đối với chó)",
    price: 200000,
    duration: "Cả ngày",
    category: "Chăm sóc",
    isActive: true,
  },
  {
    id: "service-002",
    name: "Dắt chó đi dạo",
    description:
      "Dắt chó đi dạo 45 phút tại công viên hoặc khu vực an toàn, bao gồm vệ sinh sau dạo",
    price: 150000,
    duration: "45 phút",
    category: "Vận động",
    isActive: true,
  },
  {
    id: "service-003",
    name: "Tắm rửa & Grooming",
    description:
      "Tắm rửa với sữa tắm chuyên dụng, sấy khô, cắt tỉa lông, vệ sinh tai mũi, cắt móng",
    price: 300000,
    duration: "1-2 giờ",
    category: "Grooming",
    isActive: true,
  },
  {
    id: "service-004",
    name: "Chăm sóc qua đêm",
    description:
      "Chăm sóc thú cưng qua đêm tại nhà chủ nuôi (18h tối đến 8h sáng hôm sau)",
    price: 500000,
    duration: "Qua đêm",
    category: "Chăm sóc",
    isActive: true,
  },
  {
    id: "service-005",
    name: "Huấn luyện hành vi cơ bản",
    description:
      "Huấn luyện các lệnh cơ bản: ngồi, nằm, ở lại, đi vệ sinh đúng chỗ",
    price: 400000,
    duration: "60 phút/buổi",
    category: "Huấn luyện",
    isActive: true,
  },
];

// API simulation functions
export const fetchFreelancerProfile = (
  _id: string
): Promise<FreelancerProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFreelancerProfile);
    }, 1000);
  });
};

export const fetchFreelancerReviews = (
  _freelancerId: string
): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReviews);
    }, 800);
  });
};

export const fetchFreelancerServices = (
  _freelancerId: string
): Promise<FreelancerService[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockServices);
    }, 600);
  });
};
