/**
 * DatabaseResponse DTO - Data Transfer Object لاستجابات قاعدة البيانات
 *
 * DTO لتمثيل استجابات قاعدة البيانات
 */

export interface DatabaseResponseDto<T = unknown> {
  success: boolean
  data?: T | T[]
  error?: string
  metadata?: {
    executionTime?: number
    cached?: boolean
    count?: number
  }
}

export class DatabaseResponse<T = unknown> {
  private readonly success: boolean
  private readonly data: T | T[] | undefined
  private readonly error: string | undefined
  private readonly metadata: {
    executionTime?: number
    cached?: boolean
    count?: number
  }

  constructor(
    success: boolean,
    data?: T | T[],
    error?: string,
    metadata?: {
      executionTime?: number
      cached?: boolean
      count?: number
    }
  ) {
    this.success = success
    this.data = data
    this.error = error
    this.metadata = metadata || {}
  }

  static success<T = unknown>(
    data: T | T[],
    metadata?: {
      executionTime?: number
      cached?: boolean
      count?: number
    }
  ): DatabaseResponse<T> {
    return new DatabaseResponse<T>(true, data, undefined, metadata)
  }

  static error<T = unknown>(
    error: string,
    metadata?: {
      executionTime?: number
    }
  ): DatabaseResponse<T> {
    return new DatabaseResponse<T>(false, undefined, error, metadata)
  }

  isSuccess(): boolean {
    return this.success
  }

  getData(): T | T[] | undefined {
    return this.data
  }

  getError(): string | undefined {
    return this.error
  }

  getMetadata(): {
    executionTime?: number
    cached?: boolean
    count?: number
  } {
    return { ...this.metadata }
  }

  toJSON(): DatabaseResponseDto<T> {
    return {
      success: this.success,
      data: this.data,
      error: this.error,
      metadata: this.metadata,
    }
  }
}
