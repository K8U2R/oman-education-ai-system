# 📋 Infrastructure Layer Changelog

## [2.0.0] - 2024 - Major Refactoring

### ✅ Added

- **HttpClient** - Pure HTTP client بدون business logic
- **HttpClientFactory** - Factory pattern للإنشاء
- **ApiClient Refactored** - إصدار محسّن يتبع Clean Architecture
- **Auth Interceptor** - Business logic للمصادقة في Application Layer
- **Offline Interceptor** - Business logic للعمل دون اتصال في Application Layer
- **StorageService** - Factory + Unified interface للـ Storage
- **IAsyncStorageAdapter** - Interface منفصل للـ async adapters
- **LoggingService** - Unified logging service

### 🔄 Changed

- **ApiClient** - تم إعادة هيكلته بالكامل
  - Business logic تم نقله إلى Application Layer
  - يستخدم HttpClient النقي + Interceptors
- **Storage Adapters** - تم إضافة واجهة async منفصلة
- **WebSocket/SSE** - تم توحيد السلوك (DEV/PROD)

### ⚠️ Deprecated

- **api-client.ts** - سيتم إزالته في المستقبل
  - استخدم `apiClientRefactored` بدلاً منه
- **storageAdapter** (singleton) - استخدم `storageService` بدلاً منه

### 🐛 Fixed

- Business logic في Infrastructure Layer
- Interface mismatch في Storage Adapters
- Singletons مباشرة
- Offline coupling في API Client
- سلوك DEV/PROD مختلف

---

## [1.0.0] - Initial Version

### ✅ Added

- API Client الأساسي
- Storage Adapters (localStorage, sessionStorage, IndexedDB)
- WebSocket Service
- SSE Service
- Supabase Client

---

**للمزيد من التفاصيل:** راجع `docs/INFRASTRUCTURE_REFACTORING_COMPLETE.md`
