/**
 * DatabaseAdapterFactory - مصنع Adapters قاعدة البيانات
 *
 * مصنع لإنشاء Adapters مختلفة حسب نوع المزود
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import {
  DatabaseProvider,
  DatabaseConnectionConfig,
} from '../../domain/types/database-connection.types'
import { SupabaseAdapter } from './SupabaseAdapter'
// Note: PostgreSQLAdapter and MySQLAdapter are imported dynamically to avoid dependency issues
import { logger } from '../../shared/utils/logger'

/**
 * مصنع Adapters قاعدة البيانات
 */
export class DatabaseAdapterFactory {
  /**
   * إنشاء Adapter حسب نوع المزود
   */
  static async createAdapter(
    provider: DatabaseProvider,
    config: DatabaseConnectionConfig['config']
  ): Promise<IDatabaseAdapter> {
    switch (provider) {
      case DatabaseProvider.SUPABASE:
        return this.createSupabaseAdapter(config)

      case DatabaseProvider.POSTGRESQL:
        return await this.createPostgreSQLAdapter(config)

      case DatabaseProvider.MYSQL:
        return await this.createMySQLAdapter(config)

      case DatabaseProvider.MONGODB:
        return await this.createMongoDBAdapter(config)

      case DatabaseProvider.SQLITE:
        try {
          return await this.createSQLiteAdapter(config)
        } catch (error) {
          logger.error('Failed to create SQLite adapter', {
            error: error instanceof Error ? error.message : String(error),
          })
          throw new Error(
            `SQLite adapter requires better-sqlite3. Please install it with: npm install better-sqlite3\n` +
              `Original error: ${error instanceof Error ? error.message : String(error)}`
          )
        }

      default:
        throw new Error(`Unsupported database provider: ${provider}`)
    }
  }

  /**
   * إنشاء Supabase Adapter
   */
  private static createSupabaseAdapter(
    config: DatabaseConnectionConfig['config']
  ): IDatabaseAdapter {
    const url = config.url
    const serviceRoleKey = config.serviceRoleKey

    if (!url || !serviceRoleKey) {
      throw new Error('Supabase configuration is missing. Please provide url and serviceRoleKey.')
    }

    logger.info('Creating Supabase adapter', { url: url.substring(0, 20) + '...' })
    return new SupabaseAdapter(url, serviceRoleKey)
  }

  /**
   * إنشاء PostgreSQL Adapter
   */
  private static async createPostgreSQLAdapter(
    config: DatabaseConnectionConfig['config']
  ): Promise<IDatabaseAdapter> {
    // Dynamic import لتجنب مشاكل التبعيات
    const { PostgreSQLAdapter } = await import('./PostgreSQLAdapter')

    const host = config.host
    const port = config.port
    const database = config.database
    const username = config.username
    const password = config.password

    if (!host || !database || !username || !password) {
      throw new Error(
        'PostgreSQL configuration is missing. Please provide host, database, username, and password.'
      )
    }

    logger.info('Creating PostgreSQL adapter', { host, port, database })

    return new PostgreSQLAdapter({
      host,
      port,
      database,
      username,
      password,
      poolSize: config.poolSize,
      timeout: config.timeout,
    })
  }

  /**
   * إنشاء MySQL Adapter
   */
  private static async createMySQLAdapter(
    config: DatabaseConnectionConfig['config']
  ): Promise<IDatabaseAdapter> {
    // Dynamic import لتجنب مشاكل التبعيات
    const { MySQLAdapter } = await import('./MySQLAdapter')

    const host = config.host
    const port = config.port
    const database = config.database
    const username = config.username
    const password = config.password

    if (!host || !database || !username || !password) {
      throw new Error(
        'MySQL configuration is missing. Please provide host, database, username, and password.'
      )
    }

    logger.info('Creating MySQL adapter', { host, port, database })

    return new MySQLAdapter({
      host,
      port: port || 3306,
      database,
      username,
      password,
      poolSize: config.poolSize,
      timeout: config.timeout,
    })
  }

  /**
   * إنشاء MongoDB Adapter
   */
  private static async createMongoDBAdapter(
    config: DatabaseConnectionConfig['config']
  ): Promise<IDatabaseAdapter> {
    // Dynamic import لتجنب مشاكل التبعيات
    const { MongoDBAdapter } = await import('./MongoDBAdapter')

    const connectionString = config.url
    const database = config.database
    const host = config.host
    const port = config.port
    const username = config.username
    const password = config.password

    if (!database) {
      throw new Error('MongoDB configuration is missing. Please provide database name.')
    }

    logger.info('Creating MongoDB adapter', { database, host, port })

    return new MongoDBAdapter({
      connectionString,
      host,
      port: port || 27017,
      database,
      username,
      password,
      poolSize: config.poolSize,
      timeout: config.timeout,
    })
  }

  /**
   * إنشاء SQLite Adapter
   */
  private static async createSQLiteAdapter(
    config: DatabaseConnectionConfig['config']
  ): Promise<IDatabaseAdapter> {
    // Dynamic import لتجنب مشاكل التبعيات
    const { SQLiteAdapter } = await import('./SQLiteAdapter')

    const database = config.database

    if (!database) {
      throw new Error('SQLite configuration is missing. Please provide database file path.')
    }

    logger.info('Creating SQLite adapter', { database })

    return new SQLiteAdapter({
      database,
      readOnly: false,
      timeout: config.timeout,
    })
  }
}
