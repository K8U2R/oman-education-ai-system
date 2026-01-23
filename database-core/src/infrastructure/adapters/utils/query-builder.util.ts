/**
 * Query Builder Utility - أداة بناء الاستعلامات
 *
 * Utility لبناء استعلامات SQL بشكل موحد عبر Adapters
 */

/**
 * خيارات الاستعلام
 */
export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: { column: string; direction: 'asc' | 'desc' }
}

/**
 * بناء WHERE clause
 */
export function buildWhereClause(
  conditions: Record<string, unknown>,
  paramPlaceholder: (index: number) => string = i => `$${i}`
): {
  clause: string
  params: unknown[]
} {
  const whereConditions: string[] = []
  const params: unknown[] = []
  let paramIndex = 1

  for (const [key, value] of Object.entries(conditions)) {
    if (value !== undefined && value !== null) {
      whereConditions.push(`${escapeIdentifier(key)} = ${paramPlaceholder(paramIndex)}`)
      params.push(value)
      paramIndex++
    }
  }

  return {
    clause: whereConditions.length > 0 ? ` WHERE ${whereConditions.join(' AND ')}` : '',
    params,
  }
}

/**
 * بناء ORDER BY clause
 */
export function buildOrderByClause(orderBy?: {
  column: string
  direction: 'asc' | 'desc'
}): string {
  if (!orderBy) {
    return ''
  }
  return ` ORDER BY ${escapeIdentifier(orderBy.column)} ${orderBy.direction.toUpperCase()}`
}

/**
 * بناء LIMIT و OFFSET clauses
 */
export function buildLimitOffsetClause(
  options: QueryOptions,
  paramPlaceholder: (index: number) => string = i => `$${i}`,
  startIndex: number = 1
): {
  clause: string
  params: unknown[]
  nextIndex: number
} {
  const clauses: string[] = []
  const params: unknown[] = []
  let paramIndex = startIndex

  if (options.limit) {
    clauses.push(`LIMIT ${paramPlaceholder(paramIndex)}`)
    params.push(options.limit)
    paramIndex++
  }

  if (options.offset !== undefined) {
    clauses.push(`OFFSET ${paramPlaceholder(paramIndex)}`)
    params.push(options.offset)
    paramIndex++
  }

  return {
    clause: clauses.length > 0 ? ` ${clauses.join(' ')}` : '',
    params,
    nextIndex: paramIndex,
  }
}

/**
 * Escape identifier للـ SQL injection protection
 */
export function escapeIdentifier(identifier: string, quote: string = '"'): string {
  return `${quote}${identifier.replace(new RegExp(quote, 'g'), quote + quote)}${quote}`
}

/**
 * بناء استعلام SELECT كامل
 */
export function buildSelectQuery(
  entity: string,
  conditions: Record<string, unknown>,
  options?: QueryOptions,
  paramPlaceholder: (index: number) => string = i => `$${i}`
): {
  query: string
  params: unknown[]
} {
  let query = `SELECT * FROM ${escapeIdentifier(entity)}`
  const allParams: unknown[] = []
  let paramIndex = 1

  // WHERE clause
  const { clause: whereClause, params: whereParams } = buildWhereClause(conditions, i =>
    paramPlaceholder(paramIndex + i - 1)
  )
  query += whereClause
  allParams.push(...whereParams)
  paramIndex += whereParams.length

  // ORDER BY clause
  query += buildOrderByClause(options?.orderBy)

  // LIMIT و OFFSET clauses
  const { clause: limitOffsetClause, params: limitOffsetParams } = buildLimitOffsetClause(
    options || {},
    paramPlaceholder,
    paramIndex
  )
  query += limitOffsetClause
  allParams.push(...limitOffsetParams)

  return {
    query,
    params: allParams,
  }
}
