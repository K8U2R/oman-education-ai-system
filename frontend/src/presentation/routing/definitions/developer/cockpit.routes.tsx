/**
 * Developer Cockpit Routes - مسارات قمرة المطور
 * 
 * الوصف: تعريف المسار الخاص بـ Cockpit ضمن مجموعة مسارات المطور.
 * السلطة الدستورية: القانون 11.
 */

import { RouteConfig } from '../../types';
import CockpitPage from '@/presentation/pages/developer/cockpit/CockpitPage';

export const cockpitRoutes: RouteConfig[] = [
    {
        path: '/dev/cockpit',
        element: <CockpitPage />,
        children: [], // مسار مستقل
    },
];

export const cockpitMetadata = {
    '/dev/cockpit': {
        title: 'Developer Cockpit | قمرة قيادة المطور',
        description: 'Sovereign system monitoring and real-time logs.',
        roles: ['admin', 'developer'], // لأغراض العرض والتوسعة لاحقاً
    },
};
