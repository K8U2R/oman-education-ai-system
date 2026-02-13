# خطة التنفيذ: AI Soul (Education & Development Core)

**الفرع**: `004-ai-soul` | **التاريخ**: 2026-02-04 | **المواصفات**: [spec.md](./spec.md)
**المدخلات**: مواصفات الميزة من `planning/specs/004-ai-soul/spec.md`

**ملاحظة**: هذا الملف يتبع معيار `speckit.plan`.

## الملخص (Summary)

سنقوم بتفعيل "الروح" (AI Soul) للنظام التعليمي عبر دمج نماذج اللغة الكبيرة (LLMs) محلياً. الهدف هو تمكين توليد الدروس (للمعلمين) والمساعدة البرمجية (للطلاب) مع الحفاظ على سيادة البيانات الكاملة (Offline-First).

## السياق التقني (Technical Context)

**اللغة/الإصدار**: TypeScript (Node.js/Express Backend).
**التبعيات الأساسية**: `ollama` (JS Library) أو `langchain` (للتحكم في Prompt Templates).
**النموذج المقترح**: `deepseek-r1:8b` (للتحليل العميق) و `qwen:14b` (للغة العربية).
**التخزين**: PostgreSQL (لتخزين المحتوى المولد وسجلات المحادثة).
**الاختبار**: Jest (Mocking Ollama Responses).
**المنصة المستهدفة**: Local Server (Ubuntu Linux).

## فحص الدستور (Constitution Check)

*بوابة: يجب اجتيازها قبل بحث المرحلة 0.*

- [x] **لا كود بدون مواصفات**: تم إنشاء `spec.md`.
- [x] **الاختبار قبل التنفيذ**: الخطة تتضمن TDD للـ AI Integration.
- [x] **السيادة للبيانات**: الاستخدام الحصري لـ Local LLM (Ollama). لا اتصال بـ OpenAI.
- [x] **التوثيق الحي**: يتم تحديث المجلد `planning/specs/004-ai-soul/`.
- [x] **الوضوح**: اعتماد واجهة `AIProvider` لتبسيط التبديل بين النماذج.

## هيكل المشروع (Project Structure)

### التوثيق (هذه الميزة)

```text
planning/specs/004-ai-soul/
├── plan.md              # هذا الملف
├── research.md          # مخرجات المرحلة 0 (سيتم إنشاؤه)
├── data-model.md        # مخرجات المرحلة 1
├── contracts/           # API Definitions
└── tasks.md             # المهام التفصيلية
```

### المصدر البرمجي (Backend)

سنضيف وحدة (Module) جديدة: `education` و `ai`.

```text
apps/backend/src/
├── modules/
│   ├── ai/                      # [NEW] AI Core Module
│   │   ├── services/
│   │   │   ├── AIProvider.ts    # Interface
│   │   │   ├── OllamaProvider.ts # Implementation
│   │   │   └── PromptManager.ts
│   │   └── controllers/
│   │       └── ai.controller.ts
│   └── education/
│       ├── services/
│       │   └── LessonGenerator.ts # Uses AIProvider
```

## المراحل (Phases)

### المرحلة 0: البحث والاستكشاف (Research)

1. **التحقق من Ollama + Arabic**: اختبار جودة `deepseek-r1` مع اللغة العربية (الكسور، القواعد).
2. **اختبار الأداء**: قياس زمن الاستجابة على جهاز المستخدم (2026 Hardware).
3. **تصميم Prompts**: إعداد قوالب فعالة لتوليد JSON Structured Output.

### المرحلة 1: التصميم والعقود (Design)

1. **Lesson Schema**: تعريف هيكل JSON للدرس (الأهداف، المحتوى، الأسئلة).
2. **Conversation API**: تصميم نقاط النهاية لـ Chat Streaming.

### المرحلة 2: التنفيذ (Implementation)

1. **البنية التحتية**: إعداد `OllamaService`.
2. **توليد الدروس**: ربط `LessonGenerator` بـ `OllamaService`.
3. **المساعد البرمجي**: تنفيذ `CodeReviewAgent`.

## تتبع التعقيد (Complexity Tracking)

| الانتهاك | لماذا هو مطلوب | البديل الأبسط المرفوض (السبب) |
|-----------|------------|-------------------------------------|
| اعتماد LangChain (محتمل) | إدارة سلسلة الأفكار (Chain of Thought) والذاكرة | استخدام Ollama Raw API (صعوبة إدارة الذاكرة والسياق يدوياً) |
