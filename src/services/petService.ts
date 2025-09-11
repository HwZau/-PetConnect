// Pet management services
import { apiClient } from "./apiClient";
import type { Pet, ApiResponse, PaginatedResponse } from "../types";

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
  async createPet(data: CreatePetData): Promise<ApiResponse<Pet>> {
    return apiClient.post<Pet>("/pets", data);
  },

  async getPets(
    params?: PetSearchParams
  ): Promise<ApiResponse<PaginatedResponse<Pet>>> {
    return apiClient.get<PaginatedResponse<Pet>>("/pets", params);
  },

  async getPetById(id: string): Promise<ApiResponse<Pet>> {
    return apiClient.get<Pet>(`/pets/${id}`);
  },

  async updatePet(id: string, data: UpdatePetData): Promise<ApiResponse<Pet>> {
    return apiClient.put<Pet>(`/pets/${id}`, data);
  },

  async deletePet(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/pets/${id}`);
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
