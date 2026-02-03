
import { Request, Response } from 'express';
import { LearningService } from './learning.service.js';

export class LearningController {
    private service: LearningService;

    constructor() {
        this.service = new LearningService();
    }

    async getCourses(_req: Request, res: Response) {
        try {
            const courses = await this.service.getCourses('FREE'); // Default tier for now
            return res.json({ courses });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch courses' });
        }
    }

    async getLesson(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const lesson = await this.service.getLesson(id);
            if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
            return res.json({ lesson });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch lesson' });
        }
    }

    async chat(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id;
            const { message, context, threadId } = req.body;

            if (!userId) return res.status(401).json({ error: 'Unauthorized' });
            if (!message) return res.status(400).json({ error: 'Message required' });

            const result = await this.service.askTutor(userId, threadId, message, context);
            return res.json(result);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'AI Error' });
        }
    }
}
