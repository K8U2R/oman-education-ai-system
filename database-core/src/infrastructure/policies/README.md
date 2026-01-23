# Policy Engine - محرك السياسات

**الإصدار:** 2.0.0  
**آخر تحديث:** 2026-01-09

---

## 📋 نظرة عامة

Policy Engine هو نظام متقدم لإدارة  والتحقق منها قبل تنفيذ العمليات على قاعدة البيانات. يدعم:

- ✅ Integration مع Authentication Service
- ✅ دعم Roles و Permissions
- ✅ Policy Evaluation Engine متقدم
- ✅ Caching للـ Policies
- ✅ Wildcards و Conditions
- ✅ Priority-based evaluation

---

## 🎯 الميزات

### 1. Integration مع Authentication Service

Policy Engine يتكامل مع Authentication Service للحصول على معلومات المستخدم و:

```typescript
import { PolicyEngine } from './PolicyEngine'
import { PolicyService } from '../../application/services/PolicyService'
import { AuthenticationClient } from '../clients/AuthenticationClient'

const authClient = new AuthenticationClient({
  baseUrl: process.env.AUTH_SERVICE_URL,
  apiKey: process.env.AUTH_SERVICE_API_KEY,
})

const policyEngine = new PolicyEngine()
const policyService = new PolicyService(policyEngine, authClient, {
  defaultAllow: true,
  strictMode: false,
  cacheEnabled: true,
})

policyEngine.setPolicyService(policyService)
```

### 2. دعم Roles و Permissions

Policy Engine يدعم Roles و Permissions من خلال:

- **Local Policies:** سياسات محلية محددة
- **Authentication Service:** صلاحيات من Authentication Service
- **Default Policies:** سياسات افتراضية للنظام

### 3. Policy Evaluation Engine متقدم

#### Wildcards

```typescript
// جميع المستخدمين يمكنهم القراءة
policyEngine.addPolicy({
  name: 'all-read',
  actor: '*', // Wildcard
  operation: OperationType.FIND,
  entity: 'public_content',
  allowed: true,
})

// Admin يمكنه كل شيء
policyEngine.addPolicy({
  name: 'admin-all',
  actor: 'admin',
  operation: '*', // Wildcard
  entity: '*', // Wildcard
  allowed: true,
})
```

#### Conditions

```typescript
// فقط المالك يمكنه التحديث
policyEngine.addPolicy({
  name: 'owner-update',
  actor: '*',
  operation: OperationType.UPDATE,
  entity: 'projects',
  allowed: true,
  conditions: {
    owner_id: { $eq: 'user-123' },
    status: { $ne: 'archived' },
  },
})
```

#### Priority

```typescript
// سياسة عالية الأولوية
policyEngine.addPolicy({
  name: 'high-priority',
  actor: 'admin',
  operation: '*',
  entity: '*',
  allowed: true,
  priority: 900, // أولوية عالية
})

// سياسة منخفضة الأولوية
policyEngine.addPolicy({
  name: 'low-priority',
  actor: '*',
  operation: '*',
  entity: '*',
  allowed: false,
  priority: 100, // أولوية منخفضة
})
```

### 4. Caching

Policy Engine يستخدم Caching لتحسين الأداء:

```typescript
const policyService = new PolicyService(policyEngine, authClient, {
  cacheEnabled: true, // تفعيل Cache
})

// مسح Cache
policyService.clearCache()

// مسح Cache لمستخدم معين
policyService.clearUserCache('user-123')
```

---

## 📝 استخدام Policy Engine

### Basic Usage

```typescript
import { PolicyEngine } from './PolicyEngine'
import { OperationType } from '../../domain/value-objects/OperationType'

const policyEngine = new PolicyEngine()

// إضافة سياسة
policyEngine.addPolicy({
  name: 'student-read',
  actor: 'student',
  operation: OperationType.FIND,
  entity: 'lessons',
  allowed: true,
})

// التحقق من الصلاحية
const allowed = await policyEngine.checkPermission({
  actor: 'student',
  operation: OperationType.FIND,
  entity: 'lessons',
})

// تقييم السياسة
const result = await policyEngine.evaluatePolicy({
  actor: 'student',
  operation: OperationType.FIND,
  entity: 'lessons',
})

console.log(result.allowed) // true
console.log(result.reason) // "Policy allows"
```

### Advanced Usage

```typescript
// استخدام Conditions
policyEngine.addPolicy({
  name: 'owner-only',
  actor: '*',
  operation: OperationType.UPDATE,
  entity: 'projects',
  allowed: true,
  conditions: {
    owner_id: { $eq: 'user-123' },
    age: { $gt: 13, $lt: 18 },
    role: { $in: ['admin', 'teacher'] },
  },
})

// التحقق مع Conditions
const result = await policyEngine.evaluatePolicy({
  actor: 'user-123',
  operation: OperationType.UPDATE,
  entity: 'projects',
  conditions: {
    owner_id: 'user-123',
    age: 15,
    role: ['admin'],
  },
})
```

---

## 🔧 Conditions Operators

Policy Engine يدعم Operators التالية:

- **`$eq`**: Equals
- **`$ne`**: Not equals
- **`$in`**: In array
- **`$gt`**: Greater than
- **`$lt`**: Less than
- **`$gte`**: Greater than or equal
- **`$lte`**: Less than or equal

---

## 📊 Default Policies

النظام يحتوي على سياسات افتراضية:

- **System:** صلاحيات كاملة
- **Admin:** صلاحيات كاملة
- **Super Admin:** صلاحيات كاملة
- **Teacher:** قراءة وكتابة على معظم الكيانات
- **Student:** قراءة فقط على معظم الكيانات
- **Guest:** قراءة فقط على الكيانات العامة

---

## 🧪 Testing

```bash
# تشغيل Tests
npm test -- PolicyEngine.enhanced.test.ts

# Coverage
npm run test:coverage
```

---

## 📚 API Reference

### PolicyEngine

#### Methods

- `checkPermission(params: PolicyCheckParams): Promise<boolean>`
- `evaluatePolicy(params: PolicyCheckParams): Promise<PolicyEvaluationResult>`
- `addPolicy(policy: PolicyDefinition): void`
- `removePolicy(actor: string, operation: string, entity: string): boolean`
- `getAllPolicies(): Policy[]`
- `setPolicyService(policyService: PolicyService): void`

---

**تم إعداد التوثيق بواسطة:** AI Assistant  
**التاريخ:** 2026-01-09  
**الإصدار:** 2.0.0
