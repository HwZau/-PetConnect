// file: components/admin/StatCard.tsx

import React from 'react';
import { useSettings } from "../../contexts/SettingsContext";

interface StatCardProps {
  title: string;
  value: string|number;
  delta: string;
  icon: React.ReactNode;
  className?: string;
  // optional accent class applied to the icon circle (e.g. 'bg-emerald-50 text-emerald-600')
  accent?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, delta, icon }) => {
  const { theme } = useSettings();
  // Xác định màu sắc cho delta dựa trên nội dung
  const deltaColorClass = delta.includes('+') ? 'text-green-500' : delta.includes('-') ? 'text-red-500' : (theme === 'dark' ? 'text-gray-300' : 'text-gray-500');
  const bgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const titleClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  const valueClass = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';

  return (
    // Đã cập nhật: rounded-2xl, shadow-xl, p-6
    <div className={`${bgClass} rounded-2xl shadow-xl p-6 flex items-start space-x-4`}>
      <div className="flex-shrink-0">
        {/* Icon lớn hơn; uses accent background if provided for pastel look */}
        <div className={`text-3xl p-3 rounded-full ${/* default */ 'bg-green-50 text-green-600'}`}>
          {icon}
        </div>
      </div>
      <div className="flex-grow">
        <p className={`${titleClass} text-sm mb-1`}>{title}</p>
        <h3 className={`text-2xl font-bold ${valueClass} mb-2`}>{value}</h3>
        <p className={`text-xs ${deltaColorClass}`}>{delta}</p>
      </div>
    </div>
  );
};

export default StatCard;