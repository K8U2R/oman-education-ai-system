/**
 * ValidationException - استثناء التحقق
 *
 * يُرمى عند فشل التحقق من صحة البيانات
 */

import { DatabaseException } from './DatabaseException'

export class ValidationException extends DatabaseException {
  public readonly errors: Array<{ field: string; message: string }>

  constructor(
    message: string,
    errors: Array<{ field: string; message: string }> = [],
    details?: Record<string, unknown>
  ) {
    super(message, 'VALIDATION_ERROR', 400, {
      errors,
      ...details,
    })
    this.name = 'ValidationException'
    this.errors = errors
  }
}
