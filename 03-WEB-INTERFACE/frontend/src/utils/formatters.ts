/**
 * Formatter Functions
 */

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ar');
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('ar', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format duration
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format code snippet
 */
export function formatCode(code: string, _language: string = 'javascript'): string {
  // This would typically use a syntax highlighter
  return code;
}

/**
 * Format JSON
 */
export function formatJSON(obj: unknown, indent: number = 2): string {
  try {
    return JSON.stringify(obj, null, indent);
  } catch {
    return String(obj);
  }
}

/**
 * Format file path
 */
export function formatFilePath(path: string): string {
  return path.replace(/\\/g, '/');
}

