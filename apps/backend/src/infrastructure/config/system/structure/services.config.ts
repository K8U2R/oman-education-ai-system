/**
 * System Services Configuration
 *
 * Defines static system services for introspection tools.
 * @compliance LAW_05 - Single Responsibility (Services only)
 */

import { ServiceInfo } from "@/domain/types/user";

export const SYSTEM_SERVICES: Partial<ServiceInfo>[] = [
  { name: "Database Core" },
  { name: "Auth Service" },
  { name: "Notification Service" },
  { name: "Learning Service" },
  { name: "Code Generation Service" },
  { name: "Office Generation Service" },
  { name: "Content Management Service" },
  { name: "Admin Service" },
  { name: "Developer Service" },
  { name: "Assessment Service" },
];
