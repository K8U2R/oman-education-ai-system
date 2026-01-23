/**
 * PerformanceBenchmark - معايير الأداء
 *
 * أدوات قياس ومعايير الأداء مع:
 * - Query Benchmarking
 * - Load Testing
 * - Performance Reports
 * - Comparison Analysis
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { logger } from '../../shared/utils/logger'

/**
 * Benchmark Configuration
 */
export interface BenchmarkConfig {
  iterations: number
  warmupIterations?: number
  concurrency?: number
  timeout?: number
}

/**
 * Benchmark Result
 */
export interface BenchmarkResult {
  name: string
  iterations: number
  totalDuration: number
  averageDuration: number
  minDuration: number
  maxDuration: number
  p50: number
  p95: number
  p99: number
  throughput: number // Operations per second
  errors: number
  errorRate: number
  timestamp: Date
}

/**
 * Performance Report
 */
export interface PerformanceReport {
  benchmark: string
  timestamp: Date
  results: BenchmarkResult[]
  summary: {
    totalBenchmarks: number
    averageThroughput: number
    totalErrors: number
    averageLatency: number
  }
  recommendations: string[]
}

/**
 * Performance Benchmark Service
 */
export class PerformanceBenchmark {
  private benchmarks: Map<string, BenchmarkResult[]> = new Map()

  constructor(_adapter: IDatabaseAdapter) {
    // Adapter محفوظ للاستخدام المستقبلي
  }

