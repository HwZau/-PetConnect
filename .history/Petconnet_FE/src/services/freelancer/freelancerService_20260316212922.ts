// Freelancer services
import { apiClient } from "../apiClient";
import type { ApiResponse } from "../../types";
import { API_ENDPOINTS } from "../../config/api";

export interface FreelancerData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  avatarUrl: string | null;
  services: Service[];
  reviewsReceived: Review[];
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  freelancerId: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerId: string;
  freelancerId: string;
}

export interface FreelancerListParams {
  page?: number;
  size?: number;
  searchTerm?: string;
  category?: string;
  location?: string;
  rating?: string;
}

export interface FreelancerListResponse {
  items: FreelancerData[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export const freelancerService = {
  // GET /api/v1/freelancer/getall - Lấy danh sách freelancers
  async getAllFreelancers(
    params?: FreelancerListParams
  ): Promise<ApiResponse<FreelancerListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.size) queryParams.append("size", params.size.toString());
    if (params?.searchTerm) queryParams.append("search", params.searchTerm);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.location) queryParams.append("location", params.location);
    if (params?.rating) queryParams.append("rating", params.rating);

    const url = `${API_ENDPOINTS.FREELANCERS.LIST}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    return apiClient.get<FreelancerListResponse>(url);
  },

  // GET /api/v1/freelancer/{id} - Lấy chi tiết freelancer
  async getFreelancerById(id: string): Promise<ApiResponse<FreelancerData>> {
    return apiClient.get<FreelancerData>(API_ENDPOINTS.FREELANCERS.DETAIL(id));
  },

  // Tính rating trung bình từ reviews
  calculateAverageRating(reviews: Review[]): number {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  },

  // Format service type để hiển thị
  formatServiceType(type: string): string {
    const typeMap: Record<string, string> = {
      Grooming: "Chăm sóc & Làm đẹp",
      Training: "Huấn luyện",
      Walking: "Dắt dạo",
      Sitting: "Trông giữ thú cưng",
    };
    return typeMap[type] || type;
  },
};
