/**
 * DEPRECATED: This file has been split into system/structure/{endpoints,services}.config.ts
 * 
 * This is a temporary compatibility proxy.
 * Please update your imports to use: @/infrastructure/config
 * 
 * @deprecated Use `import { SYSTEM_ENDPOINTS, SYSTEM_SERVICES } from '@/infrastructure/config'` instead
 */

export { SYSTEM_ENDPOINTS } from './system/structure/endpoints.config.js';
export { SYSTEM_SERVICES } from './system/structure/services.config.js';
