/**
 * Script لترقية المستخدم إلى Developer
 * 
 * هذا Script يترقي المستخدم nm.5.4.14m@gmail.com إلى أعلى صلاحية (developer)
 * 
 * الاستخدام:
 * 1. تأكد من أن Backend يعمل
 * 2. قم بتشغيل: npx tsx promote_user_script.ts
 */

import { DatabaseCoreAdapter } from '@/infrastructure/database'
import { container } from '@/infrastructure/di'

interface UserRow {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

async function promoteUserToDeveloper() {
  try {
    const email = 'nm.5.4.14m@gmail.com'

    // الحصول على Database Adapter
    const databaseAdapter = container.resolve<DatabaseCoreAdapter>('DatabaseCoreAdapter')

    console.log(`🔍 البحث عن المستخدم: ${email}`)

    // البحث عن المستخدم
    const user = await databaseAdapter.findOne<UserRow>('users', { email })

    if (!user) {
      console.error(`❌ المستخدم غير موجود: ${email}`)
      console.log('💡 تأكد من أن المستخدم مسجل في النظام')
      process.exit(1)
    }

    console.log('✅ المستخدم موجود:')
    console.log(`   - ID: ${user.id}`)
    console.log(`   - الاسم: ${user.first_name || ''} ${user.last_name || ''}`)
    console.log(`   - الدور الحالي: ${user.role}`)
    console.log(`   - نشط: ${user.is_active}`)
    console.log(`   - موثق: ${user.is_verified}`)

    if (user.role === 'developer') {
      console.log('✅ المستخدم لديه بالفعل صلاحية Developer')
      process.exit(0)
    }

    console.log(`\n🚀 ترقية المستخدم إلى Developer...`)

    // ترقية المستخدم
    const updated = await databaseAdapter.update<UserRow>(
      'users',
      { id: user.id },
      {
        role: 'developer',
        is_verified: true,
        is_active: true,
        updated_at: new Date().toISOString(),
      }
    )

    if (!updated) {
      console.error('❌ فشل تحديث المستخدم')
      process.exit(1)
    }

    console.log('✅ تم ترقية المستخدم بنجاح!')
    console.log(`\n📋 معلومات المستخدم المحدثة:`)
    console.log(`   - الدور: ${updated.role}`)
    console.log(`   - نشط: ${updated.is_active}`)
    console.log(`   - موثق: ${updated.is_verified}`)

    console.log(`\n⚠️  ملاحظة مهمة:`)
    console.log(`   يجب على المستخدم تسجيل الخروج وإعادة تسجيل الدخول`)
    console.log(`   لتفعيل  الجديدة في الجلسة الحالية`)

    process.exit(0)
  } catch (error) {
    console.error('❌ خطأ في ترقية المستخدم:', error)
    process.exit(1)
  }
}

// تشغيل Script
promoteUserToDeveloper()

