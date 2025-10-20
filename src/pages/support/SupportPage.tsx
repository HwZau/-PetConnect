import { useState } from "react";
import Navbar from "../../components/common/Navbar";
import  Footer  from "../../components/common/Footer";
import DogImage from "../../assets/image/AssistDog.png";
import { Search, Calendar, CreditCard, ShieldCheck, Users,  MessageCircle, Phone } from "lucide-react";

// Định nghĩa type cho các tab
type TabKey = "schedule" | "service" | "payment" | "safety";
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow p-6">{children}</div>
);
const SupportPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("schedule");

  const tabs: { id: TabKey; label: string }[] = [
    { id: "schedule", label: "Đặt lịch" },
    { id: "service", label: "Dịch vụ" },
    { id: "payment", label: "Thanh toán" },
    { id: "safety", label: "Tin tưởng & an toàn" },
  ];

  const faqData: Record<TabKey, string[]> = {
    schedule: [
      "Làm thế nào để tôi đặt dịch vụ chăm sóc thú cưng mới?",
      "Tôi có thể sửa lịch đặt hiện tại không?",
      "Chính sách hủy đặt lịch của bạn là gì?",
      "Làm thế nào để thêm nhiều thú cưng vào một lần đặt lịch?",
    ],
    service: [
      "Dịch vụ chăm sóc thú cưng bao gồm những gì?",
      "Làm sao để chọn được người chăm sóc phù hợp?",
      "Tôi có thể yêu cầu dịch vụ tại nhà không?",
      "Có hỗ trợ chăm sóc đặc biệt cho thú cưng bị bệnh không?",
    ],
    payment: [
      "Tôi có thể thanh toán bằng những phương thức nào?",
      "Có hoàn tiền nếu tôi hủy đặt lịch không?",
      "Làm sao để nhận hóa đơn thanh toán?",
      "Có hỗ trợ trả góp cho dịch vụ không?",
    ],
    safety: [
      "Người chăm sóc thú cưng được kiểm tra thế nào?",
      "Bạn có chính sách bảo hiểm thú cưng không?",
      "Làm sao để đảm bảo an toàn khi gặp người chăm sóc?",
      "Có hỗ trợ khẩn cấp khi xảy ra sự cố không?",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        {/* Header Section */}
        <div className="relative">
          <img
            src={DogImage}
            alt="Support Dog"
            className="mx-auto max-h-[800px] w-full h-auto rounded-lg shadow-md mt-11 ml-2 object-cover"
          />
          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
              Cần sự trợ giúp?
            </h1>
            <p className="mt-4 text-lg md:text-xl drop-shadow">
              Hướng dẫn đáng tin cậy giải đáp những thắc mắc của bạn
            </p>
            <a>Tìm câu trả lời </a>
            {/* Search bar */}
            <div className="mt-6 w-full max-w-lg flex items-center bg-white rounded-full shadow p-2">
              <Search className="text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Search for help..."
                className="flex-1 px-3 py-2 text-gray-700 rounded-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <section className="py-12 px-6">
          <h2 className="text-2xl font-bold text-center mb-8">
            Những chủ đề phổ biến và đường link nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Calendar className="mx-auto text-blue-500 w-10 h-10 mb-4" />
              <h3 className="font-semibold mb-2">Quản lí đặt lịch</h3>
              <p className="text-sm text-gray-600">
                Điều chỉnh hoặc xem những buổi đặt lịch chăm sóc thú cưng của
                bạn
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <CreditCard className="mx-auto text-blue-500 w-10 h-10 mb-4" />
              <h3 className="font-semibold mb-2">Thanh toán</h3>
              <p className="text-sm text-gray-600">
                Hiểu hóa đơn, quản lí thanh toán
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <ShieldCheck className="mx-auto text-blue-500 w-10 h-10 mb-4" />
              <h3 className="font-semibold mb-2">Tin tưởng & an toàn</h3>
              <p className="text-sm text-gray-600">
                Tìm hiểu về các giao thức an toàn và tiêu chuẩn chăm sóc thú
                cưng của chúng tôi
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Users className="mx-auto text-blue-500 w-10 h-10 mb-4" />
              <h3 className="font-semibold mb-2">Dịch vụ cung cấp</h3>
              <p className="text-sm text-gray-600">
                Khám phá đầy đủ các dịch vụ chăm sóc, đặt thú cưng đi dạo và
                chải chuốt
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-6 flex justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl px-8 py-10">
            <h2 className="text-2xl font-bold text-center mb-4">
              Câu hỏi được hỏi thường xuyên
            </h2>
            <p className="text-center text-[#8C8D8B] mb-8">
              Tìm câu trả lời cho những câu hỏi thường gặp về dịch vụ của chúng
              tôi
            </p>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-[200px] h-[35px] rounded-lg ml-7 font-medium transition ${
                    activeTab === tab.id
                      ? "bg-[#3F9BC6] text-white"
                      : "bg-[#8C8D8B] text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* FAQ Content */}
            <div className="max-w-3xl mx-auto">
              {faqData[activeTab].map((question: string, index: number) => (
                <div key={index} className="mb-4">
                  <details className="bg-white p-4 rounded-lg shadow cursor-pointer">
                    <summary className="font-medium">{question}</summary>
                    <p className="mt-2 text-gray-600">
                      Đây là câu trả lời mẫu cho: "{question}".
                    </p>
                  </details>
                  {/* Divider (không full width, dài hơn câu hỏi) */}
                  {index < faqData[activeTab].length - 1 && (
                    <div className="mx-8 my-4 border-t border-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 mb-18">
        <h2 className="text-2xl font-bold text-center mb-8">
          Những phương tiện liên hệ
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12">
          {/* Cột 1: Email */}
          <div className="flex justify-center">
            <Card>
              <h3 className="font-semibold text-lg mb-2">Email chúng tôi</h3>
              <p className="text-gray-600 text-sm mb-4">
                Hãy điền vào mẫu dưới đây và chúng tôi sẽ phản hồi bạn trong vòng
                24 giờ.
              </p>
              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Tên của bạn"
                  className="w-full border rounded p-2 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full border rounded p-2 text-sm"
                />
                <textarea
                  placeholder="Miêu tả vấn đề hoặc câu hỏi của bạn"
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                />
                <button
                  type="submit"
                  className="w-full bg-[#3F9BC6] text-white py-2 rounded hover:opacity-90 transition"
                >
                  Gửi tin nhắn
                </button>
              </form>
            </Card>
          </div>

          {/* Cột 2: Chat + Hotline */}
          <div className="flex flex-col items-center space-y-6">
            <Card>
              <div className="flex flex-col items-center text-center">
                <MessageCircle className="w-8 h-8 text-[#3F9BC6] mb-2" />
                <h3 className="font-semibold">Chat trực tiếp</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Nhận được hỗ trợ ngay lập tức từ đội ngũ chúng tôi.
                </p>
                <button className="w-full border rounded py-2 text-sm hover:bg-gray-50">
                  Bắt đầu chat ngay
                </button>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col items-center text-center">
                <Phone className="w-8 h-8 text-[#3F9BC6] mb-2" />
                <h3 className="font-semibold">Hotline Support</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Speak directly with our support agents. Call us at:
                </p>
                <button className="w-full border rounded py-2 text-sm hover:bg-gray-50">
                  +1 (800) PET-CARE
                </button>
              </div>
            </Card>
          </div>

          {/* Cột 3: Tài nguyên hữu ích */}
          <div className="flex justify-center">
            <Card>
              <h3 className="font-semibold text-lg mb-2">Tài nguyên hữu ích</h3>
              <p className="text-gray-600 text-sm mb-4">
                Khám phá các hướng dẫn và bài viết chi tiết để giúp bạn chăm sóc
                thú cưng.
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-[#3F9BC6] hover:underline">
                    → Hướng dẫn tối ưu về huấn luyện chó con
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#3F9BC6] hover:underline">
                    → Hiểu về dinh dưỡng cho thú cưng: Tìm hiểu sâu hơn
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#3F9BC6] hover:underline">
                    → Sơ cứu cho thú cưng: Những điều mọi chủ nuôi nên biết
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#3F9BC6] hover:underline">
                    → Cách chọn người trông thú cưng tốt nhất cho người bạn lông
                    lá của bạn
                  </a>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SupportPage;