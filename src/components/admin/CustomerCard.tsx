// file: CustomerCard.tsx
import React from "react";
import { useSettings } from "../../contexts/SettingsContext";
// IMPORT ICONS CẦN THIẾT
import { AiOutlineCalendar, AiOutlineDollarCircle, AiOutlineClockCircle, AiOutlineEnvironment, AiOutlineMail } from "react-icons/ai";
import { FaPaw } from "react-icons/fa";

interface CustomerCardProps {
  name: string;
  subtitle?: string;
  meta?: string;
  avatar?: string;
  badge?: string;
  actionLabel?: string;

  // 5 TRƯỜNG MỚI CHO CUSTOMER
  pet?: string;
  bookingCount?: number;
  totalSpent?: string;
  lastBooking?: string;
  region?: string;
}

// Helper component for displaying details inside the card
const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => {
  const { theme } = useSettings();
  const textCls = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const iconCls = theme === 'dark' ? 'text-green-400' : 'text-green-500';
  return (
    <div className={`flex items-center text-sm ${textCls}`}>
      <div className={`${iconCls} mr-2`}>{icon}</div>
      <div className="flex-1">
        <span className="font-medium">{label}:</span> {value}
      </div>
    </div>
  );
};

// Helper function để xử lý badge style
const getBadgeClasses = (badge: string) => {
  switch (badge) {
    case "Hoạt động":
      return "bg-green-100 text-green-800";
    case "VIP":
      return "bg-yellow-100 text-yellow-800";
    case "Không hoạt động":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}


const CustomerCard: React.FC<CustomerCardProps> = ({
  name,
  subtitle,
  
  avatar,
  badge,
  actionLabel,
  pet,
  bookingCount,
  totalSpent,
  lastBooking,
  region
}) => {

  const { theme } = useSettings();
  
 
  const titleCls = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const subCls = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';

  // Kiểm tra trạng thái không hoạt động
  const isInactive = badge === "Không hoạt động";

  // LOGIC CHO NÚT BẤM
  let buttonLabel = actionLabel || 'Xem Chi Tiết';
  let buttonClass = "flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors";
  let buttonIcon = null;

  if (isInactive) {
    buttonLabel = 'Liên hệ lại';
    buttonClass = "flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors";
    buttonIcon = <AiOutlineMail className="mr-2" />;
  }
  // END LOGIC CHO NÚT BẤM

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-xl`}>
      <div className="flex items-center gap-4">
        <img src={avatar || "https://i.pravatar.cc/80"} alt={name} className="w-16 h-16 rounded-full object-cover shadow-md" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-bold text-lg ${titleCls}`}>{name}</div>
              {subtitle && <div className={`text-sm ${subCls}`}>{subtitle}</div>}
            </div>
            {badge && <div className={`text-xs px-3 py-1 rounded-full font-medium ${getBadgeClasses(badge)}`}>{badge}</div>}
          </div>
        </div>
      </div>

      {/* HIỂN THỊ 5 THÔNG TIN MỚI */}
          {(pet || bookingCount !== undefined || totalSpent || lastBooking || region) && (
          <div className={`space-y-2 pt-4 mt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
          {pet && <DetailItem icon={<FaPaw />} label="Thú cưng" value={pet} />}
          {bookingCount !== undefined && <DetailItem icon={<AiOutlineCalendar />} label="Số lần đặt" value={`${bookingCount} lần`} />}
          {totalSpent && <DetailItem icon={<AiOutlineDollarCircle />} label="Tổng chi tiêu" value={totalSpent} />}
          {lastBooking && <DetailItem icon={<AiOutlineClockCircle />} label="Lần cuối đặt" value={lastBooking} />}
          {region && <DetailItem icon={<AiOutlineEnvironment />} label="Khu Vực" value={region} />}
        </div>
      )}

      {/* NÚT BẤM (ĐÃ CẬP NHẬT) */}
      <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} flex justify-center`}>
        <button className={buttonClass}>
          {buttonIcon}
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default CustomerCard;