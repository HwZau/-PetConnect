import type { UserProfile, UserStats } from "../../../types/domains/profile";
import type { Pet } from "../../../types/domains/booking";

// Mock UserProfile data với đầy đủ thuộc tính required
export const mockUserProfile: UserProfile = {
  id: "user-001",
  email: "lyhongthu@gmail.com",
  name: "Lý Hồng Thư",
  avatar: "/images/avatars/user-1.jpg",
  phone: "+84 901 234 567",
  role: "Customer",
  isVerified: true,
  createdAt: new Date("2023-01-15"),
  lastLoginAt: new Date("2024-10-23"),
  address: "123 Nguyễn Huệ, Quận 1, TP.HCM, 700000, Vietnam",
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      showProfile: true,
      showEmail: false,
      showPhone: false,
    },
    language: "vi",
    currency: "VND",
    theme: "light",
  },
};

// Mock UserStats data với đầy đủ thuộc tính required
export const mockUserStats: UserStats = {
  totalBookings: 12,
  totalSpent: 2450000, // 2.45M VND
  favoriteServices: ["Cắt tỉa lông", "Khám sức khỏe", "Pet sitting"],
  joinDate: new Date("2023-01-15"),
  lastActivity: new Date("2024-10-23"),
};

// Mock Pet data với đầy đủ thuộc tính required
export const mockUserPets: Pet[] = [
  {
    id: "pet-001",
    name: "Buddy",
    type: "dog",
    breed: "Golden Retriever",
    age: 3,
    weight: 25.5,
    specialNeeds: "Không có",
    medicalHistory: "Đã tiêm phòng đầy đủ",
    imageUrl: "/images/pets/dog1.jpg",
    vaccinations: [
      {
        name: "DHPP",
        date: new Date("2024-01-15"),
        nextDue: new Date("2025-01-15"),
      },
      {
        name: "Rabies",
        date: new Date("2024-02-01"),
        nextDue: new Date("2027-02-01"),
      },
    ],
  },
  {
    id: "pet-002",
    name: "Luna",
    type: "cat",
    breed: "Persian Cat",
    age: 2,
    weight: 4.2,
    specialNeeds: "Cần chải lông hàng ngày",
    medicalHistory: "Bị viêm da nhẹ đã khỏi",
    imageUrl: "/images/pets/cat1.jpg",
    vaccinations: [
      {
        name: "FVRCP",
        date: new Date("2024-03-10"),
        nextDue: new Date("2025-03-10"),
      },
    ],
  },
  {
    id: "pet-003",
    name: "Kiwi",
    type: "bird",
    breed: "Cockatiel",
    age: 1,
    weight: 0.09,
    specialNeeds: "Không được để gần máy lạnh",
    medicalHistory: "Khỏe mạnh",
    imageUrl: "/images/pets/bird1.jpg",
  },
];

// Mock RecentServices data theo đúng interface
export const mockRecentBookings = [
  {
    id: "booking-001",
    serviceName: "Cắt tỉa lông chuyên nghiệp",
    freelancerName: "Nguyễn Minh Tâm",
    date: new Date("2024-10-12"),
    status: "completed" as const,
    rating: 5,
  },
  {
    id: "booking-002",
    serviceName: "Khám sức khỏe tổng quát",
    freelancerName: "Dr. Phạm Văn An",
    date: new Date("2024-10-09"),
    status: "completed" as const,
    rating: 4,
  },
  {
    id: "booking-003",
    serviceName: "Pet sitting cuối tuần",
    freelancerName: "Trần Thị Mai",
    date: new Date("2024-12-25"),
    status: "upcoming" as const,
  },
];

// Mock FavoriteServices data theo đúng interface
export const mockFavoriteServices = [
  {
    id: "service-001",
    name: "Cắt tỉa lông chuyên nghiệp",
    category: "Grooming",
    price: 150000,
    rating: 4.8,
    imageUrl: "/images/services/grooming.jpg",
  },
  {
    id: "service-002",
    name: "Khám sức khỏe thú cưng",
    category: "Healthcare",
    price: 200000,
    rating: 4.9,
    imageUrl: "/images/services/healthcare.jpg",
  },
  {
    id: "service-003",
    name: "Pet sitting tại nhà",
    category: "Care",
    price: 300000,
    rating: 4.7,
    imageUrl: "/images/services/sitting.jpg",
  },
  {
    id: "service-004",
    name: "Huấn luyện cơ bản",
    category: "Training",
    price: 500000,
    rating: 4.6,
    imageUrl: "/images/services/training.jpg",
  },
];

// API simulation functions
export const fetchUserProfile = async (
  _userId: string
): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUserProfile);
    }, 500);
  });
};

export const fetchUserStats = async (_userId: string): Promise<UserStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUserStats);
    }, 300);
  });
};

export const fetchUserPets = async (_userId: string): Promise<Pet[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUserPets);
    }, 400);
  });
};

export const fetchRecentBookings = async (_userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRecentBookings);
    }, 600);
  });
};

export const fetchFavoriteServices = async (_userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFavoriteServices);
    }, 350);
  });
};
