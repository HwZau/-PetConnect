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

export interface EditPetData {
  name: string;
  type: string;
  breed: string;
}

export interface PetSearchParams extends Record<string, unknown> {
  ownerId?: string;
  species?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const petService = {
  // GET /api/v1/pet/getall - Lấy tất cả pets (admin)
  async getAllPets(): Promise<ApiResponse<Pet[]>> {
    return apiClient.get<Pet[]>(API_ENDPOINTS.PETS.LIST);
  },

  // GET /api/v1/pet/{id} - Lấy thông tin pet theo ID (admin)
  async getPetById(id: string): Promise<ApiResponse<Pet>> {
    return apiClient.get<Pet>(API_ENDPOINTS.PETS.DETAIL(id));
  },

  // GET /api/v1/pet/user/{userId}/pets - Lấy danh sách pets của user cụ thể (admin)
  async getUserPets(userId: string): Promise<ApiResponse<Pet[]>> {
    return apiClient.get<Pet[]>(API_ENDPOINTS.PETS.USER_PETS(userId));
  },

  // POST /api/v1/pet/create - Tạo pet mới (admin)
  async createPet(data: CreatePetData): Promise<ApiResponse<Pet>> {
    return apiClient.post<Pet>(API_ENDPOINTS.PETS.CREATE, data);
  },

  // PUT /api/v1/pet/update/{id} - Cập nhật thông tin pet (id là userId) (admin)
  async updatePet(
    userId: string,
    petId: string,
    data: UpdatePetData
  ): Promise<ApiResponse<Pet>> {
    return apiClient.put<Pet>(API_ENDPOINTS.PETS.UPDATE(userId), {
      ...data,
      petId,
    });
  },

  // PUT /api/v1/pet/edit/{id} - Edit pet info (id là petId)
  async editPet(petId: string, data: EditPetData): Promise<ApiResponse<Pet>> {
    console.log("Editing pet:", petId, data);
    return apiClient.put<Pet>(API_ENDPOINTS.PETS.EDIT(petId), data);
  },

  // DELETE /api/v1/pet/delete/{id} - Xóa pet (id là petId)
  async deletePet(petId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.PETS.DELETE(petId));
  },

  // POST /api/v1/pet/add/{id} - Add pet cho customer (id là userId)
  async addPet(id: string, data?: unknown): Promise<ApiResponse<Pet>> {
    return apiClient.post<Pet>(API_ENDPOINTS.PETS.ADD_PET(id), data);
  },

  // POST /api/v1/pet/{userId} - Lấy danh sách pets của customer cụ thể (dùng POST nhưng để GET data)
  async getCustomerPets(userId: string): Promise<ApiResponse<Pet[]>> {
    return apiClient.post<Pet[]>(API_ENDPOINTS.PETS.CREATE_USER_PET(userId));
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
};
