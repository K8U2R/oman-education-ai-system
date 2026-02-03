# Learning Service - خدمة التعلم

**الحالة:** ✅ مكتمل  
**الإصدار:** 2.0.0  
**آخر تحديث:** 2026-01-09

---

## 📋 نظرة عامة

خدمة التعلم والدروس في النظام. توفر جميع الوظائف المتعلقة بالدروس، التقييمات، التقدم، والإحصائيات.

---

## 🎯 الهدف

توفير نظام تعليمي شامل يدعم:

- إدارة الدروس (عرض، تحميل، بحث)
- مساعد التعلم (شرح، أمثلة، فيديوهات، خريطة ذهنية)
- إدارة التقييمات (إنشاء، تحديث، تقديم)
- تتبع التقدم والإحصائيات

---

## 📁 الهيكل

```
learning/
├── LearningService.ts          # Service الرئيسي للتعلم
├── LearningService.test.ts      # Unit Tests
└── index.ts                     # Barrel Export
```

---

## 🔧 المكونات الرئيسية

### LearningService

الخدمة الرئيسية للتعلم. توفر:

- `getLessons()` - الحصول على قائمة الدروس
- `getLesson()` - الحصول على درس واحد
- `getLessonExplanation()` - الحصول على شرح الدرس
- `getLessonExamples()` - الحصول على أمثلة الدرس
- `getLessonVideos()` - الحصول على فيديوهات الدرس
- `getLessonMindMap()` - الحصول على خريطة ذهنية للدرس
- `getAssessments()` - الحصول على قائمة التقييمات
- `getAssessment()` - الحصول على تقييم واحد
- `submitAssessment()` - تقديم تقييم
- `getProgress()` - الحصول على التقدم
- `getStats()` - الحصول على الإحصائيات

**الاستخدام:**

```typescript
import { LearningService } from '@/application/services/learning'

const learningService = new LearningService()

// الحصول على الدروس
const lessons = await learningService.getLessons({
  subjectId: 'subject-123',
  page: 1,
  perPage: 20
})

// الحصول على شرح الدرس
const explanation = await learningService.getLessonExplanation('lesson-123', {
  language: 'ar',
  style: 'detailed'
})
```

---

## 🔗 التكامل

### مع Database-Core

- يستخدم `DatabaseRouter` للوصول إلى قاعدة البيانات
- يستخدم `PolicyEngine` للتحقق من
- يستخدم `AuditLogger` لتسجيل العمليات
- يستخدم `CacheManager` لتحسين الأداء

### مع AI Services

- يستخدم AI Services لتوليد الشروح والأمثلة
- يستخدم AI Services لإنشاء الخرائط الذهنية

### مع Use Cases

- `GetLessonsUseCase` - Use Case للحصول على الدروس
- `GetLessonUseCase` - Use Case للحصول على درس واحد
- `GetAssessmentsUseCase` - Use Case للحصول على التقييمات
- `SubmitAssessmentUseCase` - Use Case لتقديم تقييم

---

## 📊 API Endpoints

### Lessons

- `GET /api/learning/lessons` - الحصول على قائمة الدروس
- `GET /api/learning/lessons/:id` - الحصول على درس واحد
- `GET /api/learning/lessons/:id/explanation` - الحصول على شرح الدرس
- `GET /api/learning/lessons/:id/examples` - الحصول على أمثلة الدرس
- `GET /api/learning/lessons/:id/videos` - الحصول على فيديوهات الدرس
- `GET /api/learning/lessons/:id/mind-map` - الحصول على خريطة ذهنية

### Assessments

- `GET /api/learning/assessments` - الحصول على قائمة التقييمات
- `GET /api/learning/assessments/:id` - الحصول على تقييم واحد
- `POST /api/learning/assessments/:id/submit` - تقديم تقييم

### Progress & Stats

- `GET /api/learning/progress` - الحصول على التقدم
- `GET /api/learning/stats` - الحصول على الإحصائيات

---

## 🧪 Testing

### Unit Tests

- ✅ `LearningService.test.ts` - Tests للخدمة الرئيسية

### Test Coverage

- **LearningService**: ✅ شامل

---

## 🔒 الأمان

### Features

- ✅ Permission-based Access Control
- ✅ Audit Logging
- ✅ Rate Limiting
- ✅ Input Validation

### Best Practices

- التحقق من  قبل الوصول
- تسجيل جميع العمليات
- التحقق من صحة البيانات المدخلة
- Rate Limiting على جميع Endpoints

---

## 📝 ملاحظات

### التكامل مع Database-Core

- جميع العمليات تمر عبر `DatabaseRouter`
- استخدام `PolicyEngine` للتحقق من
- استخدام `AuditLogger` لتسجيل جميع العمليات
- استخدام `CacheManager` لتحسين الأداء

### Caching

- الدروس: TTL 5 دقائق
- التقييمات: TTL 10 دقائق
- الشروح: TTL 15 دقيقة

---

## 🚀 الاستخدام

### Basic Usage

```typescript
import { LearningService } from '@/application/services/learning'

const learningService = new LearningService()

// الحصول على الدروس
const lessons = await learningService.getLessons({
  subjectId: 'subject-123',
  page: 1,
  perPage: 20
})

// الحصول على شرح الدرس
const explanation = await learningService.getLessonExplanation('lesson-123')
```

### Advanced Usage

```typescript
// الحصول على درس كامل مع جميع المكونات
const lesson = await learningService.getLesson('lesson-123', {
  includeExplanation: true,
  includeExamples: true,
  includeVideos: true,
  includeMindMap: true
})

// تقديم تقييم
const result = await learningService.submitAssessment('assessment-123', {
  answers: [...]
})
```

---

## ✅ Checklist

- [x] LearningService Implementation
- [x] Unit Tests
- [x] Error Handling
- [x] Documentation
- [x] Caching Support
- [x] Permission Checks

---

**تم إعداد الوثائق بواسطة:** AI Assistant  
**التاريخ:** 2026-01-09  
**الإصدار:** 2.0.0
