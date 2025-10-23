import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, delta, icon, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className || ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-500">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
        {icon && <div className="text-2xl text-green-500">{icon}</div>}
      </div>
      {delta && <div className="text-sm text-green-500 mt-2">{delta}</div>}
    </div>
  );
};

export default StatCard;
