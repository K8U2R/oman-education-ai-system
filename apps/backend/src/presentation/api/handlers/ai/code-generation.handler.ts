/**
 * Code Generation Handlers - معالجات توليد الكود
 *
 * Request handlers لجميع endpoints توليد الكود
 */

import { Request, Response } from "express";
import { z } from "zod";
import { CodeGenerationService } from "@/application/services/index.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";

// Validation Schemas
const CodeGenerationRequestSchema = z.object({
  prompt: z.string().min(1, "الوصف مطلوب").max(2000, "الوصف طويل جداً"),
  language: z.string().optional(),
  framework: z.string().optional(),
  context: z.string().optional(),
  style: z.enum(["simple", "detailed", "commented", "minimal"]).optional(),
  include_tests: z.boolean().optional(),
  include_docs: z.boolean().optional(),
});

const CodeImprovementRequestSchema = z.object({
  code: z.string().min(1, "الكود مطلوب"),
  language: z.string().min(1, "اللغة مطلوبة"),
  improvement_type: z
    .enum(["performance", "readability", "security", "best-practices"])
    .optional(),
  specific_issues: z.array(z.string()).optional(),
});

const CodeExplanationRequestSchema = z.object({
  code: z.string().min(1, "الكود مطلوب"),
  language: z.string().min(1, "اللغة مطلوبة"),
  detail_level: z.enum(["simple", "detailed", "comprehensive"]).optional(),
});

export class CodeGenerationHandler extends BaseHandler {
  /**
   * إنشاء Code Generation Handler
   *
   * @param codeGenerationService - خدمة توليد الكود
   */
  constructor(private readonly codeGenerationService: CodeGenerationService) {
    super();
  }

  /**
   * معالج توليد الكود
   *
   * POST /api/v1/code-generation/generate
   */
  generateCode = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const validatedData = CodeGenerationRequestSchema.parse(req.body);
        // const userId = req.user?.id;
        const result = await this.codeGenerationService.generateCode(
          validatedData,
          // userId,
        );
        this.ok(res, result);
      },
      "فشل توليد الكود",
    );
  };

  /**
   * معالج تحسين الكود
   *
   * POST /api/v1/code-generation/improve
   */
  improveCode = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const validatedData = CodeImprovementRequestSchema.parse(req.body);
        const result =
          await this.codeGenerationService.improveCode(validatedData);
        this.ok(res, result);
      },
      "فشل تحسين الكود",
    );
  };

  /**
   * معالج شرح الكود
   *
   * POST /api/v1/code-generation/explain
   */
  explainCode = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const validatedData = CodeExplanationRequestSchema.parse(req.body);
        const result =
          await this.codeGenerationService.explainCode(validatedData);
        this.ok(res, result);
      },
      "فشل شرح الكود",
    );
  };
}
