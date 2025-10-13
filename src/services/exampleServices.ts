// API Services - separate from components for Fast Refresh compatibility
import { apiClient } from "../services/apiClient";
import { API_ENDPOINTS } from "../config/api";

// Define proper types and export them
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  age: number;
  category?: string;
}

// 1. Basic usage with apiClient
export const userService = {
  // Get user profile
  async getProfile() {
    return await apiClient.get<UserProfile>(API_ENDPOINTS.USERS.PROFILE);
  },

  // Update user profile
  async updateProfile(userData: Partial<UserProfile>) {
    return await apiClient.put<UserProfile>(
      API_ENDPOINTS.USERS.UPDATE,
      userData
    );
  },

  // Upload avatar
  async uploadAvatar(file: File) {
    return await apiClient.uploadFile<{ url: string }>(
      API_ENDPOINTS.UPLOAD.AVATAR,
      file
    );
  },
};

// 2. Pet service example
export const petService = {
  // Get all pets
  async getPets() {
    return await apiClient.get<Pet[]>(API_ENDPOINTS.PETS.LIST);
  },

  // Create new pet
  async createPet(petData: Omit<Pet, "id">) {
    return await apiClient.post<Pet>(API_ENDPOINTS.PETS.CREATE, petData);
  },

  // Get pet by ID
  async getPet(id: string) {
    return await apiClient.get<Pet>(API_ENDPOINTS.PETS.DETAIL(id));
  },

  // Update pet
  async updatePet(id: string, petData: Partial<Pet>) {
    return await apiClient.put<Pet>(API_ENDPOINTS.PETS.UPDATE(id), petData);
  },

  // Delete pet
  async deletePet(id: string) {
    return await apiClient.delete<void>(API_ENDPOINTS.PETS.DELETE(id));
  },
};
