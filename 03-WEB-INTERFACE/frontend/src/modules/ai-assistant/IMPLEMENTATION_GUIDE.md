# 🛠️ دليل التنفيذ: تحسين نظام الرسائل

## 📋 نظرة عامة

هذا الدليل يوضح الخطوات التفصيلية لتنفيذ نظام الصلاحيات والإجراءات للرسائل.

---

## 1. تحديث أنواع البيانات

### ملف: `types/chat.types.ts`

```typescript
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  editedAt?: Date; // تاريخ آخر تعديل
  isEdited?: boolean; // هل تم تعديل الرسالة
  originalContent?: string; // المحتوى الأصلي قبل التعديل
}

export interface MessageAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger' | 'warning';
  show?: boolean; // للتحكم في إظهار/إخفاء الإجراء
}

export interface ReportData {
  messageId: string;
  reason: 'inappropriate' | 'off-topic' | 'incorrect' | 'other';
  description?: string;
  timestamp: Date;
}
```

---

## 2. إنشاء مكون Context Menu

### ملف: `components/message/MessageContextMenu.tsx`

**المتطلبات:**
- قائمة منبثقة تظهر عند النقر على أيقونة الإجراءات
- ديناميكية حسب نوع الرسالة
- دعم RTL
- إغلاق عند النقر خارجها

**الهيكل المقترح:**
```typescript
interface MessageContextMenuProps {
  message: Message;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  onEdit?: () => void;
  onCopy: () => void;
  onRegenerate?: () => void;
  onReport?: () => void;
  onDelete: () => void;
  onTextToSpeech?: () => void;
}
```

---

## 3. إنشاء مكون Edit Mode

### ملف: `components/message/MessageEditMode.tsx`

**المتطلبات:**
- textarea قابلة للتعديل
- أزرار: حفظ، إلغاء
- تحذير عند الإلغاء مع وجود تغييرات
- تصميم متناسق مع ChatInput

**الهيكل المقترح:**
```typescript
interface MessageEditModeProps {
  message: Message;
  onSave: (editedContent: string) => void;
  onCancel: () => void;
}
```

---

## 4. إنشاء مكون Report Modal

### ملف: `components/message/ReportModal.tsx`

**المتطلبات:**
- نموذج إبلاغ بسيط
- خيارات: محتوى غير مناسب، خارج السياق، معلومات خاطئة، أخرى
- حقل نصي للوصف (اختياري)
- إرسال البيانات

**الهيكل المقترح:**
```typescript
interface ReportModalProps {
  message: Message;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReportData) => void;
}
```

---

## 5. تحديث MessageItem

### ملف: `components/MessageItem.tsx`

**التغييرات المطلوبة:**

1. **إضافة أيقونة الإجراءات:**
```typescript
const [showContextMenu, setShowContextMenu] = useState(false);
const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
```

2. **إضافة معالجات الإجراءات:**
```typescript
const handleEdit = () => { /* ... */ };
const handleCopy = () => { /* ... */ };
const handleRegenerate = () => { /* ... */ };
const handleReport = () => { /* ... */ };
const handleDelete = () => { /* ... */ };
const handleTextToSpeech = () => { /* ... */ };
```

3. **إضافة وضع التعديل:**
```typescript
const [isEditing, setIsEditing] = useState(false);
```

4. **دمج MessageContextMenu:**
```typescript
{showContextMenu && (
  <MessageContextMenu
    message={message}
    isOpen={showContextMenu}
    onClose={() => setShowContextMenu(false)}
    position={contextMenuPosition}
    onEdit={handleEdit}
    onCopy={handleCopy}
    onRegenerate={handleRegenerate}
    onReport={handleReport}
    onDelete={handleDelete}
    onTextToSpeech={handleTextToSpeech}
  />
)}
```

---

## 6. تحديث useMessageHandlers

### ملف: `hooks/useMessageHandlers.ts`

**الإضافات المطلوبة:**

```typescript
// تعديل رسالة المستخدم
const handleEditMessage = useCallback(async (
  messageId: string,
  editedContent: string
) => {
  // 1. تحديث الرسالة في messages array
  // 2. إرسال الرسالة المعدلة إلى AI
  // 3. حذف الرد القديم من AI
  // 4. إعادة توليد رد جديد
}, [messages, setMessages, /* ... */]);

// إعادة توليد رد النظام
const handleRegenerateResponse = useCallback(async (
  assistantMessageId: string
) => {
  // 1. العثور على رسالة المستخدم السابقة
  // 2. حذف رسالة AI الحالية
  // 3. إرسال رسالة المستخدم مرة أخرى
  // 4. عرض رد جديد
}, [messages, setMessages, /* ... */]);

// حذف رسالة
const handleDeleteMessage = useCallback((messageId: string) => {
  // 1. التحقق من الصلاحيات
  // 2. حذف الرسالة من messages array
  // 3. تحديث التاريخ
}, [messages, setMessages, /* ... */]);

// الإبلاغ عن رسالة
const handleReportMessage = useCallback(async (
  messageId: string,
  reportData: ReportData
) => {
  // 1. إرسال بيانات الإبلاغ إلى Backend
  // 2. إظهار رسالة نجاح
}, [/* ... */]);
```

---

## 7. تحديث ai-service

### ملف: `services/api/ai-service.ts`

**التحديثات المطلوبة:**

