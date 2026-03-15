import { useState } from "react";
import {
  FiHome,
  FiActivity,
  FiDroplet,
  FiShield,
  FiHeart,
  FiEye,
  FiLock,
  FiTag,
  FiThermometer,
  FiPhone,
  FiAlertCircle,
  FiZap,
} from "react-icons/fi";

const PetCareTipsSection = () => {
  const [activeTab, setActiveTab] = useState<"daily" | "health" | "safety">(
    "daily"
  );

  const tipCategories = {
    daily: {
      title: "Chăm sóc hàng ngày",
      icon: FiHome,
      tips: [
        {
          icon: FiHeart,
          title: "Chế độ dinh dưỡng",
          description:
            "Đảm bảo thú cưng có chế độ ăn uống cân bằng và đầy đủ chất dinh dưỡng",
          details:
            "Chia nhỏ khẩu phần ăn trong ngày, tránh cho ăn quá nhiều một lúc",
        },
        {
          icon: FiDroplet,
          title: "Vệ sinh thường xuyên",
          description:
            "Tắm rửa và vệ sinh cho thú cưng đều đặn để tránh bệnh tật",
          details: "Tắm 1-2 lần/tuần cho chó, mèo có thể ít hơn do tự làm sạch",
        },
        {
          icon: FiActivity,
          title: "Vận động đủ",
          description: "Đảm bảo thú cưng có đủ hoạt động thể chất mỗi ngày",
          details:
            "Chó cần ít nhất 30 phút vận động, mèo cần đồ chơi kích thích",
        },
      ],
    },
    health: {
      title: "Sức khỏe",
      icon: FiHeart,
      tips: [
        {
          icon: FiShield,
          title: "Tiêm phòng đầy đủ",
          description: "Theo dõi lịch tiêm phòng và khám sức khỏe định kỳ",
          details:
            "Tiêm phòng cơ bản: dại, Care, Parvo cho chó; FPV, FHV cho mèo",
        },
        {
          icon: FiHeart,
          title: "Chăm sóc răng miệng",
          description: "Vệ sinh răng miệng để tránh các bệnh về nướu và răng",
          details: "Đánh răng 2-3 lần/tuần, sử dụng kem đánh răng chuyên dụng",
        },
        {
          icon: FiEye,
          title: "Theo dõi triệu chứng",
          description: "Quan sát và phát hiện sớm các dấu hiệu bất thường",
          details: "Chú ý thay đổi về ăn uống, đi vệ sinh, hoạt động",
        },
      ],
    },
    safety: {
      title: "An toàn",
      icon: FiShield,
      tips: [
        {
          icon: FiLock,
          title: "Môi trường an toàn",
          description:
            "Tạo không gian sống an toàn, tránh các vật dụng nguy hiểm",
          details: "Cất giấu hóa chất, thuốc, thực phẩm có hại xa tầm với",
        },
        {
          icon: FiTag,
          title: "Đeo thẻ định danh",
          description: "Luôn đeo thẻ tên và thông tin liên lạc khi ra ngoài",
          details: "Ghi rõ tên, số điện thoại chủ, địa chỉ trên thẻ",
        },
        {
          icon: FiThermometer,
          title: "Kiểm soát nhiệt độ",
          description: "Đảm bảo nhiệt độ phù hợp, tránh quá nóng hoặc quá lạnh",
          details: "Nhiệt độ lý tưởng: 18-22°C, luôn có nước sạch",
        },
      ],
    },
  };

  const emergencyContacts = [
    {
      icon: FiAlertCircle,
      title: "Cấp cứu 24/7",
      number: "1900-1234",
      desc: "Bệnh viện thú y trung ương",
    },
    {
      icon: FiPhone,
      title: "Tư vấn miễn phí",
      number: "1900-5678",
      desc: "Hotline chăm sóc thú cưng",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-300 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-purple-300 rounded-full animate-ping"></div>
      </div>

      <div className="container relative mx-auto px-4 z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 shadow-lg">
            <span className="text-emerald-800 text-sm font-medium">
              💡 Mẹo chăm sóc
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Bí quyết chăm sóc thú cưng
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tổng hợp những kinh nghiệm và mẹo hay từ các chuyên gia hàng đầu
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(tipCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() =>
                  setActiveTab(key as "daily" | "health" | "safety")
                }
                className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === key
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                }`}
              >
                <category.icon className="text-2xl" />
                <span>{category.title}</span>
              </button>
            ))}
          </div>

          {/* Tips Content */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 mb-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {tipCategories[activeTab].tips.map((tip, index) => (
                <div
                  key={index}
                  className="group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 h-full">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl flex items-center justify-center text-2xl text-white mb-6 group-hover:from-emerald-500 group-hover:to-blue-500 transition-all duration-300">
                      <tip.icon />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {tip.description}
                    </p>
                    <div className="bg-emerald-50 rounded-lg p-3 border-l-4 border-emerald-400">
                      <p className="text-sm text-emerald-700 font-medium">
                        💡 {tip.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <FiZap className="text-2xl" />
                </div>
                <h3 className="text-2xl font-bold">Mẹo nhanh</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FiHeart className="text-yellow-300 text-lg mt-1" />
                  <p className="text-white/90">
                    Luôn có sẵn số điện thoại bác sĩ thú y gần nhà
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <FiShield className="text-yellow-300 text-lg mt-1" />
                  <p className="text-white/90">
                    Chuẩn bị túi sơ cứu cho thú cưng với băng gạc, thuốc sát
                    trùng
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <FiEye className="text-yellow-300 text-lg mt-1" />
                  <p className="text-white/90">
                    Chụp ảnh thú cưng định kỳ để theo dõi sức khỏe
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl p-8 text-white">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <FiAlertCircle className="text-2xl" />
                </div>
                <h3 className="text-2xl font-bold">Liên hệ khẩn cấp</h3>
              </div>
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded-xl p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <contact.icon className="text-xl" />
                        <span className="font-semibold">{contact.title}</span>
                      </div>
                      <span className="text-2xl font-bold">
                        {contact.number}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">{contact.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetCareTipsSection;
