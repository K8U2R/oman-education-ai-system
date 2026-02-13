/**
 * Auth State - الحالة المشتركة للمصادقة
 *
 * يحتوي على المتغيرات التي يجب مشاركتها بين Request و Response Interceptors
 * مثل حالة Circuit Breaker وعدد محاولات التحديث.
 */

// حالة النظام (Circuit Breaker)
// نستخدم كائن لتمرير المرجع (Reference) بدلاً من القيمة
export const authState = {
    isTerminated: false,
    refreshAttempts: 0,
}

export const MAX_REFRESH_ATTEMPTS = 3

export const resetAuthState = () => {
    authState.isTerminated = false
    authState.refreshAttempts = 0
}
