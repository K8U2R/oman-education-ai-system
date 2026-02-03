/**
 * Benchmark Routes - مسارات معايير الأداء
 *
 * مسارات API للـ Performance Benchmarking
 */

import { Router, Request } from 'express'
import { PerformanceBenchmark } from '../../../application/services/PerformanceBenchmark'
import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'
import type { BenchmarkConfig } from '../../../application/services/PerformanceBenchmark'
import { asyncRouteHandler } from '../utils/route-handler.util'

/**
 * إنشاء Routes لـ Performance Benchmark
 */
export function createBenchmarkRoutes(adapter: IDatabaseAdapter): Router {
  const router = Router()
  const benchmark = new PerformanceBenchmark(adapter)

  /**
   * POST /query
   * قياس أداء استعلام
   */
  router.post(
    '/query',
    asyncRouteHandler(async (req: Request) => {
      const { name, query, config } = req.body as {
        name?: string
        query?: string | (() => Promise<unknown>)
        config?: BenchmarkConfig
      }

      if (!name || !query) {
        throw new Error('name and query are required')
      }

      // Note: query يجب أن يكون function - في الإنتاج يجب استخدام migration files أو stored procedures
      // هذا مثال مبسط
      const queryFunction =
        typeof query === 'function'
          ? query
          : async () => {
              // محاولة تنفيذ query كـ string
              if (typeof query === 'string') {
                return await adapter.executeRaw(query, {})
              }
              throw new Error('Invalid query format')
            }

      const benchmarkConfig: BenchmarkConfig = config || {
        iterations: 100,
        warmupIterations: 10,
        concurrency: 1,
        timeout: 30000,
      }

      return await benchmark.benchmarkQuery(name, queryFunction, benchmarkConfig)
    })
  )

  /**
   * POST /queries
   * قياس أداء عدة استعلامات
   */
  router.post(
    '/queries',
    asyncRouteHandler(async (req: Request) => {
      const { queries, config } = req.body as {
        queries?: Array<{ name: string; query: string | (() => Promise<unknown>) }>
        config?: BenchmarkConfig
      }

      if (!queries || !Array.isArray(queries)) {
        throw new Error('queries array is required')
      }

      const benchmarkConfig: BenchmarkConfig = config || {
        iterations: 100,
        warmupIterations: 10,
        concurrency: 1,
        timeout: 30000,
      }

      const queryFunctions = queries.map(q => ({
        name: q.name,
        query:
          typeof q.query === 'function'
            ? q.query
            : async () => await adapter.executeRaw(q.query as string, {}),
      }))

      return await benchmark.benchmarkQueries(queryFunctions, benchmarkConfig)
    })
  )

  /**
   * GET /report/:benchmarkName?
   * إنشاء تقرير الأداء
   */
  router.get(
    '/report/:benchmarkName?',
    asyncRouteHandler(async (req: Request) => {
      const { benchmarkName } = req.params
      return benchmark.generateReport(benchmarkName)
    })
  )

  /**
   * POST /compare
   * مقارنة نتائج Benchmark
   */
  router.post(
    '/compare',
    asyncRouteHandler(async (req: Request) => {
      const { benchmarkNames } = req.body as { benchmarkNames?: string[] }

      if (!benchmarkNames || !Array.isArray(benchmarkNames) || benchmarkNames.length < 2) {
        throw new Error('At least two benchmark names are required for comparison')
      }

      if (benchmarkNames.length !== 2) {
        throw new Error('Exactly two benchmark names are required for comparison')
      }
      return benchmark.compareBenchmarks(benchmarkNames[0], benchmarkNames[1])
    })
  )

  return router
}
