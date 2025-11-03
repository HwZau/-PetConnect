// Service configuration for consistent service management across the app
export interface ServiceConfig {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  category: string;
  duration: number; // in minutes
  icon?: string;
}

export const AVAILABLE_SERVICES: ServiceConfig[] = [
  {
    id: "pet-care",
    name: "Chăm sóc thú cưng tổng quát",
    basePrice: 200000,
    description: "Dịch vụ chăm sóc thú cưng toàn diện tại nhà",
    category: "care",
    duration: 120,
  },
  {
    id: "pet-grooming",
    name: "Spa & Grooming",
    basePrice: 150000,
    description: "Tắm rửa, cắt tỉa lông và chăm sóc sức khỏe",
    category: "grooming",
    duration: 90,
  },
  {
    id: "pet-sitting",
    name: "Trông giữ thú cưng",
    basePrice: 100000,
    description: "Trông giữ thú cưng khi chủ đi vắng",
    category: "sitting",
    duration: 240,
  },
  {
    id: "pet-walking",
    name: "Dắt thú cưng đi dạo",
    basePrice: 80000,
    description: "Dắt thú cưng đi dạo và tập thể dục",
    category: "exercise",
    duration: 60,
  },
  {
    id: "vet-consultation",
    name: "Tư vấn thú y",
    basePrice: 300000,
    description: "Tư vấn sức khỏe và chăm sóc thú cưng",
    category: "healthcare",
    duration: 45,
  },
  {
    id: "pet-training",
    name: "Huấn luyện thú cưng",
    basePrice: 250000,
    description: "Huấn luyện và dạy kỹ năng cho thú cưng",
    category: "training",
    duration: 90,
  },
  {
    id: "pet-boarding",
    name: "Lưu trú thú cưng",
    basePrice: 180000,
    description: "Dịch vụ lưu trú thú cưng qua đêm",
    category: "boarding",
    duration: 1440, // 24 hours
  },
];

export class ServiceManager {
  static getServiceById(serviceId: string): ServiceConfig | undefined {
    return AVAILABLE_SERVICES.find((service) => service.id === serviceId);
  }

  static getServiceByCategory(category: string): ServiceConfig[] {
    return AVAILABLE_SERVICES.filter(
      (service) => service.category === category
    );
  }

  static getAllServices(): ServiceConfig[] {
    return [...AVAILABLE_SERVICES];
  }

  static getServiceName(serviceId: string): string {
    const service = this.getServiceById(serviceId);
    return service ? service.name : "Dịch vụ chăm sóc thú cưng";
  }

  static getServicePrice(serviceId: string): number {
    const service = this.getServiceById(serviceId);
    return service ? service.basePrice : 100000;
  }

  static calculateTotalPrice(
    serviceId: string,
    petCount: number,
    petSizes: string[] = [],
    isRecurring: boolean = false
  ): number {
    const basePrice = this.getServicePrice(serviceId);
    let total = basePrice * petCount;

    // Add premium for larger pets
    petSizes.forEach((size) => {
      if (size === "large") total += 50000;
      if (size === "medium") total += 30000;
    });

    // Recurring service discount
    if (isRecurring) {
      total *= 0.9; // 10% discount
    }

    return Math.round(total);
  }

  static formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  // Get services for dropdown/selection
  static getServicesForSelect(): Array<{
    id: string;
    name: string;
    price: number;
    description: string;
  }> {
    return AVAILABLE_SERVICES.map((service) => ({
      id: service.id,
      name: service.name,
      price: service.basePrice,
      description: service.description,
    }));
  }

  // Validate if a service exists
  static isValidService(serviceId: string): boolean {
    return AVAILABLE_SERVICES.some((service) => service.id === serviceId);
  }

  // Get service categories
  static getServiceCategories(): Array<{ id: string; name: string }> {
    const categories = new Set(
      AVAILABLE_SERVICES.map((service) => service.category)
    );
    const categoryNames = {
      care: "Chăm sóc",
      grooming: "Làm đẹp",
      sitting: "Trông giữ",
      exercise: "Tập thể dục",
      healthcare: "Y tế",
      training: "Huấn luyện",
      boarding: "Lưu trú",
    };

    return Array.from(categories).map((cat) => ({
      id: cat,
      name: categoryNames[cat as keyof typeof categoryNames] || cat,
    }));
  }
}

export default ServiceManager;
