/**
 * UserPreferences Wrapper
 * Wrapper مع Error Boundary
 */

import React from 'react';
import { PersonalizationErrorBoundary } from './ErrorBoundary';
import UserPreferences from './UserPreferences';

export const UserPreferencesWrapper: React.FC = () => {
  return (
    <PersonalizationErrorBoundary>
      <UserPreferences />
    </PersonalizationErrorBoundary>
  );
};

