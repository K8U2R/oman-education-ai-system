/**
 * RecommendedLessons Component - الدروس المقترحة
 *
 * ✅ SCSS-based styling (no inline styles)
 * ✅ Liquid variables system compliant
 * ✅ CSS custom properties for theming
 * ✅ Sovereign Feedback Components Integration
 */

import React, { useEffect, useState } from 'react'
import { recommendationService, Recommendation } from '@/application/features/recommendations'
import { useAuth } from '@/features/user-authentication-management'
import { Sparkles, TrendingUp, Clock, BookOpen } from 'lucide-react'
import { LoadingState, ErrorState, EmptyState } from '@/presentation/components/ui/feedback'
import styles from './RecommendedLessons.module.scss'

interface RecommendedLessonsProps {
    /**
     * Maximum number of recommendations to display
     */
    count?: number
}

export const RecommendedLessons: React.FC<RecommendedLessonsProps> = ({ count = 5 }) => {
    const { user } = useAuth()
    const [recommendations, setRecommendations] = useState<Recommendation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchRecommendations = async () => {
        if (!user?.id) return

        try {
            setIsLoading(true)
            setError(null)

            const recs = await recommendationService.getRecommendations(
                user.id,
                'lesson', // Filter to lesson-type recommendations only
                count
            )

            setRecommendations(recs)
        } catch (err) {
            console.error('[RecommendedLessons] Failed to fetch recommendations:', err)
            setError('فشل في تحميل التوصيات المخصصة حالياً.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRecommendations()
    }, [user?.id, count])

    if (isLoading) {
        return (
            <div className={styles['recommended-lessons__loading']}>
                <LoadingState
                    message="جاري تحليل اهتماماتك التعليمية واقتراح الأنسب لك..."
                />
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles['recommended-lessons__error']}>
                <ErrorState
                    title="عذراً، لم نتمكن من جلب التوصيات"
                    message={error}
                    onRetry={fetchRecommendations}
                />
            </div>
        )
    }

    if (recommendations.length === 0) {
        return (
            <div className={styles['recommended-lessons__empty']}>
                <EmptyState
                    icon={<Sparkles className="w-12 h-12 text-primary" />}
                    title="ابدأ رحلتك التعليمية"
                    description={`مرحباً ${user?.email?.split('@')[0] || 'يا بطل'}! ابدأ دراسة أول درس لنتمكن من اقتراح محتوى مخصص يناسب اهتماماتك.`}
                    action={{
                        label: 'تصفح جميع الدروس',
                        icon: <BookOpen className="w-4 h-4" />,
                        onClick: () => window.location.href = '/lessons' // Or use navigation hook
                    }}
                />
            </div>
        )
    }

    return (
        <div className={styles['recommended-lessons']}>
            {/* Header */}
            <div className={styles['recommended-lessons__header']}>
                <Sparkles className="text-warning" />
                <h3 className={styles['recommended-lessons__title']}>دروس مقترحة لك</h3>
            </div>

            {/* Recommendations Grid */}
            <div className={styles['recommended-lessons__grid']}>
                {recommendations.map((rec) => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                ))}
            </div>
        </div>
    )
}

/**
 * Individual Recommendation Card
 */
const RecommendationCard: React.FC<{ recommendation: Recommendation }> = ({ recommendation }) => {
    const confidencePercentage = Math.round(recommendation.score * 100)
    const badgeClass = confidencePercentage >= 90 ? 'recommendation-card__badge--high' : 'recommendation-card__badge--medium'

    return (
        <div className={styles['recommendation-card']}>
            {/* Confidence Badge */}
            <div className={styles['recommendation-card__header']}>
                <div className={`${styles['recommendation-card__badge']} ${badgeClass === 'recommendation-card__badge--high' ? styles['recommendation-card__badge--high'] : styles['recommendation-card__badge--medium']}`}>
                    <TrendingUp />
                    <span>{confidencePercentage}% مطابقة</span>
                </div>

                {recommendation.metadata?.duration_minutes && (
                    <div className={styles['recommendation-card__duration']}>
                        <Clock />
                        <span>{String(recommendation.metadata.duration_minutes)} دقيقة</span>
                    </div>
                )}
            </div>

            {/* Title */}
            <h4 className={styles['recommendation-card__title']}>
                <span>{String(recommendation.title)}</span>
            </h4>

            {/* Description */}
            <p className={styles['recommendation-card__description']}>{recommendation.description}</p>

            {/* Metadata */}
            {recommendation.metadata?.difficulty && (
                <div className={styles['recommendation-card__metadata']}>
                    <span className={styles['recommendation-card__tag']}>
                        {String(recommendation.metadata.difficulty) === 'beginner' && 'مبتدئ'}
                        {String(recommendation.metadata.difficulty) === 'intermediate' && 'متوسط'}
                        {String(recommendation.metadata.difficulty) === 'advanced' && 'متقدم'}
                    </span>
                </div>
            )}
        </div>
    )
}

export default RecommendedLessons
