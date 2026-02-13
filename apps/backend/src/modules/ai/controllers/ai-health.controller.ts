import { Request, Response } from 'express';
import { BaseController } from '@/presentation/api/controllers/core/BaseController';
import { AIUsageService } from '@/modules/ai/services/ai-usage.service';
import { Logger } from '@/shared/utils/logger';

export class AIHealthController extends BaseController {
    private aiUsageService: AIUsageService;

    constructor() {
        super();
        this.aiUsageService = new AIUsageService(); // In a real DI system, this would be injected
    }

    /**
     * GET /api/v1/ai/health
     * Check AI service health status
     */
    public checkHealth = async (req: Request, res: Response): Promise<void> => {
        try {
            // Mock health check for now
            const healthStatus = {
                status: 'healthy',
                services: {
                    openai: 'operational',
                    anthropic: 'operational',
                    vectorDb: 'operational'
                },
                timestamp: new Date().toISOString()
            };

            this.sendSuccess(res, healthStatus);
        } catch (error) {
            this.sendError(res, error);
        }
    };

    /**
     * GET /api/v1/ai/usage
     * Get current user's token usage
     */
    public getUserUsage = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                // Should be handled by auth middleware, but strictly safe
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const usage = await this.aiUsageService.getUserUsage(userId);
            this.sendSuccess(res, usage);
        } catch (error) {
            this.sendError(res, error);
        }
    };
}
