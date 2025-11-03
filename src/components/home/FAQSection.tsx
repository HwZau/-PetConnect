import { useState } from "react";
import {
  FiCalendar,
  FiDollarSign,
  FiShield,
  FiAlertCircle,
  FiTruck,
  FiClock,
  FiRefreshCw,
  FiHeart,
  FiHelpCircle,
  FiSmile,
  FiMessageCircle,
  FiZap,
  FiPhone,
  FiMail,
  FiBookOpen,
  FiList,
  FiAward,
} from "react-icons/fi";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Làm thế nào để đặt lịch hẹn cho thú cưng?",
      answer:
        "Bạn có thể đặt lịch hẹn qua website, ứng dụng mobile hoặc gọi điện trực tiếp. Chỉ cần chọn dịch vụ, thời gian phù hợp và điền thông tin thú cưng. Chúng tôi sẽ xác nhận lịch hẹn trong vòng 30 phút.",
      icon: FiCalendar,
    },
    {
      question: "Chi phí dịch vụ như thế nào?",
      answer:
        "Chi phí phụ thuộc vào loại dịch vụ và kích cỡ thú cưng. Khám tổng quát từ 200,000đ, spa grooming từ 150,000đ, phẫu thuật từ 500,000đ. Chúng tôi luôn báo giá minh bạch trước khi thực hiện.",
      icon: FiDollarSign,
    },
    {
      question: "Thú cưng có cần tiêm phòng trước khi sử dụng dịch vụ?",
      answer:
        "Có, thú cưng cần được tiêm phòng đầy đủ và có sổ tiêm chủng. Điều này đảm bảo an toàn cho thú cưng của bạn và các bé khác tại trung tâm. Chúng tôi cũng cung cấp dịch vụ tiêm phòng.",
      icon: FiShield,
    },
    {
      question: "Dịch vụ cấp cứu 24/7 hoạt động như thế nào?",
      answer:
        "Chúng tôi có đội ngũ bác sĩ trực 24/7 để xử lý các trường hợp khẩn cấp. Bạn có thể gọi hotline cấp cứu 1900-1234 bất cứ lúc nào. Phí cấp cứu ngoài giờ sẽ có phụ thu 50%.",
      icon: FiAlertCircle,
    },
    {
      question: "Có dịch vụ đưa đón thú cưng không?",
      answer:
        "Có, chúng tôi cung cấp dịch vụ đưa đón trong bán kính 20km với phí từ 100,000đ/chuyến. Xe được trang bị lồng chuyên dụng, điều hòa và có nhân viên y tế đi kèm.",
      icon: FiTruck,
    },
    {
      question: "Thời gian chờ kết quả xét nghiệm là bao lâu?",
      answer:
        "Xét nghiệm cơ bản: 2-4 giờ, xét nghiệm chuyên sâu: 1-3 ngày, sinh thiết: 5-7 ngày. Kết quả khẩn cấp có thể trong vòng 1 giờ với phụ thu. Bạn sẽ nhận thông báo qua SMS/email khi có kết quả.",
      icon: FiClock,
    },
    {
      question: "Có chính sách hoàn tiền không?",
      answer:
        "Có, chúng tôi hoàn tiền 100% nếu hủy trước 24 giờ, 50% nếu hủy trong vòng 24 giờ. Trường hợp bất khả kháng sẽ được xem xét đặc biệt. Không hoàn tiền cho dịch vụ đã thực hiện.",
      icon: FiRefreshCw,
    },
    {
      question: "Làm thế nào để chăm sóc thú cưng sau điều trị?",
      answer:
        "Bác sĩ sẽ hướng dẫn chi tiết cách chăm sóc, cho thuốc và lịch tái khám. Bạn cũng nhận được sổ tay hướng dẫn và có thể liên hệ hotline tư vấn miễn phí 24/7 nếu có thắc mắc.",
      icon: FiHeart,
    },
  ];

  const quickStats = [
    { number: "2000+", label: "Câu hỏi được giải đáp", icon: FiHelpCircle },
    { number: "98%", label: "Khách hàng hài lòng", icon: FiSmile },
    { number: "24/7", label: "Hỗ trợ trực tuyến", icon: FiMessageCircle },
    { number: "<5min", label: "Thời gian phản hồi", icon: FiZap },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4 z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 shadow-lg">
            <FiHelpCircle className="text-indigo-800 text-sm mr-2" />
            <span className="text-indigo-800 text-sm font-medium">
              Câu hỏi thường gặp
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Giải đáp mọi thắc mắc
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tìm câu trả lời cho những câu hỏi phổ biến nhất về dịch vụ chăm sóc
            thú cưng
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="text-3xl mb-3">
                  <stat.icon />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* FAQ List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-xl text-white">
                        <faq.icon />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`transform transition-transform duration-300 ${
                        activeIndex === index ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="w-6 h-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      activeIndex === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-l-4 border-indigo-400">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Support */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FiMessageCircle className="text-3xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Vẫn có thắc mắc?</h3>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi câu
                  hỏi của bạn
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <FiPhone className="text-lg" />
                    <span className="font-semibold">1900-1234</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <FiMail className="text-lg" />
                    <span className="font-semibold">support@pawnest.com</span>
                  </div>
                </div>
                <button className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                  Liên hệ ngay
                </button>
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl p-8 text-white">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse mr-3"></div>
                <span className="font-semibold">Đang trực tuyến</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Chat trực tiếp</h3>
              <p className="text-white/90 mb-6 text-sm">
                Nhận hỗ trợ tức thì từ chuyên gia chăm sóc thú cưng
              </p>
              <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-xl transition-colors duration-300 backdrop-blur-sm">
                Bắt đầu chat
              </button>
            </div>

            {/* Resource Links */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Tài liệu hữu ích
              </h3>
              <div className="space-y-3">
                {[
                  { title: "Hướng dẫn chăm sóc cơ bản", icon: FiBookOpen },
                  { title: "Bảng giá dịch vụ", icon: FiDollarSign },
                  { title: "Quy trình khám chữa", icon: FiList },
                  { title: "Chính sách bảo hành", icon: FiAward },
                ].map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <link.icon className="text-xl" />
                    <span className="text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                      {link.title}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400 ml-auto group-hover:text-indigo-600 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
