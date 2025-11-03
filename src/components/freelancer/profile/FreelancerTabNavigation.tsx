import React from "react";

interface Tab {
  id: string;
  label: string;
}

interface FreelancerTabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

const FreelancerTabNavigation: React.FC<FreelancerTabNavigationProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  const tabs: Tab[] = [
    { id: "overview", label: "Tổng quan" },
    { id: "reviews", label: "Đánh giá" },
    { id: "portfolio", label: "Portfolio" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
};

export default FreelancerTabNavigation;
