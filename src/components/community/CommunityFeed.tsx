import React, { useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";

import { PostCategory, PostCategoryLabels } from "../../types/domains/PostCategory";
export interface Comment {
  id: string;
  postId?: string; // Reference to parent post
  author: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    isVerified: boolean;
    title: string;
  };
  content: string;
  images?: string[];
  imageUrl?: string;
  timestamp: string;
  likes: number;
  comments: Comment[]; // Required field with default empty array
  shares: number;
  views: number;
  liked: boolean;
  postStatus?: number;
  postCategory?: number;
  staffId?: string;
}

interface CommunityFeedProps {
  posts: Post[];
  onAddPost: (newPost: {
    author: string;
    caption: string;
    image?: string;
    category: PostCategory;
  }) => void;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  onAddPost,
}) => {
  const [newPost, setNewPost] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>(PostCategory.DogCare);


  // 🧩 Xử lý đăng bài
  const handleAddPost = () => {
    if (!newPost.trim()) return;
    onAddPost({
      author: "Bạn",
      caption: newPost,
      image: imagePreview || undefined,
      category: selectedCategory
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



  return (
    <div className="space-y-6">
      {/* Top title / hero (matches provided screenshot) */}
      
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
            <div className="space-y-4 mt-4">
              {/* Category tags */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(PostCategoryLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setSelectedCategory(Number(value) as PostCategory)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                      ${selectedCategory === Number(value)
                        ? 'bg-orange-100 text-orange-600 border-orange-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Bottom actions */}
              <div className="flex justify-between items-center border-t pt-4">
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
      </div>

     
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800 leading-5">
                      {post.author.name}
                    </h4>
                    {post.author.isVerified && (
                      <span className="text-blue-500 text-sm">✔️</span>
                    )}
                    {/* title displayed next to name */}
                    <span className="text-sm text-gray-500 ml-2">{post.author.title}</span>
                  </div>

                  {/* Category badge shown under author title when available */}
                  {typeof post.postCategory === 'number' && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        {PostCategoryLabels[post.postCategory as PostCategory]}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp moved to the right and aligned to top so it won't share line with title */}
              <div className="text-right ml-4">
                <p className="text-xs text-gray-400">{post.timestamp}</p>
              </div>
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityFeed;