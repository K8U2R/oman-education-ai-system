/**
 * Security Middleware - Middleware للأمان
 *
 * Middleware لإضافة Security Headers
 */

import { Request, Response, NextFunction } from 'express'

/**
 * Security Headers Middleware
 */
export function securityMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';"
  )

  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff')

  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY')

  // X-XSS-Protection
  res.setHeader('X-XSS-Protection', '1; mode=block')

  // Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions-Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  // Strict-Transport-Security (HSTS) - فقط في HTTPS
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  next()
}