```typescript
// تحديث sendMessage لدعم التعديل
async sendMessage(
  messages: AIMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    editMessageId?: string; // معرف الرسالة المعدلة
    regenerateMessageId?: string; // معرف رسالة AI لإعادة التوليد
  }
): Promise<AIResponse> {
  // ... الكود الحالي مع إضافة معالجة editMessageId و regenerateMessageId
}

// إضافة دالة لإعادة التوليد
async regenerateResponse(
  userMessage: string,
  previousMessages: AIMessage[]
): Promise<AIResponse> {
  // إرسال نفس رسالة المستخدم مرة أخرى
  return this.sendMessage([
    ...previousMessages,
    { role: 'user', content: userMessage }
  ]);
}
```

---

## 8. إنشاء Text-to-Speech Utility

### ملف: `utils/textToSpeech.ts`

```typescript
export class TextToSpeechService {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string, lang: string = 'ar-SA'): void {
    this.stop(); // إيقاف أي قراءة سابقة
    
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = lang;
    this.utterance.rate = 1;
    this.utterance.pitch = 1;
    this.utterance.volume = 1;

    this.synth.speak(this.utterance);
  }

  stop(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
  }

  isSpeaking(): boolean {
    return this.synth.speaking;
  }
}

export const textToSpeechService = new TextToSpeechService();
```

---

## 9. ترتيب التنفيذ

### الخطوة 1: تحديث الأنواع
1. تحديث `Message` interface
2. إضافة `MessageAction` interface
3. إضافة `ReportData` interface

### الخطوة 2: إنشاء المكونات الأساسية
1. `MessageContextMenu.tsx`
2. `MessageEditMode.tsx`
3. `ReportModal.tsx`

### الخطوة 3: تحديث MessageItem
1. إضافة أيقونة الإجراءات
2. دمج Context Menu
3. دعم وضع التعديل
4. إضافة معالجات الإجراءات

### الخطوة 4: تحديث Handlers
1. `handleEditMessage`
2. `handleRegenerateResponse`
3. `handleDeleteMessage`
4. `handleReportMessage`

### الخطوة 5: تحديث Services
1. تحديث `ai-service.ts`
2. إنشاء `textToSpeech.ts`

### الخطوة 6: التكامل والاختبار
1. ربط جميع المكونات
2. اختبار جميع الإجراءات
3. اختبار RTL والتصميم المتجاوب

---

## 10. أمثلة الكود

### مثال: MessageContextMenu

```typescript
export const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  message,
  isOpen,
  onClose,
  position,
  onEdit,
  onCopy,
  onRegenerate,
  onReport,
  onDelete,
  onTextToSpeech,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  const isUser = message.role === 'user';

  const actions: MessageAction[] = [
    {
      id: 'copy',
      label: 'نسخ',
      icon: Copy,
      onClick: onCopy,
      show: true,
    },
    ...(isUser
      ? [
          {
            id: 'edit',
            label: 'تعديل',
            icon: Edit,
            onClick: onEdit!,
            show: !!onEdit,
          },
        ]
      : [
          {
            id: 'regenerate',
            label: 'إعادة توليد',
            icon: RotateCw,
            onClick: onRegenerate!,
            show: !!onRegenerate,
          },
          {
            id: 'report',
            label: 'الإبلاغ عن الرسالة',
            icon: Flag,
            onClick: onReport!,
            show: !!onReport,
            variant: 'warning',
          },
          {
            id: 'tts',
            label: 'قراءة بصوت مسموع',
            icon: Volume2,
            onClick: onTextToSpeech!,
            show: !!onTextToSpeech,
          },
        ]),
    {
      id: 'delete',
      label: 'حذف',
      icon: Trash2,
      onClick: onDelete,
      variant: 'danger',
      show: true,
    },
  ].filter((action) => action.show);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-ide-surface border border-ide-border rounded-lg shadow-xl p-1 min-w-[180px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      dir="rtl"
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => {
              action.onClick();
              onClose();
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-right ${
              action.variant === 'danger'
                ? 'text-red-400 hover:bg-red-400/10'
                : action.variant === 'warning'
                ? 'text-yellow-400 hover:bg-yellow-400/10'
                : 'text-ide-text hover:bg-ide-border'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};
```

---

## 11. ملاحظات مهمة

1. **الأداء:** استخدم `memo` و `useCallback` لتقليل إعادة الرسم
2. **RTL:** تأكد من دعم RTL في جميع المكونات
3. **الوصولية:** أضف ARIA labels و keyboard navigation
4. **معالجة الأخطاء:** أضف try-catch blocks ورسائل خطأ واضحة
5. **التجربة:** أضف رسائل نجاح/تحميل للمستخدم

---

## 12. الاختبار

### حالات الاختبار المطلوبة:

1. ✅ تعديل رسالة مستخدم وإعادة إرسالها
2. ✅ إعادة توليد رد النظام
3. ✅ نسخ رسالة (مستخدم ونظام)
4. ✅ الإبلاغ عن رسالة نظام
5. ✅ حذف رسالة (مستخدم ونظام)
6. ✅ القراءة الصوتية لرسالة نظام
7. ✅ إغلاق Context Menu عند النقر خارجها
8. ✅ إلغاء التعديل مع وجود تغييرات
9. ✅ RTL والتصميم المتجاوب

