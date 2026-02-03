/**
 * Domain Interfaces - واجهات المجال
 *
 * جميع الواجهات المستخدمة في المجال
 */

export { IDatabaseAdapter } from './IDatabaseAdapter'
export { IPolicyEngine, type PolicyCheckParams } from './IPolicyEngine'
export { IAuditLogger, type AuditLogParams } from './IAuditLogger'
export { IDatabaseConnectionManager } from './IDatabaseConnectionManager'
export { IDatabaseRouter } from './IDatabaseRouter'
export { IAuthenticationClient, type UserInfo, type PermissionInfo } from './IAuthenticationClient'
export {
  ITransactionManager,
  type TransactionOptions,
  type TransactionInfo,
  TransactionStatus,
} from './ITransactionManager'
