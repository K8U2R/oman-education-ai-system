import React from 'react';
import SettingsPanel from '@/modules/settings/SettingsPanel';

const RightPanel: React.FC = () => {
  // For now, show Settings Panel
  // In the future, this could show Properties, Settings, or other panels based on context
  return <SettingsPanel />;
};

export default RightPanel;

