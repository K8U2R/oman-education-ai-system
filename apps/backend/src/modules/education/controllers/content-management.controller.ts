/**
 * Content Management Controller - متحكم إدارة المحتوى
 *
 * Request handlers لجميع endpoints إدارة المحتوى
 */

import { Request, Response } from "express";
import { z } from "zod";
import { ContentManagementService } from "@/modules/education/services/ContentManagementService.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";

// Validation Schemas
const CreateLessonRequestSchema = z.object({
  subject_id: z.string().min(1, "معرف المادة مطلوب"),
  grade_level_id: z.string().min(1, "معرف المستوى مطلوب"),
  title: z.string().min(1, "العنوان مطلوب").max(200, "العنوان طويل جداً"),
  content: z.string().optional(),
  order: z.number().int().min(0).optional(),
  difficulty_level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  tags: z.array(z.string()).optional(),
  is_published: z.boolean().optional(),
});

const UpdateLessonRequestSchema = z.object({
  subject_id: z.string().optional(),
  grade_level_id: z.string().optional(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  order: z.number().int().min(0).optional(),
  difficulty_level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  tags: z.array(z.string()).optional(),
  is_published: z.boolean().optional(),
});

const CreateLearningPathRequestSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(200, "الاسم طويل جداً"),
  description: z.string().optional(),
  subject_id: z.string().min(1, "معرف المادة مطلوب"),
  grade_level_id: z.string().min(1, "معرف المستوى مطلوب"),
  lessons: z.array(z.string()).optional(),
  order: z.number().int().min(0).optional(),
  is_published: z.boolean().optional(),
});

export class ContentManagementController extends BaseHandler {
  /**
   * إنشاء Content Management Controller
   *
   * @param contentManagementService - خدمة إدارة المحتوى
   */
  constructor(
    private readonly contentManagementService: ContentManagementService,
  ) {
    super();
  }

  /**
   * معالج جلب جميع الدروس
   *
   * GET /api/v1/content/lessons
   */
  getLessons = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filters = {
          subject_id: req.query.subject_id as string | undefined,
          grade_level_id: req.query.grade_level_id as string | undefined,
          is_published:
            req.query.is_published === "true"
              ? true
              : req.query.is_published === "false"
                ? false
                : undefined,
          created_by: req.query.created_by as string | undefined,
          page: parseInt(req.query.page as string) || 1,
          per_page: parseInt(req.query.per_page as string) || 20,
        };

        const result = await this.contentManagementService.getLessons(filters);
        this.ok(res, result);
      },
      "فشل جلب الدروس",
    );
  };

  /**
   * معالج جلب درس محدد
   *
   * GET /api/v1/content/lessons/:id
   */
  getLesson = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const lesson = await this.contentManagementService.getLesson(id);
        this.ok(res, lesson);
      },
      "فشل جلب الدرس",
    );
  };

  /**
   * معالج إنشاء درس
   *
   * POST /api/v1/content/lessons
   */
  createLesson = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const validatedData = CreateLessonRequestSchema.parse(req.body);
        const lesson = await this.contentManagementService.createLesson({
          ...validatedData,
          created_by: userId,
        });
        this.created(res, lesson, "تم إنشاء الدرس بنجاح");
      },
      "فشل إنشاء الدرس",
    );
  };

  /**
   * معالج تحديث درس
   *
   * PUT /api/v1/content/lessons/:id
   */
  updateLesson = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id } = req.params;
        const validatedData = UpdateLessonRequestSchema.parse(req.body);
        const lesson = await this.contentManagementService.updateLesson(
          id,
          validatedData,
          userId,
        );
        this.ok(res, lesson);
      },
      "فشل تحديث الدرس",
    );
  };

  /**
   * معالج حذف درس
   *
   * DELETE /api/v1/content/lessons/:id
   */
  deleteLesson = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id } = req.params;
        await this.contentManagementService.deleteLesson(id, userId);
        this.ok(res, { message: "تم حذف الدرس بنجاح" });
      },
      "فشل حذف الدرس",
    );
  };

  /**
   * معالج جلب المواد الدراسية
   *
   * GET /api/v1/content/subjects
   */
  getSubjects = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const subjects = await this.contentManagementService.getSubjects();
        this.ok(res, {
          subjects,
          count: subjects.length,
        });
      },
      "فشل جلب المواد",
    );
  };

  /**
   * معالج جلب المستويات الدراسية
   *
   * GET /api/v1/content/grade-levels
   */
  getGradeLevels = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const gradeLevels =
          await this.contentManagementService.getGradeLevels();
        this.ok(res, {
          grade_levels: gradeLevels,
          count: gradeLevels.length,
        });
      },
      "فشل جلب المستويات",
    );
  };

  /**
   * معالج جلب المسارات التعليمية
   *
   * GET /api/v1/content/learning-paths
   */
  getLearningPaths = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filters = {
          subject_id: req.query.subject_id as string | undefined,
          grade_level_id: req.query.grade_level_id as string | undefined,
          is_published:
            req.query.is_published === "true"
              ? true
              : req.query.is_published === "false"
                ? false
                : undefined,
          created_by: req.query.created_by as string | undefined,
        };

        const paths =
          await this.contentManagementService.getLearningPaths(filters);
        this.ok(res, {
          paths,
          count: paths.length,
        });
      },
      "فشل جلب المسارات",
    );
  };

  /**
   * معالج إنشاء مسار تعليمي
   *
   * POST /api/v1/content/learning-paths
   */
  createLearningPath = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const validatedData = CreateLearningPathRequestSchema.parse(req.body);
        const path = await this.contentManagementService.createLearningPath({
          ...validatedData,
          lessons: validatedData.lessons || [],
          created_by: userId,
        });
        this.created(res, path);
      },
      "فشل إنشاء المسار",
    );
  };

  /**
   * معالج تحديث مسار تعليمي
   *
   * PUT /api/v1/content/learning-paths/:id
   */
  updateLearningPath = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id } = req.params;
        const validatedData = CreateLearningPathRequestSchema.partial().parse(
          req.body,
        );
        const path = await this.contentManagementService.updateLearningPath(
          id,
          validatedData,
          userId,
        );
        this.ok(res, path);
      },
      "فشل تحديث المسار",
    );
  };

  /**
   * معالج حذف مسار تعليمي
   *
   * DELETE /api/v1/content/learning-paths/:id
   */
  deleteLearningPath = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id } = req.params;
        await this.contentManagementService.deleteLearningPath(id, userId);
        this.ok(res, { message: "تم حذف المسار بنجاح" });
      },
      "فشل حذف المسار",
    );
  };
}
