/**
 * مدير التخزين الآمن مع التحقق من الحجم
 * 
 * يوفر واجهة آمنة للتعامل مع localStorage مع:
 * - التحقق من الحجم قبل الحفظ
 * - معالجة الأخطاء
 * - تنظيف البيانات القديمة تلقائياً
 */
export class StorageManager {
  private static readonly MAX_SIZE = 4 * 1024 * 1024; // 4MB
  private static readonly WARNING_SIZE = 3 * 1024 * 1024; // 3MB
  private static readonly CLEANUP_THRESHOLD = 0.9; // 90% من الحد الأقصى

  /**
   * حساب الحجم الحالي لـ localStorage
   */
  private static getCurrentSize(): number {
    let total = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          // حساب حجم المفتاح والقيمة
          total += new Blob([key, value]).size;
        }
      }
    } catch (error) {
      console.error('خطأ في حساب حجم localStorage:', error);
      return 0;
    }
    return total;
  }

  /**
   * التحقق من إمكانية الحفظ
   */
  static canStore(key: string, data: string): { canStore: boolean; error?: string; currentSize?: number; availableSize?: number } {
    try {
      const currentSize = this.getCurrentSize();
      const dataSize = new Blob([data]).size;
      
      // حساب الحجم بعد إزالة المفتاح القديم (إن وجد)
      const oldValue = localStorage.getItem(key);
      const oldSize = oldValue ? new Blob([oldValue]).size : 0;
      const newSize = currentSize - oldSize + dataSize;

      if (newSize > this.MAX_SIZE) {
        const availableMB = ((this.MAX_SIZE - currentSize + oldSize) / (1024 * 1024)).toFixed(2);
        return {
          canStore: false,
          error: `لا يمكن الحفظ: الحجم المتاح ${availableMB}MB فقط`,
          currentSize,
          availableSize: this.MAX_SIZE - currentSize + oldSize,
        };
      }

      // تحذير إذا كان الحجم قريباً من الحد الأقصى
      if (newSize > this.WARNING_SIZE) {
        const usagePercent = ((newSize / this.MAX_SIZE) * 100).toFixed(1);
        console.warn(`تحذير: استخدام localStorage ${usagePercent}% من الحد الأقصى`);
      }

      return {
        canStore: true,
        currentSize,
        availableSize: this.MAX_SIZE - newSize,
      };
    } catch (error) {
      console.error('خطأ في التحقق من الحجم:', error);
      return {
        canStore: false,
        error: 'خطأ في التحقق من حجم التخزين',
      };
    }
  }

  /**
   * حفظ آمن مع التحقق من الحجم
   */
  static safeSetItem(key: string, value: string): { success: boolean; error?: string } {
    const check = this.canStore(key, value);
    
    if (!check.canStore) {
      console.error('فشل الحفظ:', check.error);
      
      // محاولة تنظيف البيانات القديمة
      if (check.currentSize && check.currentSize > this.MAX_SIZE * this.CLEANUP_THRESHOLD) {
        const cleaned = this.cleanupOldData(key);
        if (cleaned) {
          // إعادة المحاولة بعد التنظيف
          const retryCheck = this.canStore(key, value);
          if (retryCheck.canStore) {
            try {
              localStorage.setItem(key, value);
              return { success: true };
            } catch (error) {
              return {
                success: false,
                error: 'فشل الحفظ بعد التنظيف',
              };
            }
          }
        }
      }
      
      return {
        success: false,
        error: check.error || 'فشل الحفظ',
      };
    }

    try {
      localStorage.setItem(key, value);
      return { success: true };
    } catch (error) {
      console.error('خطأ في الحفظ:', error);
      
      // محاولة تنظيف وإعادة المحاولة
      this.cleanupOldData(key);
      try {
        localStorage.setItem(key, value);
        return { success: true };
      } catch (retryError) {
        return {
          success: false,
          error: 'فشل الحفظ بعد عدة محاولات',
        };
      }
    }
  }

  /**
   * قراءة آمنة من localStorage
   */
  static safeGetItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`خطأ في قراءة ${key}:`, error);
      return null;
    }
  }

  /**
   * حذف آمن من localStorage
   */
  static safeRemoveItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`خطأ في حذف ${key}:`, error);
      return false;
    }
  }

  /**
   * تنظيف البيانات القديمة
   * 
   * يحذف البيانات الأقدم أولاً (بناءً على timestamp في المفتاح)
   */
  private static cleanupOldData(excludeKey?: string): boolean {
    try {
      const keys: Array<{ key: string; timestamp: number }> = [];
      
      // جمع جميع المفاتيح مع timestamps
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key !== excludeKey) {
          // محاولة استخراج timestamp من المفتاح
          const timestampMatch = key.match(/(\d+)/);
          const timestamp = timestampMatch ? parseInt(timestampMatch[1], 10) : 0;
          keys.push({ key, timestamp });
        }
      }

      // ترتيب حسب التاريخ (الأقدم أولاً)
      keys.sort((a, b) => a.timestamp - b.timestamp);

      // حذف 20% من البيانات الأقدم
      const deleteCount = Math.ceil(keys.length * 0.2);
      let deleted = 0;

      for (let i = 0; i < deleteCount && i < keys.length; i++) {
        localStorage.removeItem(keys[i].key);
        deleted++;
      }

      if (deleted > 0) {
        console.warn(`تم تنظيف ${deleted} عنصر من localStorage`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('خطأ في تنظيف البيانات:', error);
      return false;
    }
  }

  /**
   * الحصول على معلومات التخزين
   */
  static getStorageInfo(): {
    currentSize: number;
    maxSize: number;
    usagePercent: number;
    availableSize: number;
    itemCount: number;
  } {
    const currentSize = this.getCurrentSize();
    const usagePercent = (currentSize / this.MAX_SIZE) * 100;
    const availableSize = this.MAX_SIZE - currentSize;

    return {
      currentSize,
      maxSize: this.MAX_SIZE,
      usagePercent: Math.round(usagePercent * 100) / 100,
      availableSize,
      itemCount: localStorage.length,
    };
  }

  /**
   * تنظيف كامل لـ localStorage (استخدام بحذر!)
   */
  static clearAll(excludeKeys: string[] = []): void {
    try {
      const keysToKeep = new Set(excludeKeys);
      const keysToDelete: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keysToKeep.has(key)) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => localStorage.removeItem(key));
      console.info(`تم حذف ${keysToDelete.length} عنصر من localStorage`);
    } catch (error) {
      console.error('خطأ في تنظيف localStorage:', error);
    }
  }
}

