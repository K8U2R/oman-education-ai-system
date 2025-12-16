# User Personalization Module
# وحدة التخصيص الشخصي للمستخدم

## 📋 نظرة عامة

هذه الوحدة تتيح للمستخدمين تخصيص تجربتهم في النظام، بما في ذلك:
- التفضيلات (Theme, Layout, Language, Notifications)
- الإعدادات (AI Settings, Code Editor Settings)
- الملف الشخصي (Bio, Skills, Interests)

## 🚀 المميزات

### ✅ التفضيلات
- **Theme**: Light/Dark/Auto مع تطبيق تلقائي
- **Layout**: Compact/Comfortable/Spacious
- **Language**: العربية/English مع RTL/LTR
- **Notifications**: Email, Push, Sound
- **Animations**: تفعيل/تعطيل الحركات

### ✅ الإعدادات
- **AI Model**: اختيار نموذج AI المفضل
- **AI Settings**: Temperature, Max Tokens
- **Code Editor**: Theme, Font, Tab Size, Word Wrap

### ✅ الملف الشخصي
- **Basic Info**: Display Name, Bio
- **Images**: Avatar, Cover Image
- **Location**: Location, Website
- **Skills & Interests**: قابلة للإضافة/الحذف

## 📁 الهيكل

```
user-personalization/
├── components/
│   ├── UserPreferences.tsx    # مكون التفضيلات
│   ├── UserSettings.tsx       # مكون الإعدادات
│   ├── UserProfile.tsx        # مكون الملف الشخصي
│   ├── UserDashboard.tsx      # لوحة التحكم
│   ├── LoadingState.tsx       # حالة التحميل
│   └── ErrorState.tsx         # حالة الخطأ
├── hooks/
│   ├── useTheme.ts            # Hook للثيم
│   ├── useLayout.ts           # Hook للتخطيط
│   └── index.ts               # تصدير موحد
├── utils/
│   ├── validation.ts          # التحقق من صحة البيانات
│   ├── applyPreferences.ts    # تطبيق التفضيلات
│   └── index.ts               # تصدير موحد
└── index.ts                   # تصدير موحد
```

## 🔧 الاستخدام

### في المكونات

```typescript
import { UserPreferences, UserSettings, UserProfile } from '@/modules/user-personalization';
import { useUserPersonalizationStore } from '@/store/user-personalization-store';

const MyComponent = () => {
  const { preferences, updatePreferences } = useUserPersonalizationStore();
  
  // استخدام التفضيلات
  const theme = preferences?.theme || 'auto';
  
  return <UserPreferences />;
};
```

### استخدام Hooks

```typescript
import { useTheme, useLayout } from '@/modules/user-personalization/hooks';

const MyComponent = () => {
  const { theme, isDark } = useTheme();
  const { layout } = useLayout();
  
  return <div className={isDark ? 'dark' : 'light'}>...</div>;
};
```

### Validation

```typescript
import { validatePreferences } from '@/modules/user-personalization/utils';

const result = validatePreferences({
  theme: 'dark',
  layout: 'comfortable',
  // ...
});

if (!result.valid) {
  console.error(result.errors);
}
```

## 🔄 التطبيق التلقائي

يتم تطبيق التفضيلات تلقائياً عبر `UserPersonalizationProvider`:

1. **عند تسجيل الدخول**: تحميل تلقائي للتفضيلات
2. **عند تغيير التفضيلات**: تطبيق فوري على الواجهة
3. **Theme**: تطبيق تلقائي على `document.documentElement`
4. **Layout**: تطبيق classes تلقائياً
5. **Language**: تطبيق `lang` و `dir` attributes

## 📊 State Management

يستخدم النظام `Zustand` لإدارة الحالة:

```typescript
const {
  preferences,
  settings,
  profile,
  isLoading,
  loadPreferences,
  updatePreferences,
  // ...
} = useUserPersonalizationStore();
```

## ✅ Validation

جميع البيانات يتم التحقق منها قبل الحفظ:

- **Preferences**: Theme, Layout, Language validation
- **Settings**: Temperature, Max Tokens, Font Size ranges
- **Profile**: Display Name length, Bio length, URL format

## 🎨 Styling

يستخدم النظام:
- CSS Variables من `chat-theme.css`
- Layout classes من `layout.css`
- Tailwind CSS للتصميم

## 📝 API Endpoints

- `GET /api/v1/user/preferences`
- `PUT /api/v1/user/preferences`
- `GET /api/v1/user/settings`
- `PUT /api/v1/user/settings`
- `GET /api/v1/user/profile`
- `PUT /api/v1/user/profile`

## 🔐 Security

- جميع البيانات يتم التحقق منها قبل الحفظ
- Error handling شامل
- Loading states للتحسينات UX
- Validation messages واضحة

## 🚀 التطوير المستقبلي

- [ ] إضافة المزيد من خيارات التخصيص
- [ ] دعم Themes مخصصة
- [ ] Export/Import للتفضيلات
- [ ] Sync بين الأجهزة

