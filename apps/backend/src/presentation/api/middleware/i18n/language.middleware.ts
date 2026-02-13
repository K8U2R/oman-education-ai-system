import { Request, Response, NextFunction } from "express";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      language?: string;
    }
  }
}

/**
 * Language Middleware
 *
 * Extracts the preferred language from the 'Accept-Language' header.
 * Defaults to 'en' (English) if not specified or not supported.
 * Currently supports 'en' and 'ar'.
 */
export const languageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const acceptLanguage = req.headers["accept-language"];
  let lang = "en"; // Default language

  if (acceptLanguage) {
    if (typeof acceptLanguage === "string") {
      // Parse the header (e.g., "ar-QA,ar;q=0.9,en;q=0.8")
      // We look at the first preference
      const languages = acceptLanguage
        .split(",")
        .map((l) => l.trim().split(";")[0]);

      // Check the first preferred language
      if (languages.length > 0) {
        if (languages[0].startsWith("ar")) {
          lang = "ar";
        }
      }
    }
  }

  // Attach to request object
  req.language = lang;

  // Set response header to indicate content language
  res.setHeader("Content-Language", lang);

  next();
};
