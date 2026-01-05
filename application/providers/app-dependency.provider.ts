import { RepositoryInvoker } from '../repositories/repository.invoker';
import { ServiceInvoker } from '../services/service.invoker';
import { InMemoryTodoRepository } from '../repositories/todos/InMemoryTodoRepository';
import { TodoService } from '../services/todo/todo.service';

/**
 * Application Dependency Provider
 * Registers all repositories and services
 * Follows BYO-DPP dependency injection pattern
 */
export class AppDependencyProvider {
  private static initialized = false;

  /**
   * Initialize and register all dependencies
   */
  static initialize(): void {
    if (this.initialized) {
      return;
    }

    // Initialize invokers
    const repositoryInvoker = RepositoryInvoker.getInstance();
    const serviceInvoker = ServiceInvoker.getInstance();

    // Register repositories
    const todoRepository = new InMemoryTodoRepository();
    repositoryInvoker.register('todoRepository', todoRepository);

    // Register services
    const todoService = new TodoService(todoRepository);
    serviceInvoker.register('todoService', todoService);

    this.initialized = true;
  }

  /**
   * Get repository invoker instance
   */
  static getRepositoryInvoker(): RepositoryInvoker {
    this.initialize();
    return RepositoryInvoker.getInstance();
  }

  /**
   * Get service invoker instance
   */
  static getServiceInvoker(): ServiceInvoker {
    this.initialize();
    return ServiceInvoker.getInstance();
  }

  /**
   * Reset all dependencies (useful for testing)
   */
  static reset(): void {
    RepositoryInvoker.getInstance().clear();
    ServiceInvoker.getInstance().clear();
    this.initialized = false;
  }
}
