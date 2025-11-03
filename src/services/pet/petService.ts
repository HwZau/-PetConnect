// Pet management services
import { apiClient } from "../apiClient";
import type { Pet, ApiResponse, PaginatedResponse } from "../../types";
import { API_ENDPOINTS } from "../../config/api";

export interface CreatePetData {
  name: string;
  species: "dog" | "cat" | "bird" | "rabbit" | "other";
  breed?: string;
  age: number;
  weight?: number;
  gender: "male" | "female";
  isNeutered: boolean;
  description?: string;
  medicalNotes?: string;
  emergencyContact?: string;
}

export interface UpdatePetData extends Partial<CreatePetData> {
  isActive?: boolean;
}

export interface PetSearchParams extends Record<string, unknown> {
  ownerId?: string;
  species?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const petService = {
  // GET /api/v1/pet/getall - Lấy tất cả pets
  async getAllPets(): Promise<ApiResponse<Pet[]>> {
    return apiClient.get<Pet[]>(API_ENDPOINTS.PETS.LIST);
  },

  // GET /api/v1/pet/{id} - Lấy thông tin pet theo ID
  async getPetById(id: string): Promise<ApiResponse<Pet>> {
    return apiClient.get<Pet>(API_ENDPOINTS.PETS.DETAIL(id));
  },

  // GET /api/v1/pet/user/{userId}/pets - Lấy danh sách pets của user
  async getUserPets(userId: string): Promise<ApiResponse<Pet[]>> {
    return apiClient.get<Pet[]>(API_ENDPOINTS.PETS.USER_PETS(userId));
  },

  // POST /api/v1/pet/create - Tạo pet mới
  async createPet(data: CreatePetData): Promise<ApiResponse<Pet>> {
    return apiClient.post<Pet>(API_ENDPOINTS.PETS.CREATE, data);
  },

  // PUT /api/v1/pet/update/{id} - Cập nhật thông tin pet
  async updatePet(id: string, data: UpdatePetData): Promise<ApiResponse<Pet>> {
    return apiClient.put<Pet>(API_ENDPOINTS.PETS.UPDATE(id), data);
  },

  // DELETE /api/v1/pet/delete/{id} - Xóa pet
  async deletePet(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.PETS.DELETE(id));
  },

  // POST /api/v1/pet/add/{id} - Add pet (chưa rõ chức năng cụ thể)
  async addPet(id: string, data?: unknown): Promise<ApiResponse<Pet>> {
    return apiClient.post<Pet>(API_ENDPOINTS.PETS.ADD_PET(id), data);
  },

  // POST /api/v1/pet/{userId} - Tạo pet cho user cụ thể
  async createUserPet(
    userId: string,
    data: CreatePetData
  ): Promise<ApiResponse<Pet>> {
    return apiClient.post<Pet>(
      API_ENDPOINTS.PETS.CREATE_USER_PET(userId),
      data
    );
  },

  // Legacy methods for backward compatibility
  async getPets(
    params?: PetSearchParams
  ): Promise<ApiResponse<PaginatedResponse<Pet>>> {
    return apiClient.get<PaginatedResponse<Pet>>(
      API_ENDPOINTS.PETS.LIST,
      params
    );
  },

  async uploadPetPhoto(
    petId: string,
    file: File
  ): Promise<ApiResponse<{ url: string }>> {
    return apiClient.uploadFile<{ url: string }>(`/pets/${petId}/photos`, file);
  },

  async deletePetPhoto(
    petId: string,
    photoUrl: string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(
      `/pets/${petId}/photos?url=${encodeURIComponent(photoUrl)}`
    );
  },

  async getMyPets(): Promise<ApiResponse<Pet[]>> {
    return apiClient.get<Pet[]>("/pets/my-pets");
  },
};
