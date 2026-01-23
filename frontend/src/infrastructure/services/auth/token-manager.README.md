# 🔐 Token Manager Service - خدمة إدارة Tokens

**الموقع:** `infrastructure/services/token-manager.service.ts`  
**الغرض:** خدمة موحدة لإدارة tokens في جميع أنحاء التطبيق

---

## 🎯 الهدف

تقليل التكرار في كود إدارة tokens من خلال:

- ✅ قراءة tokens من عدة مصادر (storageAdapter, authStore)
- ✅ حفظ tokens في عدة مصادر
- ✅ مزامنة tokens بين storageAdapter و authStore
- ✅ توفير واجهة موحدة لجميع العمليات المتعلقة بـ tokens

---

## 📋 الوظائف المتاحة

### `getAccessToken(): string | null`

قراءة access token من عدة مصادر (storageAdapter أولاً، ثم authStore)

```typescript
const token = tokenManager.getAccessToken()
if (token) {
  // Use token
}
```

### `getRefreshToken(): string | null`

قراءة refresh token من عدة مصادر

```typescript
const refreshToken = tokenManager.getRefreshToken()
```

### `getTokens(): TokenSource`

قراءة جميع tokens مع معلومات المصدر

```typescript
const { accessToken, refreshToken, source } = tokenManager.getTokens()
// source: 'storageAdapter' | 'authStore' | 'none'
```

### `saveTokens(tokens, options): void`

حفظ tokens في جميع المصادر

```typescript
tokenManager.saveTokens(
  {
    access_token: 'new_access_token',
    refresh_token: 'new_refresh_token',
  },
  { syncToStore: true } // Default: true
)
```

### `clearTokens(): void`

حذف tokens من جميع المصادر

```typescript
tokenManager.clearTokens()
```

### `syncTokensFromStore(): void`

مزامنة tokens من authStore إلى storageAdapter

```typescript
tokenManager.syncTokensFromStore()
```

### `syncTokensToStore(): void`

مزامنة tokens من storageAdapter إلى authStore

```typescript
tokenManager.syncTokensToStore()
```

### `hasToken(): boolean`

التحقق من وجود token

```typescript
if (tokenManager.hasToken()) {
  // Token exists
}
```

### `getTokenInfo(): TokenInfo`

الحصول على معلومات token للمساعدة في debugging

```typescript
const info = tokenManager.getTokenInfo()
console.log(info)
// {
//   hasTokenInStorage: boolean,
//   hasTokenInStore: boolean,
//   hasTokenInService: boolean,
//   tokenSource: 'storageAdapter' | 'authStore' | 'none',
//   tokenLength: number
// }
```

---

## 🔄 الاستخدام في الملفات

### قبل (مكرر):

```typescript
// في api-client.ts
let token = authService.getAccessToken()
if (!token) {
  const authState = useAuthStore.getState()
  token = authState.tokens?.access_token || null
  if (token && !storageAdapter.get('access_token')) {
    storageAdapter.set('access_token', token)
  }
}

// في useAuth.ts
let accessToken = authService.getAccessToken()
let refreshToken = authService.getRefreshToken()
if (!accessToken || !refreshToken) {
  const authState = useAuthStore.getState()
  accessToken = accessToken || authState.tokens?.access_token || null
  refreshToken = refreshToken || authState.tokens?.refresh_token || null
  if (accessToken && !authService.getAccessToken()) {
    storageAdapter.set('access_token', accessToken)
  }
  // ... more sync logic
}

// في authStore.ts
if (tokens?.access_token) {
  storageAdapter.set('access_token', tokens.access_token)
}
if (tokens?.refresh_token) {
  storageAdapter.set('refresh_token', tokens.refresh_token)
}
```

### بعد (موحد):

```typescript
// في api-client.ts
const token = tokenManager.getAccessToken()

// في useAuth.ts
const tokenInfo = tokenManager.getTokens()
const { accessToken, refreshToken } = tokenInfo

// في authStore.ts
tokenManager.saveTokens({
  access_token: tokens.access_token,
  refresh_token: tokens.refresh_token,
})
```

---

## 📦 الملفات التي تستخدم TokenManager

- ✅ `infrastructure/api/api-client.ts` - قراءة وحفظ tokens
- ✅ `application/features/auth/hooks/useAuth.ts` - قراءة tokens
- ✅ `application/features/auth/store/authStore.ts` - حفظ tokens

---

## 🎨 المزايا

1. **تقليل التكرار:** منطق واحد موحد لجميع العمليات
2. **سهولة الصيانة:** تغيير واحد يؤثر على جميع الملفات
3. **Type Safety:** أنواع واضحة لجميع العمليات
4. **Debugging:** logging موحد لجميع العمليات
5. **Consistency:** نفس السلوك في جميع أنحاء التطبيق

---

## 📝 ملاحظات

- جميع العمليات تتعامل مع `storageAdapter` و `authStore` تلقائياً
- المزامنة التلقائية بين المصادر عند الحاجة
- Logging شامل في وضع التطوير
- التحقق من صحة البيانات قبل الحفظ

---

**آخر تحديث:** 2024
