import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { PostCategory } from "../../types/domains/PostCategory";
import CommunityHeroSection from "../../components/community/CommunityHeroSection";
import { FaPaw } from "react-icons/fa";
import { FiPlay } from "react-icons/fi";
import CommunityFeed from "../../components/community/CommunityFeed";
import CommunitySidebar from "../../components/community/CommunitySidebar";
import Footer from "../../components/common/Footer";
import { useScrollToTop } from "../../hooks";
import postService from "../../services/postService";
import type { ApiResponse } from "../../types";
import type { PostApiResponse as ApiPost } from "../../services/postService";
import useAuth from "../../hooks/useAuth";
import { showSuccess, showError } from "../../utils/toastUtils";
import { isStaffRole } from "../../utils/authUtils";

/**
 * Lưu ý: định nghĩa kiểu Post và Comment ở đây phải trùng với
 * kiểu mà CommunityFeed.tsx đang dùng.
 */
import type { Post as FeedPost, Comment as FeedComment } from "../../components/community/CommunityFeed";
import type { CreatePostApiPayload } from "../../services/postService";

// Module-level cache/promise to dedupe network calls across mounts/StrictMode
// Use flexible any[] for cached raw posts because backend/FE shapes vary
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let postsPromise: Promise<ApiResponse<any[]>> | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let postsCache: any[] | null = null;

// helper to read flexible fields from API response objects
const readField = (obj: Record<string, unknown> | null | undefined, keys: string[]) => {
  if (!obj) return undefined;
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
};

type Comment = FeedComment;
// IMPORTANT: allow id to be string | number
type Post = FeedPost;

