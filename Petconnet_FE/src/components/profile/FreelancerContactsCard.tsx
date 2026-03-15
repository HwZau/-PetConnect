import React from "react";
import { FaComments, FaSearch } from "react-icons/fa";

interface Freelancer {
  id: string;
  name: string;
  title: string;
  avatar: string;
  company?: string;
  lastMessage?: string;
  online?: boolean;
}

interface FreelancerContactsCardProps {
  freelancers?: Freelancer[];
  onSelectFreelancer?: (freelancerId: string) => void;
}

const FreelancerContactsCard: React.FC<FreelancerContactsCardProps> = ({
  freelancers,
  onSelectFreelancer,
}) => {
  const defaultFreelancers: Freelancer[] = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      title: "Chăm sóc chó mèo",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
      company: "PetCare Pro",
      lastMessage: "Cảm ơn bạn đã sử dụng dịch vụ!",
      online: true,
    },
    {
      id: "2",
      name: "Trần Thị B",
      title: "Huấn luyện thú cưng",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100",
      company: "Happy Pets",
      lastMessage: "Hẹn gặp lại bạn!",
      online: false,
    },
    {
      id: "3",
      name: "Lê Văn C",
      title: "Spa & Grooming",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100",
      company: "Paw Salon",
      lastMessage: "Thú cưng của bạn rất ngoan!",
      online: true,
    },
  ];

  const displayFreelancers = freelancers || defaultFreelancers;

  const handleClick = (freelancerId: string) => {
    if (onSelectFreelancer) {
      onSelectFreelancer(freelancerId);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <FaComments className="mr-2 text-xl text-teal-600" />
        Freelancer đã liên hệ
      </h3>

      <div className="space-y-3">
        {displayFreelancers.map((freelancer) => (
          <div
            key={freelancer.id}
            onClick={() => handleClick(freelancer.id)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all cursor-pointer group border border-transparent hover:border-teal-200"
          >
            <div className="relative">
              <img
                src={freelancer.avatar}
                alt={freelancer.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-teal-400 transition-all"
              />
              {freelancer.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 truncate group-hover:text-teal-600 transition-colors">
                {freelancer.name}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {freelancer.title}
              </p>
              {freelancer.lastMessage && (
                <p className="text-xs text-gray-400 truncate mt-1">
                  {freelancer.lastMessage}
                </p>
              )}
            </div>

            <FaComments className="text-gray-300 group-hover:text-teal-600 transition-colors text-xl" />
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-teal-600 hover:text-white hover:bg-teal-600 font-medium text-sm py-2 border border-teal-600 rounded-lg transition-all flex items-center justify-center gap-2">
        <FaSearch /> Tìm thêm Freelancer
      </button>
    </div>
  );
};

export default FreelancerContactsCard;
