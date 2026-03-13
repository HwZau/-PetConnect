import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../../config/api";

/**
 * Profile Service - API calls for updating user profiles
 */

// Customer profile update request body (theo API spec)
export interface UpdateCustomerProfileRequest {
  name: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string;
}

// Freelancer profile update request body (theo API spec)
export interface UpdateFreelancerProfileRequest {
  name: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string;
}

// Generic profile update response
export interface ProfileUpdateResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Update customer profile
 * PUT /api/profile/customer
 * Body: { name, phoneNumber, address, avatarUrl }
 */
export const updateCustomerProfile = async (
  data: UpdateCustomerProfileRequest
): Promise<ProfileUpdateResponse> => {
  try {
    const response = await apiClient.put<ProfileUpdateResponse>(
      API_ENDPOINTS.PROFILE.UPDATE_CUSTOMER,
      data
    );
    return response;
  } catch (error) {
    console.error("Failed to update customer profile:", error);
    throw error;
  }
};

/**
 * Update freelancer profile
 * PUT /api/profile/freelancer
 * Body: { name, phoneNumber, address, avatarUrl }
 */
export const updateFreelancerProfile = async (
  data: UpdateFreelancerProfileRequest
): Promise<ProfileUpdateResponse> => {
  try {
    const response = await apiClient.put<ProfileUpdateResponse>(
      API_ENDPOINTS.PROFILE.UPDATE_FREELANCER,
      data
    );
    return response;
  } catch (error) {
    console.error("Failed to update freelancer profile:", error);
    throw error;
  }
};

const profileService = {
  updateCustomerProfile,
  updateFreelancerProfile,
};

export default profileService;
