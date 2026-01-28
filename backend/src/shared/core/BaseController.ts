import { Request, Response, NextFunction } from "express";

/**
 * Base Controller
 * 
 * Foundation class for all controllers in the modular architecture.
 * Provides common response methods and error handling wrappers.
 */
export abstract class BaseController {

    /**
     * Send a success response (200 OK)
     */
    protected ok<T>(res: Response, dto?: T): Response {
        if (!!dto) {
            return res.status(200).json({ success: true, data: dto });
        } else {
            return res.status(200).json({ success: true });
        }
    }

    /**
     * Send a created response (201 Created)
     */
    protected created<T>(res: Response, dto?: T): Response {
        if (!!dto) {
            return res.status(201).json({ success: true, data: dto });
        } else {
            return res.status(201).json({ success: true });
        }
    }

    /**
     * Send a client error response (400 Bad Request)
     */
    protected clientError(res: Response, message: string = "Bad Request"): Response {
        return res.status(400).json({ success: false, error: message });
    }

    /**
     * Send an unauthorized response (401 Unauthorized)
     */
    protected unauthorized(res: Response, message: string = "Unauthorized"): Response {
        return res.status(401).json({ success: false, error: message });
    }

    /**
     * Send a forbidden response (403 Forbidden)
     */
    protected forbidden(res: Response, message: string = "Forbidden"): Response {
        return res.status(403).json({ success: false, error: message });
    }

    /**
     * Send a not found response (404 Not Found)
     */
    protected notFound(res: Response, message: string = "Not Found"): Response {
        return res.status(404).json({ success: false, error: message });
    }

    /**
     * Send a server error response (500 Internal Server Error)
     */
    protected fail(res: Response, error: Error | string): Response {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.toString()
        });
    }
}
