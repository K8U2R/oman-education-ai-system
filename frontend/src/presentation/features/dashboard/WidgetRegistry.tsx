import React from 'react';
import { MainActions, QuickAccess, UserTypes } from './widgets';
// We can import more widgets here as we build them

/**
 * WIDGET_REGISTRY
 * 
 * Maps string keys to React Components.
 * This allows the dashboard configuration to reference components by name.
 */
export const WIDGET_REGISTRY: Record<string, React.FC<any>> = {
    // Organisms (Complex Sections)
    'main_actions': MainActions,
    'quick_access': QuickAccess,
    'user_types': UserTypes,

    // Future Atomic Widgets can be added here
    // 'stat_card': StatCard,
};
