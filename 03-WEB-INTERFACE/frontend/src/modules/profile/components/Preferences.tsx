import React, { useState } from 'react';
import { Moon, Sun, Bell, Globe } from 'lucide-react';
import { useTheme } from '@/core/theme/useTheme';

const Preferences: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5" />
          المظهر
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
              theme === 'dark'
                ? 'border-ide-accent bg-ide-accent/10'
                : 'border-ide-border hover:border-ide-accent/50'
            }`}
          >
            <Moon className="w-6 h-6" />
            <span>داكن</span>
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
              theme === 'light'
                ? 'border-ide-accent bg-ide-accent/10'
                : 'border-ide-border hover:border-ide-accent/50'
            }`}
          >
            <Sun className="w-6 h-6" />
            <span>فاتح</span>
          </button>
        </div>
      </div>

      <div className="border-t border-ide-border pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          الإشعارات
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span>إشعارات البريد الإلكتروني</span>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
              className="w-4 h-4 rounded"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>الإشعارات الفورية</span>
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
              className="w-4 h-4 rounded"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>تحديثات المنتج</span>
            <input
              type="checkbox"
              checked={notifications.updates}
              onChange={(e) => setNotifications({ ...notifications, updates: e.target.checked })}
              className="w-4 h-4 rounded"
            />
          </label>
        </div>
      </div>

      <div className="border-t border-ide-border pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          اللغة
        </h3>
        <select className="w-full px-4 py-2 rounded-md bg-ide-bg border border-ide-border text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent">
          <option value="ar">العربية</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
};

export default Preferences;

