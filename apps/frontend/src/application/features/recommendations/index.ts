/**
 * Recommendations Feature - ميزة التوصيات
 *
 * Export recommendation service and types
 */

export * from './services/recommendation.service'
export type {
    Recommendation,
    GenerateRecommendationsRequest,
    RecommendationsResponse,
} from './services/recommendation.service'
