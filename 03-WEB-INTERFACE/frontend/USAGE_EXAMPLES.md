# 📚 أمثلة الاستخدام - نظام التعليم الذكي العُماني

## 🎯 أمثلة عملية لاستخدام جميع الميزات

---

## 1. Performance Monitoring

### استخدام Hook

```typescript
import { usePerformance } from '@/hooks/usePerformance';

function DashboardPage() {
  const { trackAPIRequest, trackEvent, getWebVitals } = usePerformance({
    componentName: 'DashboardPage',
    trackRenders: true,
    trackAPI: true,
  });

  useEffect(() => {
    // تتبع حدث مخصص
    trackEvent('dashboard-viewed', 0, {
      userId: user.id,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const fetchData = async () => {
    const start = performance.now();
    try {
      const response = await fetch('/api/dashboard');
      const duration = performance.now() - start;
      
      trackAPIRequest('/api/dashboard', duration, response.ok, response.status);
      
      return await response.json();
    } catch (error) {
      const duration = performance.now() - start;
      trackAPIRequest('/api/dashboard', duration, false);
      throw error;
    }
  };

  // الحصول على Web Vitals
  const vitals = getWebVitals();
  console.log('Web Vitals:', vitals);

  return <div>Dashboard</div>;
}
```

### استخدام مباشر

```typescript
import { performanceMonitor } from '@/utils/performance-monitor';

// تتبع تحميل مكون
performanceMonitor.trackComponentRender('MyComponent', 150);

// تتبع طلب API
performanceMonitor.trackAPIRequest('/api/users', 500, true, 200);

// تتبع حدث مخصص
performanceMonitor.trackCustomEvent('user-action', 100, {
  action: 'click',
  element: 'button',
});
```

---

## 2. Error Handling

### استخدام Hook

```typescript
import { useErrorBoundary } from '@/hooks/useErrorBoundary';

function ChatComponent() {
  const { handleError, safeExecute, safeExecuteSync } = useErrorBoundary({
    module: 'ChatComponent',
    defaultSeverity: 'medium',
  });

  const sendMessage = async (message: string) => {
    await safeExecute(
      async () => {
        const response = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        
        return await response.json();
      },
      'send-message',
      'high'
    );
  };

  const processData = (data: any) => {
    return safeExecuteSync(
      () => {
        // معالجة البيانات
        return processComplexData(data);
      },
      'process-data',
      'low'
    );
  };

  return <div>Chat</div>;
}
```

### استخدام مباشر

```typescript
import { errorHandler } from '@/utils/error-handler';

try {
  // كود قد يسبب خطأ
  await riskyOperation();
} catch (error) {
  errorHandler.handleError(error, {
    module: 'MyModule',
    action: 'risky-operation',
    severity: 'high',
    userInfo: {
      userId: user.id,
      timestamp: new Date().toISOString(),
    },
  });
}
```

---

## 3. Lazy Loading Images

### استخدام Hook

```typescript
import { useLazyImage } from '@/hooks/useLazyImage';

function UserAvatar({ imageUrl }: { imageUrl: string }) {
  const { src, isLoaded, hasError, ref } = useLazyImage(imageUrl, {
    placeholder: '/default-avatar.png',
    rootMargin: '50px',
  });

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        ref={ref}
        src={src}
        alt="User Avatar"
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400">فشل تحميل الصورة</span>
        </div>
      )}
    </div>
  );
}
```

### استخدام مكون LazyImage

```typescript
import { LazyImage } from '@/utils/lazy-loading';

function Gallery() {
  return (
    <div>
      <LazyImage
        src="/image1.jpg"
        alt="Image 1"
        placeholder="/placeholder.jpg"
        className="w-full h-64 object-cover"
      />
    </div>
  );
}
```

---

## 4. Image Optimization

```typescript
import {
  compressImage,
  convertToWebP,
  createThumbnail,
  getBestImageFormat,
  optimizeImageURL,
} from '@/utils/image-optimizer';

// ضغط صورة
async function handleImageUpload(file: File) {
  const format = await getBestImageFormat(); // 'webp' | 'avif' | 'jpeg'
  
  const compressed = await compressImage(file, {
    quality: 80,
    format,
    maxWidth: 1920,
    maxHeight: 1080,
  });
  
  // رفع الصورة المضغوطة
  await uploadImage(compressed);
}

// تحويل إلى WebP
async function convertImage(file: File) {
  const webpBlob = await convertToWebP(file, 85);
  // استخدام webpBlob
}

// إنشاء thumbnail
async function createImageThumbnail(file: File) {
  const thumbnail = await createThumbnail(file, 200, 70);
  // استخدام thumbnail
}

// تحسين URL للـ CDN
const optimizedURL = optimizeImageURL('https://cdn.example.com/image.jpg', {
  width: 800,
  height: 600,
  quality: 85,
  format: 'webp',
});
// النتيجة: https://cdn.example.com/image.jpg?w=800&h=600&q=85&f=webp
```

---

## 5. Lazy Loading Components

```typescript
import { lazy, Suspense } from 'react';

// Lazy load للمكونات الثقيلة
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

---

## 6. Service Worker (PWA)

```typescript
// في main.tsx (تم إضافته بالفعل)
// Service Worker يتم تسجيله تلقائياً

// للتحقق من حالة Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    console.log('Service Worker ready:', registration);
  });
}

// للتحقق من التحديثات
navigator.serviceWorker.addEventListener('controllerchange', () => {
  console.log('New Service Worker activated');
  // إعادة تحميل الصفحة
  window.location.reload();
});
```

---

## 7. Sentry Integration

```typescript
import { captureException, captureMessage } from '@/config/sentry.config';

// إرسال خطأ
try {
  await riskyOperation();
} catch (error) {
  captureException(error as Error, {
    tags: {
      module: 'MyModule',
      action: 'risky-operation',
    },
    extra: {
      userId: user.id,
    },
    level: 'error',
  });
}

// إرسال رسالة
captureMessage('User performed important action', 'info');
```

---

## 8. Performance Optimization Tips

### 1. استخدام React.memo

```typescript
import { memo } from 'react';

const ExpensiveComponent = memo(({ data }: { data: any }) => {
  // مكون مكلف
  return <div>{/* ... */}</div>;
});
```

### 2. استخدام useMemo و useCallback

```typescript
import { useMemo, useCallback } from 'react';

function MyComponent({ items }: { items: Item[] }) {
  // Memoize القيمة المكلفة
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  // Memoize الدالة
  const handleClick = useCallback((id: string) => {
    console.log('Clicked:', id);
  }, []);

  return <div>{/* ... */}</div>;
}
```

### 3. تقسيم الكود الديناميكي

```typescript
// تحميل المكون فقط عند الحاجة
const loadModal = async () => {
  const { default: Modal } = await import('./Modal');
  return Modal;
};
```

---

## 9. Best Practices

### ✅ DO

- استخدم Lazy Loading للمكونات الثقيلة
- استخدم Performance Monitoring في الإنتاج
- استخدم Error Handling في جميع العمليات الخطرة
- استخدم Image Optimization للصور الكبيرة
- استخدم React.memo للمكونات المكلفة

### ❌ DON'T

- لا تحمل جميع المكونات دفعة واحدة
- لا تهمل معالجة الأخطاء
- لا ترفع صور غير محسنة
- لا تستخدم console.log في الإنتاج
- لا تهمل Web Vitals

---

## 📚 موارد إضافية

- [React Performance](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Image Optimization](https://web.dev/fast/#optimize-your-images)

---

**آخر تحديث:** 2024-01-15

