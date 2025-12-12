import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../../config/api";
import type { ApiResponse } from "../../types";

export interface CloudinaryUploadResponse {
  id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
}

/**
 * Upload image file to Cloudinary
 */
export const uploadImage = async (
  file: File
): Promise<ApiResponse<CloudinaryUploadResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<CloudinaryUploadResponse>(
    API_ENDPOINTS.CLOUDINARY.UPLOAD,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

/**
 * Upload image as base64 to Cloudinary
 */
export const uploadImageBase64 = async (
  base64: string
): Promise<ApiResponse<CloudinaryUploadResponse>> => {
  const response = await apiClient.post<CloudinaryUploadResponse>(
    API_ENDPOINTS.CLOUDINARY.UPLOAD_BASE64,
    { base64 }
  );

  return response;
};

/**
 * Upload video file to Cloudinary
 */
export const uploadVideo = async (
  file: File
): Promise<ApiResponse<CloudinaryUploadResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<CloudinaryUploadResponse>(
    API_ENDPOINTS.CLOUDINARY.UPLOAD_VIDEO,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

/**
 * Upload video as base64 to Cloudinary
 */
export const uploadVideoBase64 = async (
  base64: string
): Promise<ApiResponse<CloudinaryUploadResponse>> => {
  const response = await apiClient.post<CloudinaryUploadResponse>(
    API_ENDPOINTS.CLOUDINARY.UPLOAD_VIDEO_BASE64,
    { base64 }
  );

  return response;
};

/**
 * Delete image from Cloudinary by public ID
 */
export const deleteImage = async (
  publicId: string
): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<void>(
    API_ENDPOINTS.CLOUDINARY.DELETE(publicId)
  );

  return response;
};

/**
 * Delete video from Cloudinary by GUID
 */
export const deleteVideo = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<void>(
    API_ENDPOINTS.CLOUDINARY.DELETE_VIDEO(id)
  );

  return response;
};

/**
 * Delete video from Cloudinary by public ID
 */
export const deleteVideoByPublicId = async (
  publicId: string
): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<void>(
    API_ENDPOINTS.CLOUDINARY.DELETE_VIDEO_BY_PUBLIC(publicId)
  );

  return response;
};

/**
 * Get image by ID from database
 */
export const getImageById = async (
  id: string
): Promise<ApiResponse<CloudinaryUploadResponse>> => {
  const response = await apiClient.get<CloudinaryUploadResponse>(
    API_ENDPOINTS.CLOUDINARY.GET_BY_ID(id)
  );

  return response;
};

/**
 * Get image by public ID from database
 */
export const getImageByPublicId = async (
  publicId: string
): Promise<ApiResponse<CloudinaryUploadResponse>> => {
  const response = await apiClient.get<CloudinaryUploadResponse>(
    API_ENDPOINTS.CLOUDINARY.GET_BY_PUBLIC_ID(publicId)
  );

  return response;
};

/**
 * Get all images from database
 */
export const getAllImages = async (): Promise<
  ApiResponse<CloudinaryUploadResponse[]>
> => {
  const response = await apiClient.get<CloudinaryUploadResponse[]>(
    API_ENDPOINTS.CLOUDINARY.GET_ALL
  );

  return response;
};

/**
 * Get transformed image URL from Cloudinary
 */
export const getTransformedImageUrl = async (
  publicId: string
): Promise<ApiResponse<{ url: string }>> => {
  const response = await apiClient.get<{ url: string }>(
    API_ENDPOINTS.CLOUDINARY.GET_TRANSFORMED_URL(publicId)
  );

  return response;
};

/**
 * Get video by ID from database
 */
export const getVideoById = async (
  id: string
): Promise<ApiResponse<CloudinaryUploadResponse>> => {
  const response = await apiClient.get<CloudinaryUploadResponse>(
    API_ENDPOINTS.CLOUDINARY.GET_VIDEO_BY_ID(id)
  );

  return response;
};

export default {
  uploadImage,
  uploadImageBase64,
  deleteImage,
  getImageById,
  getImageByPublicId,
  getAllImages,
  getTransformedImageUrl,
};
