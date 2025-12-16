/**
 * UserProfile Wrapper
 * Wrapper مع Error Boundary
 */

import React from 'react';
import { PersonalizationErrorBoundary } from './ErrorBoundary';
import UserProfile from './UserProfile';

export const UserProfileWrapper: React.FC = () => {
  return (
    <PersonalizationErrorBoundary>
      <UserProfile />
    </PersonalizationErrorBoundary>
  );
};

