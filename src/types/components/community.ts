/* ===================================
 * COMMUNITY COMPONENT PROPS
 * ================================= */

import type {
  Post,
  Comment,
  CommunityMember,
  CommunityGroup,
} from "../domains/community";
import type { BaseComponentProps } from "./common";

export interface CommunityFeedProps extends BaseComponentProps {
  posts: Post[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onLikePost?: (postId: string | number) => void;
  onCommentPost?: (postId: string | number, comment: string) => void;
  onSharePost?: (postId: string | number) => void;
  onBookmarkPost?: (postId: string | number) => void;
}

export interface CommunityHeroSectionProps extends BaseComponentProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  memberCount: number;
  postsCount: number;
  onJoinCommunity?: () => void;
  onCreatePost?: () => void;
}

export interface CommunitySidebarProps extends BaseComponentProps {
  recentMembers: CommunityMember[];
  popularGroups: CommunityGroup[];
  trendingTopics: string[];
  onViewAllMembers?: () => void;
  onViewAllGroups?: () => void;
  onTopicClick?: (topic: string) => void;
}

export interface PostCardProps extends BaseComponentProps {
  post: Post;
  onLike?: (postId: string | number) => void;
  onComment?: (postId: string | number, comment: string) => void;
  onShare?: (postId: string | number) => void;
  onBookmark?: (postId: string | number) => void;
  onViewProfile?: (userId: string) => void;
  showFullContent?: boolean;
}

export interface CommentSectionProps extends BaseComponentProps {
  comments: Comment[];
  postId: string | number;
  isLoading?: boolean;
  onAddComment?: (comment: string) => void;
  onLikeComment?: (commentId: string | number) => void;
  onReplyComment?: (commentId: string | number, reply: string) => void;
  canComment?: boolean;
}
