import { Router } from 'express';
import { AIHealthController } from '@/modules/ai/controllers/ai-health.controller';
import { requireAuth } from '@/presentation/api/middleware/security/auth/require-auth.middleware'; // Adjust import
import { requireRoles } from '@/presentation/api/middleware/security/rbac/require-roles.middleware'; // Adjust import

const router = Router();
const controller = new AIHealthController();

// Shared usage endpoint (Authenticated users)
router.get('/usage', requireAuth, controller.getUserUsage);

// Admin/Dev Health Check
router.get('/health', requireAuth, requireRoles(['admin', 'developer']), controller.checkHealth);

export default router;
