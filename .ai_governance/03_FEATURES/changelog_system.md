# 📝 FEATURE SPEC: Changelog System v1.0

## 🎯 النظرة التنفيذية

إن **سجل تغييرات نظام التعليم الذكي العماني** ليس مجرد قائمة تحديثات؛ بل هو **محرك تفاعل المنتج**. مستوحى من الوضوح البصري لمنصة *Linear* والشفافية الموجهة للمطورين في *Stripe*، يعمل هذا النظام على إغلاق حلقة التغذية الراجعة بين المنصة وقاعدة مستخدميها العُمانيين.

## 🚀 استراتيجية تجربة المستخدم 2025/2026

- **تحديثات متمحورة حول الأشخاص**: استخدام AI-Kernel لتلخيص سجلات التغيير التقنية وفقًا للشخصيات المختلفة (مثل: "ملاحظات المطور" مقابل "أبرز ما يهم المعلمين").
- **حلقات تغذية راجعة تفاعلية**: وحدات "تفاعل" و"تعليق" مدمجة في كل إدخال من سجل التغييرات لالتقاط الانطباعات الفورية.
- **قابلية مسح بصرية عالية**: دعم وسائط عالية الدقة (صور GIF، عروض فيديو) وتسميات مصنّفة (Fixed، Improved، New، Breaking).

---

## 🗄️ مخطط قاعدة البيانات (محسّن)

```sql
-- Changelog Entries - سجل التغييرات
CREATE TABLE IF NOT EXISTS public.changelog_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT, -- AI generated summary
    content_html TEXT NOT NULL, -- Rich text content
    category VARCHAR(50) CHECK (category IN ('new', 'improved', 'fixed', 'breaking', 'internal')),
    author_id UUID REFERENCES public.users(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    
    -- Persona Flags
    is_for_students BOOLEAN DEFAULT true,
    is_for_teachers BOOLEAN DEFAULT false,
    is_for_developers BOOLEAN DEFAULT false,
    
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Feedback on Changelogs - ملاحظات المستخدمين
CREATE TABLE IF NOT EXISTS public.changelog_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID REFERENCES public.changelog_entries(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id),
    reaction_type VARCHAR(20), -- 'love', 'useful', 'confused'
    comment_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX idx_changelog_published ON public.changelog_entries(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_changelog_feed_entry ON public.changelog_feedback(entry_id);
```

---

## 🎨 وصف مخطط واجهة المستخدم (UI/UX)

1. **الخلاصة الرئيسية**: بطاقات كبيرة قابلة للمسح السريع مع خط زمني موحّد.
2. **الشريط الجانبي البصري**: تجميع حسب "سجل الإصدارات" و"مرشحات الفئات".
3. **نبض Linear**: حركات دقيقة بسيطة عند تمرير المؤشر فوق بطاقات الإدخال.
4. **التغذية الراجعة المدمجة**: شريط إجراءات عائم أسفل كل إدخال للتفاعلات والتعليقات السريعة.

---

## 🔌 نقاط نهاية API (بنية DTO)

### `GET /api/v1/system/changelog`

يعيد قائمة مقسّمة إلى صفحات من الإدخالات المنشورة، ومفلترة حسب دور المستخدم.

```json
{
  "entries": [
    {
      "id": "uuid",
      "version": "2.1.0",
      "title": "Smart Learning Assistant Upgrade",
      "summary": "AI-generated TL;DR for students...",
      "category": "improved",
      "published_at": "ISO-TIMESTAMP",
      "feedback_summary": { "love": 24, "useful": 12 }
    }
  ]
}
```

### `POST /api/v1/system/changelog/:id/feedback`

يقوم بالتقاط انطباعات المستخدم والتغذية الراجعة النصية.

---

## 🛠️ استراتيجية التنفيذ

- **عنقود الواجهة الخلفية**: التنفيذ داخل `application/services/system/changelog`.
- **طبقة الواجهة الأمامية**: إنشاء `ChangelogView` مخصصة في طبقة العرض باستخدام `createPaginatedStore` لتحميل فعّال.
- **AI Hook**: عند `PUBLISH`، يتم تشغيل مهمة داخلية في AI-Kernel لتوليد حقل `summary` محليًا لكل شخصية مستخدم.

