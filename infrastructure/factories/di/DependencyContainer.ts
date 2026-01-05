import { ITodoRepository } from '@domain/interfaces/ITodoRepository';
import { InMemoryTodoRepository } from '@infrastructure/adapters/repositories/InMemoryTodoRepository';
import { GetAllTodosUseCase } from '@application/use-cases/GetAllTodosUseCase';
import { CreateTodoUseCase } from '@application/use-cases/CreateTodoUseCase';
import { UpdateTodoUseCase } from '@application/use-cases/UpdateTodoUseCase';
import { DeleteTodoUseCase } from '@application/use-cases/DeleteTodoUseCase';
import { ToggleTodoStatusUseCase } from '@application/use-cases/ToggleTodoStatusUseCase';

class DependencyContainer {
  private static instance: DependencyContainer;
  private _todoRepository: ITodoRepository;

  private constructor() {
    // Initialize repositories
    this._todoRepository = new InMemoryTodoRepository();
  }

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  // Repository getter
  get todoRepository(): ITodoRepository {
    return this._todoRepository;
  }

  // Use case factories
  getAllTodosUseCase(): GetAllTodosUseCase {
    return new GetAllTodosUseCase(this._todoRepository);
  }

  createTodoUseCase(): CreateTodoUseCase {
    return new CreateTodoUseCase(this._todoRepository);
  }

  updateTodoUseCase(): UpdateTodoUseCase {
    return new UpdateTodoUseCase(this._todoRepository);
  }

  deleteTodoUseCase(): DeleteTodoUseCase {
    return new DeleteTodoUseCase(this._todoRepository);
  }

  toggleTodoStatusUseCase(): ToggleTodoStatusUseCase {
    return new ToggleTodoStatusUseCase(this._todoRepository);
  }
}

export default DependencyContainer;
