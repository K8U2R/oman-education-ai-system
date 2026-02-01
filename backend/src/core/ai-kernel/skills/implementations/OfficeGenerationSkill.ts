import { ISkill } from "../ISkill";
import { OfficeGenerationService } from "@/application/services/index.js";
import { OfficeGenerationRequest } from "@/domain/types/features/productivity/office.types.js";
import { container } from "@/infrastructure/di/Container";
import { logger } from "@/shared/utils/logger";

export class OfficeGenerationSkill implements ISkill<
  OfficeGenerationRequest,
  unknown
> {
  public name = "office.generate";
  public description =
    "Generate Office documents (Word, Excel, PowerPoint) based on data and templates.";
  public inputSchema = {
    type: "object",
    properties: {
      type: { type: "string", enum: ["word", "excel", "powerpoint"] },
      data: { type: "object" },
      templateId: { type: "string" },
    },
    required: ["type", "data"],
  };

  private service: OfficeGenerationService;

  constructor(service?: OfficeGenerationService) {
    this.service =
      service ||
      container.resolve<OfficeGenerationService>("OfficeGenerationService");
  }

  public async execute(
    input: OfficeGenerationRequest,
    context: unknown,
  ): Promise<unknown> {
    logger.info(`[OfficeSkill] Executing generation for type: ${input.type}`, {
      context,
    });
    return await this.service.generateOffice(input);
  }
}
