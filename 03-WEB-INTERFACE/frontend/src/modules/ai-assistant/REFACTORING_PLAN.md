# 📋 خطة تطويرية - إعادة هيكلة AIChatPage.tsx

## 🎯 الهدف
تقسيم ملف `AIChatPage.tsx` (745 سطر) إلى مكونات أصغر وأكثر قابلية للصيانة.

---

## 📊 تحليل الملف الحالي

### الإحصائيات:
- **عدد الأسطر:** 745 سطر
- **عدد الـ States:** 11 state
- **عدد الـ Refs:** 5 refs
- **عدد الـ Handlers:** 8 handlers
- **عدد الـ Effects:** 3 effects

### المكونات الرئيسية:
1. **Header** (السطور 300-385)
2. **Welcome View** (السطور 389-506)
3. **Search Bar** (السطور 510-576)
4. **Messages Area** (السطور 578-597)
5. **Input Area** (السطور 599-702)
6. **Modals** (السطور 709-738)

---

## 🏗️ الهيكل المقترح

```
ai-assistant/
├── AIChatPage.tsx (الملف الرئيسي - مبسط)
├── components/
│   ├── chat/
│   │   ├── ChatHeader.tsx          # رأس الصفحة
│   │   ├── ChatWelcomeView.tsx     # عرض الترحيب
│   │   ├── ChatInput.tsx           # حقل الإدخال (مركزي وعادي)
│   │   ├── ChatSearchBar.tsx       # شريط البحث
│   │   ├── ChatMessagesArea.tsx    # منطقة الرسائل
│   │   └── SelectedFilesPreview.tsx # معاينة الملفات
│   ├── ChatHistory.tsx             # موجود
│   ├── ChatSidebar.tsx              # موجود
│   ├── MessageList.tsx              # موجود
│   ├── MessageTemplates.tsx         # موجود
│   └── NavigationModal.tsx          # موجود
├── hooks/
│   ├── useChatState.ts              # إدارة حالة المحادثة
│   ├── useFileHandlers.ts           # معالجة الملفات
│   ├── useMessageHandlers.ts       # معالجة الرسائل
│   ├── useChatHistory.ts            # موجود
│   └── useKeyboardShortcuts.ts      # موجود
├── types/
│   └── chat.types.ts                # أنواع TypeScript
└── utils/
    ├── fileValidator.ts              # موجود
    └── messageFormatter.ts           # موجود
```

---

## 📝 خطة التنفيذ التفصيلية

### المرحلة 1: إنشاء الأنواع (Types) ✅
**الملف:** `types/chat.types.ts`

```typescript
export interface ChatState {
  message: string;
  messages: Message[];
  isLoading: boolean;
  selectedFiles: File[];
  searchQuery: string;
  showSearch: boolean;
  showHistory: boolean;
  showTemplates: boolean;
  showSidebar: boolean;
  showNavigationModal: boolean;
  suggestedPage: PageSuggestion | null;
  lastSendTime: number;
}

export interface PageSuggestion {
  path: string;
  title: string;
  description: string;
}

export interface ChatRefs {
  messagesEndRef: React.RefObject<HTMLDivElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  folderInputRef: React.RefObject<HTMLInputElement>;
  centerInputRef: React.RefObject<HTMLTextAreaElement>;
  regularInputRef: React.RefObject<HTMLTextAreaElement>;
}
```

**المدة المتوقعة:** 30 دقيقة

---

### المرحلة 2: إنشاء Custom Hooks ✅

#### 2.1 `hooks/useChatState.ts`
**المسؤولية:** إدارة جميع الـ states والـ refs

```typescript
export function useChatState() {
  // جميع الـ states
  // جميع الـ refs
  // دوال التحديث الأساسية
  return { state, refs, setters };
}
```

**المدة المتوقعة:** 1 ساعة

#### 2.2 `hooks/useFileHandlers.ts`
**المسؤولية:** معالجة الملفات والمجلدات

