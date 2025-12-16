# دليل التكامل - Integration Guide
# User Personalization Module

## 📋 نظرة عامة

هذا الدليل يشرح كيفية تكامل وحدة التخصيص الشخصي مع التطبيق الرئيسي.

---

## 🚀 التكامل الأساسي

### 1. إضافة Providers في App.tsx

```typescript
import { UserPersonalizationProvider } from '@/components/UserPersonalizationProvider';
import { ToastProvider } from '@/modules/user-personalization';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <IDEProvider>
          <UserPersonalizationProvider>
            <ToastProvider>
              {/* Your routes */}
            </ToastProvider>
          </UserPersonalizationProvider>
        </IDEProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

### 2. استخدام Toast Notifications

```typescript
import { useToast } from '@/modules/user-personalization';

const MyComponent = () => {
  const { showSuccess, showError } = useToast();

  const handleAction = async () => {
    try {
      // Your logic
      showSuccess('تم الحفظ بنجاح');
    } catch (error) {
      showError('حدث خطأ');
    }
  };
};
```

### 3. استخدام Keyboard Shortcuts

```typescript
import { useKeyboardShortcuts, createShortcut } from '@/modules/user-personalization';

const MyComponent = () => {
  const handleSave = () => {
    // Save logic
  };

  useKeyboardShortcuts([
    createShortcut('s', handleSave, { ctrl: true, description: 'حفظ (Ctrl+S)' }),
  ]);
};
```

### 4. استخدام Validation

```typescript
import { validatePreferences } from '@/modules/user-personalization';

const result = validatePreferences({
  theme: 'dark',
  layout: 'comfortable',
});

if (!result.valid) {
  console.error(result.errors);
}
```

### 5. استخدام Export/Import

```typescript
import { downloadPersonalization, readPersonalizationFile } from '@/modules/user-personalization';

// Export
downloadPersonalization(preferences, settings, profile);

// Import
const data = await readPersonalizationFile(file);
```

---

## 🎨 التكامل مع Theme

```typescript
import { useTheme } from '@/modules/user-personalization/hooks';

const MyComponent = () => {
  const { theme, isDark } = useTheme();
  
  return (
    <div className={isDark ? 'dark-mode' : 'light-mode'}>
      {/* Content */}
    </div>
  );
};
```

---

## 📐 التكامل مع Layout

```typescript
import { useLayout } from '@/modules/user-personalization/hooks';

const MyComponent = () => {
  const { layout } = useLayout();
  
  return (
    <div className={`layout-${layout}`}>
      {/* Content */}
    </div>
  );
};
```

---

## 🔧 استخدام Helpers

```typescript
import { mergePreferences, formatDate, formatTime } from '@/modules/user-personalization';

// Merge with defaults
const prefs = mergePreferences(userPreferences);

// Format dates
const formatted = formatDate(new Date(), 'DD/MM/YYYY');

// Format time
const time = formatTime(new Date(), '24h');
```

---

## 📊 استخدام Constants

```typescript
import { VALIDATION_LIMITS, DEFAULT_PREFERENCES } from '@/modules/user-personalization';

// Use validation limits
if (displayName.length > VALIDATION_LIMITS.DISPLAY_NAME_MAX_LENGTH) {
  // Error
}

// Use defaults
const prefs = { ...DEFAULT_PREFERENCES, ...userPrefs };
```

---

## ✅ Best Practices

1. **استخدم ToastProvider في أعلى مستوى**
2. **استخدم Validation قبل الحفظ**
3. **استخدم Constants بدلاً من القيم المباشرة**
4. **استخدم Helpers للعمليات الشائعة**
5. **استخدم Types للأنواع**

---

## 🐛 Troubleshooting

### Toast لا يظهر
- تأكد من إضافة `ToastProvider` في `App.tsx`
- تأكد من استخدام `useToast` من `@/modules/user-personalization`

### Keyboard Shortcuts لا تعمل
- تأكد من عدم وجود تعارض مع shortcuts أخرى
- تأكد من استخدام `useKeyboardShortcuts` بشكل صحيح

### Validation لا يعمل
- تأكد من استيراد `validatePreferences` من `@/modules/user-personalization`
- تأكد من تمرير البيانات الصحيحة

---

## 📚 المزيد من المعلومات

راجع `README.md` للتفاصيل الكاملة.

