import { Request, Response } from "express";
import { z } from "zod";
import { BaseCommunicationHandler } from "../../shared/BaseCommunicationHandler.js";

const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export class EmailHandler extends BaseCommunicationHandler {
  sendEmail = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        sendEmailSchema.parse(req.body);
        // Stub: Service call would go here
        this.sent(res, "mock-email-id-123", "smtp");
      },
      "Failed to send email",
    );
  };
}
