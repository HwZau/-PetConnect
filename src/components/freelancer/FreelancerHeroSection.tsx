import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineEnvironment } from "react-icons/ai";
import DogImage from "../../assets/image/Dog.png";
import type { FreelancerHeroSectionProps } from "../../types";

const FreelancerHeroSection: React.FC<FreelancerHeroSectionProps> = ({
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    onSearch?.({ searchTerm, location, category });
  };

  const petServices = [
    "Chăm sóc thú cưng",
    "Huấn luyện thú cưng",
    "Bác sĩ thú y",
    "Làm đẹp thú cưng",
    "Trông giữ thú cưng",
    "Tắm rửa thú cưng",
    "Nhiếp ảnh thú cưng",
    "Tư vấn dinh dưỡng",
  ];

  return (
    <section className="min-h-screen bg-white relative overflow-hidden pt-16 px-3">
      {/* Banner with rounded corners and gradient background */}
      <div className="w-[95%] mx-auto bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100 rounded-t-3xl relative overflow-visible min-h-screen">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 right-1/5 transform -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-purple-200/25 to-indigo-200/25 rounded-full blur-2xl"></div>
          <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-indigo-300/20 to-violet-200/20 rounded-full blur-xl"></div>
        </div>

        {/* Content inside banner */}
        <div className="px-12 py-16 pt-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
            {/* Left side - Dog Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative z-10 flex justify-center">
                <div className="relative">
                  {/* Purple oval background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-200/30 to-purple-300/30 rounded-full transform scale-110 blur-sm"></div>

                  {/* Dog image */}
                  <img
                    src={DogImage}
                    alt="Freelancer thú cưng"
                    className="relative z-10 w-full max-w-lg h-auto object-contain drop-shadow-2xl"
                  />

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-amber-400 rounded-full animate-bounce delay-100"></div>
                  <div className="absolute top-16 -left-8 w-6 h-6 bg-rose-400 rounded-full animate-bounce delay-300"></div>
                  <div className="absolute bottom-20 -right-8 w-10 h-10 bg-indigo-400 rounded-full animate-bounce delay-500"></div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight text-center lg:text-left">
                  Tìm kiếm <br />
                  <span className="text-purple-600">freelancer thú cưng </span>
                  <span className="text-violet-600">chuyên nghiệp </span>
                  <br />
                  <span className="text-gray-900">trong khu vực</span>
                </h1>

                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                  Kết nối với những chuyên gia chăm sóc thú cưng hàng đầu trong
                  khu vực của bạn. Dịch vụ chất lượng, uy tín và đáng tin cậy.
                </p>
              </div>

              {/* Search Box */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Search Input */}
                  <div className="relative">
                    <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Tìm dịch vụ thú cưng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>

                  {/* Category Select */}
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-700 appearance-none bg-white"
                    >
                      <option value="">Tất cả dịch vụ</option>
                      {petServices.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Input */}
                  <div className="relative">
                    <AiOutlineEnvironment className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Vị trí của bạn..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="w-full bg-purple-600 text-white font-semibold py-4 rounded-xl hover:bg-purple-700 transition-colors duration-200 transform hover:scale-105 shadow-lg"
                >
                  <AiOutlineSearch className="inline-block w-5 h-5 mr-2" />
                  Tìm Freelancer Ngay
                </button>
              </div>

              {/* Popular Services */}
              <div className="mt-8">
                <p className="text-lg mb-4 text-gray-600">Dịch vụ phổ biến:</p>
                <div className="flex flex-wrap gap-3">
                  {petServices.slice(0, 6).map((service) => (
                    <button
                      key={service}
                      onClick={() => {
                        setCategory(service);
                        onSearch?.({ category: service });
                      }}
                      className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-all duration-200 text-sm font-medium border border-purple-200"
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreelancerHeroSection;
