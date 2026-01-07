/**
 * Route History - تاريخ المسارات
 *
 * نظام خفيف وفعّال لتتبع تاريخ التنقل بين الصفحات/المسارات في التطبيق.
 * يُخزن السجل في localStorage ليستمر بعد إعادة التحميل، مع الحفاظ على حجم محدود.
 *
 * الميزات:
 * - تجنب التكرار المتتالي لنفس المسار
 * - استرجاع المسار السابق بسهولة
 * - دعم التحميل/الحفظ التلقائي
 * - واجهة بسيطة وآمنة
 */

export interface RouteHistoryEntry {
  /** المسار (path) مثل: /dashboard یا /lessons/123 */
  path: string
  /** عنوان الصفحة الاختياري (للعرض في سجل التصفح أو الـ breadcrumbs) */
  title?: string
  /** وقت إضافة الإدخال (timestamp في milliseconds) */
  timestamp: number
  /** المسار الذي جاء منه المستخدم (referrer) */
  referrer?: string
}

class RouteHistory {
  /** السجل الداخلي */
  private history: RouteHistoryEntry[] = []

  /** الحد الأقصى لعدد الإدخالات المخزنة (لتوفير المساحة) */
  private readonly maxHistory: number = 50

  constructor() {
    this.loadFromStorage()
  }

  /**
   * إضافة إدخال جديد إلى السجل
   */
  public addEntry(path: string, title?: string, referrer?: string): void {
    // تنظيف المسار (إزالة query params و hash إذا لزم الأمر)
    if (!path) return // Skip empty paths
    const normalizedPath = path.split('?')[0]?.split('#')[0] || path

    // تجنب إضافة مسار مكرر متتالي
    const lastEntry = this.history[this.history.length - 1]
    if (lastEntry && lastEntry.path === normalizedPath) {
      return
    }

    const newEntry: RouteHistoryEntry = {
      path: normalizedPath || path, // Fallback to original path if normalization fails
      title,
      timestamp: Date.now(),
      referrer: referrer || lastEntry?.path,
    }

    this.history.push(newEntry)

    // الحفاظ على الحد الأقصى
    if (this.history.length > this.maxHistory) {
      this.history.shift()
    }

    this.saveToStorage()
  }

  /**
   * استرجاع كامل السجل (نسخة لتجنب التعديل المباشر)
   */
  public getHistory(): RouteHistoryEntry[] {
    return [...this.history]
  }

  /**
   * استرجاع أحدث الإدخالات (مفيد لعرض "تم زيارتها مؤخراً")
   */
  public getRecentEntries(limit: number = 10): RouteHistoryEntry[] {
    return this.history.slice(-limit).reverse()
  }

  /**
   * استرجاع المسار السابق (الصفحة التي كان المستخدم فيها قبل الحالية)
   */
  public getPreviousPath(): string | null {
    if (this.history.length < 2) {
      return null
    }
    const prevEntry = this.history[this.history.length - 2]
    return prevEntry?.path ?? null
  }

  /**
   * التحقق مما إذا كان بالإمكان العودة للخلف
   */
  public canGoBack(): boolean {
    return this.history.length > 1
  }

  /**
   * مسح السجل بالكامل
   */
  public clear(): void {
    this.history = []
    this.saveToStorage()
  }

  /**
   * تحميل السجل من localStorage عند التهيئة
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('route_history')
      if (stored) {
        const parsed: RouteHistoryEntry[] = JSON.parse(stored)

        // تصفية البيانات غير الصالحة وترتيبها حسب الوقت
        this.history = parsed
          .filter(
            (entry): entry is RouteHistoryEntry =>
              typeof entry.path === 'string' && typeof entry.timestamp === 'number'
          )
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(-this.maxHistory) // الاحتفاظ بآخر 50 فقط
      }
    } catch (error) {
      console.error('فشل تحميل سجل المسارات من localStorage:', error)
      this.history = []
    }
  }

  /**
   * حفظ السجل في localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const dataToStore = JSON.stringify(this.history)
      localStorage.setItem('route_history', dataToStore)
    } catch (error) {
      console.error('فشل حفظ سجل المسارات في localStorage:', error)
    }
  }
}

/**
 * مثيل واحد (Singleton) يُستخدم في جميع أنحاء التطبيق
 */
export const routeHistory = new RouteHistory()
