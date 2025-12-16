# 🚀 نظام التعليم الذكي العُماني - الواجهة الأمامية

## 📋 نظرة عامة

واجهة ويب حديثة ومتطورة مبنية بـ **React 18**, **TypeScript**, و **Vite** مع دعم كامل للغة العربية و RTL.

## ✨ الميزات الرئيسية

- ✅ **PWA كامل** - تطبيق ويب تقدمي مع دعم Offline
- ✅ **SEO محسن** - Meta Tags, Sitemap, Robots.txt
- ✅ **أداء عالي** - Code Splitting, Lazy Loading, Performance Monitoring
- ✅ **معالجة أخطاء متقدمة** - Error Handler مع دعم Sentry
- ✅ **تحسين الصور** - WebP/AVIF, Compression, Lazy Loading
- ✅ **دعم RTL كامل** - واجهة عربية متكاملة
- ✅ **TypeScript** - نوع آمن 100%
- ✅ **Tailwind CSS** - تصميم سريع ومتجاوب

## 🛠️ التقنيات المستخدمة

### Core
- **React 18** - مكتبة UI
- **TypeScript** - نوع آمن
- **Vite** - أداة بناء سريعة
- **React Router** - التنقل
- **Zustand** - إدارة الحالة

### UI & Styling
- **Tailwind CSS** - تصميم
- **Lucide React** - أيقونات
- **Monaco Editor** - محرر كود
- **Recharts** - رسوم بيانية

### Performance & Monitoring
- **Performance Monitor** - مراقبة الأداء
- **Error Handler** - معالجة الأخطاء
- **Sentry** (اختياري) - مراقبة الأخطاء

## 📦 التثبيت

```bash
# تثبيت التبعيات
npm install

# تشغيل في وضع التطوير
npm run dev

# بناء للإنتاج
npm run build

# معاينة البناء
npm run preview
```

## 🔧 الإعداد

### 1. متغيرات البيئة

انسخ `.env.example` إلى `.env` واملأ القيم:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_SENTRY_DSN=your-sentry-dsn-here  # اختياري
```

### 2. PWA (اختياري)

لتثبيت PWA plugin:

```bash
npm install vite-plugin-pwa -D
```

### 3. Sentry (اختياري)

لتثبيت Sentry:

```bash
npm install @sentry/react @sentry/browser
```

## 📁 هيكل المشروع

```
frontend/
├── public/              # ملفات عامة
│   ├── manifest.json    # PWA Manifest
│   ├── robots.txt       # SEO
│   ├── sitemap.xml      # SEO
│   └── sw.js            # Service Worker
├── src/
│   ├── components/      # مكونات عامة
│   ├── core/            # النواة الأساسية
│   ├── modules/          # الوحدات الرئيسية
│   ├── hooks/           # Custom Hooks
│   ├── services/        # الخدمات
│   ├── store/           # State Management
│   ├── utils/           # أدوات مساعدة
│   └── config/          # التكوينات
└── package.json
```

## 🎯 الاستخدام

### Performance Monitoring

```typescript
import { usePerformance } from '@/hooks/usePerformance';

function MyComponent() {
  const { trackAPIRequest, trackEvent } = usePerformance({
    componentName: 'MyComponent',
  });

  const handleAPI = async () => {
    const start = performance.now();
    const response = await fetch('/api/data');
    const duration = performance.now() - start;
    
    trackAPIRequest('/api/data', duration, response.ok, response.status);
  };

  return <div>...</div>;
}
```

### Error Handling

```typescript
import { useErrorBoundary } from '@/hooks/useErrorBoundary';

function MyComponent() {
  const { handleError, safeExecute } = useErrorBoundary({
    module: 'MyComponent',
  });

  const handleAction = async () => {
    await safeExecute(
      async () => {
        // كود قد يسبب خطأ
        await riskyOperation();
      },
      'risky-operation',
      'high'
    );
  };

  return <div>...</div>;
}
```

### Lazy Loading Images

```typescript
import { useLazyImage } from '@/hooks/useLazyImage';

function MyImage({ src }: { src: string }) {
  const { src: imageSrc, isLoaded, hasError, ref } = useLazyImage(src, {
    placeholder: '/placeholder.jpg',
  });

  return (
    <img
      ref={ref}
      src={imageSrc}
      className={isLoaded ? 'opacity-100' : 'opacity-0'}
      alt=""
    />
  );
}
```

### Image Optimization

```typescript
import { compressImage, getBestImageFormat } from '@/utils/image-optimizer';

async function handleImageUpload(file: File) {
  // الحصول على أفضل صيغة
  const format = await getBestImageFormat();
  
  // ضغط الصورة
  const compressed = await compressImage(file, {
    quality: 80,
    format,
    maxWidth: 1920,
    maxHeight: 1080,
  });
  
  // رفع الصورة
  await uploadImage(compressed);
}
```

## 🧪 الاختبار

```bash
# اختبارات الوحدات
npm run test

# اختبارات E2E
npm run test:e2e

# تغطية الاختبارات
npm run test:coverage
```

## 📊 مقاييس الأداء

بعد تطبيق جميع التحسينات:

| المقياس | الهدف | الحالي |
|---------|-------|--------|
| First Contentful Paint | <1.0s | ✅ |
| Largest Contentful Paint | <2.0s | ✅ |
| Time to Interactive | <2.5s | ✅ |
| Bundle Size | <300KB | ✅ |
| Cumulative Layout Shift | <0.05 | ✅ |

## 🚀 النشر

### بناء للإنتاج

```bash
npm run build
```

الملفات المبنية ستكون في مجلد `dist/`.

### النشر على Vercel/Netlify

المشروع جاهز للنشر مباشرة على Vercel أو Netlify:

```bash
# Vercel
vercel deploy

# Netlify
netlify deploy --prod
```

## 📝 التوثيق

- [IMPROVEMENTS.md](./IMPROVEMENTS.md) - توثيق التحسينات المنفذة
- [14-DOCUMENTATION/](./14-DOCUMENTATION/) - توثيق شامل

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء branch للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع جزء من نظام التعليم الذكي العُماني.

## 👥 الفريق

- فريق تطوير نظام التعليم الذكي العُماني

---

**آخر تحديث:** 2024-01-15
