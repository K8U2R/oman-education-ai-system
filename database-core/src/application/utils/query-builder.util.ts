/**
 * Query Builder Utility - أداة بناء الاستعلامات
 *
 * أدوات مساعدة لبناء وتحسين الاستعلامات
 */

export interface QueryBuilderOptions {
  select?: string[]
  where?: Record<string, unknown>
  orderBy?: { column: string; direction: 'asc' | 'desc' }
  limit?: number
  offset?: number
  groupBy?: string[]
  having?: Record<string, unknown>
}

export class QueryBuilder {
  /**
   * بناء استعلام SELECT
   */
  static buildSelectQuery(table: string, options: QueryBuilderOptions): string {
    const parts: string[] = []

    // SELECT
    const columns = options.select?.join(', ') || '*'
    parts.push(`SELECT ${columns}`)

    // FROM
    parts.push(`FROM ${table}`)

    // WHERE
    if (options.where && Object.keys(options.where).length > 0) {
      const conditions = Object.entries(options.where)
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `${key} = '${value.replace(/'/g, "''")}'`
          }
          return `${key} = ${value}`
        })
        .join(' AND ')
      parts.push(`WHERE ${conditions}`)
    }

    // GROUP BY
    if (options.groupBy && options.groupBy.length > 0) {
      parts.push(`GROUP BY ${options.groupBy.join(', ')}`)
    }

    // HAVING
    if (options.having && Object.keys(options.having).length > 0) {
      const conditions = Object.entries(options.having)
        .map(([key, value]) => `${key} = ${value}`)
        .join(' AND ')
      parts.push(`HAVING ${conditions}`)
    }

    // ORDER BY
    if (options.orderBy) {
      parts.push(`ORDER BY ${options.orderBy.column} ${options.orderBy.direction.toUpperCase()}`)
    }

    // LIMIT
    if (options.limit) {
      parts.push(`LIMIT ${options.limit}`)
    }

    // OFFSET
    if (options.offset) {
      parts.push(`OFFSET ${options.offset}`)
    }

    return parts.join(' ')
  }

  /**
   * بناء استعلام COUNT
   */
  static buildCountQuery(table: string, options: QueryBuilderOptions): string {
    const parts: string[] = []

    parts.push('SELECT COUNT(*) as count')
    parts.push(`FROM ${table}`)

    if (options.where && Object.keys(options.where).length > 0) {
      const conditions = Object.entries(options.where)
        .map(([key, value]) => `${key} = ${value}`)
        .join(' AND ')
      parts.push(`WHERE ${conditions}`)
    }

    return parts.join(' ')
  }

  /**
   * التحقق من وجود فهارس محتملة
   */
  static suggestIndexes(
    table: string,
    queries: Array<{ where: Record<string, unknown> }>
  ): string[] {
    const columnUsage = new Map<string, number>()

    queries.forEach(query => {
      Object.keys(query.where).forEach(column => {
        const count = columnUsage.get(column) || 0
        columnUsage.set(column, count + 1)
      })
    })

    const suggestions: string[] = []
    columnUsage.forEach((count, column) => {
      if (count > 5) {
        suggestions.push(`CREATE INDEX idx_${table}_${column} ON ${table}(${column})`)
      }
    })

    return suggestions
  }
}
