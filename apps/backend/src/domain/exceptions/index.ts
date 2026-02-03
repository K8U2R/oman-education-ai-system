/**
 * Domain Exceptions - استثناءات المجال
 *
 * Export جميع Domain Exceptions
 */

export {
  AuthError,
  AuthenticationFailedError,
  UserNotFoundError,
  UserAlreadyExistsError,
  InvalidTokenError,
  TokenExpiredError,
  UnauthorizedError,
  AccountNotVerifiedError,
  AccountDisabledError,
  RegistrationFailedError,
  RateLimitExceededError,
  VerificationTokenExpiredError,
  VerificationTokenInvalidError,
  VerificationTokenAlreadyUsedError,
  EmailAlreadyVerifiedError,
} from "./AuthExceptions";

// Export from Value Objects
export { InvalidEmailError } from "../value-objects/Email";
export { InvalidPasswordError } from "../value-objects/Password";

// Export Database Exceptions
export {
  DatabaseError,
  DatabaseConnectionError,
  DatabaseQueryError,
  DatabaseTimeoutError,
  DatabaseTransactionError,
} from "./DatabaseExceptions";

// Export Configuration Exceptions
export {
  ConfigurationError,
  MissingConfigurationError,
  InvalidConfigurationError,
} from "./ConfigurationExceptions";

// Export Validation Exceptions
export { ValidationError } from "./ValidationExceptions";

// Export Email Exceptions
export {
  EmailError,
  EmailConnectionError,
  EmailSendError,
  EmailConfigurationError,
  EmailValidationError,
} from "./EmailExceptions";

// Export OAuth Exceptions
export {
  OAuthError,
  OAuthStateExpiredError,
  OAuthStateInvalidError,
  OAuthCodeExchangeError,
  OAuthUserInfoError,
  OAuthProviderNotSupportedError,
} from "./OAuthExceptions";

// Export Notification Exceptions
export {
  NotificationError,
  NotificationNotFoundError,
  NotificationAccessDeniedError,
  NotificationCreationFailedError,
  NotificationUpdateFailedError,
  NotificationDeleteFailedError,
} from "./NotificationExceptions";