```typescript
export function useFileHandlers(
  selectedFiles: File[],
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>,
  fileInputRef: React.RefObject<HTMLInputElement>,
  folderInputRef: React.RefObject<HTMLInputElement>
) {
  const handleFileSelect = ...
  const handleFolderSelect = ...
  const handleRemoveFile = ...
  return { handleFileSelect, handleFolderSelect, handleRemoveFile };
}
```

**المدة المتوقعة:** 45 دقيقة

#### 2.3 `hooks/useMessageHandlers.ts`
**المسؤولية:** معالجة إرسال الرسائل والتفاعل مع AI

```typescript
export function useMessageHandlers(
  state: ChatState,
  setState: ChatStateSetters,
  chatHistory: ReturnType<typeof useChatHistory>
) {
  const handleSend = ...
  const handleClearChat = ...
  const handleSelectSession = ...
  const handleSelectTemplate = ...
  const handleNavigate = ...
  const handleDismissSuggestion = ...
  return { ... };
}
```

**المدة المتوقعة:** 2 ساعة

---

### المرحلة 3: إنشاء مكونات UI ✅

#### 3.1 `components/chat/ChatHeader.tsx`
**المسؤولية:** رأس الصفحة مع الأزرار

```typescript
interface ChatHeaderProps {
  messagesCount: number;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  onShowSearch: () => void;
  onShowHistory: () => void;
  onExportChat: () => void;
  onClearChat: () => void;
  onShowTemplates: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ ... }) => {
  // السطور 300-385
}
```

**المدة المتوقعة:** 1 ساعة

#### 3.2 `components/chat/ChatWelcomeView.tsx`
**المسؤولية:** عرض الترحيب عند عدم وجود رسائل

```typescript
interface ChatWelcomeViewProps {
  message: string;
  setMessage: (msg: string) => void;
  selectedFiles: File[];
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onSend: () => void;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  folderInputRef: React.RefObject<HTMLInputElement>;
  centerInputRef: React.RefObject<HTMLTextAreaElement>;
}

export const ChatWelcomeView: React.FC<ChatWelcomeViewProps> = ({ ... }) => {
  // السطور 389-506
}
```

**المدة المتوقعة:** 1.5 ساعة

#### 3.3 `components/chat/SelectedFilesPreview.tsx`
**المسؤولية:** عرض الملفات المحددة

```typescript
interface SelectedFilesPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  variant?: 'center' | 'regular';
}

export const SelectedFilesPreview: React.FC<SelectedFilesPreviewProps> = ({ ... }) => {
  // السطور 409-427 و 602-620
}
```

**المدة المتوقعة:** 30 دقيقة

#### 3.4 `components/chat/ChatInput.tsx`
**المسؤولية:** حقل الإدخال (يدعم الوضعين: مركزي وعادي)

```typescript
interface ChatInputProps {
  message: string;
  setMessage: (msg: string) => void;
  onSend: () => void;
  isLoading: boolean;
  selectedFiles: File[];
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  variant: 'center' | 'regular';
  fileInputRef: React.RefObject<HTMLInputElement>;
  folderInputRef: React.RefObject<HTMLInputElement>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export const ChatInput: React.FC<ChatInputProps> = ({ ... }) => {
  // السطور 429-503 و 622-701
}
```

**المدة المتوقعة:** 2 ساعة

#### 3.5 `components/chat/ChatSearchBar.tsx`
**المسؤولية:** شريط البحث

```typescript
interface ChatSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCount: number;
  totalCount: number;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  folderInputRef: React.RefObject<HTMLInputElement>;
}

export const ChatSearchBar: React.FC<ChatSearchBarProps> = ({ ... }) => {
  // السطور 510-576
}
```

**المدة المتوقعة:** 1 ساعة

#### 3.6 `components/chat/ChatMessagesArea.tsx`
**المسؤولية:** منطقة عرض الرسائل

```typescript
interface ChatMessagesAreaProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessagesArea: React.FC<ChatMessagesAreaProps> = ({ ... }) => {
  // السطور 578-597
}
```

