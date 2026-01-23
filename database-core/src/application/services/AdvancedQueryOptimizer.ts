/**
 * AdvancedQueryOptimizer - محسّن الاستعلامات المتقدم
 *
 * تحسينات متقدمة للاستعلامات مع:
 * - Index Recommendations
 * - Query Plan Analysis
 * - Query Rewriting
 * - Execution Plan Optimization
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { logger } from '../../shared/utils/logger'
import type {
  ExecutionPlan,
  ExecutionPlanNode,
  PostgreSQLExecutionPlan,
  MySQLExecutionPlan,
} from '../../domain/types/query-plan.types'

/**
 * Index Recommendation
 */
export interface IndexRecommendation {
  table: string
  columns: string[]
  type: 'btree' | 'hash' | 'gin' | 'gist' | 'brin'
  reason: string
  estimatedImprovement: number // Percentage
  priority: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * Query Plan Analysis
 */
export interface QueryPlanAnalysis {
  query: string
  executionPlan: string
  estimatedCost: number
  actualCost: number
  rowsScanned: number
  indexesUsed: string[]
  missingIndexes: string[]
  recommendations: string[]
  optimizationScore: number // 0-100
}

/**
 * Query Rewrite Suggestion
 */
export interface QueryRewriteSuggestion {
  originalQuery: string
  optimizedQuery: string
  reason: string
  estimatedImprovement: number
}

/**
 * Advanced Query Optimizer
 */
export class AdvancedQueryOptimizer {
  private readonly adapter: IDatabaseAdapter
  private readonly queryHistory: Map<
    string,
    {
      count: number
      totalDuration: number
      avgDuration: number
      minDuration: number
      maxDuration: number
    }
  > = new Map()

  constructor(adapter: IDatabaseAdapter) {
    this.adapter = adapter
  }

  /**
   * تسجيل استعلام للتحليل
   */
  recordQuery(query: string, duration: number): void {
    const normalizedQuery = this.normalizeQuery(query)
    const existing = this.queryHistory.get(normalizedQuery)

    if (existing) {
      existing.count++
      existing.totalDuration += duration
      existing.avgDuration = existing.totalDuration / existing.count
      existing.minDuration = Math.min(existing.minDuration, duration)
      existing.maxDuration = Math.max(existing.maxDuration, duration)
    } else {
      this.queryHistory.set(normalizedQuery, {
        count: 1,
        totalDuration: duration,
        avgDuration: duration,
        minDuration: duration,
        maxDuration: duration,
      })
    }
  }

  /**
   * تحليل خطة التنفيذ
   */
  async analyzeQueryPlan(query: string, entity: string): Promise<QueryPlanAnalysis> {
    try {
      // محاولة الحصول على Execution Plan
      let executionPlan = ''
      let estimatedCost = 0
      let actualCost = 0
      let rowsScanned = 0
      const indexesUsed: string[] = []
      const missingIndexes: string[] = []

      // محاولة استخدام EXPLAIN (يعتمد على نوع قاعدة البيانات)
      try {
        const explainQuery = this.getExplainQuery(query)
        const planResult = await this.adapter.executeRaw<ExecutionPlan>(explainQuery, {})

        if (planResult && Array.isArray(planResult) && planResult.length > 0) {
          executionPlan = JSON.stringify(planResult, null, 2)

          // تحليل Execution Plan
          const analysis = this.parseExecutionPlan(planResult)
          estimatedCost = analysis.estimatedCost
          actualCost = analysis.actualCost
          rowsScanned = analysis.rowsScanned
          indexesUsed.push(...analysis.indexesUsed)
          missingIndexes.push(...analysis.missingIndexes)
        }
      } catch (error) {
        logger.warn('Failed to get execution plan', {
          error: error instanceof Error ? error.message : String(error),
          query: query.substring(0, 100),
        })
      }

      // توليد التوصيات
      const recommendations = this.generateRecommendations(
        query,
        entity,
        indexesUsed,
        missingIndexes,
        rowsScanned,
        estimatedCost
      )

      // حساب Optimization Score
      const optimizationScore = this.calculateOptimizationScore(
        indexesUsed.length,
        missingIndexes.length,
        rowsScanned,
        estimatedCost
      )

      return {
        query,
        executionPlan,
        estimatedCost,
        actualCost,
        rowsScanned,
        indexesUsed,
        missingIndexes,
        recommendations,
        optimizationScore,
      }
    } catch (error) {
      logger.error('Failed to analyze query plan', {
        error: error instanceof Error ? error.message : String(error),
        query: query.substring(0, 100),
      })
      throw error
    }
  }

