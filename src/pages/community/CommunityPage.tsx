import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
import CommunityHeroSection from "../../components/community/CommunityHeroSection";
import CommunityFeed from "../../components/community/CommunityFeed";
import CommunitySidebar from "../../components/community/CommunitySidebar";
import Footer from "../../components/common/Footer";
import { useScrollToTop } from "../../hooks";

/**
 * Lưu ý: định nghĩa kiểu Post và Comment ở đây phải trùng với
 * kiểu mà CommunityFeed.tsx đang dùng.
 */
type Comment = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
};

type Post = {
  id: number;
  author: {
    name: string;
    avatar: string;
    isVerified: boolean;
    title: string;
  };
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  views: number;
  liked: boolean;
};

const CommunityPage: React.FC = () => {
  useScrollToTop();

  // Khởi tạo posts với đúng shape theo Post type
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: {
        name: "Nguyễn Thị Mai",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b60b2bb4?w=50&h=50&fit=crop&crop=face",
        isVerified: true,
        title: "Chuyên gia chăm sóc thú cưng",
      },
      content:
        "Chia sẻ kinh nghiệm chăm sóc chó mèo con trong mùa đông 🐶❄️. Giữ ấm và bổ sung dinh dưỡng đầy đủ nhé!",
      images: [
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop",
      ],
      timestamp: "2 giờ trước",
      likes: 12,
      comments: [
        {
          id: 1,
          author: "Lê Hoàng",
          content: "Bài viết hữu ích quá!",
          timestamp: "1h",
        },
      ],
      shares: 0,
      views: 5,
      liked: false,
    },
  ]);

  // ======= Handlers (kiểu tương thích với CommunityFeed props) =======
  const handleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  const handleAddComment = (id: number, text: string) => {
    if (!text.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: Date.now(), author: "Bạn", content: text, timestamp: "Vừa xong" },
              ],
            }
          : p
      )
    );
  };

  const handleDeletePost = (id: number) => {
    if (!window.confirm) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa bài viết này không?")) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleEditPost = (id: number, newContent: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, content: newContent } : p)));
  };

  const handleShare = (id: number) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, shares: p.shares + 1 } : p)));
    // bạn có thể gọi API ở đây
    alert("Đã chia sẻ bài viết!");
  };

  const handleViewPost = (id: number) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p)));
  };

  // Hàm add post được gọi từ Sidebar hoặc Create Post trong Feed
  const handleAddPost = (newPost: { author: string; caption: string; image?: string }) => {
    const created: Post = {
      id: Date.now(),
      author: {
        name: newPost.author,
        avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        isVerified: false,
        title: "Thành viên Pawnet",
      },
      content: newPost.caption,
      images: newPost.image ? [newPost.image] : [],
      timestamp: "Vừa xong",
      likes: 0,
      comments: [],
      shares: 0,
      views: 0,
      liked: false,
    };
    setPosts((prevPosts) => [created, ...prevPosts]);
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
              onEdit={handleEditPost}
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