**المدة المتوقعة:** 30 دقيقة

---

### المرحلة 4: تحديث AIChatPage.tsx ✅
**المسؤولية:** الملف الرئيسي المبسط

```typescript
const AIChatPage: React.FC = () => {
  // استخدام الـ hooks
  const { state, refs, setters } = useChatState();
  const fileHandlers = useFileHandlers(...);
  const messageHandlers = useMessageHandlers(...);
  const chatHistory = useChatHistory();
  
  // استخدام الـ keyboard shortcuts
  useKeyboardShortcuts({ ... });
  
  // الـ effects
  useEffect(() => { ... }, []);
  
  return (
    <div className="...">
      {state.showSidebar && <ChatSidebar ... />}
      <div className="...">
        <ChatHeader ... />
        <Card>
          {state.messages.length === 0 ? (
            <ChatWelcomeView ... />
          ) : (
            <>
              {state.showSearch && <ChatSearchBar ... />}
              <ChatMessagesArea ... />
              <ChatInput variant="regular" ... />
            </>
          )}
        </Card>
      </div>
      {/* Modals */}
    </div>
  );
};
```

**المدة المتوقعة:** 2 ساعة

---

## 📅 الجدول الزمني

| المرحلة | المدة | الأولوية |
|---------|-------|----------|
| المرحلة 1: Types | 30 دقيقة | 🔴 عالية |
| المرحلة 2.1: useChatState | 1 ساعة | 🔴 عالية |
| المرحلة 2.2: useFileHandlers | 45 دقيقة | 🟡 متوسطة |
| المرحلة 2.3: useMessageHandlers | 2 ساعة | 🔴 عالية |
| المرحلة 3.1: ChatHeader | 1 ساعة | 🟡 متوسطة |
| المرحلة 3.2: ChatWelcomeView | 1.5 ساعة | 🟡 متوسطة |
| المرحلة 3.3: SelectedFilesPreview | 30 دقيقة | 🟢 منخفضة |
| المرحلة 3.4: ChatInput | 2 ساعة | 🔴 عالية |
| المرحلة 3.5: ChatSearchBar | 1 ساعة | 🟢 منخفضة |
| المرحلة 3.6: ChatMessagesArea | 30 دقيقة | 🟢 منخفضة |
| المرحلة 4: تحديث AIChatPage | 2 ساعة | 🔴 عالية |

**المدة الإجمالية:** ~13 ساعة

---

## ✅ معايير النجاح

1. **تقليل حجم AIChatPage.tsx** من 745 سطر إلى أقل من 150 سطر
2. **إعادة استخدام المكونات** في أماكن أخرى إذا لزم الأمر
3. **سهولة الصيانة** - كل مكون له مسؤولية واحدة
4. **اختبار كل مكون** بشكل منفصل
5. **عدم كسر الوظائف الحالية** - جميع الميزات تعمل كما هي

---

## 🔄 خطوات التنفيذ الموصى بها

1. **ابدأ بالأنواع (Types)** - الأساس لكل شيء
2. **أنشئ الـ Hooks** - المنطق الأساسي
3. **أنشئ المكونات البسيطة أولاً** - SelectedFilesPreview, ChatMessagesArea
4. **أنشئ المكونات المعقدة** - ChatInput, ChatWelcomeView
5. **حدّث AIChatPage.tsx** تدريجياً
6. **اختبر كل مرحلة** قبل الانتقال للتالية

---

## 📚 ملاحظات إضافية

- **استخدم TypeScript** بشكل صحيح في جميع الملفات
- **احتفظ بنفس التصميم** والـ styling
- **استخدم React.memo** للمكونات الكبيرة إذا لزم الأمر
- **وثّق كل مكون** بـ JSDoc comments
- **استخدم نفس نمط التسمية** الموجود في المشروع

---

## 🚀 البدء

ابدأ بالمرحلة 1 (Types) ثم تابع بالترتيب المذكور أعلاه.

**تاريخ الإنشاء:** 2024
**آخر تحديث:** 2024

