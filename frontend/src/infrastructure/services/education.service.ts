import axios from 'axios';

// Types
export enum EducationLevel {
    GRADE_1 = 'GRADE_1',
    GRADE_2 = 'GRADE_2',
    GRADE_3 = 'GRADE_3',
    GRADE_4 = 'GRADE_4',
    GRADE_5 = 'GRADE_5',
    GRADE_6 = 'GRADE_6',
    GRADE_7 = 'GRADE_7',
    GRADE_8 = 'GRADE_8',
    GRADE_9 = 'GRADE_9',
    GRADE_10 = 'GRADE_10',
    GRADE_11 = 'GRADE_11',
    GRADE_12 = 'GRADE_12'
}

export interface GeneratedLesson {
    id: string;
    title: string;
    content: string;
    status: string;
    // ... other fields
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface EducationalLesson {
    id: string;
    title: string;
    content?: string;
    orderIndex: number;
    aiMetadata?: any;
    // status etc
}

export interface EducationalUnit {
    id: string;
    title: string;
    orderIndex: number;
    lessons: EducationalLesson[];
}

export interface EducationalTrack {
    id: string;
    title: string;
    subject: string;
    level: string;
    units: EducationalUnit[];
}

export const EducationService = {
    /**
     * Get all tracks with hierarchy
     */
    async getTracks(): Promise<EducationalTrack[]> {
        const token = localStorage.getItem('token');
        // In a real scenario, this endpoint should return the full hierarchy
        const response = await axios.get(`${API_URL}/education/tracks?include=units.lessons`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data || [];
    },

    /**
     * Generate a new Lesson using AI
     */
    async generateLesson(topic: string, level: string, context?: string): Promise<GeneratedLesson> {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/education/lessons/generate`, {
            topic,
            level,
            additionalContext: context
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.data.lesson;
    },

    async createTrack(title: string, level: string, subject: string): Promise<any> {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/education/tracks`, {
            title, level, subject
        }, { headers: { Authorization: `Bearer ${token}` } });
        return response.data.data;
    },

    async createUnit(trackId: string, title: string, orderIndex: number): Promise<any> {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/education/tracks/${trackId}/units`, {
            title, orderIndex
        }, { headers: { Authorization: `Bearer ${token}` } });
        return response.data.data;
    }
};
