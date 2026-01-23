/**
 * User Pages - صفحات المستخدم
 *
 * نقطة التصدير المركزية لجميع صفحات نظام المستخدم بعد إعادة الهيكلة
 */

export { default as DashboardPage } from './dashboard/DashboardPage'
export { default as ProfilePage } from './profile/ProfilePage'
export { default as SubscriptionPage } from './subscription/SubscriptionPage'
export { default as UserSecuritySettingsPage } from './security/UserSecuritySettingsPage'

// ملاحظة: SettingsPage سيتم التعامل معها كـ Modal كما هو مخطط،
// ولكن نترك التصدير إذا كان مطلوباً كصفحة منفصلة في مسارات التنقل.
export { default as SettingsPage } from './settings/SettingsPage'
