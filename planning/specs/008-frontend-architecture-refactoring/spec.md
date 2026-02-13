# مواصفات الميزة: Frontend Architecture Refactoring

**فرع الميزة**: `008-frontend-architecture-refactoring`
**تاريخ الإنشاء**: 2026-02-09
**الحالة**: مسودة (Draft)
**المدخلات**: "تحليل شامل لهيكل المشروع وتوصيات إعادة الهيكلة (T046)"

## سيناريوهات المستخدم والاختبار (User Scenarios & Testing)

### قصة المستخدم 1 - توحيد إدارة الحالة (State Management Standardization) (الأولوية: P1)

بصفتي **مطوّر واجهة أمامية**، أريد **استخدام TanStack Query لجلب جميع بيانات الخادم**، لكي **أتخلص من تكرار الكود (boilerplate) الخاص بـ loading/error states وأضمن تزامن البيانات**.

**لماذا هذه الأولوية**: التباين الحالي بين `AdminStore` (Zustand) و `useProjects` (Local State) يسبب صعوبة في الصيانة وتكراراً غير ضروري للكود. توحيد النمط سيقلل حجم الكود ويحسن الأداء (caching).

**اختبار مستقل**: يمكن تحويل `Admin` features أولاً والتحقق من عملها، ثم `Projects` بشكل منفصل.

**سيناريوهات القبول**:

1. **نظراً لـ** وجود `AdminService`، **عندما** يتم استدعاء البيانات في `useAdmin`، **إذن** يجب استخدام `useQuery` وتخزين البيانات في الكاش، وإزالة `useAdminStore` الخاص بجلب البيانات.
2. **نظراً لـ** وجود `ProjectService`، **عندما** يتم استدعاء البيانات في `useProjects`، **إذن** يجب استخدام `useQuery` بدلاً من `useState/useEffect` اليدوية.

---

### قصة المستخدم 2 - تناسق هيكل المشروع (Project Structure Consistency) (الأولوية: P2)

بصفتي **مطوّر جديد**، أريد **أن تتطابق أسماء المجلدات في `application` مع `presentation`**، لكي **أتمكن من تتبع المنطق (Logic) إلى الواجهة (UI) بسهولة**.

**لماذا هذه الأولوية**: الفجوة الحالية (مثل `admin` vs `system-administration-portal`) تزيد من الوقت المستغرق لفهم الكود (Cognitive Load).

**اختبار مستقل**: يمكن إعادة تسمية المجلدات وتحديث الاستيرادات (Imports) وتشغيل اختبارات البناء (Build check).

**سيناريوهات القبول**:

1. **نظراً لـ** وجود مجلد `presentation/features/system-administration-portal`، **عندما** أقوم بإعادة الهيكلة، **إذن** يجب أن يصبح اسمه `presentation/features/admin` ليطابق `application/features/admin`.
2. **نظراً لـ** وجود مجلد `presentation/features/project-management-dashboard`، **عندما** أقوم بإعادة الهيكلة، **إذن** يجب أن يصبح اسمه `presentation/features/projects`.

---

### قصة المستخدم 3 - تنظيف وتوضيح Database Core (الأولوية: P3)

بصفتي **مهندس برمجيات**، أريد **تحليل وهيكلة ميزة `database-core`**، لكي **أفهم دورها الفعلي وأفصل منطق التخزين المحلي عن منطق الواجهة**.

**لماذا هذه الأولوية**: وجود 42 ملفاً في مجلد واحد دون هيكلية واضحة يمثل ديناً تقنياً (Technical Debt) كبيراً ومخاطر للصيانة.

**سيناريوهات القبول**:

1. **نظراً لـ** وجود مجلد `features/database-core`، **عندما** يتم تحليله، **إذن** يجب تقسيم محتوياته إلى `services`، `types`، أو نقله إلى `infrastructure` إذا كان مجرد wrapper.

---

## المتطلبات (Requirements)

### المتطلبات الوظيفية

- **FR-001**: النظام يجب أن يستخدم `TanStack Query (v5)` كطبقة وحيدة لإدارة حالة الخادم (Server State).
- **FR-002**: النظام يجب أن يحتفظ بـ Zustand فقط لإدارة حالة العميل (Client State) مثل الـ UI interactions (Modals, Sidebar).
- **FR-003**: جميع الخدمات (Services) يجب أن تكون Singletons وتستخدم النمط الموحد `apiClientRefactored`.
- **FR-004**: هيكلية المجلدات في `presentation` يجب أن تكون مرآة لهيكلية `application`.

### الكيانات الرئيسية

- **QueryKey Factory**: نمط لتوحيد مفاتيح الكاش لتجنب التضارب.
- **Service Hooks**: Custom Hooks تغلف `useQuery` و `useMutation` لكل كيان (مثل `useProjects`, `useAdminUsers`).

## معايير النجاح (Success Criteria)

### نتائج قابلة للقياس

- **SC-001**: تقليل عدد أسطر الكود في ملفات `hooks/use*.ts` بنسبة 40% (بسبب إزالة الـ boilerplate).
- **SC-002**: اجتياز اختبارات النوع `type-check` والاستيراد الدوري (circular imports) بنسبة 100%.
- **SC-003**: توحيد جميع عمليات جلب البيانات تحت نمط واحد (لا وجود لـ `useEffect` لجلب البيانات).
