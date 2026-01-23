/**
 * Sanitize Utility - أداة تنظيف HTML
 *
 * يوفر وظائف لتنظيف HTML من محتوى ضار (XSS protection)
 */

import DOMPurify from 'dompurify'

/**
 * تنظيف HTML من محتوى ضار
 *
 * @param dirty - النص HTML غير الآمن
 * @returns نص HTML آمن
 *
 * @example
 * ```typescript
 * const safeHTML = sanitizeHTML(userInput)
 * <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
 * ```
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    // السماح فقط بالـ tags الآمنة
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'blockquote',
      'code',
      'pre',
    ],
    // السماح فقط بالـ attributes الآمنة
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    // منع data attributes
    ALLOW_DATA_ATTR: false,
    // إزالة جميع الـ scripts
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    // إزالة جميع الـ attributes الخطرة
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  })
}

/**
 * تنظيف نص عادي (بدون HTML)
 *
 * @param text - النص المراد تنظيفه
 * @returns نص آمن
 */
export function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
}

/**
 * تنظيف URL
 *
 * @param url - الرابط المراد تنظيفه
 * @returns رابط آمن
 */
export function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url)
    // السماح فقط بـ http و https
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url
    }
    return ''
  } catch {
    return ''
  }
}
