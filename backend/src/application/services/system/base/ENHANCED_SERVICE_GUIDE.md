# دليل Enhanced Base Service - Enhanced Base Service Guide

**التاريخ:** 2026-01-09  
**الإصدار:** 1.0.0

---

## 📋 نظرة عامة

`EnhancedBaseService` هو Base Class محسّن لجميع Application Services يوفر:

- ✅ **Performance Optimization**: Query batching, cache warming, optimization
- ✅ **Enhanced Error Handling**: Error classification, recovery, user-friendly messages
- ✅ **Enhanced Logging**: Structured logging, performance tracking
- ✅ **Query Optimization**: Automatic query analysis and recommendations

---

## 🚀 الاستخدام

### 1. Extend EnhancedBaseService

```typescript
import { EnhancedBaseService } from '@/application/services/base/EnhancedBaseService'
import { DatabaseCoreAdapter } from '@/infrastructure/adapters/db/DatabaseCoreAdapter'

export class MyService extends EnhancedBaseService {
  constructor(databaseAdapter: DatabaseCoreAdapter) {
    super(databaseAdapter)
  }

  protected getServiceName(): string {
    return 'MyService'
  }
}
```

### 2. استخدام executeWithEnhancements

```typescript
async getData(userId: string): Promise<Data[]> {
  return this.executeWithEnhancements(
    async () => {
      // Your operation here
      return await this.databaseAdapter.find('data', { user_id: userId })
    },
    {
      cacheWarming: ['data'], // Warm cache for 'data' entity
      performanceTracking: true, // Track performance
      retryable: true, // Enable retry on failure
      retryOptions: {
        maxRetries: 3,
        initialDelay: 1000,
      },
    },
    {
      userId,
      operation: 'getData',
      service: this.getServiceName(),
    }
  )
}
```

### 3. Batch Operations

```typescript
async batchCreate(items: Item[]): Promise<Item[]> {
  const operations: BatchOperation[] = items.map(item => ({
    operation: 'INSERT',
    entity: 'items',
    payload: item,
  }))

  return this.executeBatch(operations, {
    userId: 'user-123',
    operation: 'batchCreate',
  })
}
```

### 4. Query Optimization

```typescript
async getOptimizedData(conditions: Record<string, unknown>): Promise<Data[]> {
  // Get optimization recommendations
  const optimization = this.optimizeQuery('data', conditions, { limit: 20 })
  
  if (!optimization.optimized) {
    // Log suggestions
    enhancedLogger.warn('Query optimization suggestions', {
      suggestions: optimization.suggestions,
    })
  }

  // Execute query
  return await this.databaseAdapter.find('data', conditions)
}
```

### 5. Cache Management

```typescript
async getCachedData(): Promise<Data[]> {
  // Warm cache before operation
  await this.warmCache(['data', 'related_data'])

  // Or prefetch specific data
  await this.prefetchData('data', { status: 'active' }, { limit: 10 })

  // Execute query (will use cache if available)
  return await this.databaseAdapter.find('data', { status: 'active' })
}
```

### 6. Error Handling with Fallback

```typescript
async getDataWithFallback(userId: string): Promise<Data[]> {
  return this.executeWithEnhancements(
    async () => {
      // Primary operation
      return await this.databaseAdapter.find('data', { user_id: userId })
    },
    {
      retryable: true,
    },
    {
      userId,
      operation: 'getDataWithFallback',
    }
  ).catch(async (error) => {
    // Fallback operation
    return this.handleServiceErrorWithRecovery(
      error,
      'getDataWithFallback',
      { userId },
      async () => {
        // Fallback: return cached or default data
        return await this.databaseAdapter.find('data', { user_id: userId, cached: true })
      }
    )
  })
}
```

---

## 📊 الميزات المتاحة

### Performance Optimization
- `executeWithEnhancements()` - تنفيذ مع تحسينات تلقائية
- `executeBatch()` - عمليات مجمعة
- `optimizeQuery()` - تحليل وتحسين الاستعلامات
- `warmCache()` - تسخين Cache
- `prefetchData()` - جلب البيانات مسبقاً
- `getPerformanceMetrics()` - مقاييس الأداء
- `getConnectionPoolStats()` - إحصائيات Connection Pool

### Error Handling
- `handleServiceErrorWithRecovery()` - معالجة الأخطاء مع استعادة
- Automatic error classification
- User-friendly error messages
- Retry mechanisms
- Fallback strategies

### Logging
- `enhancedLogOperation()` - تسجيل العمليات
- `enhancedLogError()` - تسجيل الأخطاء
- Automatic performance tracking
- Context tracking

---

## 🎯 Best Practices

### 1. Always use executeWithEnhancements for database operations
```typescript
// ✅ Good
async getData() {
  return this.executeWithEnhancements(
    async () => await this.databaseAdapter.find('data', {}),
    {},
    { operation: 'getData' }
  )
}

// ❌ Bad
async getData() {
  return await this.databaseAdapter.find('data', {})
}
```

### 2. Provide context for better logging
```typescript
// ✅ Good
return this.executeWithEnhancements(
  async () => await operation(),
  {},
  {
    userId: 'user-123',
    requestId: 'req-456',
    operation: 'getData',
    metadata: { filter: 'active' },
  }
)
```

### 3. Use cache warming for frequently accessed data
```typescript
// ✅ Good
return this.executeWithEnhancements(
  async () => await operation(),
  {
    cacheWarming: ['users', 'items'], // Warm cache
  },
  { operation: 'getData' }
)
```

### 4. Enable retry for network operations
```typescript
// ✅ Good
return this.executeWithEnhancements(
  async () => await externalApiCall(),
  {
    retryable: true,
    retryOptions: {
      maxRetries: 3,
      initialDelay: 1000,
    },
  },
  { operation: 'externalCall' }
)
```

### 5. Use batch operations for multiple writes
```typescript
// ✅ Good
const operations = items.map(item => ({
  operation: 'INSERT',
  entity: 'items',
  payload: item,
}))
return this.executeBatch(operations)
```

---

## 📝 Examples

راجع `backend/src/application/services/examples/EnhancedServiceExample.ts` لأمثلة شاملة.

---

**تم إعداد الدليل بواسطة:** AI Assistant  
**التاريخ:** 2026-01-09  
**الإصدار:** 1.0.0
