/**
 * Not Found Middleware - معالج 404
 *
 * Catches all undefined routes and returns appropriate responses.
 *
 * Features:
 * - Content negotiation (JSON vs HTML)
 * - Professional error pages
 * - Security-compliant (LAW_08 - No internal details)
 * - Extensible for future enhancements
 *
 * Future enhancements ready:
 * - Analytics tracking
 * - Custom pages per route pattern
 * - Route suggestions
 * - Rate limiting for 404 scanning prevention
 */

import { Request, Response } from "express";
import { logger } from "@/shared/utils/logger";

/**
 * Configuration for 404 responses
 */
export interface NotFoundConfig {
  logRequests?: boolean;
  customJsonMessage?: string;
  customHtmlTemplate?: string;
  includePathInResponse?: boolean;
}

const DEFAULT_CONFIG: NotFoundConfig = {
  logRequests: true,
  customJsonMessage: "المسار المطلوب غير موجود",
  includePathInResponse: false, // Security: Don't reveal paths by default
};

/**
 * Main 404 handler middleware factory
 *
 * @param config - Configuration options for the handler
 * @returns Express middleware function
 */
export function notFoundHandler(config: NotFoundConfig = DEFAULT_CONFIG) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return (req: Request, res: Response): void => {
    // Optional logging for analytics and debugging
    if (finalConfig.logRequests) {
      logger.warn(`404 Not Found: ${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get("user-agent"),
        method: req.method,
        path: req.path,
      });
    }

    // Content negotiation: Detect what client expects
    const acceptsJson = req.accepts("json");
    const acceptsHtml = req.accepts("html");

    if (acceptsJson && !acceptsHtml) {
      // API request - Return JSON response
      sendJsonNotFound(req, res, finalConfig);
    } else {
      // Browser request - Return HTML page
      sendHtmlNotFound(req, res, finalConfig);
    }
  };
}

/**
 * Send JSON 404 response for API requests
 */
function sendJsonNotFound(
  req: Request,
  res: Response,
  config: NotFoundConfig,
): void {
  const response: Record<string, unknown> = {
    success: false,
    message: config.customJsonMessage || DEFAULT_CONFIG.customJsonMessage,
  };

  // Optionally include path (disabled by default for security)
  if (config.includePathInResponse) {
    response.path = req.path;
  }

  res.status(404).json(response);
}

/**
 * Send HTML 404 response for browser requests
 */
function sendHtmlNotFound(
  _req: Request,
  res: Response,
  config: NotFoundConfig,
): void {
  const html = config.customHtmlTemplate || getDefault404Html();
  res.status(404).send(html);
}

/**
 * Default HTML template for 404 page
 *
 * Features:
 * - RTL (Right-to-Left) support for Arabic
 * - Professional gradient design
 * - Mobile-responsive
 * - No technical details (LAW_08 compliant)
 */
function getDefault404Html(): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - الصفحة غير موجودة</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .container { 
      text-align: center; 
      padding: 2rem; 
      max-width: 600px;
      animation: fadeIn 0.5s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .error-code { 
      font-size: 8rem; 
      font-weight: bold; 
      margin-bottom: 1rem; 
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
      line-height: 1;
    }
    .message { 
      font-size: 1.5rem; 
      margin-bottom: 2rem; 
      line-height: 1.6;
      opacity: 0.95;
    }
    .link {
      display: inline-block; 
      padding: 1rem 2rem; 
      background: white; 
      color: #667eea;
      text-decoration: none; 
      border-radius: 50px; 
      font-weight: bold;
      transition: transform 0.3s, box-shadow 0.3s; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .link:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 6px 12px rgba(0,0,0,0.15); 
    }
    @media (max-width: 600px) {
      .error-code { font-size: 5rem; }
      .message { font-size: 1.2rem; }
      .container { padding: 1rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="error-code">404</div>
    <div class="message">المسار المطلوب غير موجود</div>
    <a href="/" class="link">العودة للصفحة الرئيسية</a>
  </div>
</body>
</html>`;
}

/**
 * Export pre-configured instance for immediate use
 *
 * Use this for standard 404 handling:
 * ```typescript
 * import { notFound } from './not-found.middleware';
 * app.use(notFound);
 * ```
 *
 * Or customize:
 * ```typescript
 * import { notFoundHandler } from './not-found.middleware';
 * app.use(notFoundHandler({ logRequests: false }));
 * ```
 */
export const notFound = notFoundHandler();
