import { UserData } from "../domain/types/auth/index.js";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends UserData {
      planTier?: "FREE" | "PRO" | "PREMIUM";
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Request {
      user?: User;
      userId?: string;
    }
  }
}

export {};
