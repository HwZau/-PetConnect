import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../config/api";
import type { ApiResponse } from "../types";

// Minimal Post types for the service. Components can keep their own richer types.
export interface PostAuthor {
  name: string;
  avatar?: string;
  isVerified?: boolean;
  title?: string;
}

export interface ServiceComment {
  id: number | string;
  author: string;
  content: string;
  timestamp?: string;
}

export interface Post {
  id: number | string;
  author: PostAuthor | null;
  content: string;
  images?: string[];
  timestamp?: string;
  likes: number;
  comments?: ServiceComment[];
  shares: number;
  views: number;
  liked?: boolean;
}

const ENDPOINT = API_ENDPOINTS.COMMUNITY.POSTS;

export const postService = {
  async listPosts(): Promise<ApiResponse<Post[]>> {
    return apiClient.get<Post[]>(ENDPOINT);
  },

  async createPost(data: Partial<Post>): Promise<ApiResponse<Post>> {
    return apiClient.post<Post>(API_ENDPOINTS.COMMUNITY.CREATE_POST, data);
  },

  async getPost(id: string | number): Promise<ApiResponse<Post>> {
    return apiClient.get<Post>(API_ENDPOINTS.COMMUNITY.POST_DETAIL(String(id)));
  },

  async updatePost(id: string | number, data: Partial<Post>): Promise<ApiResponse<Post>> {
    return apiClient.put<Post>(API_ENDPOINTS.COMMUNITY.UPDATE_POST(String(id)), data);
  },

  async deletePost(id: string | number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.COMMUNITY.DELETE_POST(String(id)));
  },
};

export default postService;
