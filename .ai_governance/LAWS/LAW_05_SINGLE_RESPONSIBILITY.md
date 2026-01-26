# القانون 05: المسؤولية الفردية (Single Responsibility)

## التعريف (Definition)

يجب ألا يتجاوز أي ملف 300 سطر. الـ Handler الذي يقوم بـ (Login, Register, OAuth, Update Profile) هو انتهاك لهذا القانون.

## السبب التقني (The Rationale)

1. **الصيانة:** الملفات الصغيرة أسهل في الفهم والعزل.
2. **التعاون:** تقليل تضارب الأكواد (Merge Conflicts).

## القائمة البيضاء (المسموح ✅)

- تقسيم `AuthHandler` إلى: `LoginHandler`, `RegistrationHandler`.
- فصل `UserHandler` لإدارة الملف الشخصي.

## القائمة السوداء (المحظور ❌)

- الكلاسات التي تحتوي على أكثر من 5 Public Methods غير مترابطة.
- ملفات المساعدين (Helpers) العامة.

## آلية التنفيذ (Enforcement)

- قياس تعقيد الكود (Cyclomatic Complexity).
