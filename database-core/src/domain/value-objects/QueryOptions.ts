/**
 * QueryOptions - خيارات الاستعلام
 *
 * Value Object يمثل خيارات الاستعلام (pagination, sorting, etc.)
 */

export interface QueryOptionsParams {
  limit?: number
  offset?: number
  orderBy?: { column: string; direction: 'asc' | 'desc' }
}

export class QueryOptions {
  private readonly limit: number | undefined
  private readonly offset: number | undefined
  private readonly orderBy: { column: string; direction: 'asc' | 'desc' } | undefined

  constructor(params: QueryOptionsParams = {}) {
    // Validate limit
    if (params.limit !== undefined) {
      if (params.limit < 1 || params.limit > 1000) {
        throw new Error('Limit must be between 1 and 1000')
      }
      this.limit = params.limit
    }

    // Validate offset
    if (params.offset !== undefined) {
      if (params.offset < 0) {
        throw new Error('Offset must be >= 0')
      }
      this.offset = params.offset
    }

    // Validate orderBy
    if (params.orderBy) {
      if (!params.orderBy.column || !params.orderBy.column.trim()) {
        throw new Error('OrderBy column is required')
      }
      if (params.orderBy.direction !== 'asc' && params.orderBy.direction !== 'desc') {
        throw new Error('OrderBy direction must be "asc" or "desc"')
      }
      this.orderBy = {
        column: params.orderBy.column.trim(),
        direction: params.orderBy.direction,
      }
    }
  }

  getLimit(): number | undefined {
    return this.limit
  }

  getOffset(): number | undefined {
    return this.offset
  }

  getOrderBy(): { column: string; direction: 'asc' | 'desc' } | undefined {
    return this.orderBy
  }

  toJSON(): QueryOptionsParams {
    return {
      limit: this.limit,
      offset: this.offset,
      orderBy: this.orderBy,
    }
  }
}
