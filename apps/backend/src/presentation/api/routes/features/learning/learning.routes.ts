/**
 * Learning Routes - مسارات التعلم
 *
 * Learning API endpoints
 */

import { RouteFactory } from "../../shared/route-factory.js";
import { LearningHandler } from "../../../handlers/ai/learning.handler.js";
import { authMiddleware } from "../../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /learning/lessons
 * Get all lessons
 */
router.get(
  "/",
  ...RouteFactory.createAuthenticatedRoute<LearningHandler>(
    "LearningHandler",
    "getLessons",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /learning/lessons/:id
 * Get a specific lesson
 */
router.get(
  "/lessons/:id",
  ...RouteFactory.createAuthenticatedRoute<LearningHandler>(
    "LearningHandler",
    "getLesson",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /learning/lessons/:id/explanation
 * Get lesson explanation
 */
router.get(
  "/lessons/:id/explanation",
  ...RouteFactory.createAuthenticatedRoute<LearningHandler>(
    "LearningHandler",
    "getLessonExplanation",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /learning/lessons/:id/examples
 * Get lesson examples
 */
router.get(
  "/lessons/:id/examples",
  ...RouteFactory.createAuthenticatedRoute<LearningHandler>(
    "LearningHandler",
    "getLessonExamples",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /learning/lessons/:id/videos
 * Get lesson videos
 */
router.get(
  "/lessons/:id/videos",
  ...RouteFactory.createAuthenticatedRoute<LearningHandler>(
    "LearningHandler",
    "getLessonVideos",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /learning/lessons/:id/mind-map
 * Get lesson mind map
 */
router.get(
  "/lessons/:id/mind-map",
  ...RouteFactory.createAuthenticatedRoute<LearningHandler>(
    "LearningHandler",
    "getLessonMindMap",
    authMiddleware.authenticate,
  ),
);

/**
 * POST /learning/lessons/:id/chat
 * Chat with lesson context (SSE)
 */
router.post(
  "/lessons/:id/chat",
  ...RouteFactory.createAuthenticatedRoute<LearningHandler>(
    "LearningHandler",
    "chatWithLesson",
    authMiddleware.authenticate,
  ),
);

export default router;
