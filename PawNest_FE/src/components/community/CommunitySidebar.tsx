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
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-2 mb-5">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AiOutlineFire className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Chủ đề Hot</h3>
          </div>
          <div className="space-y-2">
            {trendingTopics.map((t, idx) => (
              <div
                key={t.id}
                onClick={() => showSuccess(`📢 Mở chủ đề: ${t.title}`)}
                className="group relative flex items-center justify-between py-3 px-3 hover:bg-orange-50 rounded-xl cursor-pointer transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-orange-500">#{idx + 1}</span>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-600">{t.title}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t.posts} bài viết</p>
                </div>
                <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Members */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-5">👥 Thành viên hoạt động</h3>
          <div className="space-y-3">
            {activeMembers.map((m) => (
              <div
                key={m.id}
                onClick={() => showSuccess(`👤 Xem hồ sơ: ${m.name}`)}
                className="group flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-all"
              >
                <div className="relative">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400"
                  />
                  {m.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-3 border-white shadow-sm"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                  <p className="text-xs text-blue-600 font-medium">{m.specialty}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {m.isOnline ? 'Hoạt động' : 'Ngoại tuyến'}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-orange-600 hover:text-orange-700 font-bold transition-colors py-2 hover:bg-orange-50 rounded-lg">
            Xem tất cả thành viên →
          </button>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-2 mb-5">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AiOutlineCalendar className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Sự kiện sắp tới</h3>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((e) => (
              <div
                key={e.id}
                onClick={() => showSuccess(`📅 Chi tiết sự kiện: ${e.title}`)}
                className="border-2 border-purple-200 rounded-xl p-4 hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-all group"
              >
                <h4 className="text-sm font-bold text-gray-800 mb-2 group-hover:text-purple-700">{e.title}</h4>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>📅 {e.date}</span>
                  <span>🕒 {e.time}</span>
                  <span className="ml-auto font-semibold text-purple-600">{e.participants} 👥</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-2 mb-4">
            <AiOutlineStar className="w-6 h-6" />
            <h3 className="text-lg font-bold">Thống kê cộng đồng</h3>
          </div>
          <div className="space-y-3 text-orange-500 text-sm">
            <div className="flex justify-between items-center bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur">
              <span className="font-medium">Tổng thành viên</span>
              <span className="font-bold text-lg">2,547</span>
            </div>
            <div className="flex justify-between items-center bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur">
              <span className="font-medium">Bài viết hôm nay</span>
              <span className="font-medium">Bài viết hôm nay</span>
              <span className="font-bold text-lg">42</span>
            </div>
            <div className="flex justify-between items-center bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur">
              <span className="font-medium">Thảo luận hoạt động</span>
              <span className="font-bold text-lg">156</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunitySidebar;