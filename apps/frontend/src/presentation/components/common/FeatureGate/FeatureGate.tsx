/**
 * FeatureGate Component - بوابة الميزات
 *
 * ✅ Permission-based conditional rendering for AI features
 * ✅ Consistent upgrade prompts for unauthorized users
 * ✅ Reusable across the application
 */

import React from 'react'
import { useRole } from '@/features/user-authentication-management'
import type { Permission } from '@/domain/types/auth.types'
import { UpgradePrompt } from './UpgradePrompt'

interface FeatureGateProps {
    /**
     * The permission required to access the feature
     */
    permission: Permission

    /**
     * The feature content to show if user has permission
     */
    children: React.ReactNode

    /**
     * Optional custom fallback UI when permission is denied
     * If not provided, shows UpgradePrompt by default
     */
    fallback?: React.ReactNode

    /**
     * Feature name to display in the upgrade prompt
     */
    featureName?: string

    /**
     * If true, shows nothing when permission is denied (instead of UpgradePrompt)
     */
    hideOnDenied?: boolean
}

/**
 * FeatureGate - بوابة الميزات المحمية بالصلاحيات
 *
 * استخدم هذا المكون لحماية الميزات بناءً على صلاحيات المستخدم
 *
 * @example
 * // Show AI content generator only for users with permission
 * <FeatureGate permission="ai.content-generation.use" featureName="AI Content Generation">
 *   <AIContentGenerator />
 * </FeatureGate>
 *
 * @example
 * // Hide completely when denied (no upgrade prompt)
 * <FeatureGate permission="ai.recommendations.view" hideOnDenied>
 *   <RecommendationsSection />
 * </FeatureGate>
 *
 * @example
 * // Custom fallback UI
 * <FeatureGate 
 *   permission="ai.analytics.advanced"
 *   fallback={<CustomUpgradeMessage />}
 * >
 *   <AdvancedAnalytics />
 * </FeatureGate>
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
    permission,
    children,
    fallback,
    featureName,
    hideOnDenied = false,
}) => {
    const { hasPermission } = useRole()

    // Check if user has the required permission
    const hasAccess = hasPermission(permission)

    // If user has permission, show the feature
    if (hasAccess) {
        return <>{children}</>
    }

    // If user doesn't have permission
    if (hideOnDenied) {
        return null
    }

    // Show custom fallback or default UpgradePrompt
    if (fallback) {
        return <>{fallback}</>
    }

    return <UpgradePrompt feature={featureName || permission} requiredPermission={permission} />
}

export default FeatureGate