  /**
   * توليد توصيات الفهارس
   */
  async generateIndexRecommendations(entity: string): Promise<IndexRecommendation[]> {
    const recommendations: IndexRecommendation[] = []

    try {
      // تحليل الاستعلامات المتكررة
      const entityQueries = Array.from(this.queryHistory.entries())
        .filter(([query]) => query.toLowerCase().includes(entity.toLowerCase()))
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 10)

      for (const [query, stats] of entityQueries) {
        // استخراج الأعمدة المستخدمة في WHERE
        const whereColumns = this.extractWhereColumns(query)

        // استخراج الأعمدة المستخدمة في ORDER BY
        const orderByColumns = this.extractOrderByColumns(query)

        // استخراج الأعمدة المستخدمة في JOIN
        const joinColumns = this.extractJoinColumns(query)

        // توليد توصيات
        if (whereColumns.length > 0 && stats.avgDuration > 100) {
          recommendations.push({
            table: entity,
            columns: whereColumns,
            type: 'btree',
            reason: `استعلامات متكررة (${stats.count} مرة) بمتوسط مدة ${Math.round(stats.avgDuration)}ms`,
            estimatedImprovement: Math.min(80, stats.avgDuration / 10),
            priority:
              stats.avgDuration > 500 ? 'critical' : stats.avgDuration > 200 ? 'high' : 'medium',
          })
        }

        if (orderByColumns.length > 0 && stats.avgDuration > 200) {
          recommendations.push({
            table: entity,
            columns: orderByColumns,
            type: 'btree',
            reason: `ORDER BY بدون فهرس - متوسط مدة ${Math.round(stats.avgDuration)}ms`,
            estimatedImprovement: Math.min(60, stats.avgDuration / 15),
            priority: stats.avgDuration > 500 ? 'high' : 'medium',
          })
        }

        if (joinColumns.length > 0 && stats.avgDuration > 300) {
          recommendations.push({
            table: entity,
            columns: joinColumns,
            type: 'btree',
            reason: `JOIN بدون فهرس - متوسط مدة ${Math.round(stats.avgDuration)}ms`,
            estimatedImprovement: Math.min(70, stats.avgDuration / 12),
            priority: stats.avgDuration > 500 ? 'high' : 'medium',
          })
        }
      }

      // إزالة التكرارات
      const uniqueRecommendations = this.deduplicateRecommendations(recommendations)

      return uniqueRecommendations.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    } catch (error) {
      logger.error('Failed to generate index recommendations', {
        error: error instanceof Error ? error.message : String(error),
        entity,
      })
      return []
    }
  }

