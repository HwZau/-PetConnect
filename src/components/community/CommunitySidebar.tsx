import React, { useState } from "react";
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
      if (!formData.caption) return alert("Vui lòng nhập nội dung ảnh!");
      // Gửi dữ liệu bài viết mới về CommunityPage
      onAddPost({
        author: "Bạn",
        caption: formData.caption,
        image: formData.image,
      });
      alert("📸 Đăng bài thành công!");
    } else if (modalType === "freelancer") {
      alert(`🔍 Đang tìm freelancer: ${formData.freelancer || "Tất cả"}`);
    } else if (modalType === "event") {
      if (!formData.eventTitle) return alert("Nhập tên sự kiện!");
      alert(`🎉 Sự kiện '${formData.eventTitle}' đã được tạo!`);
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
              onClick={() => alert(`📢 Mở chủ đề: ${t.title}`)}
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
              onClick={() => alert(`👤 Xem hồ sơ: ${m.name}`)}
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
              onClick={() => alert(`📅 Chi tiết sự kiện: ${e.title}`)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <AiOutlineClose className="w-5 h-5" />
            </button>

            {/* Đăng ảnh */}
            {modalType === "photo" && (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  📸 Đăng ảnh thú cưng
                </h3>
                <textarea
                  value={formData.caption}
                  onChange={(e) =>
                    setFormData({ ...formData, caption: e.target.value })
                  }
                  placeholder="Viết nội dung..."
                  className="w-full border rounded-lg p-2 mb-3"
                ></textarea>
                <input
                  type="file"
                  accept="image/*"
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
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="preview"
                    className="w-full h-40 object-cover rounded-lg mt-3"
                  />
                )}
                <button
                  onClick={handleSubmit}
                  className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
                >
                  Đăng bài
                </button>
              </>
            )}

            {/* Freelancer & Event giữ nguyên */}
            {modalType === "freelancer" && (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  🔍 Tìm freelancer
                </h3>
                <input
                  type="text"
                  value={formData.freelancer}
                  onChange={(e) =>
                    setFormData({ ...formData, freelancer: e.target.value })
                  }
                  placeholder="Nhập tên freelancer..."
                  className="w-full border rounded-lg p-2 mb-3"
                />
                <button
                  onClick={handleSubmit}
                  className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
                >
                  Tìm kiếm
                </button>
              </>
            )}

            {modalType === "event" && (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  🎉 Tạo sự kiện mới
                </h3>
                <input
                  type="text"
                  placeholder="Tên sự kiện"
                  value={formData.eventTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, eventTitle: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 mb-3"
                />
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 mb-3"
                />
                <input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) =>
                    setFormData({ ...formData, eventTime: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 mb-3"
                />
                <button
                  onClick={handleSubmit}
                  className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
                >
                  Tạo sự kiện
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CommunitySidebar;
