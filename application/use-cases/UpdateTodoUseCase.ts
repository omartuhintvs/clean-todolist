import { Todo } from '@domain/entities/Todo';
import { ITodoRepository } from '@domain/interfaces/ITodoRepository';
import { UpdateTodoRequest } from '@application/dtos/UpdateTodoRequest';

export class UpdateTodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(request: UpdateTodoRequest): Promise<Todo> {
    const todo = await this.todoRepository.findById(request.id);

    if (!todo) {
      throw new Error(`Todo with id ${request.id} not found`);
    }

    // Update using domain methods
    if (request.title !== undefined) {
      todo.updateTitle(request.title);
    }

    if (request.description !== undefined) {
      todo.updateDescription(request.description);
    }

    return this.todoRepository.update(todo);
  }
}
