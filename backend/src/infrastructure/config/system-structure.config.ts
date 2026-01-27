/**
 * System Structure Configuration
 * 
 * Defines static system components (endpoints, services) for introspection tools.
 * Law 12: Single Responsibility Principle & DRY.
 */

import { APIEndpointInfo, ServiceInfo } from "@/domain/types/user";

export const SYSTEM_ENDPOINTS: APIEndpointInfo[] = [
    // Health
    {
        method: "GET",
        path: "/api/v1/health",
        description: "Health check",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    {
        method: "GET",
        path: "/api/v1/health/ready",
        description: "Readiness check",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    {
        method: "GET",
        path: "/api/v1/health/live",
        description: "Liveness check",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    // Auth
    {
        method: "POST",
        path: "/api/v1/auth/login",
        description: "User login",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    {
        method: "POST",
        path: "/api/v1/auth/register",
        description: "User registration",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    {
        method: "POST",
        path: "/api/v1/auth/refresh",
        description: "Refresh token",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    {
        method: "POST",
        path: "/api/v1/auth/logout",
        description: "User logout",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    // Notifications
    {
        method: "GET",
        path: "/api/v1/notifications",
        description: "Get notifications",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    {
        method: "GET",
        path: "/api/v1/notifications/:id",
        description: "Get notification",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    {
        method: "POST",
        path: "/api/v1/notifications/:id/read",
        description: "Mark as read",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    // Learning
    {
        method: "GET",
        path: "/api/v1/learning/lessons",
        description: "Get lessons",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    {
        method: "GET",
        path: "/api/v1/learning/lessons/:id",
        description: "Get lesson",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    {
        method: "GET",
        path: "/api/v1/learning/lessons/:id/explanation",
        description: "Get explanation",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    // Code Generation
    {
        method: "POST",
        path: "/api/v1/code-generation/generate",
        description: "Generate code",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    {
        method: "POST",
        path: "/api/v1/code-generation/improve",
        description: "Improve code",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    // Office
    {
        method: "POST",
        path: "/api/v1/office/generate",
        description: "Generate office file",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    // Admin
    {
        method: "GET",
        path: "/api/v1/admin/stats/system",
        description: "System stats",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    {
        method: "GET",
        path: "/api/v1/admin/users",
        description: "Search users",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    // Developer
    {
        method: "GET",
        path: "/api/v1/developer/stats",
        description: "Developer stats",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    // Assessment
    {
        method: "GET",
        path: "/api/v1/assessments",
        description: "Get assessments",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
    {
        method: "POST",
        path: "/api/v1/assessments",
        description: "Create assessment",
        request_count: 0,
        average_response_time: 0,
        error_count: 0,
    },
];

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
