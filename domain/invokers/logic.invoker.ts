import { IDependencyInvoker } from '../interfaces/dependency-invoker.interface';

/**
 * Logic Invoker
 * Manages business logic invocation
 * Follows the BYO-DPP invoker pattern for domain logic
 */
export class LogicInvoker implements IDependencyInvoker {
  private static instance: LogicInvoker;
  private logics: Map<string, unknown> = new Map();

  private constructor() {}

  static getInstance(): LogicInvoker {
    if (!LogicInvoker.instance) {
      LogicInvoker.instance = new LogicInvoker();
    }
    return LogicInvoker.instance;
  }

  /**
   * Register a logic instance
   */
  register<T>(name: string, logic: T): void {
    this.logics.set(name, logic);
  }

  /**
   * Invoke a logic synchronously
   */
  invoke<T>(logicName: string): T {
    const logic = this.logics.get(logicName);
    if (!logic) {
      throw new Error(`Logic '${logicName}' not found. Did you register it?`);
    }
    return logic as T;
  }

  /**
   * Invoke a logic asynchronously
   */
  async invokeAsync<T>(logicName: string): Promise<T> {
    return Promise.resolve(this.invoke<T>(logicName));
  }

  /**
   * Check if logic is registered
   */
  has(logicName: string): boolean {
    return this.logics.has(logicName);
  }

  /**
   * Clear all registered logics (useful for testing)
   */
  clear(): void {
    this.logics.clear();
  }
}
