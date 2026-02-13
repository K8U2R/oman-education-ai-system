import { z } from "zod";

export const getNotificationsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  per_page: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["unread", "read", "archived"]).optional(),
  type: z.string().optional(),
});
