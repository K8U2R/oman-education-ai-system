/**
 * QueryResult - نتيجة الاستعلام
 *
 * Entity تمثل نتيجة استعلام قاعدة البيانات
 */

export interface QueryResultParams<T = unknown> {
  data: T | T[]
  count?: number
  metadata?: {
    executionTime?: number
    cached?: boolean
    query?: string
  }
}

export class QueryResult<T = unknown> {
  private readonly data: T | T[]
  private readonly count: number | undefined
  private readonly metadata: {
    executionTime?: number
    cached?: boolean
    query?: string
  }

  constructor(params: QueryResultParams<T>) {
    this.data = params.data
    this.count = params.count
    this.metadata = params.metadata || {}
  }

  getData(): T | T[] {
    return this.data
  }

  getDataAsArray(): T[] {
    return Array.isArray(this.data) ? this.data : [this.data]
  }

  getDataAsSingle(): T | null {
    return Array.isArray(this.data) ? this.data[0] || null : this.data
  }

  getCount(): number | undefined {
    return this.count
  }

  getMetadata(): {
    executionTime?: number
    cached?: boolean
    query?: string
  } {
    return { ...this.metadata }
  }

  isCached(): boolean {
    return this.metadata.cached ?? false
  }

  getExecutionTime(): number | undefined {
    return this.metadata.executionTime
  }

  isEmpty(): boolean {
    if (Array.isArray(this.data)) {
      return this.data.length === 0
    }
    return this.data === null || this.data === undefined
  }

  toJSON(): {
    data: T | T[]
    count?: number
    metadata: {
      executionTime?: number
      cached?: boolean
      query?: string
    }
  } {
    return {
      data: this.data,
      count: this.count,
      metadata: this.metadata,
    }
  }
}
