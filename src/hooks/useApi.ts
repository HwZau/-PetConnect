import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../services/apiClient";
import type { ApiResponse } from "../types";

interface UseApiOptions<T = unknown> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = unknown>(
  endpoint: string,
  options: UseApiOptions<T> = {}
) {
  const { immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (
      method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
      data?: unknown,
      params?: Record<string, unknown>
    ): Promise<ApiResponse<T>> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let response: ApiResponse<T>;

        switch (method) {
          case "GET":
            response = await apiClient.get<T>(endpoint, params);
            break;
          case "POST":
            response = await apiClient.post<T>(endpoint, data);
            break;
          case "PUT":
            response = await apiClient.put<T>(endpoint, data);
            break;
          case "DELETE":
            response = await apiClient.delete<T>(endpoint);
            break;
          case "PATCH":
            response = await apiClient.patch<T>(endpoint, data);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        if (response.success) {
          setState({
            data: response.data || null,
            loading: false,
            error: null,
          });
          if (response.data !== undefined) {
            onSuccess?.(response.data);
          }
        } else {
          setState({
            data: null,
            loading: false,
            error: response.error || null,
          });
          if (response.error) {
            onError?.(response.error);
          }
        }

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        onError?.(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [endpoint, onSuccess, onError]
  );

  // Auto-execute GET request on mount if immediate is true
  useEffect(() => {
    if (immediate) {
      execute("GET");
    }
  }, [execute, immediate]);

  // Convenience methods
  const get = useCallback(
    (params?: Record<string, unknown>) => execute("GET", undefined, params),
    [execute]
  );

  const post = useCallback(
    (data?: unknown) => execute("POST", data),
    [execute]
  );

  const put = useCallback((data?: unknown) => execute("PUT", data), [execute]);

  const patch = useCallback(
    (data?: unknown) => execute("PATCH", data),
    [execute]
  );

  const del = useCallback(() => execute("DELETE"), [execute]);

  const refetch = useCallback(() => execute("GET"), [execute]);

  return {
    ...state,
    execute,
    get,
    post,
    put,
    patch,
    delete: del,
    refetch,
  };
}

// Hook for file uploads
export function useFileUpload<T = unknown>(endpoint: string) {
  const [state, setState] = useState<UseApiState<T> & { progress: number }>({
    data: null,
    loading: false,
    error: null,
    progress: 0,
  });

  const upload = useCallback(
    async (
      file: File,
      additionalData?: Record<string, unknown>
    ): Promise<ApiResponse<T>> => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        progress: 0,
      }));

      try {
        const response = await apiClient.uploadFile<T>(
          endpoint,
          file,
          additionalData,
          (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setState((prev) => ({ ...prev, progress }));
          }
        );

        if (response.success) {
          setState({
            data: response.data || null,
            loading: false,
            error: null,
            progress: 100,
          });
        } else {
          setState({
            data: null,
            loading: false,
            error: response.error || null,
            progress: 0,
          });
        }

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          progress: 0,
        });

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [endpoint]
  );

  return {
    ...state,
    upload,
  };
}
