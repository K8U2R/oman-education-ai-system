/**
 * Developer Cockpit Routes - مسارات قمرة المطور
 * 
 * الوصف: تعريف المسار الخاص بـ Cockpit ضمن مجموعة مسارات المطور.
 * السلطة الدستورية: القانون 11.
 */

import { RouteConfig } from '../../types';
import CockpitPage from '@/presentation/pages/developer/cockpit/CockpitPage';
import { DeveloperLayout } from '@/presentation/layouts/developer/DeveloperLayout';
import AILabPage from '@/presentation/pages/developer/ai/AILabPage';
import DatabasePage from '@/presentation/pages/developer/database/DatabasePage';

export const cockpitRoutes: RouteConfig[] = [
    {
        path: '/dev/cockpit',
        element: <DeveloperLayout />,
        metadata: {
            requiresAuth: false,
        },
        children: [
            {
                index: true,
                element: <CockpitPage />,
                metadata: { requiresAuth: false }
            },
            {
                path: 'ai-lab',
                element: <AILabPage />,
                metadata: { requiresAuth: false }
            },
            {
                path: 'database',
                element: <DatabasePage />,
                metadata: { requiresAuth: false }
            },
            {
                path: 'logs',
                element: <div className="p-4 text-white">System Logs (Moved here soon)</div>, // Placeholder for now
                metadata: { requiresAuth: false }
            },
            {
                path: 'settings',
                element: <div className="p-4 text-white">Settings</div>,
                metadata: { requiresAuth: false }
            }
        ],
    },
];

export const cockpitMetadata = {
    '/dev/cockpit': {
        title: 'Developer Cockpit | قمرة قيادة المطور',
        description: 'Sovereign system monitoring and real-time logs.',
        roles: ['admin', 'developer'],
        requiresAuth: false,
    },
};