  /**
   * قياس أداء استعلام
   */
  async benchmarkQuery<T = unknown>(
    name: string,
    query: () => Promise<T>,
    config: BenchmarkConfig = { iterations: 100 }
  ): Promise<BenchmarkResult> {
    const { iterations = 100, warmupIterations = 10, concurrency = 1, timeout = 30000 } = config

    logger.info('Starting query benchmark', { name, iterations, concurrency })

    // Warmup
    if (warmupIterations > 0) {
      for (let i = 0; i < warmupIterations; i++) {
        try {
          await query()
        } catch {
          // Ignore warmup errors
        }
      }
    }

    const durations: number[] = []
    let errors = 0
    const startTime = Date.now()

    // Run benchmarks
    if (concurrency === 1) {
      // Sequential execution
      for (let i = 0; i < iterations; i++) {
        const iterationStart = Date.now()
        try {
          await Promise.race([
            query(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
          ])
          const duration = Date.now() - iterationStart
          durations.push(duration)
        } catch (error) {
          errors++
          logger.warn('Benchmark iteration failed', {
            name,
            iteration: i,
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }
    } else {
      // Concurrent execution
      const batches = Math.ceil(iterations / concurrency)
      for (let batch = 0; batch < batches; batch++) {
        const batchSize = Math.min(concurrency, iterations - batch * concurrency)
        const promises = Array.from({ length: batchSize }, async () => {
          const iterationStart = Date.now()
          try {
            await Promise.race([
              query(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
            ])
            return Date.now() - iterationStart
          } catch (error) {
            errors++
            return null
          }
        })

        const batchResults = await Promise.all(promises)
        durations.push(...batchResults.filter((d): d is number => d !== null))
      }
    }

    const totalDuration = Date.now() - startTime

    // Calculate statistics
    const sortedDurations = durations.sort((a, b) => a - b)
    const averageDuration =
      durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0
    const minDuration = sortedDurations[0] || 0
    const maxDuration = sortedDurations[sortedDurations.length - 1] || 0
    const p50 = this.percentile(sortedDurations, 50)
    const p95 = this.percentile(sortedDurations, 95)
    const p99 = this.percentile(sortedDurations, 99)
    const throughput = (durations.length / totalDuration) * 1000
    const errorRate = errors / iterations

    const result: BenchmarkResult = {
      name,
      iterations: durations.length,
      totalDuration,
      averageDuration: Math.round(averageDuration),
      minDuration,
      maxDuration,
      p50,
      p95,
      p99,
      throughput: Math.round(throughput * 100) / 100,
      errors,
      errorRate: Math.round(errorRate * 100) / 100,
      timestamp: new Date(),
    }

    // Save result
    const existing = this.benchmarks.get(name) || []
    existing.push(result)
    this.benchmarks.set(name, existing)

    logger.info('Query benchmark completed', {
      name,
      averageDuration: result.averageDuration,
      throughput: result.throughput,
      errors: result.errors,
    })

    return result
  }

  /**
   * قياس أداء عدة استعلامات
   */
  async benchmarkQueries<T = unknown>(
    queries: Array<{ name: string; query: () => Promise<T> }>,
    config: BenchmarkConfig = { iterations: 100 }
  ): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = []

    for (const { name, query } of queries) {
      try {
        const result = await this.benchmarkQuery(name, query, config)
        results.push(result)
      } catch (error) {
        logger.error('Benchmark failed', {
          name,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return results
  }

  /**
   * إنشاء تقرير الأداء
   */
  generateReport(benchmarkName?: string): PerformanceReport {
    const relevantResults = benchmarkName
      ? this.benchmarks.get(benchmarkName) || []
      : Array.from(this.benchmarks.values()).flat()

    if (relevantResults.length === 0) {
      return {
        benchmark: benchmarkName || 'all',
        timestamp: new Date(),
        results: [],
        summary: {
          totalBenchmarks: 0,
          averageThroughput: 0,
          totalErrors: 0,
          averageLatency: 0,
        },
        recommendations: [],
      }
    }

    const totalBenchmarks = relevantResults.length
    const averageThroughput =
      relevantResults.reduce((sum, r) => sum + r.throughput, 0) / totalBenchmarks
    const totalErrors = relevantResults.reduce((sum, r) => sum + r.errors, 0)
    const averageLatency =
      relevantResults.reduce((sum, r) => sum + r.averageDuration, 0) / totalBenchmarks

    // Generate recommendations
    const recommendations: string[] = []

    if (averageLatency > 1000) {
      recommendations.push(
        `متوسط زمن الاستجابة عالي (${Math.round(averageLatency)}ms) - يُنصح بتحسين الاستعلامات`
      )
    }

    if (totalErrors > 0) {
      recommendations.push(`تم اكتشاف ${totalErrors} أخطاء - يُنصح بمراجعة الاستعلامات`)
    }

    if (averageThroughput < 10) {
      recommendations.push(
        `الإنتاجية منخفضة (${Math.round(averageThroughput)} ops/s) - يُنصح بتحسين الأداء`
      )
    }

    return {
      benchmark: benchmarkName || 'all',
      timestamp: new Date(),
      results: relevantResults.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      summary: {
        totalBenchmarks,
        averageThroughput: Math.round(averageThroughput * 100) / 100,
        totalErrors,
        averageLatency: Math.round(averageLatency),
      },
      recommendations,
    }
  }

  /**
   * مقارنة نتائج Benchmark
   */
  compareBenchmarks(
    benchmark1: string,
    benchmark2: string
  ): {
    benchmark1: BenchmarkResult | null
    benchmark2: BenchmarkResult | null
    improvement: number // Percentage
    comparison: {
      latency: { better: string; improvement: number }
      throughput: { better: string; improvement: number }
    }
  } {
    const results1 = this.benchmarks.get(benchmark1)
    const results2 = this.benchmarks.get(benchmark2)

    const latest1 = results1?.[results1.length - 1] || null
    const latest2 = results2?.[results2.length - 1] || null

    if (!latest1 || !latest2) {
      return {
        benchmark1: latest1,
        benchmark2: latest2,
        improvement: 0,
        comparison: {
          latency: { better: 'none', improvement: 0 },
          throughput: { better: 'none', improvement: 0 },
        },
      }
    }

    const latencyImprovement =
      ((latest1.averageDuration - latest2.averageDuration) / latest1.averageDuration) * 100
    const throughputImprovement =
      ((latest2.throughput - latest1.throughput) / latest1.throughput) * 100

    return {
      benchmark1: latest1,
      benchmark2: latest2,
      improvement: Math.round((latencyImprovement + throughputImprovement) / 2),
      comparison: {
        latency: {
          better: latest2.averageDuration < latest1.averageDuration ? benchmark2 : benchmark1,
          improvement: Math.round(latencyImprovement),
        },
        throughput: {
          better: latest2.throughput > latest1.throughput ? benchmark2 : benchmark1,
          improvement: Math.round(throughputImprovement),
        },
      },
    }
  }

  // Helper Methods

  private percentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) {
      return 0
    }
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1
    return sortedArray[Math.max(0, Math.min(index, sortedArray.length - 1))]
  }
}
