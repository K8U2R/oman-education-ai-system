/**
 * Query Builder Utility - بناء استعلامات SQL
 *
 * دوال مساعدة لبناء استعلامات SQL من Query Builder State
 */

import type { QueryBuilderState, Condition } from '../types'

/**
 * بناء SELECT Query من Query Builder State
 */
export function buildSelectQuery(state: QueryBuilderState): string {
  if (!state.from) {
    throw new Error('يجب تحديد جدول (FROM)')
  }

  const parts: string[] = []

  // SELECT
  const columns = state.select.length > 0 ? state.select.join(', ') : '*'
  parts.push(`SELECT ${columns}`)

  // FROM
  parts.push(`FROM ${state.from}`)

  // JOINs
  if (state.joins.length > 0) {
    state.joins.forEach(join => {
      const joinType = join.type.toUpperCase()
      const onCondition = buildCondition(join.on)
      parts.push(`${joinType} JOIN ${join.table} ON ${onCondition}`)
    })
  }

  // WHERE
  if (state.where.length > 0) {
    const whereClause = state.where
      .map((condition, index) => {
        const conditionStr = buildCondition(condition)
        if (index > 0 && condition.logicalOperator) {
          return `${condition.logicalOperator} ${conditionStr}`
        }
        return conditionStr
      })
      .join(' ')
    parts.push(`WHERE ${whereClause}`)
  }

  // GROUP BY
  if (state.groupBy.length > 0) {
    parts.push(`GROUP BY ${state.groupBy.join(', ')}`)
  }

  // HAVING
  if (state.having.length > 0) {
    const havingClause = state.having
      .map((condition, index) => {
        const conditionStr = buildCondition(condition)
        if (index > 0 && condition.logicalOperator) {
          return `${condition.logicalOperator} ${conditionStr}`
        }
        return conditionStr
      })
      .join(' ')
    parts.push(`HAVING ${havingClause}`)
  }

  // ORDER BY
  if (state.orderBy.length > 0) {
    const orderByClause = state.orderBy
      .map(order => `${order.column} ${order.direction.toUpperCase()}`)
      .join(', ')
    parts.push(`ORDER BY ${orderByClause}`)
  }

  // LIMIT
  if (state.limit !== null && state.limit > 0) {
    parts.push(`LIMIT ${state.limit}`)
  }

  return parts.join(' ')
}

/**
 * بناء Condition
 */
function buildCondition(condition: Condition): string {
  const { column, operator, value } = condition

  switch (operator) {
    case 'IS NULL':
      return `${column} IS NULL`
    case 'IS NOT NULL':
      return `${column} IS NOT NULL`
    case 'IN':
      if (Array.isArray(value)) {
        const values = value.map(v => formatValue(v)).join(', ')
        return `${column} IN (${values})`
      }
      throw new Error('IN operator requires an array value')
    case 'NOT IN':
      if (Array.isArray(value)) {
        const values = value.map(v => formatValue(v)).join(', ')
        return `${column} NOT IN (${values})`
      }
      throw new Error('NOT IN operator requires an array value')
    case 'LIKE':
      return `${column} LIKE ${formatValue(value)}`
    default:
      return `${column} ${operator} ${formatValue(value)}`
  }
}

/**
 * تنسيق القيمة للـ SQL
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'NULL'
  }
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'` // Escape single quotes
  }
  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE'
  }
  if (typeof value === 'number') {
    return String(value)
  }
  if (value instanceof Date) {
    return `'${value.toISOString()}'`
  }
  return `'${String(value)}'`
}

/**
 * بناء INSERT Query
 */
export function buildInsertQuery(table: string, data: Record<string, unknown>): string {
  const columns = Object.keys(data).join(', ')
  const values = Object.values(data).map(formatValue).join(', ')
  return `INSERT INTO ${table} (${columns}) VALUES (${values})`
}

/**
 * بناء UPDATE Query
 */
export function buildUpdateQuery(
  table: string,
  data: Record<string, unknown>,
  where: Condition[]
): string {
  if (where.length === 0) {
    throw new Error('UPDATE query requires WHERE conditions')
  }

  const setClause = Object.entries(data)
    .map(([key, value]) => `${key} = ${formatValue(value)}`)
    .join(', ')

  const whereClause = where.map(condition => buildCondition(condition)).join(' AND ')

  return `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`
}

/**
 * بناء DELETE Query
 */
export function buildDeleteQuery(table: string, where: Condition[]): string {
  if (where.length === 0) {
    throw new Error('DELETE query requires WHERE conditions')
  }

  const whereClause = where.map(condition => buildCondition(condition)).join(' AND ')

  return `DELETE FROM ${table} WHERE ${whereClause}`
}
