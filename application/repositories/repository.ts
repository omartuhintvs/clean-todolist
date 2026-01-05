import { IRepository } from '../interfaces/repository.interface';

/**
 * Base Repository class
 * All repositories should extend this base class
 */
export abstract class Repository implements IRepository {
  protected baseUrl?: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Handle repository errors consistently
   */
  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}
