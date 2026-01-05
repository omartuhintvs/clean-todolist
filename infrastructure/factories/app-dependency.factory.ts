import { AppDependencyProvider } from '@/application/providers/app-dependency.provider';
import { RepositoryInvoker } from '@/application/repositories/repository.invoker';
import { ServiceInvoker } from '@/application/services/service.invoker';
import { LogicInvoker } from '@/domain/invokers/logic.invoker';

/**
 * Application Dependency Factory
 * Central factory for accessing all application dependencies
 * Follows BYO-DPP factory pattern
 */
export class AppDependencyFactory {
  private static instance: AppDependencyFactory;

  private constructor() {
    // Initialize all providers
    AppDependencyProvider.initialize();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AppDependencyFactory {
    if (!AppDependencyFactory.instance) {
      AppDependencyFactory.instance = new AppDependencyFactory();
    }
    return AppDependencyFactory.instance;
  }

  /**
   * Get repository invoker
   */
  getRepositoryInvoker(): RepositoryInvoker {
    return AppDependencyProvider.getRepositoryInvoker();
  }

  /**
   * Get service invoker
   */
  getServiceInvoker(): ServiceInvoker {
    return AppDependencyProvider.getServiceInvoker();
  }

  /**
   * Get logic invoker
   */
  getLogicInvoker(): LogicInvoker {
    return LogicInvoker.getInstance();
  }

  /**
   * Reset all dependencies (for testing)
   */
  static reset(): void {
    AppDependencyProvider.reset();
    LogicInvoker.getInstance().clear();
  }
}
