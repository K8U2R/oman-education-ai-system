/**
 * Database Control Service - خدمة التحكم الشامل
 *
 * Application Service للتحكم الشامل في قاعدة البيانات
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type { Table, TableSchema, QueryResult, ApiResponse } from '../types'

class DatabaseControlService {
  /**
   * تنفيذ Query
   */
  async executeQuery(query: string, params?: Record<string, unknown>): Promise<QueryResult> {
    const response = await apiClient.post<ApiResponse<QueryResult>>(
      DATABASE_CORE_ENDPOINTS.DATABASE.QUERY,
      { query, params }
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to execute query')
    }

    return response.data
  }

  /**
   * الحصول على جميع الجداول
   */
  async getTables(): Promise<Table[]> {
    const response = await apiClient.get<ApiResponse<{ tables: Table[] }>>(
      DATABASE_CORE_ENDPOINTS.DATABASE.TABLES
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get tables')
    }

    return (response.data as { tables: Table[] }).tables
  }

  /**
   * الحصول على Table Schema
   */
  async getTableSchema(tableName: string): Promise<TableSchema> {
    const response = await apiClient.get<ApiResponse<TableSchema>>(
      DATABASE_CORE_ENDPOINTS.DATABASE.TABLE_SCHEMA(tableName)
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get table schema')
    }

    return response.data
  }

  /**
   * الحصول على Table Data
   */
  async getTableData(
    tableName: string,
    options?: { page?: number; perPage?: number; filters?: Record<string, unknown> }
  ): Promise<QueryResult> {
    const response = await apiClient.get<ApiResponse<QueryResult>>(
      DATABASE_CORE_ENDPOINTS.DATABASE.TABLE_DATA(tableName),
      { params: options }
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get table data')
    }

    return response.data
  }
}

export const databaseControlService = new DatabaseControlService()
