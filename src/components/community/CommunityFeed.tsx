import React, { useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { MdOutlineDeleteOutline, MdOutlineEdit } from "react-icons/md";
import type { CreatePostApiPayload } from "../../services/postService";
import { PostCategory, PostCategoryLabels } from "../../types/domains/PostCategory";
import { PostStatus, PostStatusLabels } from "../../types/domains/PostStatus";
import { isStaffRole } from "../../utils/authUtils";
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
    title: string;
    caption: string;
    image?: string;
    category: PostCategory;
  }) => void;
  onDeletePost?: (postId: string | number) => Promise<void>;
  onUpdatePost?: (postId: string | number, data: Partial<CreatePostApiPayload>) => Promise<void>;
  isAuthenticated?: boolean;
  onLoginNavigate?: () => void;  // Navigate to login on demand
  currentUserId?: string;
  userRole?: string;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  onAddPost,
  onDeletePost,
  onUpdatePost,
  isAuthenticated = false,
  onLoginNavigate,
  currentUserId,
  userRole,
}) => {
  // Guard against missing auth
  const safeIsAuthenticated = Boolean(isAuthenticated);
  
  console.log("🔵 CommunityFeed RENDER START - isAuthenticated:", isAuthenticated, "safeIsAuthenticated:", safeIsAuthenticated);
  const [newPost, setNewPost] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>(PostCategory.DogCare);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editCategory, setEditCategory] = useState<PostCategory>(PostCategory.DogCare);
  const [deleteConfirmPostId, setDeleteConfirmPostId] = useState<string | null>(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  console.log("🔵 CommunityFeed RENDER END");

  // Handler that navigates to login when button is clicked
  const handleLoginClick = () => {
    console.log("Login button clicked - navigating to login");
    onLoginNavigate?.();
  };

  // Handle delete post with confirmation modal
  const handleDeleteClick = (postId: string | number) => {
    setDeleteConfirmPostId(String(postId));
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!onDeletePost || !deleteConfirmPostId) return;
    
    setIsLoadingAction(true);
    try {
      await onDeletePost(deleteConfirmPostId);
      setDeleteConfirmPostId(null);
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirmPostId(null);
  };

  // Handle start edit
  const handleEditClick = (post: Post) => {
    setEditingPostId(String(post.id));
    setEditingPost(post);
    setEditContent(post.content);
    setEditCategory((post.postCategory ?? PostCategory.DogCare) as PostCategory);
  };

  // Handle save edit
  const handleSaveEdit = async (postId: string | number) => {
    if (!onUpdatePost) return;
    if (!editContent.trim()) return;
    if (!editingPost) return;
    
    setIsLoadingAction(true);
    try {
      // Send full payload as backend expects: title, content, imageUrl, category
      const updateData: Partial<CreatePostApiPayload> = {
        title: editingPost.content.slice(0, 80), // Use first 80 chars of original content as title
        content: editContent,
        imageUrl: editingPost.images?.[0] || "",
        category: editCategory,
      };
      console.log("[DEBUG] Sending update payload:", updateData);
      await onUpdatePost(postId, updateData);
      setEditingPostId(null);
      setEditContent("");
      setEditingPost(null);
      setEditCategory(PostCategory.DogCare);
    } finally {
      setIsLoadingAction(false);
    }
  };

  // 🧩 Xử lý đăng bài
  const handleAddPost = () => {
    console.log("handleAddPost called, safeIsAuthenticated:", safeIsAuthenticated);
    if (!safeIsAuthenticated) {
      console.log("Not authenticated - would navigate to login if called from UI");
      return;
    }
    if (!newPost.trim() || !newPostTitle.trim()) return;
    onAddPost({
      author: "Bạn",
      title: newPostTitle,
      caption: newPost,
      image: imagePreview || undefined,
      category: selectedCategory
    });
    setNewPost("");
    setNewPostTitle("");
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
      {/* 🧩 Ô đăng bài */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {!safeIsAuthenticated ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🐾</div>
            <p className="text-gray-600 mb-6 text-lg">Vui lòng là staff để chia sẻ với cộng đồng</p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLoginClick();
              }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 font-semibold transition-all"
            >
              Đăng nhập ngay
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="user"
                className="w-12 h-12 rounded-full shadow-sm"
              />
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all mb-3"
                  placeholder="Tiêu đề bài viết..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <textarea
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  placeholder="Chia sẻ cảm nghĩ của bạn..."
                  rows={4}
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                ></textarea>
              </div>
            </div>
            
            {imagePreview && (
              <div className="mt-4 relative inline-block">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="rounded-xl max-h-72 object-cover shadow-md"
                />
                <button
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
                  onClick={() => setImagePreview(null)}
                >
                  ✕
                </button>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {/* Category tags */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Chọn chuyên mục</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PostCategoryLabels).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setSelectedCategory(Number(value) as PostCategory)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === Number(value)
                          ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <label className="flex items-center gap-2 text-orange-600 cursor-pointer hover:text-orange-700 font-medium transition-colors">
                  <AiOutlineCamera className="w-5 h-5" />
                  <span>Thêm ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                
                <button
                  type="button"
                  onClick={handleAddPost}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-lg hover:from-orange-600 hover:to-orange-700 font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                  disabled={!newPost.trim() || !newPostTitle.trim()}
                >
                   Đăng bài
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

     
      {posts.map((post) => {
        const isUserStaffOrAdmin = isStaffRole(userRole);
        const isOwnPost = isUserStaffOrAdmin && currentUserId && post.staffId && String(currentUserId) === String(post.staffId);
        const isEditing = editingPostId === String(post.id);
        
        return (
        <div
          key={post.id}
          className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {typeof post.postCategory === 'number' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        {PostCategoryLabels[post.postCategory as PostCategory]}
                      </span>
                    )}
                    {typeof post.postStatus === 'number' && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
                        ${post.postStatus === PostStatus.Draft ? 'bg-gray-100 text-gray-800 border-gray-200' : ''}
                        ${post.postStatus === PostStatus.Pending ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                        ${post.postStatus === PostStatus.Rejected ? 'bg-red-100 text-red-800 border-red-200' : ''}
                        ${post.postStatus === PostStatus.Approved ? 'bg-green-100 text-green-800 border-green-200' : ''}
                      `}>
                        {PostStatusLabels[post.postStatus as PostStatus]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Timestamp and action buttons */}
              <div className="text-right ml-4 flex flex-col items-end gap-3">
                <p className="text-xs text-gray-400">{post.timestamp}</p>
                {isOwnPost && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(post)}
                      disabled={isLoadingAction}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 hover:text-blue-700"
                      title="Sửa bài viết"
                    >
                      <MdOutlineEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(post.id)}
                      disabled={isLoadingAction}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 hover:text-red-700"
                      title="Xóa bài viết"
                    >
                      <MdOutlineDeleteOutline size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content or Edit Form */}
            {isEditing ? (
              <div className="mt-4 space-y-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h3 className="font-semibold text-gray-800">Chỉnh sửa bài viết</h3>
                <textarea
                  className="w-full bg-white border border-orange-200 p-3 rounded-lg text-gray-700 resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                />
                {/* Category selector for edit */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Chuyên mục</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(PostCategoryLabels).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setEditCategory(Number(value) as PostCategory)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          editCategory === Number(value)
                            ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => {
                      setEditingPostId(null);
                      setEditContent("");
                      setEditingPost(null);
                      setEditCategory(PostCategory.DogCare);
                    }}
                    disabled={isLoadingAction}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-all disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleSaveEdit(post.id)}
                    disabled={isLoadingAction || !editContent.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 font-semibold transition-all disabled:opacity-50"
                  >
                    {isLoadingAction ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Nội dung */}
                <p className="mt-6 text-gray-700 leading-relaxed text-base">{post.content}</p>
                {post.images && post.images.length > 0 && (
                  <div className="mt-4">
                    <img
                      src={post.images[0]}
                      alt="post"
                      className="rounded-xl max-h-96 w-full object-cover shadow-md"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
      })}

      {/* Delete Confirmation Modal */}
      {deleteConfirmPostId && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm mx-4 overflow-hidden animate-in">
            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Xóa bài viết?</h2>
              <p className="text-gray-600">Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa bài viết này?</p>
            </div>
            <div className="px-6 py-6 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={cancelDelete}
                disabled={isLoadingAction}
                className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoadingAction}
                className="px-6 py-2.5 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-all shadow-md disabled:opacity-50"
              >
                {isLoadingAction ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;