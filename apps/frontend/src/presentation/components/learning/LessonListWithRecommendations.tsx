/**
 * LessonListWithRecommendations - قائمة الدروس مع التوصيات
 *
 * Wraps lesson list with AI recommendations section
 * ✅ Protected by ai.recommendations.view permission using FeatureGate
 */

import React from 'react'
import { FeatureGate } from '@/presentation/components/common/FeatureGate'
import { RecommendedLessons } from './RecommendedLessons'

interface LessonListWithRecommendationsProps {
    /**
     * The main lesson list component
     */
    children: React.ReactNode

    /**
     * Number of recommendations to show
     */
    recommendationCount?: number
}

/**
 * Wrapper component that adds AI recommendations section to lesson lists
 * 
 * @example
 * ```tsx
 * <LessonListWithRecommendations recommendationCount={5}>
 *   <YourLessonListComponent lessons={lessons} />
 * </LessonListWithRecommendations>
 * ```
 */
export const LessonListWithRecommendations: React.FC<LessonListWithRecommendationsProps> = ({
    children,
    recommendationCount = 5,
}) => {
    return (
        <div>
            {/* Main Lesson List */}
            {children}

            {/* AI Recommendations Section - Protected by permission */}
            <FeatureGate permission="ai.recommendations.view" hideOnDenied>
                <RecommendedLessons count={recommendationCount} />
            </FeatureGate>
        </div>
    )
}

export default LessonListWithRecommendations
