import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { TierGuard } from '../../../src/presentation/middleware/TierGuard';
import { PlanTier } from '@prisma/client';

describe('TierGuard Middleware (Law 14 Compliance)', () => {
    it('should allow access if user tier meets requirement', () => {
        const req = {
            user: { planTier: 'PRO' }
        } as Partial<Request> as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as Partial<Response> as Response;

        const next = vi.fn() as unknown as NextFunction;

        TierGuard(PlanTier.PRO)(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should BLOCK access if user tier is lower than required (Free accessing Premium)', () => {
        const req = {
            user: { planTier: 'FREE' }
        } as Partial<Request> as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as Partial<Response> as Response;

        const next = vi.fn() as unknown as NextFunction;

        TierGuard(PlanTier.PREMIUM)(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: 'Forbidden',
            required: 'PREMIUM',
            current: 'FREE'
        }));
    });

    it('should default to FREE if planTier is missing', () => {
        const req = {
            user: {} // No planTier
        } as Partial<Request> as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as Partial<Response> as Response;

        const next = vi.fn() as unknown as NextFunction;

        // Requirement is PRO, user defaults to FREE -> Should Fail
        TierGuard(PlanTier.PRO)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
    });
});
