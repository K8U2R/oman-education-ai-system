import { Request, Response } from "express";
import { z } from "zod";
import { BaseCommunicationHandler } from "../../shared/BaseCommunicationHandler.js";

const sendSmsSchema = z.object({
  to: z.string().min(8), // Basic phone validation
  message: z.string().min(1).max(160),
});

export class SmsHandler extends BaseCommunicationHandler {
  sendSms = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        sendSmsSchema.parse(req.body);
        // Stub: Service call would go here
        this.queued(res, "mock-job-id-456");
      },
      "Failed to send SMS",
    );
  };
}
