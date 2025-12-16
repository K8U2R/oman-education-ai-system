import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Settings, Send, LogOut, MoreVertical } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import Avatar from '@/components/ui/Avatar';

interface UserMenuProps {
  className?: string;
}

/**
 * مكون قائمة المستخدم المنسدلة
 */
export const UserMenu: React.FC<UserMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/login');
  };

  const handleDownloadApp = () => {
    // يمكن إضافة رابط تحميل التطبيق هنا
    window.open('https://example.com/download', '_blank');
    setIsOpen(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setIsOpen(false);
  };

  const handleContactUs = () => {
    // يمكن إضافة صفحة الاتصال أو فتح نافذة بريد إلكتروني
    window.location.href = 'mailto:support@example.com';
    setIsOpen(false);
  };

  const handleProfileOptions = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const menuItems = [
    {
      id: 'download',
      label: 'Download mobile App',
      icon: Smartphone,
      onClick: handleDownloadApp,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onClick: handleSettings,
    },
    {
      id: 'contact',
      label: 'Contact us',
      icon: Send,
      onClick: handleContactUs,
    },
    {
      id: 'logout',
      label: 'Log out',
      icon: LogOut,
      onClick: handleLogout,
      className: 'text-red-400 hover:text-red-500',
    },
  ];

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {/* User Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ide-surface/50 transition-colors flex-shrink-0"
        aria-label="قائمة المستخدم"
        aria-expanded={isOpen}
      >
        <Avatar
          src={user?.avatar}
          alt={user?.name || 'User'}
          size="sm"
          className="border-2 border-ide-accent/30 flex-shrink-0"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-64 bg-ide-surface border border-ide-border rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-2"
        >
          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-ide-border/50 transition-colors ${
                    item.className || 'text-ide-text'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Profile Section */}
          <div className="border-t border-ide-border/50 p-3 bg-ide-accent/5">
            <button
              onClick={handleProfileOptions}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-ide-border/30 transition-colors group min-w-0"
            >
              <Avatar
                src={user?.avatar}
                alt={user?.name || 'User'}
                size="sm"
                className="border-2 border-ide-accent/50 group-hover:border-ide-accent transition-colors flex-shrink-0"
              />
              <div className="flex-1 text-right min-w-0 flex-1">
                <p className="text-sm font-semibold text-ide-text truncate min-w-0">
                  {user?.name || 'ناصر الخاطري'}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleProfileOptions();
                }}
                className="p-1 rounded hover:bg-ide-border/50 transition-colors flex-shrink-0"
                aria-label="خيارات الملف الشخصي"
              >
                <MoreVertical className="w-4 h-4 text-ide-text-secondary" />
              </button>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

