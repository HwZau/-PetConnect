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
  postId: string; // Backend uses postId, not id
  title: string; // Backend includes title
  author: PostAuthor | null;
  content: string;
  imageUrl?: string;
  images?: string[];
  timestamp?: string; // Optional: backend may not include this
  likes?: number; // Optional: backend may not include this
  comments?: ServiceComment[]; // Optional
  shares?: number; // Optional: backend may not include this
  views?: number; // Optional: backend may not include this
  liked?: boolean;
  postStatus: number; // Backend includes postStatus
  postCategory: number; // Backend includes postCategory
  staffId?: string; // Optional
}

// New API create payload shape (matches backend CreatePostRequest)
export interface CreatePostApiPayload {
  title: string;
  content: string;
  imageUrl?: string;
  // match backend request DTO property names: status and category (enum numbers)
  status: number; // PostStatus enum (0 = waiting for approval)
  category: number; // PostCategory enum
  // NOTE: staffId is NOT included - backend sets it server-side from JWT token
}

// API response shape
export interface PostApiResponse {
  // backend CreatePostResponse uses PostId/PostStatus/PostCategory names (server-side C#),
  // but JSON is typically camelCase (postId/postStatus/postCategory). Accept both shapes.
  _id?: string; // MongoDB ID
  id?: string; // some clients expect `id`
  postId?: string;
  PostId?: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  postStatus?: number;
  PostStatus?: number;
  postCategory?: number;
  PostCategory?: number;
  staffId?: string;
  authorId?: string;
  author?: PostAuthor;
  timestamp?: string;
  likes?: number;
  comments?: ServiceComment[];
  shares?: number;
  views?: number;
}

export const postService = {
  async listPosts(): Promise<ApiResponse<Post[]>> {
    return apiClient.get<Post[]>(API_ENDPOINTS.COMMUNITY.POSTS);
  },

  // Accept API-shaped payload
  async createPost(data: CreatePostApiPayload): Promise<ApiResponse<PostApiResponse>> {
    return apiClient.post<PostApiResponse>(API_ENDPOINTS.COMMUNITY.CREATE_POST, data);
  },

  async createPostAdmin(data: CreatePostApiPayload): Promise<ApiResponse<PostApiResponse>> {
    // Admin endpoint is /post/admin on the API
    const adminPath = `${API_ENDPOINTS.COMMUNITY.CREATE_POST}/admin`;
    return apiClient.post<PostApiResponse>(adminPath, data);
  },

  async getPost(id: string | number): Promise<ApiResponse<Post>> {
    return apiClient.get<Post>(API_ENDPOINTS.COMMUNITY.POST_DETAIL(String(id)));
  },

  async updatePost(id: string | number, data: Partial<CreatePostApiPayload>): Promise<ApiResponse<PostApiResponse>> {
    return apiClient.put<PostApiResponse>(API_ENDPOINTS.COMMUNITY.UPDATE_POST(String(id)), data);
  },

  async deletePost(id: string | number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.COMMUNITY.DELETE_POST(String(id)));
  },
};

export default postService;