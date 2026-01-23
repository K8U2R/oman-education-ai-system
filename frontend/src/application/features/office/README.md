# 📄 Office Feature - ميزة توليد ملفات Office

**الحالة:** ✅ مكتمل  
**الإصدار:** 2.0.0  
**آخر تحديث:** 2025-01-08

---

## 📋 نظرة عامة

ميزة توليد ملفات Office في النظام. تتيح للمستخدمين توليد ملفات Excel، Word، PowerPoint، و PDF باستخدام الذكاء الاصطناعي.

---

## 🎯 الهدف

تمكين المستخدمين من:

- توليد ملفات Excel ذكية
- توليد ملفات Word بتنسيق احترافي
- توليد عروض PowerPoint تلقائياً
- توليد ملفات PDF
- استخدام AI لفهم الأوامر الطبيعية

---

## 📁 الهيكل

```
office/
├── hooks/                    # Custom Hooks
│   ├── useOffice.ts          # Hook لـ Office
│   └── index.ts
├── services/                  # Services
│   ├── office.service.ts     # Service الرئيسي
│   └── index.ts
├── store/                     # State Management
│   ├── officeStore.ts       # Zustand Store
│   └── index.ts
├── types/                     # TypeScript Types
│   ├── office.types.ts      # أنواع Office
│   └── index.ts
├── constants/                 # Constants
│   ├── office.constants.ts  # ثوابت Office
│   └── index.ts
├── utils/                     # Utilities
│   ├── office.utils.ts      # دوال مساعدة
│   └── index.ts
├── index.ts                   # Barrel Export الرئيسي
└── README.md                  # هذا الملف
```

## 🚀 الميزات

### 1. توليد Excel

- إنشاء جداول بيانات ذكية
- إضافة معادلات تلقائياً
- تنسيق احترافي

### 2. توليد Word

- إنشاء مستندات بتنسيق احترافي
- إضافة محتوى تلقائياً
- تنسيق الجداول والقوائم

### 3. توليد PowerPoint

- إنشاء عروض تقديمية تلقائياً
- إضافة شرائح ذكية
- تنسيق احترافي

### 4. توليد PDF

- إنشاء ملفات PDF
- تنسيق احترافي
- دعم العربية والإنجليزية

## 💻 الاستخدام

### استخدام Hook

```typescript
import { useOffice } from '@/application/features/office/hooks'

const MyComponent = () => {
  const { generateOffice, templates, isLoading, isGenerating, error, loadTemplates } = useOffice()

  const handleGenerate = async () => {
    const response = await generateOffice({
      type: 'excel',
      description: 'أنشئ جدول درجات لـ 30 طالب',
      options: {
        title: 'جدول الدرجات',
        style: 'professional',
        language: 'ar',
      },
    })
    // تحميل الملف
    window.open(response.download_url)
  }

  // ...
}
```

### استخدام Service

```typescript
import { officeService } from '@/application/features/office/services'

// توليد ملف Office
const response = await officeService.generateOffice({
  type: 'excel',
  description: 'أنشئ جدول درجات',
  options: {
    title: 'جدول الدرجات',
    style: 'professional',
    language: 'ar',
  },
})

// جلب القوالب
const templates = await officeService.getTemplates('excel')
```

### استخدام Store

```typescript
import { useOfficeStore } from '@/application/features/office/store'

const MyComponent = () => {
  const {
    templates,
    currentGeneration,
    generationHistory,
    isGenerating,
    fetchTemplates,
    generateOffice,
  } = useOfficeStore()

  // ...
}
```

### استخدام Utils

```typescript
import {
  formatOfficeFileType,
  formatOfficeStyle,
  formatOfficeLanguage,
  getOfficeFileTypeIcon,
  getOfficeFileTypeColor,
  formatOfficeFileSize,
  downloadOfficeFile,
  openOfficeFilePreview,
} from '@/application/features/office/utils'

// تنسيق نوع الملف
const typeFormatted = formatOfficeFileType('excel') // "Excel"

// تنسيق النمط
const styleFormatted = formatOfficeStyle('professional') // "احترافي"

// تنسيق اللغة
const languageFormatted = formatOfficeLanguage('ar') // "العربية"

// الحصول على أيقونة
const icon = getOfficeFileTypeIcon('word') // "file-text"

// الحصول على لون
const color = getOfficeFileTypeColor('powerpoint') // "#f59e0b"

// تنسيق حجم الملف
const sizeFormatted = formatOfficeFileSize(1024 * 1024) // "1 MB"

// تحميل الملف
downloadOfficeFile(response)

// فتح المعاينة
openOfficeFilePreview(response)
```

### استخدام Constants

```typescript
import {
  OFFICE_CONFIG,
  OFFICE_FILE_TYPES,
  OFFICE_STYLES,
  OFFICE_LANGUAGES,
} from '@/application/features/office/constants'

// استخدام Configuration
const timeout = OFFICE_CONFIG.GENERATION.TIMEOUT
const errorMessage = OFFICE_CONFIG.ERROR_MESSAGES.FAILED_TO_GENERATE

// استخدام File Types
const excelType = OFFICE_FILE_TYPES.EXCEL

// استخدام Styles
const professionalStyle = OFFICE_STYLES.PROFESSIONAL

// استخدام Languages
const arabic = OFFICE_LANGUAGES.ARABIC
```

## 🔗 التكاملات

### مع الميزات الأخرى:

- **auth/**: يحتاج auth للوصول إلى Office
- **storage/**: يمكن حفظ الملفات المولدة
- **projects/**: يمكن توليد ملفات المشاريع
- **learning/**: يمكن توليد ملفات الدروس
- **AI Service**: لفهم الأوامر وتوليد المحتوى

---

## 📝 ملاحظات

- جميع Types منظمة في `types/`
- Store يستخدم Zustand مع devtools
- يدعم Excel, Word, PowerPoint, PDF
- يدعم أنماط متعددة (simple, professional, academic, business)
- يدعم العربية والإنجليزية

---

## 🧪 الاختبار

```typescript
import { describe, it, expect } from 'vitest'
import { useOffice } from './hooks/useOffice'
import { renderHook } from '@testing-library/react'

describe('useOffice', () => {
  it('should generate office file successfully', async () => {
    const { result } = renderHook(() => useOffice())
    // ...
  })
})
```

---

## 📚 المراجع

- [API Constants](../../../domain/constants/api.constants.ts)

---

**آخر تحديث:** 2025-01-08  
**الإصدار:** 2.0.0
