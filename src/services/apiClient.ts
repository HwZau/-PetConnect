// API Client configuration with Axios
import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosProgressEvent,
} from "axios";
import type { ApiResponse } from "../types";
import { API_CONFIG } from "../config/api";

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.token = localStorage.getItem("auth_token");

    // Create axios instance
    this.axiosInstance = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor - add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle common errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.clearToken();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  getToken(): string | null {
    return this.token;
  }

  private handleAxiosResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Success",
    };
  }

  private handleAxiosError(error: unknown): ApiResponse<never> {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          error:
            error.response.data?.message ||
            `HTTP error! status: ${error.response.status}`,
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          error: "No response from server",
        };
      }
    }

    // Something else happened
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint, {
        params,
        ...config,
      });
      return this.handleAxiosResponse<T>(response);
    } catch (error) {
      return this.handleAxiosError(error);
    }
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(endpoint, data, config);
      return this.handleAxiosResponse<T>(response);
    } catch (error) {
      return this.handleAxiosError(error);
    }
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(endpoint, data, config);
      return this.handleAxiosResponse<T>(response);
    } catch (error) {
      return this.handleAxiosError(error);
    }
  }

  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(endpoint, config);
      return this.handleAxiosResponse<T>(response);
    } catch (error) {
      return this.handleAxiosError(error);
    }
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(
        endpoint,
        data,
        config
      );
      return this.handleAxiosResponse<T>(response);
    } catch (error) {
      return this.handleAxiosError(error);
    }
  }

  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, unknown>,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      if (additionalData) {
        Object.keys(additionalData).forEach((key) => {
          if (
            additionalData[key] !== undefined &&
            additionalData[key] !== null
          ) {
            formData.append(key, String(additionalData[key]));
          }
        });
      }

      const response = await this.axiosInstance.post<T>(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });

      return this.handleAxiosResponse<T>(response);
    } catch (error) {
      return this.handleAxiosError(error);
    }
  }

  async uploadMultipleFiles<T>(
    endpoint: string,
    files: File[],
    additionalData?: Record<string, unknown>,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();

      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      if (additionalData) {
        Object.keys(additionalData).forEach((key) => {
          if (
            additionalData[key] !== undefined &&
            additionalData[key] !== null
          ) {
            formData.append(key, String(additionalData[key]));
          }
        });
      }

      const response = await this.axiosInstance.post<T>(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });

      return this.handleAxiosResponse<T>(response);
    } catch (error) {
      return this.handleAxiosError(error);
    }
  }
  // Utility method for canceling requests
  createCancelToken() {
    return axios.CancelToken.source();
  }

  // Check if error is a cancel error
  isCancel(error: unknown): boolean {
    return axios.isCancel(error);
  }

  // Get base URL
  getBaseURL(): string {
    return this.axiosInstance.defaults.baseURL || "";
  }

  // Update base URL
  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  // Set timeout
  setTimeout(timeout: number): void {
    this.axiosInstance.defaults.timeout = timeout;
  }

  // Add custom header
  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  // Remove custom header
  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }
}

// Create and export default instance
export const apiClient = new ApiClient();

// Export axios for direct use if needed
export { axios };
