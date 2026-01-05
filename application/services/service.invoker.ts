import { IDependencyInvoker } from '../interfaces/dependency-invoker.interface';

/**
 * Service Invoker
 * Manages service instance creation and invocation
 * Follows the BYO-DPP invoker pattern for runtime dependency resolution
 */
export class ServiceInvoker implements IDependencyInvoker {
  private static instance: ServiceInvoker;
  private services: Map<string, unknown> = new Map();

  private constructor() {}

  static getInstance(): ServiceInvoker {
    if (!ServiceInvoker.instance) {
      ServiceInvoker.instance = new ServiceInvoker();
    }
    return ServiceInvoker.instance;
  }

  /**
   * Register a service instance
   */
  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  /**
   * Invoke a service synchronously
   */
  invoke<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found. Did you register it?`);
    }
    return service as T;
  }

  /**
   * Invoke a service asynchronously
   */
  async invokeAsync<T>(serviceName: string): Promise<T> {
    return Promise.resolve(this.invoke<T>(serviceName));
  }

  /**
   * Check if service is registered
   */
  has(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  /**
   * Clear all registered services (useful for testing)
   */
  clear(): void {
    this.services.clear();
  }
}
