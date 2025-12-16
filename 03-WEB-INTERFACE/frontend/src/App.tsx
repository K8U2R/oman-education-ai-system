import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IDEProvider } from '@/core/state/IDEContext';
import { ThemeProvider } from '@/core/theme/ThemeContextProvider';
import { AuthProvider } from '@/modules/auth/AuthProvider';
import { UserPersonalizationProvider } from '@/components/UserPersonalizationProvider';
import { ToastProvider } from '@/modules/user-personalization';
import ErrorBoundary from '@/core/error/ErrorBoundary';
import ErrorPanel from '@/core/error/ErrorPanel';
import IDE from '@/core/layout/IDE';
import DocsRouter from '@/modules/docs/DocsRouter';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import VerifyEmailPage from '@/pages/VerifyEmailPage';
import OAuthCallbackPage from '@/pages/OAuthCallbackPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Lazy loading للمكونات الثقيلة
import { lazy, Suspense } from 'react';
import { createLazyComponent } from '@/utils/lazy-loading';

const DashboardPage = lazy(() => import('@/modules/dashboard/DashboardPage'));
const ProjectsPage = lazy(() => import('@/modules/projects/ProjectsPage'));
const ProfilePage = lazy(() => import('@/modules/profile/ProfilePage'));
const NotificationsPage = lazy(() => import('@/modules/notifications/NotificationsPage'));
const AnalyticsPage = lazy(() => import('@/modules/analytics/AnalyticsPage'));
const MarketplacePage = lazy(() => import('@/modules/marketplace/MarketplacePage'));
const CollaborationPage = lazy(() => import('@/modules/collaboration/CollaborationPage'));
const SettingsPage = lazy(() => import('@/modules/settings/SettingsPage'));
const OfficeAssistantPage = lazy(() => import('@/modules/office-assistant/OfficeAssistantPage'));
const AIChatPage = lazy(() => import('@/modules/ai-assistant/AIChatPage'));
const { Component: UserDashboardWrapper } = createLazyComponent(
  () => import('@/modules/user-personalization').then(m => ({ default: m.UserDashboardWrapper }))
);

// Fallback component للتحميل
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-4 text-gray-600">جاري التحميل...</span>
  </div>
);

import { useAuthStore } from '@/store/auth-store';
import '@/core/error/ErrorService'; // Initialize error service
import '@/styles/layout.css'; // Layout styles from preferences

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ThemeProvider>
          <AuthProvider>
            <UserPersonalizationProvider>
              <ToastProvider>
                <IDEProvider>
                  <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/auth/oauth/google/callback" element={<OAuthCallbackPage />} />
                <Route path="/auth/oauth/github/callback" element={<OAuthCallbackPage />} />

                {/* Protected Routes with Lazy Loading */}
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <AIChatPage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <DashboardPage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <ProjectsPage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <ProfilePage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <NotificationsPage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <AnalyticsPage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/marketplace"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <MarketplacePage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collaboration"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <CollaborationPage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <SettingsPage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/dashboard"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <UserDashboardWrapper />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/office"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <OfficeAssistantPage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />

                {/* Docs Route */}
                <Route path="/docs/*" element={<DocsRouter />} />

                {/* IDE Route */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <IDE />
                      <ErrorPanel />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                  
                  {/* PWA Install Prompt */}
                  <PWAInstallPrompt />
                </IDEProvider>
              </ToastProvider>
            </UserPersonalizationProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

