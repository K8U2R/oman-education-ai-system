/**
 * Assessment Handlers - معالجات التقييمات
 *
 * Request handlers لجميع endpoints التقييمات
 */

import { Request, Response } from "express";
import { AssessmentService } from "@/application/services/assessment/AssessmentService.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import {
  CreateAssessmentRequestSchema,
  SubmitAssessmentRequestSchema,
} from "@/presentation/api/dto/content/assessment.dto.js";
import {
  CreateAssessmentRequest,
  SubmitAssessmentRequest,
  UpdateAssessmentRequest,
} from "@/domain/types/assessment.types.js";

export class AssessmentHandler extends BaseHandler {
  /**
   * إنشاء Assessment Handler
   *
   * @param assessmentService - خدمة التقييمات
   */
  constructor(private readonly assessmentService: AssessmentService) {
    super();
  }

  /**
   * معالج إنشاء تقييم
   *
   * POST /api/v1/assessments
   */
  createAssessment = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const validatedData = CreateAssessmentRequestSchema.parse(req.body);
        const assessment = await this.assessmentService.createAssessment(
          validatedData as unknown as CreateAssessmentRequest,
          userId,
        );
        this.created(res, assessment, "تم إنشاء التقييم بنجاح");
      },
      "فشل إنشاء التقييم",
    );
  };

  /**
   * معالج جلب جميع تقييمات المستخدم
   *
   * GET /api/v1/assessments
   */
  getAssessments = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const result = await this.assessmentService.getAssessments({
          created_by: userId,
        });
        this.ok(res, result.assessments, "تم جلب التقييمات بنجاح");
      },
      "فشل جلب التقييمات",
    );
  };

  /**
   * معالج جلب تقييم محدد
   *
   * GET /api/v1/assessments/:id
   */
  getAssessment = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id } = req.params;
        const assessment = await this.assessmentService.getAssessment(id);
        this.ok(res, assessment, "تم جلب التقييم بنجاح");
      },
      "فشل جلب التقييم",
    );
  };

  /**
   * معالج تحديث تقييم
   *
   * PUT /api/v1/assessments/:id
   */
  updateAssessment = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id } = req.params;
        const validatedData = CreateAssessmentRequestSchema.partial().parse(
          req.body,
        );
        const assessment = await this.assessmentService.updateAssessment(
          id,
          validatedData as unknown as UpdateAssessmentRequest,
          userId,
        );
        this.ok(res, assessment, "تم تحديث التقييم بنجاح");
      },
      "فشل تحديث التقييم",
    );
  };

  /**
   * معالج حذف تقييم
   *
   * DELETE /api/v1/assessments/:id
   */
  deleteAssessment = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id } = req.params;
        await this.assessmentService.deleteAssessment(id, userId);
        this.ok(res, { message: "تم حذف التقييم بنجاح" });
      },
      "فشل حذف التقييم",
    );
  };

  /**
   * معالج تقديم تقييم
   *
   * POST /api/v1/assessments/:id/submit
   */
  submitAssessment = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id } = req.params;
        const validatedData = SubmitAssessmentRequestSchema.parse(req.body);
        const result = await this.assessmentService.submitAssessment(
          id,
          validatedData as unknown as SubmitAssessmentRequest,
          userId,
        );
        this.ok(res, result, "تم تقديم التقييم بنجاح");
      },
      "فشل تقديم التقييم",
    );
  };

  /**
   * معالج جلب نتائج تقييم
   *
   * GET /api/v1/assessments/:id/results
   */
  getAssessmentResults = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id } = req.params;
        const results = await this.assessmentService.getSubmission(id, userId);
        if (!results) {
          this.notFound(res, "نتائج التقييم غير موجودة");
          return;
        }
        this.ok(res, results, "تم جلب نتائج التقييم بنجاح");
      },
      "فشل جلب نتائج التقييم",
    );
  };

  /**
   * معالج جلب إحصائيات التقييمات
   */
  getAssessmentStats = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        this.ok(
          res,
          { total: 0, completed: 0, averageScore: 0 },
          "تم جلب إحصائيات التقييمات",
        );
      },
      "فشل جلب إحصائيات التقييمات",
    );
  };

  /**
   * معالج جلب تقديم محدد (Alias for getAssessmentResults)
   */
  getSubmission = async (req: Request, res: Response): Promise<void> => {
    return this.getAssessmentResults(req, res);
  };
}
