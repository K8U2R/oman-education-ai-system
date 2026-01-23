/**
 * Sentinel Developer Routes
 * @law Law-7 (Diagnostic Protocol)
 */

import { RouteConfig } from '../../types';
import { SentinelRoute } from '@/presentation/pages/developer/sentinel/SentinelRoute';

export const sentinelRoutes: RouteConfig[] = [
    {
        path: '/__sentinel',
        element: <SentinelRoute />,
        metadata: {
            title: 'Diagnostic Sentinel',
            requiresAuth: false,
            layout: 'minimal',
            showInNav: false,
        }
    },
];
