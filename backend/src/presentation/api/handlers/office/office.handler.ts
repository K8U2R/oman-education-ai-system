import { Request, Response } from "express";
import { z } from "zod";
import { OfficeGenerationService } from "@/application/services/office/OfficeGenerationService";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler";

// Validation Schemas
const OfficeGenerationRequestSchema = z.object({
  type: z.enum(["excel", "word", "powerpoint", "pdf"]),
  template_id: z.string().optional(),
  data: z.record(z.any()),
  options: z
    .object({
      title: z.string().optional(),
      author: z.string().optional(),
      subject: z.string().optional(),
      language: z.enum(["ar", "en"]).optional(),
      style: z
        .enum(["simple", "professional", "academic", "business"])
        .optional(),
      include_charts: z.boolean().optional(),
      include_images: z.boolean().optional(),
    })
    .optional(),
  user_specialization: z.string().optional(),
  description: z.string().optional(),
});

export class OfficeHandler extends BaseHandler {
  /**
   * إنشاء Office Handler
   *
   * @param officeGenerationService - خدمة إنشاء ملفات Office
   */
  constructor(
    private readonly officeGenerationService: OfficeGenerationService,
  ) {
    super();
  }

  /**
   * معالج إنشاء ملف Office
   *
   * POST /api/v1/office/generate
   */
  generateOffice = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const validatedData = OfficeGenerationRequestSchema.parse(req.body);
        const userId = req.user?.id;
        const result = await this.officeGenerationService.generateOffice(
          validatedData,
          userId,
        );
        this.ok(res, result);
      },
      "فشل إنشاء ملف Office",
    );
  };

  /**
   * معالج جلب القوالب
   *
   * GET /api/v1/office/templates
   */
  getTemplates = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const type = req.query.type as string | undefined;
        const templates = await this.officeGenerationService.getTemplates(type);
        this.ok(res, {
          templates,
          count: templates.length,
        });
      },
      "فشل جلب القوالب",
    );
  };
}
