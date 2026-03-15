import React, { useState, useRef } from "react";
import { AiOutlineClose, AiOutlineSave } from "react-icons/ai";
import { FaPaw, FaUpload, FaSpinner } from "react-icons/fa";
import { cloudinaryService } from "../../services";
import { showError, showSuccess } from "../../utils";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: {
    name: string;
    phoneNumber: string;
    address: string;
    avatarUrl: string;
  };
  onChange: (field: string, value: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  onChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setUploading(true);
    try {
      const response = await cloudinaryService.uploadImage(file);
      if (response.success && response.data) {
        onChange("avatarUrl", response.data.secureUrl);
        showSuccess("Tải ảnh lên thành công");
      } else {
        showError("Không thể tải ảnh lên");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showError("Lỗi khi tải ảnh lên");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaPaw className="text-teal-500 mr-2" />
            Chỉnh Sửa Hồ Sơ
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên hiển thị
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Nhập tên của bạn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => onChange("address", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Nhập địa chỉ của bạn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar URL
            </label>
            <div className="space-y-3">
              {formData.avatarUrl && (
                <div className="flex items-center justify-center">
                  <img
                    src={formData.avatarUrl}
                    alt="Avatar preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-teal-500"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => onChange("avatarUrl", e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="URL ảnh đại diện"
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Đang tải...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      <span>Tải lên</span>
                    </>
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-gray-500">
                Tải ảnh lên Cloudinary hoặc nhập URL trực tiếp (tối đa 5MB)
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onSave}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            <AiOutlineSave className="w-5 h-5" />
            <span>Lưu</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            <AiOutlineClose className="w-5 h-5" />
            <span>Hủy</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
