
import axios from 'axios';

const API_URL = '/api/v1/learning';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    threadId: string;
    response: string;
}

export const learningService = {
    async getCourses() {
        const { data } = await axios.get(`${API_URL}/courses`);
        return data.courses;
    },

    async getLesson(id: string) {
        const { data } = await axios.get(`${API_URL}/lessons/${id}`);
        return data.lesson;
    },

    async sendChatMessage(message: string, threadId: string | null = null, context: string = '') {
        const { data } = await axios.post<ChatResponse>(`${API_URL}/chat`, {
            message,
            threadId,
            context
        });
        return data;
    }
};
