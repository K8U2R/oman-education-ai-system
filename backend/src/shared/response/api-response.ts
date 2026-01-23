/**
 * API Response Utility - مساعدة استجابات API
 * 
 * @law Law-1 (Modularity) - Centralized response handling
 */

import { Response } from "express";
import { sendSuccess, sendError } from "../../presentation/api/utils/response.helper.js";

export class ApiResponse {
    /**
     * إرسال استجابة نجاح
     */
    static success<T>(res: Response, data: T, message?: string, statusCode: number = 200): void {
        sendSuccess(res, data, message, statusCode as any);
    }

    /**
     * إرسال استجابة خطأ
     */
    static error(res: Response, message: string, statusCode: number = 400, code: string = "ERROR"): void {
        sendError(res, { message, code: code as any }, statusCode as any);
    }
}
