import { Todo } from '@domain/entities/Todo';
import { ITodoRepository } from '@domain/interfaces/ITodoRepository';
import { CreateTodoRequest } from '@application/dtos/CreateTodoRequest';
import { TODO_STATUS } from '@domain/types/TodoStatus';

export class CreateTodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(request: CreateTodoRequest): Promise<Todo> {
    // Validate input
    if (!request.title.trim()) {
      throw new Error('Title cannot be empty');
    }

    // Create domain entity
    const todo = new Todo(
      this.generateId(),
      request.title.trim(),
      request.description.trim(),
      TODO_STATUS.PENDING,
      new Date(),
      new Date()
    );

    // Persist through abstraction
    return this.todoRepository.create(todo);
  }

  private generateId(): string {
    return `todo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
