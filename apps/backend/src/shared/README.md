# Shared Layer - الطبقة المشتركة

## 📋 الوصف

الطبقة المشتركة (Shared Layer) تحتوي على الكود المشترك الذي يمكن استخدامه عبر جميع الطبقات. هذه الطبقة لا تحتوي على Business Logic ولكن تحتوي على Utilities، Configuration Management، Logging، وغيرها من الأدوات المساعدة.

## 🏗️ الهيكل

```
shared/
├── configuration/     # الإعدادات
│   ├── settings-manager.ts
│   ├── env-loader.ts
│   ├── schemas/
│   │   └── settings.schema.ts
│   └── types/
│       └── settings.types.ts
└── utils/            # الأدوات المساعدة
    ├── logger.ts
    └── pkce.util.ts
```

## 📦 المكونات

### 1. Configuration - الإعدادات

**الموقع:** `configuration/`

**الوظيفة:**
- إدارة الإعدادات المشتركة
- تحميل Environment Variables
- Validation للإعدادات
- Type-safe Configuration

**الأقسام:**

#### `configuration/settings-manager.ts`
- مدير الإعدادات الرئيسي
- تحميل الإعدادات من ملفات
- Cache للإعدادات
- Hot Reload (اختياري)

#### `configuration/env-loader.ts`
- تحميل Environment Variables
- Parsing و Validation
- Default Values
- Type Conversion

#### `configuration/schemas/settings.schema.ts`
- Schema للإعدادات
- Validation Rules
- Type Definitions

#### `configuration/types/settings.types.ts`
- أنواع TypeScript للإعدادات
- Interfaces
- Type Aliases

### 2. Utils - الأدوات المساعدة

**الموقع:** `utils/`

**الوظيفة:**
- وظائف مساعدة مشتركة
- Utilities قابلة لإعادة الاستخدام
- Helper Functions

**الأقسام:**

#### `utils/logger.ts`
- نظام Logging المركزي
- Log Levels (debug, info, warn, error)
- Formatting
- Output Destinations

#### `utils/pkce.util.ts`
- PKCE (Proof Key for Code Exchange) Utilities
- Generate Code Verifier
- Generate Code Challenge
- OAuth Security

## ✅ ما يجب أن يكون في هذه الطبقة

### 1. Common Utilities
- وظائف مساعدة مشتركة
- Helper Functions
- Utility Classes

### 2. Configuration Management
- إدارة الإعدادات المشتركة
- Environment Variables Loading
- Configuration Validation

### 3. Logging
- نظام Logging مركزي
- Log Formatting
- Log Levels

### 4. Type Definitions
- أنواع مشتركة
- Interfaces مشتركة
- Type Aliases

### 5. Constants
- ثوابت مشتركة
- Enums
- Configuration Constants

### 6. Helper Functions
- وظائف مساعدة
- String Utilities
- Date Utilities
- Validation Utilities

## ❌ ما لا يجب أن يكون في هذه الطبقة

### 1. Business Logic
- ❌ لا يجب وجود Business Logic
- ✅ يجب أن يكون في Application أو Domain Layer

### 2. Domain-Specific Code
- ❌ لا يجب وجود كود خاص بمجال معين
- ✅ يجب أن يكون في Domain Layer

### 3. Framework-Specific Code
- ❌ لا يجب وجود كود خاص بـ Framework (Express, React)
- ✅ يجب أن يكون في Infrastructure أو Presentation Layer

### 4. External Dependencies
- ❌ لا يجب الاعتماد على External APIs
- ✅ يجب أن يكون في Infrastructure Layer

### 5. Database Access
- ❌ لا يجب الوصول إلى قاعدة البيانات
- ✅ يجب أن يكون في Infrastructure Layer

### 6. HTTP Handling
- ❌ لا يجب وجود HTTP-specific Code
- ✅ يجب أن يكون في Presentation Layer

## 🔄 التدفق (Flow)

```
All Layers
    ↓ (Use)
Shared Layer (Utilities, Config, Logging)
```

## 📝 أمثلة الاستخدام

### Logger Example
```typescript
// logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(`[INFO] ${message}`, meta)
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error)
  }
}
```

### Settings Manager Example
```typescript
// settings-manager.ts
export function getSettings(): Settings {
  return {
    database: {
      url: process.env.DATABASE_URL!,
      poolSize: parseInt(process.env.DB_POOL_SIZE || '10')
    },
    server: {
      port: parseInt(process.env.PORT || '3000')
    }
  }
}
```

### PKCE Utility Example
```typescript
// pkce.util.ts
export function generateCodeVerifier(): string {
  return base64URLEncode(crypto.randomBytes(32))
}

export function generateCodeChallenge(verifier: string): string {
  return base64URLEncode(sha256(verifier))
}
```

## 🧪 الاختبار

- كل Utility Function يجب أن يكون له Unit Tests
- اختبار Configuration Loading
- اختبار Error Handling
- اختبار Edge Cases

## 📚 المراجع

- Shared Utilities Best Practices
- Configuration Management Patterns
- Logging Best Practices

