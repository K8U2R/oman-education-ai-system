# Troubleshooting Guide
# دليل حل المشاكل

## 🔧 المشاكل الشائعة والحلول

### 1. المكونات لا تظهر

**المشكلة:** المكونات لا تظهر أو تظهر فارغة.

**الحل:**
- تأكد من أن `UserPersonalizationProvider` موجود في `App.tsx`
- تحقق من أن المستخدم مسجل دخول
- تحقق من console للأخطاء

```tsx
// تأكد من وجود Provider
<UserPersonalizationProvider>
  <YourComponent />
</UserPersonalizationProvider>
```

---

### 2. التفضيلات لا تُحفظ

**المشكلة:** التغييرات لا تُحفظ في قاعدة البيانات.

**الحل:**
- تحقق من اتصال API
- تحقق من أن المستخدم مسجل دخول
- تحقق من console للأخطاء
- تأكد من أن `updatePreferences` يتم استدعاؤه

```tsx
const { updatePreferences } = useUserPersonalization();

const handleSave = async () => {
  try {
    await updatePreferences(newPreferences);
    console.log('Saved successfully');
  } catch (error) {
    console.error('Save failed:', error);
  }
};
```

---

### 3. Theme لا يتغير

**المشكلة:** Theme لا يتغير عند تحديث التفضيلات.

**الحل:**
- تأكد من أن `useTheme` hook يستخدم `preferences.theme`
- تحقق من أن `applyPreferences` يتم استدعاؤه
- تحقق من أن `ThemeContext` متكامل

```tsx
const { preferences } = useUserPersonalization();
const { setTheme } = useTheme();

useEffect(() => {
  if (preferences?.theme) {
    setTheme(preferences.theme);
  }
}, [preferences?.theme, setTheme]);
```

---

### 4. Keyboard Shortcuts لا تعمل

**المشكلة:** Keyboard Shortcuts لا تعمل.

**الحل:**
- تأكد من أن `useKeyboardShortcuts` مستخدم بشكل صحيح
- تحقق من أن المكون نشط (focused)
- تحقق من أن الاختصارات لا تتعارض مع اختصارات أخرى

```tsx
useKeyboardShortcuts([
  createShortcut('s', handleSave, { 
    ctrl: true,
    description: 'حفظ (Ctrl+S)' 
  }),
]);
```

---

### 5. Export/Import لا يعمل

**المشكلة:** Export/Import لا يعمل.

**الحل:**
- تحقق من أن الملف صحيح
- تحقق من أن البيانات في الصيغة الصحيحة
- تحقق من console للأخطاء

```tsx
try {
  const data = await importPersonalization(file);
  console.log('Imported:', data);
} catch (error) {
  console.error('Import failed:', error);
}
```

---

### 6. Cache لا يعمل

**المشكلة:** Cache لا يعمل أو البيانات قديمة.

**الحل:**
- تحقق من أن `cacheManager` مستخدم بشكل صحيح
- استخدم `invalidate` لمسح Cache
- تحقق من TTL (Time To Live)

```tsx
const { data, invalidate, refresh } = useCache({
  key: 'user-preferences',
  fetcher: () => fetchPreferences(),
  duration: 5 * 60 * 1000, // 5 minutes
});

// مسح Cache
invalidate();

// تحديث البيانات
refresh();
```

---

### 7. Analytics لا يعمل

**المشكلة:** Analytics لا يعمل.

**الحل:**
- تحقق من أن `trackEvent` مستخدم بشكل صحيح
- تحقق من console في development mode
- تأكد من تكامل Analytics service في production

```tsx
import { trackPreferenceChange } from '@/modules/user-personalization/utils/analytics';

trackPreferenceChange('theme', 'dark', 'light');
```

---

### 8. Error Boundary لا يعمل

**المشكلة:** Error Boundary لا يلتقط الأخطاء.

**الحل:**
- تأكد من استخدام Wrapper Components
- تحقق من أن Error Boundary في المكان الصحيح
- تحقق من console للأخطاء

```tsx
// استخدم Wrapper Components
<UserPreferencesWrapper />
<UserSettingsWrapper />
<UserProfileWrapper />
```

---

### 9. Accessibility لا يعمل

**المشكلة:** Accessibility features لا تعمل.

**الحل:**
- تأكد من استخدام `useAccessibility` hook
- تحقق من أن `containerRef` موجود
- تحقق من أن Screen Reader مفعل

```tsx
const containerRef = React.useRef<HTMLDivElement>(null);
const { announce, safeFocus } = useAccessibility({
  enableKeyboardNavigation: true,
  enableScreenReader: true,
  containerRef,
});
```

---

### 10. Migration لا يعمل

**المشكلة:** Migration لا يعمل عند استيراد البيانات.

**الحل:**
- تحقق من إصدار البيانات
- تحقق من أن `autoMigrate` مستخدم
- تحقق من console للأخطاء

```tsx
import { autoMigrate } from '@/modules/user-personalization';

const migrated = autoMigrate(data);
if (!migrated.success) {
  console.error('Migration failed:', migrated.errors);
}
```

---

## 🐛 Debug Tips

### 1. Enable Debug Mode

```tsx
// في development mode
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}
```

### 2. Check Network Requests

```tsx
// في browser DevTools
// Network tab -> Filter by "preferences" or "settings"
```

### 3. Check Store State

```tsx
import { useUserPersonalizationStore } from '@/store/user-personalization-store';

const store = useUserPersonalizationStore.getState();
console.log('Store state:', store);
```

---

## 📞 الدعم

إذا لم تجد الحل لمشكلتك:
1. تحقق من Documentation
2. تحقق من Examples
3. افتح Issue في GitHub
4. راجع Console للأخطاء

