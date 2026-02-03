/**
 * QueryOptimizerService - خدمة تحسين الاستعلامات
 *
 * خدمة لتحسين أداء الاستعلامات من خلال:
 * - تحليل الاستعلامات البطيئة
 * - اقتراح تحسينات
 * - تتبع الأداء
 */

import { logger } from '../../shared/utils/logger'

export interface QueryMetrics {
  query: string
  entity: string
  operation: string
  duration: number
  timestamp: number
  rowsAffected?: number
  cached?: boolean
}

export interface QueryAnalysis {
  query: string
  entity: string
  averageDuration: number
  callCount: number
  slowQueries: number
  recommendations: string[]
}

export class QueryOptimizerService {
  private queryMetrics: QueryMetrics[] = []
  private readonly maxMetrics: number = 10000
  private readonly slowQueryThreshold: number = 1000 // 1 second

  /**
   * تسجيل استعلام جديد
   */
  recordQuery(metrics: QueryMetrics): void {
    this.queryMetrics.push(metrics)

    // تنظيف القديم إذا تجاوز الحد
    if (this.queryMetrics.length > this.maxMetrics) {
      this.queryMetrics = this.queryMetrics.slice(-this.maxMetrics)
    }

    // تحذير للاستعلامات البطيئة
    if (metrics.duration > this.slowQueryThreshold) {
      logger.warn('Slow query detected', {
        query: metrics.query,
        entity: metrics.entity,
        duration: metrics.duration,
        operation: metrics.operation,
      })
    }
  }

  /**
   * تحليل الاستعلامات لـ entity معين
   */
  analyzeEntity(entity: string): QueryAnalysis {
    const entityQueries = this.queryMetrics.filter(m => m.entity === entity)

    if (entityQueries.length === 0) {
      return {
        query: '',
        entity,
        averageDuration: 0,
        callCount: 0,
        slowQueries: 0,
        recommendations: [],
      }
    }

    const durations = entityQueries.map(m => m.duration)
    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length
    const slowQueries = entityQueries.filter(m => m.duration > this.slowQueryThreshold).length

    const recommendations = this.generateRecommendations(entity, entityQueries, averageDuration)

    return {
      query: entityQueries[0].query,
      entity,
      averageDuration: Math.round(averageDuration),
      callCount: entityQueries.length,
      slowQueries,
      recommendations,
    }
  }

  /**
   * توليد توصيات التحسين
   */
  private generateRecommendations(
    _entity: string,
    queries: QueryMetrics[],
    averageDuration: number
  ): string[] {
    const recommendations: string[] = []

    // تحليل الاستعلامات البطيئة
    const slowQueries = queries.filter(q => q.duration > this.slowQueryThreshold)

    if (slowQueries.length > 0) {
      recommendations.push(
        `تم اكتشاف ${slowQueries.length} استعلام بطيء. يُنصح بإضافة فهارس (indexes) على الأعمدة المستخدمة في WHERE.`
      )
    }

    // تحليل الاستعلامات المتكررة
    const queryCounts = new Map<string, number>()
    queries.forEach(q => {
      const count = queryCounts.get(q.query) || 0
      queryCounts.set(q.query, count + 1)
    })

    const repeatedQueries = Array.from(queryCounts.entries()).filter(([, count]) => count > 10)

    if (repeatedQueries.length > 0) {
      recommendations.push(`تم اكتشاف استعلامات متكررة. يُنصح بتمكين Cache لهذه الاستعلامات.`)
    }

    // تحليل متوسط المدة
    if (averageDuration > 500) {
      recommendations.push(
        `متوسط مدة الاستعلامات عالي (${Math.round(averageDuration)}ms). يُنصح بمراجعة الاستعلامات وإضافة فهارس.`
      )
    }

    // تحليل Cache
    const cachedQueries = queries.filter(q => q.cached).length
    const cacheRatio = cachedQueries / queries.length

    if (cacheRatio < 0.3 && queries.length > 20) {
      recommendations.push(
        `نسبة Cache منخفضة (${Math.round(cacheRatio * 100)}%). يُنصح بتمكين Cache للاستعلامات المتكررة.`
      )
    }

    return recommendations
  }

  /**
   * الحصول على إحصائيات الاستعلامات
   */
  getStatistics(): {
    totalQueries: number
    averageDuration: number
    slowQueries: number
    cachedQueries: number
    entities: string[]
  } {
    if (this.queryMetrics.length === 0) {
      return {
        totalQueries: 0,
        averageDuration: 0,
        slowQueries: 0,
        cachedQueries: 0,
        entities: [],
      }
    }

    const durations = this.queryMetrics.map(m => m.duration)
    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length
    const slowQueries = this.queryMetrics.filter(m => m.duration > this.slowQueryThreshold).length
    const cachedQueries = this.queryMetrics.filter(m => m.cached).length
    const entities = Array.from(new Set(this.queryMetrics.map(m => m.entity)))

    return {
      totalQueries: this.queryMetrics.length,
      averageDuration: Math.round(averageDuration),
      slowQueries,
      cachedQueries,
      entities,
    }
  }

  /**
   * مسح الإحصائيات
   */
  clearStatistics(): void {
    this.queryMetrics = []
    logger.info('Query statistics cleared')
  }

  /**
   * الحصول على الاستعلامات البطيئة
   */
  getSlowQueries(limit: number = 10): QueryMetrics[] {
    return this.queryMetrics
      .filter(m => m.duration > this.slowQueryThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit)
  }
}
