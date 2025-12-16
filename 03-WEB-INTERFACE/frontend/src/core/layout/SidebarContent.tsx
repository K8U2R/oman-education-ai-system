import React from 'react';
import GitPanel from '@/modules/version-control/GitPanel';
import ExtensionsPanel from '@/modules/extensions/ExtensionsPanel';
import SettingsPanel from '@/modules/settings/SettingsPanel';

interface SidebarContentProps {
  activeView: 'files' | 'git' | 'extensions' | 'settings';
}

const SidebarContent: React.FC<SidebarContentProps> = ({ activeView }) => {
  switch (activeView) {
    case 'git':
      return <GitPanel />;
    case 'extensions':
      return <ExtensionsPanel />;
    case 'settings':
      return <SettingsPanel />;
    default:
      return null;
  }
};

export default SidebarContent;

