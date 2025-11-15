import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHome, AiOutlineSetting, AiOutlineUser, AiOutlineBell } from 'react-icons/ai';
import { useSettings } from '../../contexts/SettingsContext';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useSettings();

  const handleVisitHomePage = () => {
    navigate('/'); // Navigate to homepage
  };

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Cài Đặt Hệ Thống</h2>
          <p className="text-gray-500">Quản lý cài đặt và tùy chỉnh cho hệ thống quản trị.</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Website Section */}
          <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 shadow-xl`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 rounded-xl">
                <AiOutlineHome className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold">Website</h3>
            </div>
            <div className="pl-11">
              <button
                onClick={handleVisitHomePage}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors inline-flex items-center gap-2"
              >
                <AiOutlineHome />
                {t('Truy cập Trang Chủ', 'Visit Homepage')}
              </button>
              <p className="mt-2 text-sm text-gray-400">
                {t('Chuyển đến giao diện người dùng của website', 'Go to the public-facing website')}
              </p>
            </div>
          </div>

          {/* Theme & Language */}
          <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 shadow-xl`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 rounded-xl">
                <AiOutlineSetting className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold">{t('Giao diện & Ngôn ngữ', 'Appearance & Language')}</h3>
            </div>
            <div className="space-y-4 pl-11">
              <div className="flex items-center justify-between max-w-md">
                <span>{t('Ngôn ngữ', 'Language')}</span>
                <div className="text-sm">{language === 'vi' ? 'Tiếng Việt' : 'English'}</div>
              </div>

              <div className="flex items-center justify-between max-w-md">
                <span>{t('Chế độ', 'Mode')}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1 rounded-lg ${theme === 'light' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    {t('Sáng', 'Light')}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1 rounded-lg ${theme === 'dark' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    {t('Tối', 'Dark')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Other small settings remain similar (kept basic) */}
          <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 shadow-xl`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-xl">
                <AiOutlineUser className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold">{t('Tùy Chỉnh Người Dùng', 'User Preferences')}</h3>
            </div>
            <div className="space-y-4 pl-11">
              <div className="flex items-center justify-between max-w-md">
                <span>{t('Ngôn ngữ giao diện', 'Interface Language')}</span>
                <div className="text-sm">{language === 'vi' ? 'Tiếng Việt' : 'English'}</div>
              </div>
            </div>
          </div>

          {/* Notifications and security cards stay visually consistent */}
          <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 shadow-xl`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-50 rounded-xl">
                <AiOutlineBell className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-xl font-bold">{t('Thông Báo', 'Notifications')}</h3>
            </div>
            <div className="space-y-4 pl-11">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-orange-600 focus:ring-orange-500" defaultChecked />
                  <span className="ml-2">{t('Thông báo đặt lịch mới', 'New booking notifications')}</span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;