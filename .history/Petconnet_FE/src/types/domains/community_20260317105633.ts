/* ===================================
 * COMMUNITY DOMAIN INTERFACES
 * ================================= */

export interface Comment {
  id: number | string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Post {
  id?: number | string;
  _id?: string;
  authorId?: string;
  author?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  authorName?: string;
  authorAvatar?: string;
  content: string;
  posts?: Post[];
  imageUrls?: string[];
  createdAt?: Date | string;
  likes: number;
  commentsCount?: number;
  sharesCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  comments?: Comment[];
  tags?: string[];
  category?: string;
}

export interface PostApiResponse {
  _id: string;
  author: {
    _id: string;
    name: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  commentsCount: number;
  imageUrls?: string[];
}

export interface CommunityMember {
  id: string;
  name: string;
  avatar?: string;
  role: "member" | "moderator" | "admin";
  joinedAt: Date;
  postsCount: number;
  reputation?: number;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  memberCount: number;
  postsCount: number;
  isPrivate: boolean;
  createdAt: Date;
  category?: string;
}
