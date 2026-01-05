export interface IDependencyInvoker {
  invoke<T>(dependencyName: string, ...args: unknown[]): T;
  invokeAsync<T>(dependencyName: string, ...args: unknown[]): Promise<T>;
}
