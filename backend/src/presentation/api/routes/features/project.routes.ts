/**
 * Project Routes - مسارات المشاريع
 *
 * Project API endpoints
 *
 * @swagger
 * tags:
 *   - name: Projects
 *     description: إدارة المشاريع التعليمية
 */

import { RouteFactory } from "../shared/route-factory.js";
import { ProjectController } from "@/modules/education/controllers/project.controller.js";
import { authMiddleware } from "../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: جلب جميع المشاريع
 *     description: استرجاع قائمة المشاريع مع دعم الفلاتر والتقسيم للصفحات
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [educational, research, assignment, presentation]
 *         description: نوع المشروع
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, in_progress, completed, archived]
 *         description: حالة المشروع
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: رقم الصفحة
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 20
 *         description: عدد العناصر في الصفحة
 *     responses:
 *       200:
 *         description: تم جلب المشاريع بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         projects:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Project'
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         total_pages:
 *                           type: integer
 */
router.get(
  "/",
  ...RouteFactory.createAuthenticatedRoute<ProjectController>(
    "ProjectController",
    "getProjects",
    authMiddleware.authenticate,
  ),
);

/**
 * @swagger
 * /api/v1/projects/stats:
 *   get:
 *     summary: إحصائيات المشاريع
 *     description: الحصول على إحصائيات عامة عن المشاريع
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم جلب الإحصائيات بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         stats:
 *                           $ref: '#/components/schemas/ProjectStats'
 */
router.get(
  "/stats",
  ...RouteFactory.createAuthenticatedRoute<ProjectController>(
    "ProjectController",
    "getProjectProgress",
    authMiddleware.authenticate,
  ),
);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   get:
 *     summary: عرض تفاصيل مشروع
 *     description: الحصول على تفاصيل مشروع محدد
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: معرف المشروع
 *     responses:
 *       200:
 *         description: تم جلب المشروع بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         project:
 *                           $ref: '#/components/schemas/Project'
 *       404:
 *         description: المشروع غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/:id",
  ...RouteFactory.createAuthenticatedRoute<ProjectController>(
    "ProjectController",
    "getProject",
    authMiddleware.authenticate,
  ),
);

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: إنشاء مشروع جديد
 *     description: إنشاء مشروع تعليمي جديد
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectRequest'
 *     responses:
 *       201:
 *         description: تم إنشاء المشروع بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         project:
 *                           $ref: '#/components/schemas/Project'
 */
router.post(
  "/",
  ...RouteFactory.createAuthenticatedRoute<ProjectController>(
    "ProjectController",
    "createProject",
    authMiddleware.authenticate,
  ),
);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   put:
 *     summary: تحديث مشروع
 *     description: تحديث بيانات مشروع موجود
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: معرف المشروع
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [draft, in_progress, completed, archived] }
 *               progress: { type: number }
 *     responses:
 *       200:
 *         description: تم تحديث المشروع بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         project:
 *                           $ref: '#/components/schemas/Project'
 */
router.put(
  "/:id",
  ...RouteFactory.createAuthenticatedRoute<ProjectController>(
    "ProjectController",
    "updateProject",
    authMiddleware.authenticate,
  ),
);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   delete:
 *     summary: حذف مشروع
 *     description: حذف مشروع نهائياً
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: معرف المشروع
 *     responses:
 *       200:
 *         description: تم حذف المشروع بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
router.delete(
  "/:id",
  ...RouteFactory.createAuthenticatedRoute<ProjectController>(
    "ProjectController",
    "deleteProject",
    authMiddleware.authenticate,
  ),
);

/**
 * @swagger
 * /api/v1/projects/{id}/progress:
 *   get:
 *     summary: تقدم المشروع
 *     description: عرض تفاصيل تقدم المشروع والمهام المنجزة
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: معرف المشروع
 *     responses:
 *       200:
 *         description: تم جلب التقدم بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         progress:
 *                           type: object
 *                           properties:
 *                             project_id: { type: string }
 *                             progress_percentage: { type: number }
 *                             completed_tasks: { type: number }
 *                             total_tasks: { type: number }
 */
router.get(
  "/:id/progress",
  ...RouteFactory.createAuthenticatedRoute<ProjectController>(
    "ProjectController",
    "getProjectProgress",
    authMiddleware.authenticate,
  ),
);

export default router;
