import { apiClient } from './api-client';

export interface GenerateLessonResponse {
    success: boolean;
    data: any; // Ideally this should be typed, but for now we follow Law 14 (Tier Supremacy) which is handled on backend
}

/**
 * Service to handle Education related API calls
 */
export const educationApiService = {
    /**
     * Generate a structured lesson from a topic.
     * PlanTier is handled automatically by the backend via Auth token.
     */
    generateLesson: async (topic: string, level: string = "intermediate", language: "ar" | "en" = "ar"): Promise<GenerateLessonResponse> => {
        // Law 14: We do NOT send planTier here to prevent spoofing.
        // Backend extracts it from req.user
        return apiClient.post('/education/generate', {
            topic,
            level,
            language
        });
    }
};
