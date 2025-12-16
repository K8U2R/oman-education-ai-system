import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import SettingsTabs from './components/SettingsTabs';
import GeneralSettings from './components/GeneralSettings';
import EditorSettings from './components/EditorSettings';
import AISettings from './components/AISettings';
import IntegrationSettings from './components/IntegrationSettings';
import SecuritySettings from './components/SecuritySettings';
import AppearanceSettings from './components/AppearanceSettings';
import AdvancedSettings from './components/AdvancedSettings';
import { 
  UserPreferencesWrapper, 
  UserSettingsWrapper, 
  UserProfileWrapper 
} from '@/modules/user-personalization';

const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('general');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'general', label: 'عام' },
    { id: 'preferences', label: 'التفضيلات' },
    { id: 'user-settings', label: 'الإعدادات الشخصية' },
    { id: 'profile', label: 'الملف الشخصي' },
    { id: 'editor', label: 'المحرر' },
    { id: 'ai', label: 'AI' },
    { id: 'integrations', label: 'التكاملات' },
    { id: 'security', label: 'الأمان' },
    { id: 'appearance', label: 'المظهر' },
    { id: 'advanced', label: 'متقدم' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
          case 'preferences':
            return <UserPreferencesWrapper />;
          case 'user-settings':
            return <UserSettingsWrapper />;
          case 'profile':
            return <UserProfileWrapper />;
      case 'editor':
        return <EditorSettings />;
      case 'ai':
        return <AISettings />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'advanced':
        return <AdvancedSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-ide-bg w-full overflow-y-auto">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 mb-8">
          <SettingsIcon className="w-8 h-8 text-ide-accent" />
          <h1 className="text-3xl font-bold">الإعدادات</h1>
        </div>

        <Card>
          <SettingsTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
          <div className="mt-6">{renderContent()}</div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

