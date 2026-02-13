import { RouteMetadata } from '../../types';

export const docsMetadata: Record<string, RouteMetadata> = {
    '/docs': {
        title: 'مركز التوثيق',
        description: 'الدليل الشامل لنظام عمان التعليمي الذكي',
        // roles: ['*'], // Accessible to everyone by default if no requiredRole is set
        layout: 'docs', // Signal to use Docs Layout if dynamic layout is implemented
    },
};
