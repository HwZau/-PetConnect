// Service management services
import { apiClient } from "../apiClient";
import type { ApiResponse } from "../../types";
import { API_ENDPOINTS } from "../../config/api";

export interface CreateServiceData {
  name: string;
  description: string;
  category: string;
  price: number;
}

export interface UpdateServiceData {
  title?: string;
  description?: string;
  type?: number;
  price?: number;
}

export interface ServiceResponse {
  id: string;
  title: string;
  description: string;
  type: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export const serviceService = {
  /**
   * Create a new service
   * POST /api/v1/service/create
   */
  async createService(
    data: CreateServiceData
  ): Promise<ApiResponse<ServiceResponse>> {
    return apiClient.post<ServiceResponse>(API_ENDPOINTS.SERVICES.CREATE, data);
  },

  /**
   * Update an existing service
   * PUT /api/v1/service/update/{id}
   */
  async updateService(
    serviceId: string,
    data: UpdateServiceData
  ): Promise<ApiResponse<ServiceResponse>> {
    return apiClient.put<ServiceResponse>(
      API_ENDPOINTS.SERVICES.UPDATE(serviceId),
      data
    );
  },

  /**
   * Delete a service
   * DELETE /api/v1/service/delete/{id}
   */
  async deleteService(serviceId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.SERVICES.DELETE(serviceId));
  },

  /**
   * Get service details
   * GET /api/v1/services/{id}
   */
  async getServiceDetail(
    serviceId: string
  ): Promise<ApiResponse<ServiceResponse>> {
    return apiClient.get<ServiceResponse>(
      API_ENDPOINTS.SERVICES.DETAIL(serviceId)
    );
  },

  /**
   * Get all services
   * GET /api/v1/services
   */
  async getAllServices(): Promise<ApiResponse<ServiceResponse[]>> {
    return apiClient.get<ServiceResponse[]>(API_ENDPOINTS.SERVICES.LIST);
  },
};
