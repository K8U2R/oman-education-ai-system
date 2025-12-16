/**
 * UserSettings Wrapper
 * Wrapper مع Error Boundary
 */

import React from 'react';
import { PersonalizationErrorBoundary } from './ErrorBoundary';
import UserSettings from './UserSettings';

export const UserSettingsWrapper: React.FC = () => {
  return (
    <PersonalizationErrorBoundary>
      <UserSettings />
    </PersonalizationErrorBoundary>
  );
};

