import { apiClient as api } from '@/infrastructure/api/api-client';

export interface GenerateLessonRequest {
    topic: string;
    subject: string;
    gradeLevel: string;
    language: 'ar' | 'en';
}

export interface LessonPlanResponse {
    topic: string;
    subject: string;
    gradeLevel: string;
    duration: string;
    objectives: string[];
    materials: string[];
    structure: {
        introduction: { duration: string; content: string };
        mainActivity: { duration: string; content: string };
        conclusion: { duration: string; content: string };
    };
    assessment: string[];
}

export class AiService {
    private static readonly BASE_URL = '/ai';

    /**
     * Generate a lesson plan using the AI Soul
     */
    static async generateLesson(request: GenerateLessonRequest): Promise<LessonPlanResponse> {
        const response = await api.post<LessonPlanResponse>(`${this.BASE_URL}/lessons/generate`, request);
        return response;
    }
}
