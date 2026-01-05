import { Todo } from '@domain/entities/Todo';
import { ITodoRepository } from '@domain/interfaces/ITodoRepository';

export class ToggleTodoStatusUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);

    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    // Use domain logic to toggle status
    if (todo.isPending()) {
      todo.complete();
    } else {
      todo.uncomplete();
    }

    return this.todoRepository.update(todo);
  }
}
