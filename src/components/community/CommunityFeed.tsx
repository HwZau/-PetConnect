import React, { useState } from "react";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineComment,
  AiOutlineShareAlt,
  AiOutlineCamera,
} from "react-icons/ai";

export interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
}

export interface Post {
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
}

interface CommunityFeedProps {
  posts: Post[];
  onLike: (id: number) => void;
  onComment: (id: number, text: string) => void;
  onDelete: (id: number) => void;
  onShare: (id: number) => void;
  onView: (id: number) => void;
  onAddPost: (newPost: {
    author: string;
    caption: string;
    image?: string;
  }) => void;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  onLike,
  onComment,
  onDelete,
  onShare,
  onView,
  onAddPost,
}) => {
  const [newPost, setNewPost] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  // 🧩 Xử lý đăng bài
  const handleAddPost = () => {
    if (!newPost.trim()) return;
    onAddPost({
      author: "Bạn",
      caption: newPost,
      image: imagePreview || undefined,
    });
    setNewPost("");
    setImagePreview(null);
  };

  // 🧩 Xử lý upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // 🧩 Gửi comment
  const handleSendComment = (postId: number) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="space-y-6">
      {/* 🧩 Ô đăng bài */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-start gap-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="user"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <textarea
              className="w-full bg-gray-100 p-3 rounded-lg text-gray-700 resize-none focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Chia sẻ cảm nghĩ của bạn về thú cưng..."
              rows={3}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            ></textarea>
            {imagePreview && (
              <div className="mt-3 relative">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="rounded-lg max-h-64 object-cover"
                />
                <button
                  className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded-lg text-sm"
                  onClick={() => setImagePreview(null)}
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex justify-between mt-4">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <AiOutlineCamera className="text-orange-500 w-5 h-5" />
                <span>Thêm ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              <button
                onClick={handleAddPost}
                className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700"
              >
                Đăng bài
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🧩 Danh sách bài đăng */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {post.author.name}{" "}
                    {post.author.isVerified && (
                      <span className="text-blue-500">✔️</span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-500">{post.author.title}</p>
                  <p className="text-xs text-gray-400">{post.timestamp}</p>
                </div>
              </div>
              <button
                className="text-red-500 text-sm hover:text-red-600"
                onClick={() => onDelete(post.id)}
              >
                Xóa
              </button>
            </div>

            {/* Nội dung */}
            <p className="mt-4 text-gray-700">{post.content}</p>
            {post.images && post.images.length > 0 && (
              <div className="mt-3">
                <img
                  src={post.images[0]}
                  alt="post"
                  className="rounded-lg max-h-96 w-full object-cover"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-around text-gray-600 text-sm mt-4 pt-3">
              <button
                className="flex items-center gap-2 hover:text-orange-500"
                onClick={() => onLike(post.id)}
              >
                {post.liked ? (
                  <AiFillLike className="text-orange-500" />
                ) : (
                  <AiOutlineLike />
                )}
                <span>Thích ({post.likes})</span>
              </button>
              <button
                className="flex items-center gap-2 hover:text-orange-500"
                onClick={() => onView(post.id)}
              >
                <AiOutlineComment />
                <span>Bình luận ({post.comments.length})</span>
              </button>
              <button
                className="flex items-center gap-2 hover:text-orange-500"
                onClick={() => onShare(post.id)}
              >
                <AiOutlineShareAlt />
                <span>Chia sẻ ({post.shares})</span>
              </button>
            </div>

            {/* Bình luận */}
            <div className="mt-4 space-y-3 border-t border-gray-100 pt-3">
              {post.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    alt={c.author}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="bg-gray-100 rounded-lg p-2">
                    <p className="text-sm font-semibold">{c.author}</p>
                    <p className="text-gray-700 text-sm">{c.content}</p>
                    <span className="text-xs text-gray-400">{c.timestamp}</span>
                  </div>
                </div>
              ))}

              {/* Ô nhập comment */}
              <div className="flex items-center gap-3 mt-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="user"
                  className="w-8 h-8 rounded-full"
                />
                <input
                  type="text"
                  placeholder="Viết bình luận..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs({
                      ...commentInputs,
                      [post.id]: e.target.value,
                    })
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSendComment(post.id)
                  }
                />
                <button
                  onClick={() => handleSendComment(post.id)}
                  className="text-orange-600 font-semibold text-sm"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityFeed;
