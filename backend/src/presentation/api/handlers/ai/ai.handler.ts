import { Request, Response } from "express";
import { AITokenizerService } from "@/application/services/ai/AITokenizerService.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";

export class AIHandler extends BaseHandler {
  constructor(private readonly tokenizerService: AITokenizerService) {
    super();
  }

  /**
   * تحليل وتجزئة النص
   * POST /api/v1/ai/tokenize
   */
  tokenize = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { text, normalize } = req.body;

        if (typeof text !== "string") {
          this.badRequest(
            res,
            "يجب أن يكون النص عبارة عن سلسلة نصية (string)",
            "VALIDATION_ERROR",
          );
          return;
        }

        const result = this.tokenizerService.analyze(text, {
          normalize: normalize !== false,
        });

        this.ok(res, result, "تم تحليل النص بنجاح");
      },
      "فشل تحليل النص",
    );
  };
}
