import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface Course {
    id: string;
    title: string;
    slug: string;
    level: string;
    modules: any[];
}

export interface ChatResponse {
    content: string;
    threadId: string;
}

export const LearningService = {
    /**
     * Get all published courses
     */
    async getCourses(): Promise<Course[]> {
        const response = await axios.get(`${API_URL}/courses`);
        return response.data;
    },

    /**
     * Get specific course details
     */
    async getCourseBySlug(slug: string): Promise<Course> {
        const response = await axios.get(`${API_URL}/courses/${slug}`);
        return response.data;
    },

    /**
     * Send message to AI Tutor
     * @law Law-14 (Tier Sovereignty) - Checked on Backend, but handled gracefully here too.
     */
    async sendMessage(message: string, threadId?: string): Promise<ChatResponse> {
        const response = await axios.post(`${API_URL}/chat`, {
            message,
            threadId
        });
        return response.data;
    }
};
