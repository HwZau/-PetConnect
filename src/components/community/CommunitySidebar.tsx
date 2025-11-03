import React from "react";
import { showSuccess } from "../../utils/toastUtils";
import {
  AiOutlineFire,
  AiOutlineCalendar,
  AiOutlineStar,
} from "react-icons/ai";

const CommunitySidebar: React.FC = () => {
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
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
      isOnline: true,
      specialty: "Bác sĩ thú y",
    },
    {
      id: 2,
      name: "Trần Đức",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      isOnline: true,
      specialty: "Huấn luyện viên",
    },
    {
      id: 3,
      name: "Lê Hoa",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
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

  return (
    <>
      <div className="space-y-6">
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
    </>
  );
};

export default CommunitySidebar;