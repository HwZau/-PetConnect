interface FilterState {
  search: string;
  category: string;
  location: string;
  dateRange: string;
}

interface IncomingEventsSectionProps {
  filters?: FilterState;
}

const IncomingEventsSection = ({ filters }: IncomingEventsSectionProps) => {
  const allEvents = [
    {
      id: 1,
      title: "Workshop: Chăm sóc thú cưng mùa đông",
      date: "2024-12-15",
      time: "14:00 - 17:00",
      location: "Trung tâm Thú y Sài Gòn",
      description:
        "Học cách chăm sóc thú cưng trong mùa đông lạnh, bao gồm dinh dưỡng và sức khỏe.",
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&h=250",
      category: "Workshop",
      price: "200.000 VNĐ",
      attendees: 45,
      maxAttendees: 80,
      organizer: "Dr. Nguyễn Minh",
    },
    {
      id: 2,
      title: "Pet Fashion Show 2024",
      date: "2024-12-20",
      time: "18:00 - 21:00",
      location: "Diamond Plaza, Q.1",
      description:
        "Show diễn thời trang dành cho thú cưng với những bộ trang phục độc đáo và dễ thương.",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&h=250",
      category: "Show",
      price: "Free",
      attendees: 120,
      maxAttendees: 200,
      organizer: "PawStyle Community",
    },
    {
      id: 3,
      title: "Ngày hội nhận nuôi cuối năm",
      date: "2024-12-28",
      time: "08:00 - 16:00",
      location: "Công viên Tao Đàn",
      description:
        "Sự kiện lớn nhất trong năm giúp các bé thú cưng tìm được gia đình mới.",
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&h=250",
      category: "Adoption",
      price: "Free",
      attendees: 89,
      maxAttendees: 150,
      organizer: "Animal Rescue Saigon",
    },
    {
      id: 4,
      title: "Cuộc thi Pet Talent Show",
      date: "2025-01-05",
      time: "13:00 - 18:00",
      location: "Nhà văn hóa Q.3",
      description:
        "Thú cưng của bạn có tài năng đặc biệt? Hãy tham gia cuộc thi và thể hiện tài năng!",
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&h=250",
      category: "Competition",
      price: "100.000 VNĐ",
      attendees: 67,
      maxAttendees: 100,
      organizer: "Pet Talent Vietnam",
    },
  ];

  // Filter events based on filters
  const filteredEvents = allEvents.filter((event) => {
    if (
      filters?.search &&
      !event.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !event.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (
      filters?.category &&
      event.category.toLowerCase() !== filters.category
    ) {
      return false;
    }
    if (filters?.location) {
      const eventLocationLower = event.location.toLowerCase();
      const filterLocationLower = filters.location.toLowerCase();
      if (!eventLocationLower.includes(filterLocationLower)) {
        return false;
      }
    }
    // Add date filtering logic here if needed
    return true;
  });

  const incomingEvents = filteredEvents;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Workshop":
        return "bg-blue-600";
      case "Show":
        return "bg-purple-600";
      case "Adoption":
        return "bg-green-600";
      case "Competition":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const getAttendancePercentage = (attendees: number, maxAttendees: number) => {
    return Math.round((attendees / maxAttendees) * 100);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sự kiện nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những sự kiện đặc biệt và được quan tâm nhiều nhất trong cộng đồng
            yêu thú cưng
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {incomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Event Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className={`${getCategoryColor(
                      event.category
                    )} text-white px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {event.category}
                  </span>
                  <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {event.price}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex-1">
                    {event.title}
                  </h3>
                </div>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                    Tổ chức bởi {event.organizer}
                  </div>
                </div>

                {/* Attendance Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>
                      {event.attendees}/{event.maxAttendees} người tham gia
                    </span>
                    <span>
                      {getAttendancePercentage(
                        event.attendees,
                        event.maxAttendees
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${getAttendancePercentage(
                          event.attendees,
                          event.maxAttendees
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Đăng ký tham gia
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
            Xem tất cả sự kiện
          </button>
        </div>
      </div>
    </section>
  );
};

export default IncomingEventsSection;
