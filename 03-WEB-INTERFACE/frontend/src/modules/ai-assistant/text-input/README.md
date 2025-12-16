# 📝 قسم كتابة النص ونظام العمل

هذا المجلد يحتوي على جميع المكونات والأدوات المتعلقة بكتابة النص ومعالجته في نظام المساعد الذكي.

---

## 📁 هيكل الملفات

```
text-input/
├── components/          # مكونات واجهة المستخدم
│   ├── ChatInput.tsx   # حقل إدخال الرسائل
│   └── MessageEditMode.tsx  # وضع تعديل الرسائل
├── hooks/              # React Hooks
│   ├── useKeyboardShortcuts.ts  # اختصارات لوحة المفاتيح
│   └── useTextInput.ts  # إدارة حالة حقل الإدخال
├── utils/              # أدوات مساعدة
│   ├── messageFormatter.ts  # تنسيق الرسائل
│   ├── messageValidator.ts  # التحقق من صحة الرسائل
│   └── textToSpeech.ts  # تحويل النص إلى كلام
├── types/              # أنواع TypeScript
│   └── text-input.types.ts
├── index.ts            # نقطة التصدير الرئيسية
└── README.md           # هذا الملف
```

---

## 🎯 المكونات

### `ChatInput`
مكون حقل الإدخال للمحادثة مع دعم:
- وضعين: `center` (مركزي) و `regular` (عادي)
- إرفاق الملفات والمجلدات
- تكيف تلقائي للارتفاع
- اختصارات لوحة المفاتيح

### `MessageEditMode`
مكون وضع التعديل للرسائل مع:
- textarea قابلة للتعديل
- أزرار حفظ وإلغاء
- تحذير عند الإلغاء مع وجود تغييرات

---

## 🪝 Hooks

### `useKeyboardShortcuts`
Hook لإدارة اختصارات لوحة المفاتيح:
- `Ctrl/Cmd + K`: التركيز على حقل الإدخال
- `Ctrl/Cmd + L`: مسح المحادثة
- `Ctrl/Cmd + F`: البحث
- `Escape`: إغلاق النوافذ المنبثقة
- `Ctrl/Cmd + Enter`: إرسال الرسالة

### `useTextInput`
Hook لإدارة حالة حقل إدخال النص:
- إدارة القيمة والحالة
- التحقق من صحة النص
- حساب الإحصائيات (عدد الأحرف، الكلمات، الأسطر)
- ضبط الارتفاع تلقائياً

---

## 🛠️ الأدوات المساعدة

### `messageFormatter`
وظائف تنسيق الرسائل:
- `formatMessageContent()`: تنظيف وتنسيق المحتوى
- `extractCodeBlocks()`: استخراج كتل الكود
- `extractLinks()`: استخراج الروابط
- `messagesToMarkdown()`: تحويل إلى Markdown
- `messagesToJSON()`: تحويل إلى JSON
- `exportChat()`: تصدير المحادثة

### `messageValidator`
وظائف التحقق من صحة الرسائل:
- `sanitizeMessage()`: تنظيف من XSS
- `validateMessageLength()`: التحقق من الطول
- `validateMessageContent()`: التحقق من المحتوى
- `validateMessage()`: التحقق الشامل
- `validateMessageForSend()`: التحقق قبل الإرسال
- `validateMessageForEdit()`: التحقق قبل التعديل

### `textToSpeech`
خدمة تحويل النص إلى كلام:
- `speak()`: قراءة النص
- `stop()`: إيقاف القراءة
- `getIsSpeaking()`: التحقق من حالة القراءة
- `setRate()`, `setPitch()`, `setVolume()`: ضبط الإعدادات

---

## 📦 الاستخدام

### استيراد المكونات
```typescript
import { ChatInput, MessageEditMode } from '@/modules/ai-assistant/text-input';
```

### استيراد Hooks
```typescript
import { useKeyboardShortcuts, useTextInput } from '@/modules/ai-assistant/text-input';
```

### استيراد الأدوات
```typescript
import { 
  formatMessageContent, 
  validateMessage, 
  textToSpeechService 
} from '@/modules/ai-assistant/text-input';
```

### استيراد الأنواع
```typescript
import type { 
  TextInputState, 
  TextInputOptions, 
  TextValidationResult 
} from '@/modules/ai-assistant/text-input';
```

---

## 🔄 التحديثات

تم نقل جميع الملفات المتعلقة بكتابة النص من:
- `components/chat/ChatInput.tsx` → `text-input/components/ChatInput.tsx`
- `components/message/MessageEditMode.tsx` → `text-input/components/MessageEditMode.tsx`
- `hooks/useKeyboardShortcuts.ts` → `text-input/hooks/useKeyboardShortcuts.ts`
- `utils/messageFormatter.ts` → `text-input/utils/messageFormatter.ts`
- `utils/messageValidator.ts` → `text-input/utils/messageValidator.ts`
- `utils/textToSpeech.ts` → `text-input/utils/textToSpeech.ts`

---

## ✅ الحالة

- ✅ جميع المكونات تم نقلها
- ✅ جميع الاستيرادات تم تحديثها
- ✅ الهيكل منظم ومتسق
- ✅ ملف index.ts للتصدير الموحد

---

**تاريخ الإنشاء:** $(date)
**الإصدار:** 1.0.0

