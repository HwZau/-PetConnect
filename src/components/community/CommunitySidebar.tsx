import React from "react";
import {
  AiOutlineUser,
  AiOutlineFire,
  AiOutlineCalendar,
  AiOutlineCamera,
  AiOutlineHeart,
  AiOutlineStar,
  AiOutlineRight,
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
    {
      id: 4,
      name: "Phạm Tuấn",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      isOnline: true,
      specialty: "Pet Sitter",
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
    {
      id: 3,
      title: "Gặp gỡ freelancer thú cưng",
      date: "25/10/2025",
      time: "16:00",
      participants: 42,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hành động nhanh
        </h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
            <div className="flex items-center space-x-3">
              <AiOutlineCamera className="w-5 h-5" />
              <span>Đăng ảnh thú cưng</span>
            </div>
            <AiOutlineRight className="w-4 h-4" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <AiOutlineUser className="w-5 h-5" />
              <span>Tìm freelancer</span>
            </div>
            <AiOutlineRight className="w-4 h-4" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
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
        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {topic.title}
                </p>
                <p className="text-xs text-gray-500">{topic.posts} bài viết</p>
              </div>
              <AiOutlineRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Active Members */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thành viên hoạt động
        </h3>
        <div className="space-y-3">
          {activeMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-3 py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-colors"
            >
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {member.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {member.name}
                </p>
                <p className="text-xs text-orange-600">{member.specialty}</p>
              </div>
            </div>
          ))}
        </div>
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
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors cursor-pointer"
            >
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                {event.title}
              </h4>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {event.date} • {event.time}
                </span>
                <div className="flex items-center space-x-1">
                  <AiOutlineUser className="w-3 h-3" />
                  <span>{event.participants}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium">
          Xem tất cả sự kiện
        </button>
      </div>

      {/* Community Stats */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center space-x-2 mb-4">
          <AiOutlineStar className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Thống kê cộng đồng</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90">Tổng thành viên</span>
            <span className="font-bold">2,547</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90">Bài viết hôm nay</span>
            <span className="font-bold">42</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90">Freelancer online</span>
            <span className="font-bold">156</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90">Đánh giá trung bình</span>
            <div className="flex items-center space-x-1">
              <AiOutlineHeart className="w-4 h-4 fill-current" />
              <span className="font-bold">4.8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySidebar;
