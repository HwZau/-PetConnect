// file: components/admin/StatCard.tsx

import React from 'react';

interface StatCardProps {
  title: string;
  value: string|number;
  delta: string;
  icon: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, delta, icon }) => {
  // Xác định màu sắc cho delta dựa trên nội dung
  const deltaColorClass = delta.includes('+') ? 'text-green-500' : delta.includes('-') ? 'text-red-500' : 'text-gray-500';

  return (
    // Đã cập nhật: rounded-2xl, shadow-xl, p-6
    <div className="bg-white rounded-2xl shadow-xl p-6 flex items-start space-x-4">
      <div className="flex-shrink-0">
        {/* Icon lớn hơn và màu xanh lá */}
        <div className="text-green-600 text-3xl p-2 bg-green-100 rounded-full"> 
          {icon}
        </div>
      </div>
      <div className="flex-grow">
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{value}</h3>
        <p className={`text-xs ${deltaColorClass}`}>{delta}</p>
      </div>
    </div>
  );
};

export default StatCard;