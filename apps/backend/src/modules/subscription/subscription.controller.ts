
import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service.js';
import { PlanTier } from '@prisma/client';

export class SubscriptionController {
    private service: SubscriptionService;

    constructor() {
        this.service = new SubscriptionService();
    }

    async getMyPlan(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id; // Assuming auth middleware
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const plan = await this.service.getUserPlan(userId);
            return res.json({ plan });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async upgrade(req: Request, res: Response) {
        try {
            const userId = (req.user as any)?.id;
            const { tier } = req.body; // Expecting { tier: 'PRO' | 'PREMIUM' }

            if (!userId) return res.status(401).json({ error: 'Unauthorized' });
            if (!['PRO', 'PREMIUM'].includes(tier)) {
                return res.status(400).json({ error: 'Invalid tier' });
            }

            await this.service.upgradeUser(userId, tier as PlanTier);
            return res.json({ success: true, message: `Upgraded to ${tier}` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Upgrade failed' });
        }
    }
}
