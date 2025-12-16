/**
 * UserDashboard Wrapper
 * Wrapper مع Error Boundary
 */

import React from 'react';
import { PersonalizationErrorBoundary } from './ErrorBoundary';
import UserDashboard from './UserDashboard';

export const UserDashboardWrapper: React.FC = () => {
  return (
    <PersonalizationErrorBoundary>
      <UserDashboard />
    </PersonalizationErrorBoundary>
  );
};

