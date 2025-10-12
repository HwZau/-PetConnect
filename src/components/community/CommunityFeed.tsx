import React, { useState } from "react";
import {
  AiOutlineHeart,
  AiOutlineComment,
  AiOutlineShake,
  AiOutlineCamera,
  AiOutlineMore,
  AiOutlineLike,
  AiOutlineEye,
} from "react-icons/ai";

interface Post {
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
  comments: number;
  shares: number;
  views: number;
  liked: boolean;
}

const CommunityFeed: React.FC = () => {
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
        "Chia sẻ kinh nghiệm chăm sóc chó mèo con trong mùa đông. Các bé rất dễ bị cảm lạnh nên chúng ta cần chú ý giữ ấm và dinh dưỡng đầy đủ cho các bé nhé! 🐶❄️",
      images: [
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop",
      ],
      timestamp: "2 giờ trước",
      likes: 124,
      comments: 18,
      shares: 5,
      views: 432,
      liked: false,
    },
    {
      id: 2,
      author: {
        name: "Trần Văn Đức",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        isVerified: true,
        title: "Huấn luyện viên chó",
      },
      content:
        "Hôm nay có buổi training với những chú Golden Retriever siêu đáng yêu! Các bé học rất nhanh và ngoan lắm. Ai có thắc mắc về huấn luyện chó cơ bản thì inbox mình nhé! 💪🐕",
      timestamp: "5 giờ trước",
      likes: 89,
      comments: 12,
      shares: 3,
      views: 287,
      liked: true,
    },
    {
      id: 3,
      author: {
        name: "Lê Thị Hoa",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        isVerified: true,
        title: "Bác sĩ thú y",
      },
      content:
        "Nguyên tắc vàng khi chăm sóc thú cưng ốm: Quan sát cẩn thận các triệu chứng và đưa đến bác sĩ thú y kịp thời. Đừng tự ý dùng thuốc cho các bé nhé các bạn! 🏥🩺",
      timestamp: "8 giờ trước",
      likes: 156,
      comments: 24,
      shares: 8,
      views: 621,
      liked: false,
    },
  ]);

  const handleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
            alt="Your avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <button className="w-full text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
              Bạn đang nghĩ gì về thú cưng hôm nay?
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
            <AiOutlineCamera className="w-5 h-5 text-orange-500" />
            <span>Ảnh/Video</span>
          </button>
          <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
            Đăng bài
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Post Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">
                      {post.author.name}
                    </h3>
                    {post.author.isVerified && (
                      <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-orange-600">{post.author.title}</p>
                  <p className="text-xs text-gray-500">{post.timestamp}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <AiOutlineMore className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="px-6 pb-4">
            <p className="text-gray-800 leading-relaxed">{post.content}</p>
          </div>

          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div className="px-6 pb-4">
              {post.images.length === 1 ? (
                <img
                  src={post.images[0]}
                  alt="Post image"
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {post.images.slice(0, 3).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Post Stats */}
          <div className="px-6 py-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <AiOutlineLike className="w-4 h-4" />
                  <span>{post.likes}</span>
                </span>
                <span>{post.comments} bình luận</span>
                <span>{post.shares} chia sẻ</span>
              </div>
              <div className="flex items-center space-x-1">
                <AiOutlineEye className="w-4 h-4" />
                <span>{post.views} lượt xem</span>
              </div>
            </div>
          </div>

          {/* Post Actions */}
          <div className="px-6 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  post.liked
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <AiOutlineHeart
                  className={`w-5 h-5 ${post.liked ? "fill-current" : ""}`}
                />
                <span>Thích</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <AiOutlineComment className="w-5 h-5" />
                <span>Bình luận</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <AiOutlineShake className="w-5 h-5" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Load More */}
      <div className="text-center py-8">
        <button className="px-6 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium">
          Xem thêm bài viết
        </button>
      </div>
    </div>
  );
};

export default CommunityFeed;
