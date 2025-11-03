import React, { useState, useEffect } from "react";
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
import useAuth from "../../hooks/useAuth";
import { showSuccess, showError } from "../../utils/toastUtils";

/**
 * Lưu ý: định nghĩa kiểu Post và Comment ở đây phải trùng với
 * kiểu mà CommunityFeed.tsx đang dùng.
 */
import type { Post as FeedPost, Comment as FeedComment } from "../../components/community/CommunityFeed";
import type { CreatePostApiPayload } from "../../services/postService";


type Comment = FeedComment;
// IMPORTANT: allow id to be string | number
type Post = FeedPost;

const CommunityPage: React.FC = () => {
  useScrollToTop();
  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch posts from backend (API_ENDPOINTS.COMMUNITY.POSTS)
  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    const load = async () => {
      try {
        const res = await postService.listPosts();

        if (!mounted) return;

        if (res.success && res.data) {
          // Keep id as string (don't coerce GUID to Number)
          const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
          
          // Helper function to create unique comment ID
          // const createUniqueCommentId = (postId: string | number, commentId?: string | number) => {
          //   return `${String(postId)}_${commentId || Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          // };

          const normalized = res.data.map((p) => ({
            id: String(p.id),
            author: p.author ?? {
              name: 'Người dùng',
              avatar: defaultAvatar,
              isVerified: false,
              title: 'Thành viên Pawnet'
            },
            content: p.content,
            images: p.imageUrl ? [p.imageUrl] : [],
            timestamp: p.timestamp ?? new Date().toISOString(),
            likes: p.likes ?? 0,
            comments: Array.isArray(p.comments) ? p.comments.map((c, index) => ({
              id: c.id ? `comment-${String(p.id)}-${String(c.id)}` : `comment-${String(p.id)}-${index}`,
              author: c.author || 'Người dùng',
              content: c.content || '',
              timestamp: c.timestamp || 'Vừa xong'
            })) : [],
            shares: p.shares ?? 0,
            views: p.views ?? 0,
            liked: false,
            postStatus: p.postStatus,
            postCategory: p.postCategory,
            staffId: p.staffId
          })) as Post[];
          setPosts(normalized);
        } else {
          console.error("Failed to fetch posts:", res.error || "Unknown error");
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(load, retryDelay);
          } else {
            showError("Không thể tải bài viết. Vui lòng thử lại sau.");
          }
        }
      } catch (err) {
        console.error("Failed to fetch posts", err);
        if (retryCount < maxRetries && mounted) {
          retryCount++;
          setTimeout(load, retryDelay);
        } else if (mounted) {
          showError("Không thể tải bài viết. Vui lòng thử lại sau.");
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const { isAuthenticated } = useAuth();



  // newPost: author/caption/image from UI -> translate to API shape
  const handleAddPost = async (newPost: { author: string; caption: string; image?: string; category: PostCategory }) => {
    if (!isAuthenticated) {
      showError("Vui lòng đăng nhập để đăng bài");
      return;
    }

    // Local payload for UI
    const payloadForUI = {
      author: { name: newPost.author, avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png", isVerified: false, title: "Thành viên Pawnet" },
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

    try {
      // Generate random UUID v4 for staffId
      function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      const apiPayload: CreatePostApiPayload = {
        title: newPost.caption?.slice(0, 100) || "Untitled",
        content: newPost.caption,
        imageUrl: newPost.image ?? "",
        postStatus: 0,
        postCategory: newPost.category,
        staffId: uuidv4()
      };

      const res = await postService.createPost(apiPayload);
      if (res.success && res.data) {
        const sp = res.data;
        const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
        const serverPost: Post = {
          id: String(sp.id),
          author: { 
            name: newPost.author,
            avatar: sp.author?.avatar ?? defaultAvatar,
            isVerified: sp.author?.isVerified ?? false,
            title: sp.author?.title ?? "Thành viên Pawnet"
          },
          content: sp.content,
          images: sp.imageUrl ? [sp.imageUrl] : [],
          timestamp: sp.timestamp ?? new Date().toISOString(),
          likes: sp.likes ?? 0,
          comments: [],
          shares: sp.shares ?? 0,
          views: sp.views ?? 0,
          liked: false,
        };
        setPosts((prev) => prev.map((p) => (p.id === tempId ? serverPost : p)));
        showSuccess("Đã đăng bài");
      } else {
        showError(res.error || res.message || "Tạo bài thất bại, giữ bản local");
      }
    } catch (err) {
      console.error("create post failed", err);
      showError("Tạo bài thất bại (network), giữ bản local");
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <CommunityFeed
              posts={posts}
              onAddPost={handleAddPost}
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