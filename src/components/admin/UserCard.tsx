import React from "react";

interface UserCardProps {
  name: string;
  subtitle?: string;
  meta?: string;
  avatar?: string;
  badge?: string;
  actionLabel?: string;
}

const UserCard: React.FC<UserCardProps> = ({ name, subtitle, meta, avatar, badge, actionLabel }) => {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <img src={avatar || "https://i.pravatar.cc/80"} alt={name} className="w-14 h-14 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{name}</div>
              {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
            </div>
            {badge && <div className="text-xs px-2 py-1 text-green-700 bg-green-50 rounded">{badge}</div>}
          </div>

          {meta && <div className="text-sm text-gray-600 mt-2">{meta}</div>}
          <div className="mt-3">
            <button className="px-3 py-1 bg-green-600 text-white rounded">{actionLabel || "View Profile"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