// Fallback sample posts used when backend and cache are unavailable
const FALLBACK_POSTS: Post[] = [
  {
    id: "fallback-1",
    author: { name: "Pet Connect Community", avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png", isVerified: true, title: "Pet Connect" },
    content: "Hệ thống đang gặp sự cố tạm thời. Đây là nội dung mẫu để bạn có thể tiếp tục tương tác.",
    images: [],
    timestamp: new Date().toISOString(),
    likes: 0,
    comments: [],
    shares: 0,
    views: 0,
    liked: false,
  },
];

const CommunityPage: React.FC = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  const { isAuthenticated, user } = useAuth();

  // Fetch posts from backend (API_ENDPOINTS.COMMUNITY.POSTS)
  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  const [loadError, setLoadError] = useState(false);

    useEffect(() => {
    const load = async () => {
      // Only load posts if user is authenticated
      if (!isAuthenticated) {
        console.log("[CommunityPage.load] User not authenticated, skipping posts load");
        return;
      }
      
      setLoadError(false);
      try {
        // If we've already cached the raw posts, use them immediately
        if (postsCache) {
          const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
          const normalized = postsCache.map((p, index: number) => {
            const pr = p as unknown as Record<string, unknown>;
            // Ensure unique ID - prefer _id, then other fields, fallback to temp ID
            const rawId = p._id || readField(pr, ["postId", "id", "PostId"]);
            const id = rawId ? String(rawId) : `cached-post-${Date.now()}-${index}`;
            const authorRec = readField(pr, ["author"]) as Record<string, unknown> | undefined;
            return {
              id,
              author: (authorRec && typeof authorRec === 'object') ? {
                name: String(authorRec['name'] ?? 'Người dùng'),
                avatar: String(authorRec['avatar'] ?? defaultAvatar),
                isVerified: Boolean(authorRec['isVerified'] ?? false),
                title: String(authorRec['title'] ?? 'Thành viên Pet Connect')
              } : { name: 'Người dùng', avatar: defaultAvatar, isVerified: false, title: 'Thành viên Pet Connect' },
              content: String(pr['content'] ?? ''),
              images: pr['imageUrl'] ? [String(pr['imageUrl'])] : [],
              timestamp: String(pr['timestamp'] ?? new Date().toISOString()),
              likes: Number(pr['likes'] ?? 0),
              comments: [],
              shares: Number(pr['shares'] ?? 0),
              views: Number(pr['views'] ?? 0),
              liked: false,
              postStatus: pr['postStatus'] ?? pr['PostStatus'],
              postCategory: pr['postCategory'] ?? pr['PostCategory'] ?? pr['category'],
              staffId: pr['staffId'] as string | undefined
            } as Post;
          });
          setPosts(normalized);
          return;
        }

        // Reuse an ongoing fetch if present
        if (!postsPromise) postsPromise = postService.listPosts();
        const res = await postsPromise;
        postsPromise = null;

        if (!mountedRef.current) return;

        if (res.success && res.data) {
          // cache raw data and persist to localStorage
          postsCache = res.data?.posts ?? [];
          try { localStorage.setItem('communityPosts', JSON.stringify(res.data?.posts)); } catch (e) { console.warn('Failed to persist communityPosts', e); }

          const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
          const normalized = (res.data?.posts ?? []).map((p, index) => {
            const pr = p as unknown as Record<string, unknown>;
            // Ensure unique ID - prefer _id, then other fields, fallback to temp ID
            const rawId = p._id || readField(pr, ["postId", "id", "PostId"]);
            const id = rawId ? String(rawId) : `post-${Date.now()}-${index}`;
            const authorRec = readField(pr, ["author"]) as Record<string, unknown> | undefined;
            return {
              id,
              author: (authorRec && typeof authorRec === 'object') ? {
                name: String(authorRec['name'] ?? 'Người dùng'),
                avatar: String(authorRec['avatar'] ?? defaultAvatar),
                isVerified: Boolean(authorRec['isVerified'] ?? false),
                title: String(authorRec['title'] ?? 'Thành viên Pawnet')
              } : { name: 'Người dùng', avatar: defaultAvatar, isVerified: false, title: 'Thành viên Pawnet' },
              authorId: String((p as any).author?.id || (p as any).authorId || ''),
              content: String(pr['content'] ?? ''),
              images: pr['imageUrl'] ? [String(pr['imageUrl'])] : [],
              timestamp: String(pr['timestamp'] ?? new Date().toISOString()),
              likes: Number(pr['likes'] ?? 0),
                  comments: Array.isArray(pr['comments']) ? (pr['comments'] as unknown[]).map((c: unknown, index) => {
                    const cr = c as Record<string, unknown>;
                    return {
                      id: cr?.['id'] ? `comment-${String(pr['id'])}-${String(cr['id'])}` : `comment-${String(pr['id'])}-${index}`,
                      author: String(cr?.['author'] ?? 'Người dùng'),
                      content: String(cr?.['content'] ?? ''),
                      timestamp: String(cr?.['timestamp'] ?? 'Vừa xong')
                    };
                  }) : [],
              shares: Number(pr['shares'] ?? 0),
              views: Number(pr['views'] ?? 0),
              liked: false,
              postStatus: pr['postStatus'] ?? pr['PostStatus'],
              postCategory: pr['postCategory'] ?? pr['PostCategory'] ?? pr['category'],
              staffId: pr['staffId'] as string | undefined
            } as Post;
          });
          setPosts(normalized);
        } else {
          console.error("Failed to fetch posts:", res.error || "Unknown error");

          if (retryCountRef.current < maxRetries) {
            retryCountRef.current++;
            setTimeout(load, retryDelay);
            return;
          }

          // final attempt failed -> try persisted cache or fallback
          if (mountedRef.current) {
            setLoadError(true);
            showError("Máy chủ tạm thời không khả dụng. Hiển thị nội dung tạm thời.");
            let cachedRaw: ApiPost[] | null = null;
            try { cachedRaw = JSON.parse(localStorage.getItem('communityPosts') || 'null') as ApiPost[]; } catch { cachedRaw = null; }
            if (cachedRaw && Array.isArray(cachedRaw)) {
              postsCache = cachedRaw;
              const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
              const normalized = cachedRaw.map((p) => {
                const pr = p as unknown as Record<string, unknown>;
                const id = String(readField(pr, ["postId", "id", "PostId"]) ?? "");
                const authorRec = readField(pr, ["author"]) as Record<string, unknown> | undefined;
                return {
                  id,
                  author: (authorRec && typeof authorRec === 'object') ? {
                    name: String(authorRec['name'] ?? 'Người dùng'),
                    avatar: String(authorRec['avatar'] ?? defaultAvatar),
                    isVerified: Boolean(authorRec['isVerified'] ?? false),
                    title: String(authorRec['title'] ?? 'Thành viên Pet Connect')
                  } : { name: 'Người dùng', avatar: defaultAvatar, isVerified: false, title: 'Thành viên Pet Connect' },
                  content: String(pr['content'] ?? ''),
                  images: pr['imageUrl'] ? [String(pr['imageUrl'])] : [],
                  timestamp: String(pr['timestamp'] ?? new Date().toISOString()),
                  likes: Number(pr['likes'] ?? 0),
                  comments: [],
                  shares: Number(pr['shares'] ?? 0),
                  views: Number(pr['views'] ?? 0),
                  liked: false,
                } as Post;
              });
              setPosts(normalized);
            } else {
              setPosts(FALLBACK_POSTS);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch posts", err);
        if (retryCountRef.current < maxRetries && mountedRef.current) {
          retryCountRef.current++;
          setTimeout(load, retryDelay);
        } else if (mountedRef.current) {
          setLoadError(true);
          showError("Máy chủ tạm thời không khả dụng. Hiển thị nội dung tạm thời.");
          let cachedRaw: ApiPost[] | null = null;
          try { cachedRaw = JSON.parse(localStorage.getItem('communityPosts') || 'null') as ApiPost[]; } catch { cachedRaw = null; }
          if (cachedRaw && Array.isArray(cachedRaw)) {
            postsCache = cachedRaw;
            const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
            const normalized = cachedRaw.map((p) => {
              const pr = p as unknown as Record<string, unknown>;
              const id = String(readField(pr, ["postId", "id", "PostId"]) ?? "");
              const authorRec = readField(pr, ["author"]) as Record<string, unknown> | undefined;
              return {
                id,
                author: (authorRec && typeof authorRec === 'object') ? {
                  name: String(authorRec['name'] ?? 'Người dùng'),
                  avatar: String(authorRec['avatar'] ?? defaultAvatar),
                  isVerified: Boolean(authorRec['isVerified'] ?? false),
                  title: String(authorRec['title'] ?? 'Thành viên Pawnet')
                } : { name: 'Người dùng', avatar: defaultAvatar, isVerified: false, title: 'Thành viên Pawnet' },
                authorId: String((p as any).author?.id || (p as any).authorId || ''),
                content: String(pr['content'] ?? ''),
                images: pr['imageUrl'] ? [String(pr['imageUrl'])] : [],
                timestamp: String(pr['timestamp'] ?? new Date().toISOString()),
                likes: Number(pr['likes'] ?? 0),
                comments: [],
                shares: Number(pr['shares'] ?? 0),
                views: Number(pr['views'] ?? 0),
                liked: false,
              } as Post;
            });
            setPosts(normalized);
          } else {
            setPosts(FALLBACK_POSTS);
          }
        }
      }
    };

    // initialize mounted ref and start load
    mountedRef.current = true;
    retryCountRef.current = 0;
    load();

    return () => {
      mountedRef.current = false;
    };
    }, [isAuthenticated]);

  // Expose manual retry to UI
  const handleRetry = () => {
    retryCountRef.current = 0;
    postsPromise = null;
    setLoadError(false);
    // call load again
    // simpler: just reload page-level data by calling the effect's load indirectly via setting postsCache to null and calling postService
    postsCache = null;
    // call the same load logic by setting a microtask
    setTimeout(() => {
      // call the useEffect load via dispatching a synthetic update: re-run fetch
      // We'll just call postService directly and then set posts (mirror load behavior)
      ;(async () => {
        try {
          const res = await postService.listPosts();
          if (res.success && res.data) {
            postsCache = res.data?.posts ?? [];
            try { localStorage.setItem('communityPosts', JSON.stringify(res.data?.posts)); } catch (e) { console.warn('Failed to persist communityPosts', e); }
            const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
            const normalized = (res.data?.posts ?? []).map((p, index) => {
              const pr = p as unknown as Record<string, unknown>;
              const id = String(p._id || readField(pr, ["postId", "id", "PostId"]) || `temp-${index}`);
              const authorRec = readField(pr, ["author"]) as Record<string, unknown> | undefined;
              return {
                id,
                author: (authorRec && typeof authorRec === 'object') ? {
                  name: String(authorRec['name'] ?? 'Người dùng'),
                  avatar: String(authorRec['avatar'] ?? defaultAvatar),
                  isVerified: Boolean(authorRec['isVerified'] ?? false),
                  title: String(authorRec['title'] ?? 'Thành viên Pawnet')
                } : { name: 'Người dùng', avatar: defaultAvatar, isVerified: false, title: 'Thành viên Pawnet' },
                authorId: String((p as any).author?.id || (p as any).authorId || ''),
                content: String(pr['content'] ?? ''),
                images: pr['imageUrl'] ? [String(pr['imageUrl'])] : [],
                timestamp: String(pr['timestamp'] ?? new Date().toISOString()),
                likes: Number(pr['likes'] ?? 0),
                comments: [],
                shares: Number(pr['shares'] ?? 0),
                views: Number(pr['views'] ?? 0),
                liked: false,
              } as Post;
            });
            setPosts(normalized);
            setLoadError(false);
            // try to sync any queued posts
            void trySyncOutbox();
          } else {
            setLoadError(true);
          }
        } catch {
          setLoadError(true);
        }
      })();
    }, 0);
  };

  // Clear outbox on component mount (handles old outbox items with invalid structure)
  useEffect(() => {
    try {
      localStorage.removeItem("communityOutbox");
      console.log("[DEBUG] Cleared old outbox items on mount");
    } catch (e) {
      console.warn("[DEBUG] Failed to clear outbox:", e);
    }
  }, []);

  // Helper: validate GUID strings (8-4-4-4-12 hex format, no version/variant restrictions)
  const isValidGuid = (id?: string | null) => {
    if (!id) return false;
    // Accept MongoDB ObjectId format: 24 hex digits
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  // DEBUG: Log authentication state
  React.useEffect(() => {
    console.log("CommunityPage: isAuthenticated =", isAuthenticated);
  }, [isAuthenticated]);

  // DEBUG: Track CommunityPage render
  React.useEffect(() => {
    console.log("🟣 CommunityPage component mounted/rendered");
    return () => {
      console.log("🟣 CommunityPage component unmounted");
    };
  }, []);

  // Outbox: store pending posts when backend is down
  type OutboxItem = {
    tempId: string;
    payload: CreatePostApiPayload;
    authorName?: string;
    timestamp?: string;
  };

  const addToOutbox = (item: OutboxItem) => {
    try {
      const raw = localStorage.getItem("communityOutbox");
      const arr: OutboxItem[] = raw ? JSON.parse(raw) : [];
      arr.push(item);
      localStorage.setItem("communityOutbox", JSON.stringify(arr));
    } catch (e) {
      console.warn("Failed to save outbox item", e);
    }
  };

  const trySyncOutbox = async () => {
    try {
      const raw = localStorage.getItem("communityOutbox");
      const arr: OutboxItem[] = raw ? JSON.parse(raw) : [];
      if (!arr || arr.length === 0) return;

      // attempt to send each item sequentially
      for (const item of arr.slice()) {
        try {
          const res = await postService.createPost(item.payload);
          if (res.success && res.data) {
            const sp = res.data;
            const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
            const serverPost: Post = {
              id: String(sp.postId ?? sp.id ?? sp.PostId ?? ""),
              author: {
                name: item.authorName ?? 'Người dùng',
                avatar: sp.author?.avatar ?? defaultAvatar,
                isVerified: sp.author?.isVerified ?? false,
                title: sp.author?.title ?? 'Thành viên Pawnet'
              },
              content: String(sp.content ?? ""),
              images: sp.imageUrl ? [String(sp.imageUrl)] : [],
              timestamp: String(sp.timestamp ?? item.timestamp ?? new Date().toISOString()),
              likes: Number(sp.likes ?? 0),
              comments: [],
              shares: Number(sp.shares ?? 0),
              views: Number(sp.views ?? 0),
              liked: false,
            };

            // replace temp post in UI
            setPosts((prev) => prev.map((p) => (p.id === item.tempId ? serverPost : p)));

            // remove item from outbox
            const remaining = (JSON.parse(localStorage.getItem("communityOutbox") || '[]') as OutboxItem[]).filter(x => x.tempId !== item.tempId);
            localStorage.setItem("communityOutbox", JSON.stringify(remaining));
          }
        } catch (e) {
          // stop syncing on first failure to avoid rapid retries
          console.warn("Outbox sync failed for item", item.tempId, e);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to sync outbox", e);
    }
  };



  // Delete post handler
  const handleDeletePost = async (postId: string | number) => {
    try {
      const res = await postService.deletePost(postId);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        showSuccess("Bài viết đã được xóa");
        // Update localStorage cache
        postsCache = postsCache?.filter((p) => String(p.postId ?? p.id ?? p.PostId ?? "") !== String(postId)) ?? null;
        if (postsCache) {
          try { localStorage.setItem('communityPosts', JSON.stringify(postsCache)); } catch (e) { console.warn('Failed to update cache', e); }
        }
      } else {
        showError(res.error || "Xóa bài thất bại");
      }
    } catch (err) {
      console.error("Delete post failed", err);
      showError("Xóa bài thất bại");
    }
  };

  // Update post handler
  const handleUpdatePost = async (postId: string | number, data: Partial<CreatePostApiPayload>) => {
    try {
      const res = await postService.updatePost(postId, data);
      if (res.success && res.data) {
        const sp = res.data;
        const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
        const updatedPost: Post = {
          id: String(sp._id ?? sp.postId ?? sp.id ?? sp.PostId ?? ""),
          author: {
            name: posts.find((p) => String(p.id) === String(postId))?.author.name || 'Người dùng',
            avatar: sp.author?.avatar ?? defaultAvatar,
            isVerified: sp.author?.isVerified ?? false,
            title: sp.author?.title ?? "Thành viên Pawnet"
          },
          authorId: String(sp.authorId || posts.find((p) => String(p.id) === String(postId))?.authorId || ''),
          content: String(sp.content ?? ""),
          images: sp.imageUrl ? [String(sp.imageUrl)] : [],
          timestamp: String(sp.timestamp ?? new Date().toISOString()),
          likes: Number(sp.likes ?? 0),
          comments: [],
          shares: Number(sp.shares ?? 0),
          views: Number(sp.views ?? 0),
          liked: false,
        };
        setPosts((prev) => prev.map((p) => (String(p.id) === String(postId) ? updatedPost : p)));
        showSuccess("Bài viết đã được cập nhật");
        // Update cache
        if (postsCache) {
          postsCache = postsCache.map((p) => String(p.postId ?? p.id ?? p.PostId ?? "") === String(postId) ? sp : p);
          try { localStorage.setItem('communityPosts', JSON.stringify(postsCache)); } catch (e) { console.warn('Failed to update cache', e); }
        }
      } else {
        showError(res.error || "Cập nhật bài thất bại");
      }
    } catch (err) {
      console.error("Update post failed", err);
      showError("Cập nhật bài thất bại");
    }
  };

  // newPost: author/caption/image from UI -> translate to API shape
  const handleAddPost = async (newPost: { author: string; title: string; caption: string; image?: string; category: PostCategory }) => {
    if (!isAuthenticated) {
      showError("Vui lòng đăng nhập để đăng bài");
      return;
    }

    // Local payload for UI
    const payloadForUI = {
      author: { name: user?.name || 'Người dùng', avatar: user?.avatarUrl || "https://cdn-icons-png.flaticon.com/512/847/847969.png", isVerified: false, title: "Thành viên Pawnet" },
      content: newPost.caption,
      images: newPost.image ? [newPost.image] : [],
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [] as Comment[],
      shares: 0,
      views: 0,
      liked: false,
    };

    // optimistic add with string temp id
    const tempId = `temp-${Date.now()}`;
    const tempPost: Post = {
      id: tempId,
      author: payloadForUI.author,
      authorId: user?.id || '',
      content: payloadForUI.content,
      images: payloadForUI.images,
      timestamp: payloadForUI.timestamp,
      likes: payloadForUI.likes,
      comments: payloadForUI.comments,
      shares: payloadForUI.shares,
      views: payloadForUI.views,
      liked: payloadForUI.liked,
    };
    setPosts((prev) => [tempPost, ...prev]);

    // Build API payload
    // Generate unique title: use provided title + timestamp to avoid unique constraint violation
    const uniqueTitle = `${(newPost.title?.trim() || "Post").slice(0, 80)} #${Date.now()}`;
    const apiPayload: CreatePostApiPayload = {
      title: uniqueTitle,
      content: newPost.caption,
      imageUrl: newPost.image ?? "",
      // backend expects `status` and `category` (enum numbers)
      // status 0 = waiting for approval (chờ duyệt)
      status: 0,
      category: newPost.category,
      // NOTE: staffId is NOT sent to backend - server will set it from JWT token via GetCurrentUserId()
    };

    try {
      // Use user.id from login (which includes JWT-decoded id for Staff/Admin)
      // For Staff users, refreshUser() would call getProfile() which may fail,
      // so we trust the id from initial login which was already validated
      const serverUserId: string | undefined = user?.id;
      console.log("[DEBUG] Using user.id from auth context:", serverUserId);
      console.log("[DEBUG] isValidGuid check:", isValidGuid(serverUserId));
      
      // Validate serverUserId is present and a valid GUID format before calling backend
      if (!serverUserId || !isValidGuid(serverUserId)) {
        console.error("[DEBUG] Invalid serverUserId:", serverUserId);
        // Remove temp post from optimistic UI
        setPosts((prev) => prev.filter((p) => p.id !== tempId));
        showError("Tài khoản không hợp lệ. Vui lòng đăng nhập lại.");
        return;
      }

      // NOTE: staffId is NOT added to payload - backend will set it from JWT token

      // If backend previously failed, save to outbox instead of posting now
      if (loadError) {
        addToOutbox({ tempId, payload: apiPayload, authorName: newPost.author, timestamp: payloadForUI.timestamp });
        showSuccess("Bài viết đã được lưu tạm thời và sẽ được gửi khi máy chủ khả dụng.");
        return;
      }

      // Log payload for debugging (will show in browser console)
      console.log("Posting to API - payload:", apiPayload);

      const res = await postService.createPost(apiPayload);
      if (res.success && res.data) {
        const sp = res.data;
        const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
        const serverPost: Post = {
          // backend may return `postId` (or camelCase `postId`) or `id`; support both
          id: String(sp._id ?? sp.postId ?? sp.id ?? sp.PostId ?? `server-post-${Date.now()}`),
          author: { 
            name: user?.name || 'Người dùng',
            avatar: sp.author?.avatar ?? defaultAvatar,
            isVerified: sp.author?.isVerified ?? false,
            title: sp.author?.title ?? "Thành viên Pawnet"
          },
          authorId: user?.id || '',
          content: String(sp.content ?? ""),
          images: sp.imageUrl ? [String(sp.imageUrl)] : [],
          timestamp: String(sp.timestamp ?? new Date().toISOString()),
          likes: Number(sp.likes ?? 0),
          comments: [],
          shares: Number(sp.shares ?? 0),
          views: Number(sp.views ?? 0),
          liked: false,
        };
        setPosts((prev) => [serverPost, ...prev.filter((p) => p.id !== tempId)]);
        showSuccess("Đã đăng bài");
        // DO NOT call trySyncOutbox() here - only outbox items get synced during app startup
        // The current post was successful, so no need to retry
      } else {
        // Save to outbox when server rejects or returns an error
        addToOutbox({ tempId, payload: apiPayload, authorName: newPost.author, timestamp: payloadForUI.timestamp });
        showError(res.error || res.message || "Tạo bài thất bại, bài viết đã được lưu tạm thời.");
      }
    } catch (err) {
      console.error("create post failed", err);
      // network or unexpected error, save to outbox
      addToOutbox({ tempId, payload: apiPayload, authorName: newPost.author, timestamp: payloadForUI.timestamp });

      // If server returned 500 with FK error, show a clearer message
      // Try to detect Postgres FK error text in error.message
      const errMsg = String((err as { message?: string })?.message || String(err));
      if (errMsg && /FK_Post_Users_staff_id|23503/i.test(errMsg)) {
        showError("Lỗi máy chủ: staff_id không hợp lệ. Bài viết đã được lưu tạm thời.");
      } else {
        showError("Tạo bài thất bại (network), bài viết đã được lưu tạm thời.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <CommunityHeroSection />

      {/* Page-level hero/title inserted between CommunityHeroSection and feed */}
      <div className="text-center mt-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Pet Freelancer Community</h1>
        <p className="mt-2 text-sm md:text-base text-gray-500 max-w-2xl mx-auto">Kết nối với người trông thú cưng, người đặt thú cưng, người huấn luyện và những người nuôi thú cưng khác</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
            <FaPaw className="w-4 h-4" />
            <span>Tìm dịch vụ</span>
          </button>
          <button className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium">
            <FiPlay className="w-4 h-4" />
            <span>Xem những câu chuyện thành công</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loadError && (
          <div className="mb-4 p-4 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 flex items-center justify-between">
            <div>
              <strong>Máy chủ tạm thời không khả dụng.</strong>
              <div className="text-sm">Bạn có thể thử lại hoặc tiếp tục với nội dung lưu trữ.</div>
            </div>
            <div>
              <button onClick={handleRetry} className="px-3 py-1 bg-yellow-600 text-white rounded">Thử lại</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <CommunityFeed
              posts={posts}
              onAddPost={handleAddPost}
              onDeletePost={handleDeletePost}
              onUpdatePost={handleUpdatePost}
              isAuthenticated={isAuthenticated}
              onLoginNavigate={() => navigate("/login")}
              currentUserId={user?.id}
              userRole={(user as unknown as Record<string, unknown>)?.role as string | undefined}
              user={user}
            />
          </div>
          <div className="lg:col-span-1">
            <CommunitySidebar  />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommunityPage;