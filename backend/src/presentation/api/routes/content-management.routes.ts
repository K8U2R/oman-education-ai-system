/**
 * Content Management Routes - مسارات إدارة المحتوى
 *
 * Content Management API endpoints
 */

import { RouteFactory } from "./shared/route-factory.js";
import { ContentManagementHandler } from "../handlers/content/content-management.handler.js";
import { authMiddleware } from "../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /content/subjects
 * Get all subjects
 */
router.get(
  "/subjects",
  ...RouteFactory.createAuthenticatedRoute<ContentManagementHandler>(
    "ContentManagementHandler",
    "getSubjects",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /content/grade-levels
 * Get all grade levels
 */
router.get(
  "/grade-levels",
  ...RouteFactory.createAuthenticatedRoute<ContentManagementHandler>(
    "ContentManagementHandler",
    "getGradeLevels",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /content/lessons
 * Get all lessons
 */
router.get(
  "/lessons",
  ...RouteFactory.createAuthenticatedRoute<ContentManagementHandler>(
    "ContentManagementHandler",
    "getLessons",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /content/lessons/:id
 * Get a specific lesson
 */
router.get(
  "/lessons/:id",
  ...RouteFactory.createAuthenticatedRoute<ContentManagementHandler>(
    "ContentManagementHandler",
    "getLesson",
    authMiddleware.authenticate,
  ),
);

/**
 * POST /content/lessons
 * Create a new lesson
 */
router.post(
  "/lessons",
  ...RouteFactory.createAuthenticatedRoute<ContentManagementHandler>(
    "ContentManagementHandler",
    "createLesson",
    authMiddleware.authenticate,
  ),
);

/**
 * PUT /content/lessons/:id
 * Update a lesson
 */
router.put(
  "/lessons/:id",
  ...RouteFactory.createAuthenticatedRoute<ContentManagementHandler>(
    "ContentManagementHandler",
    "updateLesson",
    authMiddleware.authenticate,
  ),
);

/**
 * DELETE /content/lessons/:id
 * Delete a lesson
 */
router.delete(
  "/lessons/:id",
  ...RouteFactory.createAuthenticatedRoute<ContentManagementHandler>(
    "ContentManagementHandler",
    "deleteLesson",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /content/learning-paths
 * Get all learning paths
 */
router.get(
  "/learning-paths",
  ...RouteFactory.createAuthenticatedRoute<ContentManagementHandler>(
    "ContentManagementHandler",
    "getLearningPaths",
    authMiddleware.authenticate,
  ),
);

/**
 * POST /content/learning-paths
 * Create a new learning path
 */
router.post(
  "/learning-paths",
  ...RouteFactory.createAuthenticatedRoute<ContentManagementHandler>(
    "ContentManagementHandler",
    "createLearningPath",
    authMiddleware.authenticate,
  ),
);

/**
 * PUT /content/learning-paths/:id
 * Update a learning path
 */
router.put(
  "/learning-paths/:id",
  ...RouteFactory.createAuthenticatedRoute<ContentManagementHandler>(
    "ContentManagementHandler",
    "updateLearningPath",
    authMiddleware.authenticate,
  ),
);

/**
 * DELETE /content/learning-paths/:id
 * Delete a learning path
 */
router.delete(
  "/learning-paths/:id",
  ...RouteFactory.createAuthenticatedRoute<ContentManagementHandler>(
    "ContentManagementHandler",
    "deleteLearningPath",
    authMiddleware.authenticate,
  ),
);

export default router;
