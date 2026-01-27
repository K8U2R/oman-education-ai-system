# القانون 11: السيادة المركزية (Root Sovereignty)

> **"الجذر هو الحقيقة الوحيدة؛ وكل فرع يخدم الجذر بامتثال."**

## 1. المبدأ (The Principle)

الملف الجذري `package.json` في الـ Root Directory هو **قائد الأوركسترا الوحيد** للنظام. يُحظر تماماً "الهروب" من سياق الجذر أو تغيير مسار العمل (Working Directory) يدوياً داخل السكربتات التشغيلية.

يجب أن تتم إدارة جميع العمليات الفرعية (Database, Backend, Frontend, Cockpit) من نقطة مركزية واحدة باستخدام أدوات إدارة الـ Workspaces المعتمدة.

## 2. الدوافع التقنية (The Rationale)

1. **اتساق المسارات (Path Consistency):**
    عند استخدام `cd` داخل السكربت، تضيع المرجعية النسبية للملفات، مما يسبب فشل الأدوات التي تعتمد على المسار الجذري (مثل ESLint و TypeScript Configs). البقاء في الجذر يضمن رؤية موحدة لكل ملفات المشروع.

2. **تزامن العمليات (Process Orchestration):**
    في نظامنا المتطور (Dual-Head Architecture)، نحتاج لتشغيل عدة خدمات في آن واحد (قاعدة البيانات الأساسية، الواجهة الخلفية، واجهة الطلاب، وقمرة المطور). استخدام `--prefix` مع مكتبة `concurrently` هو الطريقة الوحيدة لضمان إقلاع وإيقاف هذه الخدمات بشكل نظيف ومنسق.

3. **جاهزية CI/CD:**
    أدوات الأتمتة (مثل GitHub Actions) تتوقع أن تعمل الأوامر من جذر المستودع. الاعتماد على `cd` يجعل كتابة ملفات الـ Workflow معقدة وعرضة للأخطاء الكارثية.

## 3. البروتوكول الصارم (The Protocol)

### ✅ المسموح (Allowed Pattern)

استخدام خاصية `--prefix` لتوجيه الأوامر للمجلدات الفرعية دون مغادرة الجذر، واستخدام `concurrently` للتشغيل المتوازي.

```json
/* في package.json الجذري */
"scripts": {
  "build:backend": "npm run build --prefix backend",
  "test:frontend": "npm run test --prefix frontend",
  "dev:cockpit": "npm run dev:cockpit --prefix frontend",
  "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\" \"npm run dev:cockpit\""
}
```

### ❌ المحظور (Forbidden Pattern)

استخدام أمر `cd` لتغيير المسار يدوياً داخل سلسلة الأوامر. هذا يعتبر "كسراً للسيادة" ويؤدي لرفض الكود فوراً.

```json
/* ⛔ انتهاك صارم */
"scripts": {
  "build:backend": "cd backend && npm run build",  // مرفوض!
  "start": "cd frontend && npm start"              // مرفوض!
}
```

---
> **تم التحديث:** 2026/01/26 08:21 م
