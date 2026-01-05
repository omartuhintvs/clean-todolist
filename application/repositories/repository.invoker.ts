import { IDependencyInvoker } from '../interfaces/dependency-invoker.interface';

/**
 * Repository Invoker
 * Manages repository instance creation and invocation
 * Follows the BYO-DPP invoker pattern for runtime dependency resolution
 */
export class RepositoryInvoker implements IDependencyInvoker {
  private static instance: RepositoryInvoker;
  private repositories: Map<string, unknown> = new Map();

  private constructor() {}

  static getInstance(): RepositoryInvoker {
    if (!RepositoryInvoker.instance) {
      RepositoryInvoker.instance = new RepositoryInvoker();
    }
    return RepositoryInvoker.instance;
  }

  /**
   * Register a repository instance
   */
  register<T>(name: string, repository: T): void {
    this.repositories.set(name, repository);
  }

  /**
   * Invoke a repository synchronously
   */
  invoke<T>(repositoryName: string): T {
    const repository = this.repositories.get(repositoryName);
    if (!repository) {
      throw new Error(`Repository '${repositoryName}' not found. Did you register it?`);
    }
    return repository as T;
  }

  /**
   * Invoke a repository asynchronously
   */
  async invokeAsync<T>(repositoryName: string): Promise<T> {
    return Promise.resolve(this.invoke<T>(repositoryName));
  }

  /**
   * Check if repository is registered
   */
  has(repositoryName: string): boolean {
    return this.repositories.has(repositoryName);
  }

  /**
   * Clear all registered repositories (useful for testing)
   */
  clear(): void {
    this.repositories.clear();
  }
}
