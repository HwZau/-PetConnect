import { HiChevronRight } from "react-icons/hi";
import { FaHome, FaWalking, FaHotel, FaMedkit } from "react-icons/fa";

const ServicesSection = () => {
  const services = [
    {
      icon: <FaHome className="text-2xl text-white" />,
      title: "Chăm sóc tại nhà",
      description:
        "Người chăm sóc đến nhà bạn để chăm sóc thú cưng trong môi trường quen thuộc",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: <FaWalking className="text-2xl text-white" />,
      title: "Dắt chó đi dạo",
      description:
        "Dịch vụ dắt chó đi dạo hàng ngày để thú cưng được vận động và khám phá",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: <FaHotel className="text-2xl text-white" />,
      title: "Nhận nuôi tạm thời",
      description:
        "Thú cưng được chăm sóc tại nhà người chăm sóc khi bạn đi xa",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: <FaMedkit className="text-2xl text-white" />,
      title: "Chăm sóc đặc biệt",
      description:
        "Dịch vụ chăm sóc chuyên biệt cho thú cưng có nhu cầu đặc biệt hoặc bệnh lý",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <section className="py-20 bg-gray-70">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Dịch vụ chăm sóc toàn diện
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Từ chăm sóc hàng ngày đến dịch vụ chuyên biệt, chúng tôi cung cấp
            đầy đủ các dịch vụ để thú cưng của bạn luôn khỏe mạnh và hạnh phúc.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {service.icon}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="flex items-center justify-between">
                  <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center group">
                    Tìm hiểu thêm
                    <HiChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all">
            Xem tất cả dịch vụ
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
