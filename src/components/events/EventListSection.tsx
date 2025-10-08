const EventListSection = () => {
  const events = [
    {
      id: 1,
      title: "Cuộc thi thú cưng đẹp nhất",
      date: "15/10/2024",
      time: "14:00 - 17:00",
      location: "Công viên Tao Đàn, Q.1",
      description:
        "Cuộc thi dành cho tất cả các loại thú cưng. Có nhiều giải thưởng hấp dẫn và hoạt động vui chơi.",
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&h=300",
      participants: 156,
      category: "Cuộc thi",
    },
    {
      id: 2,
      title: "Hội thảo chăm sóc chó mèo",
      date: "22/10/2024",
      time: "09:00 - 12:00",
      location: "Trung tâm Hội nghị, Q.3",
      description:
        "Học hỏi kinh nghiệm từ các chuyên gia thú y về cách chăm sóc thú cưng khỏe mạnh.",
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&h=300",
      participants: 89,
      category: "Hội thảo",
    },
    {
      id: 3,
      title: "Ngày hội nhận nuôi thú cưng",
      date: "29/10/2024",
      time: "08:00 - 16:00",
      location: "Công viên Gia Định, Q.Gò Vấp",
      description:
        "Sự kiện kết nối những chú thú cưng cần được nhận nuôi với các gia đình yêu thương.",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&h=300",
      participants: 234,
      category: "Nhận nuôi",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Những sự kiện sắp tới
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tham gia các sự kiện thú vị và kết nối với cộng đồng yêu thú cưng
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Event Image */}
              <div className="relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {event.title}
                </h3>

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
                    {event.date}
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
                </div>

                {/* Participants and Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                    {event.participants} người tham gia
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Tham gia
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center mt-12">
          <button className="bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300">
            Xem thêm sự kiện
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventListSection;
