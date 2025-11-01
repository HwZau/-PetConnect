import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import CommunityHeroSection from "../../components/community/CommunityHeroSection";
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

type Comment = FeedComment;
type Post = FeedPost;

const CommunityPage: React.FC = () => {
  useScrollToTop();
  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch posts from backend (API_ENDPOINTS.COMMUNITY.POSTS)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await postService.listPosts();
        if (mounted && res.success && res.data) {
          // Normalize id to number (frontend components expect numeric ids)
          // res.data is typed by postService.Post
          const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
          const normalized = res.data.map((p) => ({
            id: Number(p.id),
            author: p.author
              ? { name: p.author.name, avatar: p.author.avatar ?? defaultAvatar, isVerified: !!p.author.isVerified, title: p.author.title ?? '' }
              : { name: 'Người dùng', avatar: defaultAvatar, isVerified: false, title: '' },
            content: p.content,
            images: p.images ?? [],
            timestamp: p.timestamp ?? "",
            likes: p.likes ?? 0,
            comments: (p.comments ?? []) as Comment[],
            shares: p.shares ?? 0,
            views: p.views ?? 0,
            liked: !!p.liked,
          })) as Post[];
          setPosts(normalized);
        }
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // ======= Handlers (kiểu tương thích với CommunityFeed props) =======
  // ======= Handlers (kiểu tương thích với CommunityFeed props) =======
  const { isAuthenticated } = useAuth();

  const handleLike = (id: number) => {
    // optimistic with rollback
    const prev = posts;
    const next = posts.map((p) =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    );
    setPosts(next);

    const target = next.find((p) => p.id === id);
    if (!target) return;

    postService
      .likePost(id)
      .then((res) => {
        if (!res.success) {
          setPosts(prev);
          showError(res.error || res.message || "Cập nhật like thất bại");
        }
      })
      .catch(() => {
        setPosts(prev);
        showError("Cập nhật like thất bại (network)");
      });
  };

  const handleAddComment = (id: number, text: string) => {
    if (!text.trim()) return;
    const prev = posts;
    const newComment = { id: Date.now(), author: "Bạn", content: text, timestamp: "Vừa xong" };
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === id ? { ...p, comments: [...p.comments, newComment] } : p))
    );

    postService
      .commentPost(id, { content: text })
      .then((res) => {
        if (!res.success) {
          setPosts(prev);
          showError(res.error || res.message || "Gửi bình luận thất bại");
        }
      })
      .catch(() => {
        setPosts(prev);
        showError("Gửi bình luận thất bại (network)");
      });
  };

  const handleDeletePost = (id: number) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để xóa bài viết");
      return;
    }

    if (!window.confirm || window.confirm("Bạn có chắc muốn xóa bài viết này không?")) {
      const prev = posts;
      // optimistic remove
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== id));

      postService
        .deletePost(id)
        .then((res) => {
          if (!res.success) {
            setPosts(prev);
            showError(res.error || res.message || "Xóa bài viết thất bại");
          } else {
            showSuccess("Xóa bài viết thành công");
          }
        })
        .catch(() => {
          setPosts(prev);
          showError("Xóa bài viết thất bại (network)");
        });
    }
  };

  const handleShare = (id: number) => {
    const prev = posts;
    const next = posts.map((p) => (p.id === id ? { ...p, shares: p.shares + 1 } : p));
    setPosts(next);
    postService
      .updatePost(id, { shares: next.find((p) => p.id === id)?.shares })
      .then((res) => {
        if (!res.success) {
          setPosts(prev);
          showError(res.error || res.message || "Chia sẻ bài viết thất bại");
        } else {
          showSuccess("Đã chia sẻ bài viết!");
        }
      })
      .catch(() => {
        setPosts(prev);
        showError("Chia sẻ bài viết thất bại (network)");
      });
  };

  const handleViewPost = (id: number) => {
    const prev = posts;
    const next = posts.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p));
    setPosts(next);
    postService
      .updatePost(id, { views: next.find((p) => p.id === id)?.views })
      .then((res) => {
        if (!res.success) {
          setPosts(prev);
          showError(res.error || res.message || "Cập nhật lượt xem thất bại");
        }
      })
      .catch(() => {
        setPosts(prev);
        showError("Cập nhật lượt xem thất bại (network)");
      });
  };

  const handleAddPost = async (newPost: { author: string; caption: string; image?: string }) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để đăng bài");
      return;
    }

    const payload = {
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

    // optimistic add with temp id
    const tempId = Date.now();
    const tempPost: Post = {
      id: tempId,
      author: payload.author,
      content: payload.content,
      images: payload.images,
      timestamp: payload.timestamp,
      likes: payload.likes,
      comments: payload.comments,
      shares: payload.shares,
      views: payload.views,
      liked: payload.liked,
    };
    setPosts((prev) => [tempPost, ...prev]);

    try {
      const res = await postService.createPost(payload);
      if (res.success && res.data) {
        // replace temp with server post (map server shape to local Post)
        const sp = res.data;
        const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
        const serverPost: Post = {
          id: Number(sp.id),
          author: sp.author
            ? { name: sp.author.name, avatar: sp.author.avatar ?? defaultAvatar, isVerified: !!sp.author.isVerified, title: sp.author.title ?? '' }
            : { name: 'Người dùng', avatar: defaultAvatar, isVerified: false, title: '' },
          content: sp.content,
          images: sp.images ?? [],
          timestamp: sp.timestamp ?? "",
          likes: sp.likes ?? 0,
          comments: (sp.comments ?? []) as Comment[],
          shares: sp.shares ?? 0,
          views: sp.views ?? 0,
          liked: !!sp.liked,
        };
        setPosts((prev) => prev.map((p) => (p.id === tempId ? serverPost : p)));
        showSuccess("Đã đăng bài");
      } else {
        // keep temp and notify
        showError(res.error || res.message || "Tạo bài thất bại, giữ bản local");
      }
    } catch (err) {
      console.error("create post failed", err);
      showError("Tạo bài thất bại (network), giữ bản local");
    }
  };

  // ================= Render =================
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <CommunityHeroSection />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* FEED */}
          <div className="lg:col-span-3">
            <CommunityFeed
              posts={posts}
              onLike={handleLike}
              onComment={handleAddComment}
              onDelete={handleDeletePost}
            
              onShare={handleShare}
              onView={handleViewPost}
              onAddPost={handleAddPost}
            />
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <CommunitySidebar onAddPost={handleAddPost} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommunityPage;
