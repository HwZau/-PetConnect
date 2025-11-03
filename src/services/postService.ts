import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../config/api";
import type { ApiResponse } from "../types";

export interface PostAuthor {
  name: string;
  avatar?: string;
  isVerified?: boolean;
  title?: string;
}

export interface ServiceComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  postId?: string; // Reference to parent post
}

export interface Post {
  id: string; // Using only string for consistency
  author: PostAuthor | null;
  content: string;
  imageUrl?: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: ServiceComment[]; // Making it required with empty array as default
  shares: number;
  views: number;
  liked?: boolean;
  postStatus?: number;
  postCategory?: number;
  staffId?: string;
}

// New API create payload shape
export interface CreatePostApiPayload {
  title: string;
  content: string;
  imageUrl?: string;
  postStatus: number;
  postCategory: number;
  staffId: string;
}

// API response shape
export interface PostApiResponse {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  postStatus: number;
  postCategory: number;
  staffId: string;
  author?: PostAuthor;
  timestamp?: string;
  likes?: number;
  comments?: ServiceComment[];
  shares?: number;
  views?: number;
}

const BASE_URL = "https://localhost:7020";
const ENDPOINT = API_ENDPOINTS.COMMUNITY.POSTS;

export const postService = {
  async listPosts(): Promise<ApiResponse<Post[]>> {
    return apiClient.get<Post[]>(ENDPOINT, undefined, {
      baseURL: BASE_URL
    });
  },

  // Accept API-shaped payload
  async createPost(data: CreatePostApiPayload): Promise<ApiResponse<PostApiResponse>> {
    return apiClient.post<PostApiResponse>(API_ENDPOINTS.COMMUNITY.CREATE_POST, data, {
      baseURL: BASE_URL
    });
  },

  async getPost(id: string | number): Promise<ApiResponse<Post>> {
    return apiClient.get<Post>(API_ENDPOINTS.COMMUNITY.POST_DETAIL(String(id)), undefined, {
      baseURL: BASE_URL
    });
  },

  async updatePost(id: string | number, data: Partial<CreatePostApiPayload>): Promise<ApiResponse<Post>> {
    return apiClient.put<Post>(API_ENDPOINTS.COMMUNITY.UPDATE_POST(String(id)), data, {
      baseURL: BASE_URL
    });
  },

  async deletePost(id: string | number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.COMMUNITY.DELETE_POST(String(id)), {
      baseURL: BASE_URL
    });
  },
};

export default postService;