  /**
   * اقتراح إعادة كتابة الاستعلام
   */
  suggestQueryRewrite(query: string): QueryRewriteSuggestion[] {
    const suggestions: QueryRewriteSuggestion[] = []

    // تحليل SELECT *
    if (query.match(/SELECT\s+\*\s+FROM/i)) {
      suggestions.push({
        originalQuery: query,
        optimizedQuery: query.replace(/SELECT\s+\*/i, 'SELECT specific_columns'),
        reason: 'SELECT * يجلب جميع الأعمدة - استخدم أعمدة محددة',
        estimatedImprovement: 20,
      })
    }

    // تحليل WHERE مع LIKE '%pattern%'
    if (query.match(/WHERE\s+\w+\s+LIKE\s+['"]%.*%['"]/i)) {
      suggestions.push({
        originalQuery: query,
        optimizedQuery: query.replace(
          /LIKE\s+(['"]%.*%['"])/i,
          'LIKE $1 -- Consider full-text search'
        ),
        reason: 'LIKE مع wildcards في البداية والنهاية بطيء - استخدم Full-Text Search',
        estimatedImprovement: 50,
      })
    }

    // تحليل ORDER BY بدون LIMIT
    if (query.match(/ORDER\s+BY/i) && !query.match(/LIMIT/i)) {
      suggestions.push({
        originalQuery: query,
        optimizedQuery: query + ' LIMIT 100',
        reason: 'ORDER BY بدون LIMIT قد يجلب بيانات كثيرة - أضف LIMIT',
        estimatedImprovement: 30,
      })
    }

    // تحليل N+1 Queries Pattern
    if (this.detectNPlusOnePattern(query)) {
      suggestions.push({
        originalQuery: query,
        optimizedQuery: query + ' -- Consider JOIN or batch query',
        reason: 'نمط N+1 Queries مكتشف - استخدم JOIN أو Batch Query',
        estimatedImprovement: 70,
      })
    }

    return suggestions
  }

  /**
   * تحليل أداء الاستعلامات
   */
  analyzeQueryPerformance(entity?: string): {
    totalQueries: number
    slowQueries: number
    averageDuration: number
    topSlowQueries: Array<{ query: string; avgDuration: number; count: number }>
    indexRecommendations: IndexRecommendation[]
  } {
    let relevantQueries = Array.from(this.queryHistory.entries())

    if (entity) {
      relevantQueries = relevantQueries.filter(([query]) =>
        query.toLowerCase().includes(entity.toLowerCase())
      )
    }

    const totalQueries = relevantQueries.reduce((sum, [, stats]) => sum + stats.count, 0)
    const slowQueries = relevantQueries.filter(([, stats]) => stats.avgDuration > 1000).length
    const averageDuration =
      relevantQueries.reduce((sum, [, stats]) => sum + stats.avgDuration * stats.count, 0) /
      totalQueries

    const topSlowQueries = relevantQueries
      .map(([query, stats]) => ({
        query: query.substring(0, 200),
        avgDuration: stats.avgDuration,
        count: stats.count,
      }))
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 10)

    return {
      totalQueries,
      slowQueries,
      averageDuration: Math.round(averageDuration),
      topSlowQueries,
      indexRecommendations: [], // سيتم ملؤها لاحقاً
    }
  }

  // Helper Methods

  private normalizeQuery(query: string): string {
    return query
      .replace(/\s+/g, ' ')
      .replace(/['"]\d+['"]/g, "'?'")
      .replace(/\$\d+/g, '$?')
      .trim()
  }

  private getExplainQuery(query: string): string {
    // محاولة إضافة EXPLAIN حسب نوع قاعدة البيانات
    if (query.toUpperCase().startsWith('SELECT')) {
      return `EXPLAIN (FORMAT JSON) ${query}`
    }
    return query
  }

  /**
   * تحليل Execution Plan بشكل حقيقي
   */
  private parseExecutionPlan(plan: ExecutionPlan): {
    estimatedCost: number
    actualCost: number
    rowsScanned: number
    indexesUsed: string[]
    missingIndexes: string[]
  } {
    const indexesUsed: string[] = []
    const missingIndexes: string[] = []
    let estimatedCost = 0
    let actualCost = 0
    let rowsScanned = 0

    // تحليل PostgreSQL Execution Plan
    if (Array.isArray(plan) && plan.length > 0) {
      const firstPlan = plan[0] as PostgreSQLExecutionPlan | MySQLExecutionPlan | ExecutionPlanNode

      // PostgreSQL Format
      if ('Plan' in firstPlan || 'Planning Time' in firstPlan) {
        const pgPlan = firstPlan as PostgreSQLExecutionPlan
        estimatedCost = pgPlan['Total Cost'] || pgPlan['Plan']?.['Total Cost'] || 0
        actualCost = pgPlan['Actual Total Time'] || pgPlan['Execution Time'] || 0
        rowsScanned = pgPlan['Actual Rows'] || pgPlan['Plan']?.['Plan Rows'] || 0

        // استخراج الفهارس المستخدمة
        this.extractIndexesFromPostgreSQLPlan(pgPlan['Plan'], indexesUsed, missingIndexes)
      }
      // MySQL Format
      else if ('select_type' in firstPlan || 'table' in firstPlan) {
        const mysqlPlan = firstPlan as MySQLExecutionPlan
        rowsScanned = mysqlPlan.rows || 0
        estimatedCost = rowsScanned * 0.1 // تقدير بسيط

        if (mysqlPlan.key) {
          indexesUsed.push(mysqlPlan.key)
        } else if (mysqlPlan.possible_keys) {
          missingIndexes.push(...mysqlPlan.possible_keys.split(',').map(k => k.trim()))
        }
      }
      // Generic Node Format
      else if ('Node Type' in firstPlan || 'Operation' in firstPlan) {
        const node = firstPlan as ExecutionPlanNode
        estimatedCost = node['Total Cost'] || node['Startup Cost'] || 0
        rowsScanned = node['Plan Rows'] || 0

        if (node['Index Name']) {
          indexesUsed.push(node['Index Name'])
        } else if (node['Relation Name'] && !node['Index Name']) {
          missingIndexes.push(`${node['Relation Name']} (no index)`)
        }
      }
    }

    return {
      estimatedCost,
      actualCost,
      rowsScanned,
      indexesUsed: [...new Set(indexesUsed)],
      missingIndexes: [...new Set(missingIndexes)],
    }
  }

  /**
   * استخراج الفهارس من PostgreSQL Execution Plan
   */
  private extractIndexesFromPostgreSQLPlan(
    node: ExecutionPlanNode | undefined,
    indexesUsed: string[],
    missingIndexes: string[]
  ): void {
    if (!node) return

    if (node['Index Name']) {
      indexesUsed.push(node['Index Name'])
    } else if (node['Node Type'] === 'Seq Scan' && node['Relation Name']) {
      missingIndexes.push(`${node['Relation Name']} (sequential scan)`)
    }

    // معالجة العقد الفرعية
    if (node['Plans'] && Array.isArray(node['Plans'])) {
      for (const childNode of node['Plans']) {
        this.extractIndexesFromPostgreSQLPlan(childNode, indexesUsed, missingIndexes)
      }
    }
  }

  private extractWhereColumns(query: string): string[] {
    const match = query.match(/WHERE\s+(\w+)/i)
    return match ? [match[1]] : []
  }

  private extractOrderByColumns(query: string): string[] {
    const match = query.match(/ORDER\s+BY\s+(\w+)/i)
    return match ? [match[1]] : []
  }

  private extractJoinColumns(query: string): string[] {
    const matches = query.matchAll(/JOIN\s+\w+\s+ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/gi)
    const columns: string[] = []
    for (const match of matches) {
      columns.push(match[2], match[4])
    }
    return columns
  }

  private deduplicateRecommendations(
    recommendations: IndexRecommendation[]
  ): IndexRecommendation[] {
    const seen = new Set<string>()
    return recommendations.filter(rec => {
      const key = `${rec.table}:${rec.columns.join(',')}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  private detectNPlusOnePattern(query: string): boolean {
    // كشف بسيط - يمكن تحسينه
    return query.split('SELECT').length > 2
  }

  private generateRecommendations(
    _query: string,
    _entity: string,
    _indexesUsed: string[],
    missingIndexes: string[],
    rowsScanned: number,
    estimatedCost: number
  ): string[] {
    const recommendations: string[] = []

    if (missingIndexes.length > 0) {
      recommendations.push(`يُنصح بإضافة فهارس على: ${missingIndexes.join(', ')}`)
    }

    if (rowsScanned > 10000) {
      recommendations.push(
        `عدد الصفوف المفحوصة كبير (${rowsScanned}) - يُنصح بإضافة فهارس أو تحسين WHERE conditions`
      )
    }

    if (estimatedCost > 1000) {
      recommendations.push(`التكلفة المقدرة عالية (${estimatedCost}) - يُنصح بمراجعة الاستعلام`)
    }

    return recommendations
  }

  private calculateOptimizationScore(
    _indexesUsed: number,
    missingIndexes: number,
    rowsScanned: number,
    estimatedCost: number
  ): number {
    let score = 100

    // خصم نقاط للفهارس المفقودة
    score -= missingIndexes * 10

    // خصم نقاط للصفوف المفحوصة الكثيرة
    if (rowsScanned > 10000) {
      score -= 20
    }

    // خصم نقاط للتكلفة العالية
    if (estimatedCost > 1000) {
      score -= 15
    }

    return Math.max(0, Math.min(100, score))
  }
}
