# 🏛️ دليل البنية المعمارية والأسلوب البرمجي
## Oman Education AI - Style Guide & Architectural Manual

> **النسخة:** 1.0.0  
> **التاريخ:** 2026-02-09  
> **الحالة:** معتمد رسمياً

---

## 📋 جدول المحتويات

1. [المنهجية المعمارية](#methodology)
2. [هيكلية المجلدات](#folder-structure)
3. [نظام التصميم السائل](#fluid-design)
4. [بروتوكولات الأمان](#security)
5. [نظام الذكاء الاصطناعي](#ai-integration)
6. [دليل الصيانة](#maintenance)

---

<a name="methodology"></a>
## 🏛️ المنهجية المعمارية: التغليف السيادي (Sovereign Encapsulation)

### المبدأ الأساسي
تعتمد البنية التحتية للمشروع على **تحويل كل عنصر إلى وحدة مستقلة بذاتها**، مما يمنع تشتت الملفات ويجعل النظام قابلاً للتوسع.

### الأهداف الاستراتيجية
- ✅ **منع التشتت**: كل مكون يحتوي على كامل ملفاته في مجلد واحد
- ✅ **السيادة الذاتية**: كل وحدة مسؤولة عن نفسها بالكامل
- ✅ **قابلية التوسع**: سهولة إضافة مكونات جديدة دون تأثير على الموجود
- ✅ **الكشف المبكر**: الأخطاء تُكتشف في نطاق المكون فقط

---

<a name="folder-structure"></a>
## 📁 هيكلية المجلدات (Consistent Hierarchy)

### القاعدة الذهبية
> **كل مكون (Component) أو هيكل (Layout) يجب أن يتبع النمط التالي:**

```
ComponentName/
├── ComponentName.tsx          # الملف المنطقي (React فقط)
├── _style.scss                # الأنماط السائلة
├── index.ts                   # نقطة التصدير
├── types.ts                   # التعريفات (اختياري)
├── hooks/                     # Hooks خاصة (اختياري)
│   └── useComponentName.ts
├── utils/                     # Utilities (اختياري)
│   └── helpers.ts
└── constants/                 # الثوابت (اختياري)
    └── config.ts
```

### مثال تطبيقي: Header Component
```
presentation/components/shell/Header/
├── Header.tsx                 # ✅ React logic only
├── Header.module.scss         # ✅ Styles only
├── index.ts                   # ✅ Export point
├── components/                # Sub-components
│   ├── HeaderNavigation/
│   │   ├── HeaderNavigation.tsx
│   │   ├── HeaderNavigation.module.scss
│   │   └── index.ts
│   └── ...
├── hooks/
│   └── useHeader.ts
├── types/
│   └── header.types.ts
└── utils/
    └── header.utils.ts
```

### قواعد الالتزام
1. ❌ **ممنوع**: ملفات styles خارج مجلد المكون
2. ❌ **ممنوع**: Inline styles أو Tailwind classes مباشرة في المنطق
3. ✅ **إلزامي**: استخدام CSS Modules (`.module.scss`)
4. ✅ **إلزامي**: نقطة تصدير واحدة (`index.ts`)

---

<a name="fluid-design"></a>
## 🎨 نظام التصميم السائل (Fluid Design System)

### المبدأ الأساسي
> **يمنع استخدام البكسل الثابت (`px`) منعاً باتاً.**

### المرجع الوحيد: `_liquid-variables.scss`

#### 1. المسافات (Spacing)
```scss
// ❌ ممنوع
.component {
  padding: 16px;
  margin: 20px;
}

// ✅ صحيح
.component {
  padding: $spacing-fluid-4;
  margin: $spacing-fluid-5;
}
```

#### 2. الخطوط (Typography)
```scss
// ❌ ممنوع
.title {
  font-size: 24px;
  line-height: 32px;
}

// ✅ صحيح
.title {
  font-size: $font-fluid-xl;
  line-height: $line-height-fluid-xl;
}
```

#### 3. الألوان (Colors)
```scss
// ❌ ممنوع
.button {
  background: #3b82f6;
  color: #ffffff;
}

// ✅ صحيح
.button {
  background: var(--color-primary);
  color: var(--color-white);
}
```

### التوكنز العالمية (Global Tokens)
```scss
// في _liquid-variables.scss
$spacing-fluid-1: clamp(0.25rem, 0.5vw, 0.5rem);
$spacing-fluid-2: clamp(0.5rem, 1vw, 1rem);
$spacing-fluid-4: clamp(1rem, 2vw, 2rem);

$font-fluid-sm: clamp(0.875rem, 1vw, 1rem);
$font-fluid-base: clamp(1rem, 1.2vw, 1.125rem);
$font-fluid-xl: clamp(1.5rem, 2vw, 2rem);
```

### دعم الثيمات (Theme Support)
```scss
// Dark Mode & Light Mode
:root {
  --color-primary: #3b82f6;
  --color-bg-primary: #ffffff;
  --color-text-primary: #1f2937;
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-bg-primary: #1f2937;
  --color-text-primary: #f9fafb;
}
```

---

<a name="security"></a>
## 🛡️ بروتوكولات الأمان والبيانات (Core Gatekeeping)

### المفهوم الأساسي
يعمل "قلب النظام" كحارس بوابة ذكي يمنع **الانهيارات المتسلسلة** (Cascading Failures).

### 1. قاطع الدائرة (Circuit Breaker)

#### المهمة
إيقاف "عواصف الطلبات" عند فشل المصادقة.

#### الآلية
```typescript
// في api.service.ts
class CircuitBreaker {
  private failureCount = 0
  private readonly FAILURE_THRESHOLD = 3
  private isTerminated = false

  async executeRequest<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isTerminated) {
      throw new Error('Circuit breaker is open - requests blocked')
    }

    try {
      const result = await fn()
      this.reset()
      return result
    } catch (error) {
      this.failureCount++
      
      if (this.failureCount >= this.FAILURE_THRESHOLD) {
        this.isTerminated = true
        // منع حظر المستخدم (Error 429)
        console.error('🔴 Circuit breaker activated - stopping all requests')
      }
      
      throw error
    }
  }

  private reset() {
    this.failureCount = 0
    this.isTerminated = false
  }
}
```

### 2. تتبع الطلبات (Request Tracing)

#### الشفافية
كل طلب يحمل `X-Request-ID` فريد:

```typescript
// في http-client.ts
const requestInterceptor = (config: AxiosRequestConfig) => {
  config.headers['X-Request-ID'] = generateUUID()
  config.headers['X-Timestamp'] = new Date().toISOString()
  
  console.log(`📤 [${config.headers['X-Request-ID']}] ${config.method?.toUpperCase()} ${config.url}`)
  
  return config
}
```

#### الصيانة
هذا المعرف يسمح بتتبع "الخطأ من جحره":
```
Frontend Log: [req-abc-123] POST /api/auth/login
Backend Log:  [req-abc-123] Authentication failed: invalid credentials
```

### 3. السيادة التخزينية (Enhanced Caching)

#### المبدأ
استخدام `enhanced-cache.service.ts` كمصدر وحيد للحقيقة.

#### IndexedDB للبيانات الضخمة
```typescript
// في enhanced-cache.service.ts
class EnhancedCacheService {
  private db: IDBDatabase

  async setLarge<T>(key: string, data: T, ttl?: number): Promise<void> {
    // تخزين في IndexedDB للبيانات الضخمة (>5MB)
    const size = JSON.stringify(data).length
    
    if (size > 5 * 1024 * 1024) { // 5MB
      await this.indexedDB.set(key, data, ttl)
    } else {
      await this.memoryCache.set(key, data, ttl)
    }
  }

  async get<T>(key: string): Promise<T | null> {
    // Check memory first (fastest)
    const memoryData = await this.memoryCache.get<T>(key)
    if (memoryData) return memoryData

    // Fallback to IndexedDB
    const dbData = await this.indexedDB.get<T>(key)
    if (dbData) {
      // Promote to memory cache
      await this.memoryCache.set(key, dbData)
      return dbData
    }

    return null
  }
}
```

---

<a name="ai-integration"></a>
## 🤖 نظام الذكاء الاصطناعي والتفاعل (AI Integration)

### 1. بوابة الميزات (FeatureGate)

#### الحماية
أي ميزة ذكية يجب أن تُغلف بمكون `FeatureGate`:

```tsx
// ✅ الاستخدام الصحيح
import { FeatureGate } from '@/components/common/FeatureGate'

export const AIRecommendations = () => {
  return (
    <FeatureGate
      feature="ai.recommendations"
      requiredPermission="ai.recommendations.view"
      fallback={<UpgradePrompt feature="ai-recommendations" />}
    >
      <RecommendationEngine />
    </FeatureGate>
  )
}
```

#### الصلاحيات
```typescript
// في permissions.constants.ts
export const AI_PERMISSIONS = {
  RECOMMENDATIONS_VIEW: 'ai.recommendations.view',
  RECOMMENDATIONS_MANAGE: 'ai.recommendations.manage',
  CHAT_ACCESS: 'ai.chat.access',
  ANALYSIS_VIEW: 'ai.analysis.view',
} as const
```

#### الترقية
المستخدم بدون صلاحية يرى `UpgradePrompt`:

```tsx
// components/common/UpgradePrompt/UpgradePrompt.tsx
export const UpgradePrompt: FC<UpgradePromptProps> = ({ feature }) => {
  return (
    <div className={styles.upgradePrompt}>
      <Icon name="sparkles" className={styles.icon} />
      <h3 className={styles.title}>ارتقِ لتجربة الذكاء الاصطناعي</h3>
      <p className={styles.description}>
        احصل على توصيات مخصصة وتحليلات ذكية بالترقية إلى الباقة المميزة
      </p>
      <Button variant="primary" size="lg">
        ترقية الحساب
      </Button>
    </div>
  )
}
```

### 2. محرك التوصيات (Recommendation Engine)

#### الحالات الثلاث
يجب التعامل دائماً مع:

```tsx
export const RecommendationList = () => {
  const { data, isLoading, error } = useRecommendations()

  // 1️⃣ جاري التحميل
  if (isLoading) {
    return <SkeletonLoader type="recommendations" count={3} />
  }

  // 2️⃣ حدث خطأ
  if (error) {
    return (
      <ProfessionalErrorPanel
        error={error}
        requestId={error.requestId}
        showTechnicalDetails
      />
    )
  }

  // 3️⃣ لا توجد بيانات
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon="lightbulb"
        title="لا توجد توصيات بعد"
        description="ابدأ بإكمال بعض الدروس للحصول على توصيات مخصصة"
      />
    )
  }

  // 4️⃣ عرض البيانات
  return (
    <div className={styles.recommendationList}>
      {data.map(item => (
        <RecommendationCard key={item.id} recommendation={item} />
      ))}
    </div>
  )
}
```

---

<a name="maintenance"></a>
## 📈 دليل الصيانة (Maintenance Guide)

### لكشف الأخطاء "من جحرها المختفي"

#### 1. لوحة تحكم المطور (DeveloperDashboard)

```tsx
// في development mode فقط
if (import.meta.env.DEV) {
  return (
    <>
      <App />
      <DeveloperDashboard />
    </>
  )
}
```

**الميزات:**
- 📊 مراقبة دقة محرك التوصيات لحظياً
- 💾 حالة الـ Cache والـ IndexedDB
- 🔄 معدل نجاح/فشل الطلبات
- ⚡ أداء المكونات (Component Performance)

#### 2. أدوات التشخيص (ProfessionalErrorPanel)

```tsx
<ProfessionalErrorPanel
  error={error}
  requestId="req-abc-123"
  showTechnicalDetails={import.meta.env.DEV}
  onRetry={() => refetch()}
/>
```

**المعلومات المقدمة:**
- 🔴 نوع الخطأ (Error Type)
- 📝 رسالة الخطأ (Error Message)
- 🔍 Stack Trace (في Dev mode)
- 🆔 Request ID للتتبع
- 🔄 زر إعادة المحاولة

#### 3. تطهير الأكواد (Code Cleanup)

```tsx
// ❌ ممنوع في Production
export const MyComponent = () => {
  console.log('Debug info...') // يظهر في Production
  
  return <div>...</div>
}

// ✅ صحيح
export const MyComponent = () => {
  if (import.meta.env.DEV) {
    console.log('Debug info...') // Dev mode فقط
  }
  
  return <div>...</div>
}

// ✅ الأفضل
export const MyComponent = () => {
  return (
    <>
      <div>...</div>
      {import.meta.env.DEV && <DevDiagnosticsOverlay />}
    </>
  )
}
```

---

## 🎯 خلاصة المبادئ الأساسية

### 1. التغليف السيادي (Sovereign Encapsulation)
> كل مكون مسؤول عن نفسه بالكامل

### 2. التصميم السائل (Fluid Design)
> لا بكسل ثابت - معادلات `clamp()` فقط

### 3. الأمان المتعدد الطبقات (Layered Security)
> Circuit Breaker + Request Tracing + Enhanced Caching

### 4. بوابة الميزات (Feature Gating)
> كل ميزة AI محمية بصلاحيات

### 5. الصيانة الذكية (Smart Maintenance)
> Developer Dashboard + Error Panels + Clean Production Code

---

## 🏆 النتيجة النهائية

**هذا المنهج يحول مشروعك إلى قلعة برمجية:**
- ✅ كل خلية مسؤولة عن نفسها
- ✅ سهولة الصيانة والتوسع
- ✅ كشف تلقائي للأخطاء
- ✅ أمان متعدد الطبقات
- ✅ تجربة مستخدم سائلة

**مما يضمن أن `k8u2r.online` سيبقى نظاماً:**
- 🧠 ذكياً
- 🔒 آمناً
- 🌊 سائلاً
- 🚀 قابلاً للتوسع

---

## 📚 مراجع إضافية

- [Fluid Design System Variables](./_liquid-variables.scss)
- [Component Library Documentation](../docs/components.md)
- [API Security Protocols](../docs/security.md)
- [AI Integration Guide](../docs/ai-integration.md)

---

**آخر تحديث:** 2026-02-09  
**الإصدار:** 1.0.0  
**الحالة:** معتمد رسمياً للإنتاج
