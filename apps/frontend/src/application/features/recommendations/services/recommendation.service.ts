/**
 * Recommendation Engine Service - خدمة محرك التوصيات
 *
 * ✅ Integrated with RecommendationEngineStats from domain/types
 * ✅ Supports caching and batch operations
 * ✅ LAW 14 compliant - No static exports of sensitive data
 */

import type {
    RecommendationType,
    RecommendationEngineStats,
} from '@/domain/types/developer.types'
import { apiClient } from '@/infrastructure/services/api/api-client'

// ==================== Types ====================

/**
 * Typed metadata for lesson recommendations
 */
export interface LessonMetadata {
    duration_minutes?: number
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    [key: string]: unknown
}

export interface Recommendation {
    id: string
    type: RecommendationType
    score: number // 0-1 confidence score
    title: string
    description: string
    metadata?: LessonMetadata
    created_at: string
}

export interface GenerateRecommendationsRequest {
    user_id: string
    type?: RecommendationType
    count?: number
    context?: Record<string, unknown>
}

export interface RecommendationsResponse {
    success: boolean
    recommendations: Recommendation[]
    stats: RecommendationEngineStats
    meta?: {
        total: number
        generated_at: string
    }
}

// ==================== Service Class ====================

class RecommendationService {
    private baseUrl = '/api/v1/recommendations'
    private cache = new Map<string, { data: Recommendation[]; timestamp: number }>()
    private cacheTimeout = 5 * 60 * 1000 // 5 minutes

    /**
     * Get recommendations for a user
     */
    async getRecommendations(
        userId: string,
        type?: RecommendationType,
        count: number = 10
    ): Promise<Recommendation[]> {
        const cacheKey = `${userId}-${type || 'all'}-${count}`

        // Check cache
        const cached = this.cache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data
        }

        try {
            const response = await apiClient.get<RecommendationsResponse>(this.baseUrl, {
                params: { user_id: userId, type, count },
            })

            const recommendations = response.recommendations

            // Cache the result
            this.cache.set(cacheKey, {
                data: recommendations,
                timestamp: Date.now(),
            })

            return recommendations
        } catch (error) {
            console.error('[RecommendationService] Failed to fetch recommendations:', error)

            // Return mock data in dev mode
            if (import.meta.env.DEV) {
                return this.getMockRecommendations(type, count)
            }

            throw error
        }
    }

    /**
     * Generate new recommendations (admin/AI models)
     */
    async generateRecommendations(
        request: GenerateRecommendationsRequest
    ): Promise<Recommendation[]> {
        try {
            const response = await apiClient.post<RecommendationsResponse>(
                `${this.baseUrl}/generate`,
                request
            )

            // Invalidate cache for this user
            this.invalidateCacheForUser(request.user_id)

            return response.recommendations
        } catch (error) {
            console.error('[RecommendationService] Failed to generate recommendations:', error)
            throw error
        }
    }

    /**
     * Get recommendation engine statistics
     */
    async getEngineStats(): Promise<RecommendationEngineStats> {
        try {
            const response = await apiClient.get<{ stats: RecommendationEngineStats }>(
                `${this.baseUrl}/stats`
            )

            return response.stats
        } catch (error) {
            console.error('[RecommendationService] Failed to fetch engine stats:', error)

            // Return mock stats in dev mode
            if (import.meta.env.DEV) {
                return this.getMockEngineStats()
            }

            throw error
        }
    }

    /**
     * Clear cache for a specific user
     */
    invalidateCacheForUser(userId: string): void {
        const keysToDelete: string[] = []

        this.cache.forEach((_, key) => {
            if (key.startsWith(userId)) {
                keysToDelete.push(key)
            }
        })

        keysToDelete.forEach(key => this.cache.delete(key))
    }

    /**
     * Clear all cache
     */
    clearCache(): void {
        this.cache.clear()
    }

    // ==================== Mock Data (Development) ====================

    private getMockRecommendations(
        type?: RecommendationType,
        count: number = 10
    ): Recommendation[] {
        const mockRecommendations: Recommendation[] = [
            {
                id: '1',
                type: 'lesson',
                score: 0.95,
                title: 'درس الرياضيات: المعادلات التربيعية',
                description: 'بناءً على أدائك في الدروس السابقة، نوصي بهذا الدرس',
                metadata: { difficulty: 'intermediate', subject_id: 'math-101' },
                created_at: new Date().toISOString(),
            },
            {
                id: '2',
                type: 'content',
                score: 0.88,
                title: 'فيديو تعليمي: حل المعادلات',
                description: 'محتوى إضافي لتحسين فهمك',
                metadata: { duration_minutes: 15, platform: 'youtube' },
                created_at: new Date().toISOString(),
            },
            {
                id: '3',
                type: 'path',
                score: 0.82,
                title: 'مسار الرياضيات المتقدمة',
                description: 'رحلة تعليمية مُخصصة لك',
                metadata: { total_lessons: 20, estimated_weeks: 8 },
                created_at: new Date().toISOString(),
            },
            {
                id: '4',
                type: 'resource',
                score: 0.75,
                title: 'كتاب: أساسيات الجبر',
                description: 'مصدر مفيد لتعميق معرفتك',
                metadata: { pages: 250, language: 'ar' },
                created_at: new Date().toISOString(),
            },
            {
                id: '5',
                type: 'activity',
                score: 0.70,
                title: 'تمرين تفاعلي: حل المسائل',
                description: 'مارس مهاراتك مع تمارين تفاعلية',
                metadata: { questions: 15, time_limit_minutes: 30 },
                created_at: new Date().toISOString(),
            },
        ]

        return mockRecommendations
            .filter(rec => !type || rec.type === type)
            .slice(0, count)
    }

    private getMockEngineStats(): RecommendationEngineStats {
        return {
            engine_status: 'active',
            total_recommendations_generated: 12_450,
            recommendations_today: 342,
            average_accuracy: 0.87,
            user_satisfaction_rate: 0.91,
            recommendations_by_type: {
                lesson: 5200,
                content: 3800,
                path: 1800,
                resource: 1200,
                activity: 450,
            },
            active_models_count: 3,
            last_training_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            next_training_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            training_data_size: 45_000,
            inference_avg_time_ms: 120,
            cache_hit_rate: 0.78,
        }
    }
}

// ==================== Singleton Export ====================

export const recommendationService = new RecommendationService()
