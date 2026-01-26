# القانون 09: تاريخ التغييرات (Traceable History)

## التعريف (Definition)

يجب أن تتبع رسائل الـ Commit معيار "Conventional Commits" لتسهيل التتبع وتوليد سجلات التغيير تلقائياً.

## السبب التقني (The Rationale)

1. **الأتمتة:** توليد إصدارات الدلالية (Semantic Versioning) آلياً.
2. **الوضوح:** معرفة نوع التغيير (ميزة، إصلاح، تنظيف) بمجرد النظر.

## القائمة البيضاء (المسموح ✅)

- `feat(auth): add login endpoint`
- `fix(ui): correct modal z-index`

## القائمة السوداء (المحظور ❌)

- "fixed bug"
- "update code"
- "wip"

## آلية التنفيذ (Enforcement)

- تفعيل `Husky` و `Commitlint` قبل قبول الـ Commit.
