import React, { lazy } from 'react';
import { RouteConfig } from '../../types';
import { docsMetadata } from './docs.metadata';
import DocsLayout from '@/presentation/layouts/DocsLayout/DocsLayout';
import { PublicRoute } from '../../guards'; // Ensure it's accessible publicly

// Lazy Loading
const DocsHomePage = lazy(() => import('@/presentation/pages/docs/DocsHomePage'));

export const docsRoutes: RouteConfig[] = [
    {
        path: '/docs',
        element: (
            // We might want to use Header/Footer so we can wrap DocsLayout inside AppShell or just Header
            // For now, let's use the explicit DocsLayout which defines its own sidebar
            <PublicRoute allowAuthenticated={true}>
                <DocsLayout />
            </PublicRoute>
        ),
        metadata: docsMetadata['/docs'],
        children: [
            {
                path: '', // Default index route
                element: (
                    <React.Suspense fallback={<div>Loading Docs...</div>}>
                        <DocsHomePage />
                    </React.Suspense>
                ),
                metadata: docsMetadata['/docs'] // Re-use metadata or define home specific
            }
        ]
    }
];
