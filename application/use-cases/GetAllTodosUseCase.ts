import { Todo } from '@domain/entities/Todo';
import { ITodoRepository } from '@domain/interfaces/ITodoRepository';

export class GetAllTodosUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }
}
