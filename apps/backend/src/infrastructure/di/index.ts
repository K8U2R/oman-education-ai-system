/**
 * Dependency Injection Module
 *
 * Export DI Container and Service Registry
 */

export {
  container,
  Container,
  type ServiceFactory,
  type ServiceScope,
} from "./Container.js";
export { registerServices, initializeServices } from "./ServiceRegistry.js";
