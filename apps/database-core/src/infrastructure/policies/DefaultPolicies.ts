import { PolicyEngine } from './PolicyEngine'
import { OperationType } from '../../domain/value-objects/OperationType'

/**
 * DefaultPolicies - السياسات الافتراضية
 *
 * تحميل السياسات الافتراضية للنظام
 */
export function loadDefaultPolicies(policyEngine: PolicyEngine): void {
  // سياسات النظام
  // استخدام addPolicy مباشرة (يتعامل مع إنشاء id تلقائياً)

  // 1. System - صلاحيات كاملة
  policyEngine.addPolicy({
    name: 'system-all',
    actor: 'system',
    operation: '*',
    entity: '*',
    allowed: true,
    priority: 1000, // أعلى أولوية
  })

  // 2. Admin - صلاحيات كاملة
  policyEngine.addPolicy({
    name: 'admin-all',
    actor: 'admin',
    operation: '*',
    entity: '*',
    allowed: true,
    priority: 900,
  })

  // 3. Super Admin - صلاحيات كاملة
  policyEngine.addPolicy({
    name: 'super-admin-all',
    actor: 'super_admin',
    operation: '*',
    entity: '*',
    allowed: true,
    priority: 950,
  })

  // 4. Teacher - قراءة وكتابة على معظم الكيانات
  policyEngine.addPolicy({
    name: 'teacher-read-write',
    actor: 'teacher',
    operation: [OperationType.FIND, OperationType.INSERT, OperationType.UPDATE],
    entity: ['lessons', 'assessments', 'projects', 'students'],
    allowed: true,
    priority: 500,
  })

  // 5. Student - قراءة فقط على معظم الكيانات
  policyEngine.addPolicy({
    name: 'student-read',
    actor: 'student',
    operation: OperationType.FIND,
    entity: ['lessons', 'assessments', 'projects'],
    allowed: true,
    priority: 300,
  })

  // 6. Student - كتابة على مشاريعه الخاصة فقط
  policyEngine.addPolicy({
    name: 'student-write-own-projects',
    actor: 'student',
    operation: [OperationType.INSERT, OperationType.UPDATE],
    entity: 'projects',
    allowed: true,
    conditions: {
      // يمكن إضافة conditions لاحقاً للتحقق من الملكية
    },
    priority: 400,
  })

  // 7. Guest - قراءة فقط على الكيانات العامة
  policyEngine.addPolicy({
    name: 'guest-read-public',
    actor: 'guest',
    operation: OperationType.FIND,
    entity: ['lessons', 'public_content'],
    allowed: true,
    priority: 100,
  })

  // 8. منع الحذف للطلاب (باستثناء المشاريع الخاصة)
  policyEngine.addPolicy({
    name: 'student-no-delete',
    actor: 'student',
    operation: OperationType.DELETE,
    entity: '*',
    allowed: false,
    priority: 200,
  })
}
