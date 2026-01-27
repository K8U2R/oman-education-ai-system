import { UserRole } from '@/domain/types/auth.types';

export interface DashboardWidgetConfig {
    id: string;             // Unique instance ID
    widgetKey: string;      // Key from WIDGET_REGISTRY
    colSpan?: number;       // Grid column span (1-12)
    props?: Record<string, any>; // Static props to pass
    permission?: string;    // Required permission to view
}

/**
 * DASHBOARD_LAYOUTS
 * 
 * Defines the widget layout for each user role.
 * The renderer will use this to generate the dashboard.
 */
export const DASHBOARD_LAYOUTS: Partial<Record<UserRole | 'default', DashboardWidgetConfig[]>> = {
    // 👨‍🎓 Student Dashboard
    student: [
        {
            id: 'main_actions',
            widgetKey: 'main_actions',
            colSpan: 12
        },
        {
            id: 'quick_access',
            widgetKey: 'quick_access',
            colSpan: 12
        },
        // We can hide UserTypes for logged-in students if we want, or keep it
        {
            id: 'user_types',
            widgetKey: 'user_types',
            colSpan: 12
        }
    ],

    // 👨‍🏫 Teacher Dashboard (Can be different)
    teacher: [
        {
            id: 'main_actions',
            widgetKey: 'main_actions',
            colSpan: 12
        },
        {
            id: 'quick_access',
            widgetKey: 'quick_access',
            colSpan: 12,
            props: {
                // Example: We could pass props to show teacher-specific quick links
            }
        },
        {
            id: 'user_types',
            widgetKey: 'user_types',
            colSpan: 12
        }
    ],

    // 👮‍♂️ Admin Dashboard (Usually has its own page, but if it uses this engine:
    admin: [
        {
            id: 'main_actions',
            widgetKey: 'main_actions',
            colSpan: 12
        },
        // Admins see everything
        {
            id: 'quick_access',
            widgetKey: 'quick_access',
            colSpan: 12
        },
        {
            id: 'user_types',
            widgetKey: 'user_types',
            colSpan: 12
        }
    ],

    // 👤 Fallback
    default: [
        { id: 'user_types', widgetKey: 'user_types', colSpan: 12 }
    ]
};
