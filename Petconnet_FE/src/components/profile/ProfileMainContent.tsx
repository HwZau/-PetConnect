import React from "react";
import { FaHeart, FaPaw, FaEdit } from "react-icons/fa";

interface ProfileMainContentProps {
  bio?: string;
  interests?: string[];
  onEdit?: () => void;
}

const ProfileMainContent: React.FC<ProfileMainContentProps> = ({
  bio = "Tôi yêu thích thú cưng và luôn muốn cho chúng những điều tốt nhất. Mong muốn tìm được những người chăm sóc thú cưng tận tâm và chuyên nghiệp.",
  interests = [
    "Chăm sóc thú cưng",
    "Huấn luyện chó",
    "Tắm spa cho thú cưng",
    "Thú y",
    "Dinh dưỡng thú cưng",
    "Vận động cùng thú cưng",
  ],
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* About Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaHeart className="text-pink-500" />
            Giới thiệu
          </h3>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-teal-600 hover:text-teal-700 transition-colors p-2 hover:bg-teal-50 rounded-lg"
            >
              <FaEdit />
            </button>
          )}
        </div>
        <p className="text-gray-700 leading-relaxed">{bio}</p>
      </div>

      {/* Interests Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaPaw className="text-orange-500" />
          Sở thích
        </h3>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 rounded-full text-sm font-medium border border-teal-200 hover:from-teal-100 hover:to-cyan-100 transition-all cursor-pointer"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileMainContent;
