import React, { useState } from "react";
import { showSuccess, showError } from "../../utils/toastUtils";
import {
  AiOutlineUser,
  AiOutlineFire,
  AiOutlineCalendar,
  AiOutlineCamera,
  AiOutlineStar,
  AiOutlineRight,
  AiOutlineClose,
} from "react-icons/ai";

interface CommunitySidebarProps {
  onAddPost: (post: {
    author: string;
    caption: string;
    image?: string;
  }) => void;
}

const CommunitySidebar: React.FC<CommunitySidebarProps> = ({ onAddPost }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "photo" | "freelancer" | "event"
  const [formData, setFormData] = useState({
    image: "",
    caption: "",
    freelancer: "",
    eventTitle: "",
    eventDate: "",
    eventTime: "",
  });

  const trendingTopics = [
    { id: 1, title: "Chăm sóc chó mèo mùa đông", posts: 156 },
    { id: 2, title: "Huấn luyện thú cưng cơ bản", posts: 89 },
    { id: 3, title: "Dinh dưỡng cho thú cưng", posts: 67 },
    { id: 4, title: "Sức khỏe thú cưng", posts: 124 },
    { id: 5, title: "Grooming tips", posts: 45 },
  ];

  const activeMembers = [
    {
      id: 1,
      name: "Dr. Nguyễn Mai",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
      isOnline: true,
      specialty: "Bác sĩ thú y",
    },
    {
      id: 2,
      name: "Trần Đức",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      isOnline: true,
      specialty: "Huấn luyện viên",
    },
    {
      id: 3,
      name: "Lê Hoa",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      isOnline: false,
      specialty: "Groomer",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Workshop chăm sóc chó mèo",
      date: "15/10/2025",
      time: "14:00",
      participants: 24,
    },
    {
      id: 2,
      title: "Thi ảnh thú cưng đẹp nhất",
      date: "20/10/2025",
      time: "09:00",
      participants: 87,
    },
  ];

  // 📌 Mở modal theo loại
  const openModal = (type: string) => {
    setModalType(type);
    setShowModal(true);
  };

  // 📌 Xử lý submit tùy loại
  const handleSubmit = () => {
    if (modalType === "photo") {
      if (!formData.caption) {
        showError("Vui lòng nhập nội dung ảnh!");
        return;
      }
      // Gửi dữ liệu bài viết mới về CommunityPage
      onAddPost({
        author: "Bạn",
        caption: formData.caption,
        image: formData.image,
      });
      showSuccess("📸 Đăng bài thành công!");
    } else if (modalType === "freelancer") {
      showSuccess(`🔍 Đang tìm freelancer: ${formData.freelancer || "Tất cả"}`);
    } else if (modalType === "event") {
      if (!formData.eventTitle) {
        showError("Nhập tên sự kiện!");
        return;
      }
      showSuccess(`🎉 Sự kiện '${formData.eventTitle}' đã được tạo!`);
    }

    // Reset form và đóng modal
    setShowModal(false);
    setFormData({
      image: "",
      caption: "",
      freelancer: "",
      eventTitle: "",
      eventDate: "",
      eventTime: "",
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hành động nhanh
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => openModal("photo")}
              className="w-full flex items-center justify-between px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <AiOutlineCamera className="w-5 h-5" />
                <span>Đăng ảnh thú cưng</span>
              </div>
              <AiOutlineRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openModal("freelancer")}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <AiOutlineUser className="w-5 h-5" />
                <span>Tìm freelancer</span>
              </div>
              <AiOutlineRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openModal("event")}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <AiOutlineCalendar className="w-5 h-5" />
                <span>Tạo sự kiện</span>
              </div>
              <AiOutlineRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AiOutlineFire className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Chủ đề hot</h3>
          </div>
          {trendingTopics.map((t) => (
            <div
              key={t.id}
              onClick={() => showSuccess(`📢 Mở chủ đề: ${t.title}`)}
              className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{t.title}</p>
                <p className="text-xs text-gray-500">{t.posts} bài viết</p>
              </div>
              <AiOutlineRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>

        {/* Active Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thành viên hoạt động
          </h3>
          {activeMembers.map((m) => (
            <div
              key={m.id}
              onClick={() => showSuccess(`👤 Xem hồ sơ: ${m.name}`)}
              className="flex items-center space-x-3 py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {m.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{m.name}</p>
                <p className="text-xs text-orange-600">{m.specialty}</p>
              </div>
            </div>
          ))}
          <button className="w-full mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium">
            Xem tất cả thành viên
          </button>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AiOutlineCalendar className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Sự kiện sắp tới
            </h3>
          </div>
          {upcomingEvents.map((e) => (
            <div
              key={e.id}
              onClick={() => showSuccess(`📅 Chi tiết sự kiện: ${e.title}`)}
              className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 cursor-pointer mb-3"
            >
              <h4 className="text-sm font-semibold text-gray-800 mb-1">
                {e.title}
              </h4>
              <p className="text-xs text-gray-500">
                {e.date} • {e.time} ({e.participants} người tham gia)
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-2 mb-3">
            <AiOutlineStar className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Thống kê cộng đồng</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tổng thành viên</span>
              <span className="font-bold">2,547</span>
            </div>
            <div className="flex justify-between">
              <span>Bài viết hôm nay</span>
              <span className="font-bold">42</span>
            </div>
            <div className="flex justify-between">
              <span>Freelancer online</span>
              <span className="font-bold">156</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Overlay với animation */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-sm"
              aria-hidden="true"
              onClick={() => setShowModal(false)}
            />

            {/* Modal panel */}
            <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <AiOutlineClose className="w-5 h-5" />
              </button>

              {/* Đăng ảnh */}
              {modalType === "photo" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b pb-4">
                    <AiOutlineCamera className="w-6 h-6 text-orange-500" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Đăng ảnh thú cưng
                    </h3>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nội dung bài viết
                      </label>
                      <textarea
                        value={formData.caption}
                        onChange={(e) =>
                          setFormData({ ...formData, caption: e.target.value })
                        }
                        placeholder="Chia sẻ câu chuyện về thú cưng của bạn..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow text-gray-700 resize-none"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hình ảnh
                      </label>
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-orange-500 transition-colors">
                        <div className="space-y-1 text-center">
                          <AiOutlineCamera className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md font-medium text-orange-600 hover:text-orange-500">
                              <span>Tải ảnh lên</span>
                              <input 
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setFormData({
                                      ...formData,
                                      image: URL.createObjectURL(file),
                                    });
                                  }
                                }}
                              />
                            </label>
                            <p className="pl-1">hoặc kéo thả vào đây</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                        </div>
                      </div>

                      {formData.image && (
                        <div className="mt-4 relative">
                          <img
                            src={formData.image}
                            alt="preview"
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <button
                            onClick={() => setFormData({ ...formData, image: "" })}
                            className="absolute top-2 right-2 p-1 bg-gray-900/50 text-white rounded-lg hover:bg-gray-900/75 transition-colors"
                          >
                            <AiOutlineClose className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleSubmit}
                        className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium space-x-2"
                      >
                        <AiOutlineCamera className="w-5 h-5" />
                        <span>Đăng bài</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tìm Freelancer */}
              {modalType === "freelancer" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b pb-4">
                    <AiOutlineUser className="w-6 h-6 text-orange-500" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Tìm Freelancer
                    </h3>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên freelancer
                      </label>
                      <input
                        type="text"
                        value={formData.freelancer}
                        onChange={(e) =>
                          setFormData({ ...formData, freelancer: e.target.value })
                        }
                        placeholder="Nhập tên freelancer..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow text-gray-700"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleSubmit}
                        className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium space-x-2"
                      >
                        <AiOutlineUser className="w-5 h-5" />
                        <span>Tìm kiếm</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tạo sự kiện */}
              {modalType === "event" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b pb-4">
                    <AiOutlineCalendar className="w-6 h-6 text-orange-500" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Tạo sự kiện mới
                    </h3>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên sự kiện
                      </label>
                      <input
                        type="text"
                        value={formData.eventTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, eventTitle: e.target.value })
                        }
                        placeholder="Nhập tên sự kiện..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow text-gray-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày
                        </label>
                        <input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) =>
                            setFormData({ ...formData, eventDate: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giờ
                        </label>
                        <input
                          type="time"
                          value={formData.eventTime}
                          onChange={(e) =>
                            setFormData({ ...formData, eventTime: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow text-gray-700"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleSubmit}
                        className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium space-x-2"
                      >
                        <AiOutlineCalendar className="w-5 h-5" />
                        <span>Tạo sự kiện</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommunitySidebar;
