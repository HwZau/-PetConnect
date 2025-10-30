// file: AdminHeader.tsx

import React, { useEffect, useState } from "react";
import { AiOutlineSearch, AiOutlineBell, AiOutlineBulb } from "react-icons/ai";
import { useSearch } from "../../contexts/SearchContext";
import { useSettings } from "../../contexts/SettingsContext";

const AdminHeader: React.FC = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [local, setLocal] = useState<string>(searchQuery || "");

  // keep local in sync when context changes elsewhere
  useEffect(() => { setLocal(searchQuery || ""); }, [searchQuery]);

  // debounce writes to context
  useEffect(() => {
    const id = setTimeout(() => setSearchQuery(local), 300);
    return () => clearTimeout(id);
  }, [local, setSearchQuery]);

  const { language, theme, toggleTheme, setLanguage } = useSettings();
  const t = (vi: string, en: string) => (language === 'vi' ? vi : en);

  return (
    // THAY ĐỔI: header theme-aware
    <header className={`${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} py-4 px-8 flex items-center justify-between shadow-sm z-10`}>
      <div className="flex items-center gap-4 w-full max-w-lg">
        <div className="relative flex-1">
          <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder={t('Tìm kiếm freelancer, khách hàng, công việc...', 'Search freelancers, customers, jobs...')}
            className={`w-full pl-10 pr-10 py-2 border rounded-xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500`}
          />
          {local && (
            <button
              onClick={() => { setLocal(''); setSearchQuery(''); }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
              aria-label="clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Nút thông báo */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <AiOutlineBell className="text-2xl text-gray-600" />
          <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button>

        {/* Theme toggle */}
        <button onClick={toggleTheme} title={t('Chuyển giao diện', 'Toggle theme')} className="p-2 rounded-md hover:bg-gray-100">
          <AiOutlineBulb className="text-xl text-green-600" />
        </button>

        {/* Language select */}
        <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="rounded-md border-gray-200 px-2 py-1">
          <option value="vi">VI</option>
          <option value="en">EN</option>
        </select>

        {/* Avatar Admin */}
        <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors">
          <img src="https://i.pravatar.cc/40" alt="avatar" className="w-10 h-10 rounded-full border-2 border-green-500" />
          <div className="text-sm hidden sm:block">
            <div className="font-medium">{t('Quản Trị Viên','Administrator')}</div>
            <div className="text-xs text-gray-500">{t('Người quản trị hệ thống','System administrator')}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;