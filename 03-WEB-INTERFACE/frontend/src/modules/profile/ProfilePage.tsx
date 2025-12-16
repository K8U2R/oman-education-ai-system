import React, { useState } from 'react';
import { User, Key, Bell, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import Card from '@/components/ui/Card';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfo from './components/PersonalInfo';
import SecuritySettings from './components/SecuritySettings';
import Preferences from './components/Preferences';
import ActivityHistory from './components/ActivityHistory';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'preferences' | 'activity'>('info');

  const tabs = [
    { id: 'info' as const, label: 'المعلومات الشخصية', icon: User },
    { id: 'security' as const, label: 'الأمان', icon: Shield },
    { id: 'preferences' as const, label: 'التفضيلات', icon: Bell },
    { id: 'activity' as const, label: 'سجل النشاطات', icon: Key },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-ide-bg flex items-center justify-center">
        <p className="text-ide-text-secondary">جارٍ تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ide-bg w-full overflow-y-auto">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4 sm:space-y-6">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Tabs */}
        <Card>
          <div className="flex border-b border-ide-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-ide-accent border-b-2 border-ide-accent'
                      : 'text-ide-text-secondary hover:text-ide-text'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'info' && <PersonalInfo user={user} onUpdate={updateUser} />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'preferences' && <Preferences />}
            {activeTab === 'activity' && <ActivityHistory />}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

