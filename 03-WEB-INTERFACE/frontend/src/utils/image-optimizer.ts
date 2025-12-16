/**
 * Image Optimizer - محسن الصور
 * أدوات لتحسين وتحويل الصور
 */

export interface ImageOptimizationOptions {
  quality?: number; // 0-100
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * تحويل الصورة إلى WebP
 */
export async function convertToWebP(
  file: File,
  quality: number = 80
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('فشل تحويل الصورة'));
            }
          },
          'image/webp',
          quality / 100
        );
      } else {
        reject(new Error('فشل تحميل Canvas context'));
      }
    };

    img.onerror = () => reject(new Error('فشل تحميل الصورة'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * ضغط الصورة
 */
export async function compressImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<Blob> {
  const {
    quality = 80,
    format = 'webp',
    maxWidth = 1920,
    maxHeight = 1080,
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // حساب الأبعاد الجديدة
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        // تحسين الجودة
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, width, height);
        
        const mimeType = `image/${format}`;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('فشل ضغط الصورة'));
            }
          },
          mimeType,
          quality / 100
        );
      } else {
        reject(new Error('فشل تحميل Canvas context'));
      }
    };

    img.onerror = () => reject(new Error('فشل تحميل الصورة'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * إنشاء thumbnail للصورة
 */
export async function createThumbnail(
  file: File,
  size: number = 200,
  quality: number = 70
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // حساب الأبعاد مع الحفاظ على النسبة
      let { width, height } = img;
      const ratio = Math.min(size / width, size / height);
      width = width * ratio;
      height = height * ratio;

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('فشل إنشاء thumbnail'));
            }
          },
          'image/jpeg',
          quality / 100
        );
      } else {
        reject(new Error('فشل تحميل Canvas context'));
      }
    };

    img.onerror = () => reject(new Error('فشل تحميل الصورة'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * فحص دعم WebP
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * فحص دعم AVIF
 */
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

/**
 * الحصول على أفضل صيغة مدعومة
 */
export async function getBestImageFormat(): Promise<'webp' | 'avif' | 'jpeg'> {
  if (await supportsAVIF()) {
    return 'avif';
  }
  if (await supportsWebP()) {
    return 'webp';
  }
  return 'jpeg';
}

/**
 * تحسين URL الصورة (لخدمات CDN)
 */
export function optimizeImageURL(
  url: string,
  options: ImageOptimizationOptions = {}
): string {
  const { width, height, quality = 80, format } = options;
  
  // مثال: استخدام Cloudinary أو ImageKit
  // يمكن تعديل هذا حسب خدمة CDN المستخدمة
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  if (quality) params.append('q', quality.toString());
  if (format) params.append('f', format);
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

