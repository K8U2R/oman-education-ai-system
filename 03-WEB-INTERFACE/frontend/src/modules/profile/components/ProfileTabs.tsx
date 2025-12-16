import React from 'react';
import Tabs, { Tab } from '@/components/ui/Tabs';
import { User, Shield, Bell, Key } from 'lucide-react';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { id: 'info', label: 'المعلومات الشخصية', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'الأمان', icon: <Shield className="w-4 h-4" /> },
    { id: 'preferences', label: 'التفضيلات', icon: <Bell className="w-4 h-4" /> },
    { id: 'activity', label: 'سجل النشاطات', icon: <Key className="w-4 h-4" /> },
  ];

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onChange={onTabChange}
      variant="underline"
    />
  );
};

export default ProfileTabs;

