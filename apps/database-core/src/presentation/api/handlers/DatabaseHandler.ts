/**
 * DatabaseHandler - معالج طلبات قاعدة البيانات
 *
 * معالج لطلبات قاعدة البيانات في API Layer
 */

import { Request, Response } from 'express'
import { DatabaseCoreService } from '../../../application/services/DatabaseCoreService'
import { DatabaseRequest } from '../../../application/dto/DatabaseRequest.dto'
import { DatabaseResponse } from '../../../application/dto/DatabaseResponse.dto'
import {
  ValidationException,
  QueryException,
  PermissionDeniedException,
} from '../../../domain/exceptions'
import { logger } from '../../../shared/utils/logger'

export class DatabaseHandler {
  constructor(private readonly databaseService: DatabaseCoreService) {}

  /**
   * معالج تنفيذ عملية قاعدة البيانات
   */
  async executeOperation(req: Request, res: Response): Promise<void> {
    try {
      // 1. بناء DatabaseRequest من req.body
      const request = new DatabaseRequest(req.body)

      // 2. تنفيذ العملية
      const response = await this.databaseService.executeOperation(request.toJSON())

      // 3. إرجاع الاستجابة
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.status(response.isSuccess() ? 200 : 400).json(response.toJSON())
    } catch (error) {
      logger.error('DatabaseHandler.executeOperation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        body: req.body,
      })

      // معالجة الأخطاء
      if (error instanceof ValidationException) {
        const response = DatabaseResponse.error(error.message, undefined)
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.status(400).json(response.toJSON())
        return
      }

      if (error instanceof PermissionDeniedException) {
        const response = DatabaseResponse.error(error.message, undefined)
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.status(403).json(response.toJSON())
        return
      }

      if (error instanceof QueryException) {
        const response = DatabaseResponse.error(error.message, undefined)
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.status(400).json(response.toJSON())
        return
      }

      // خطأ غير معروف
      const response = DatabaseResponse.error('حدث خطأ غير معروف في معالجة الطلب')
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.status(500).json(response.toJSON())
    }
  }
}
