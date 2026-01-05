import { Todo } from '@/domain/entities/Todo';
import { TodoResponseDTO } from '../out-dtos/todo-response.dto';

/**
 * Todo Mapper
 * Maps between domain entities and DTOs
 */
export class TodoMapper {
  /**
   * Map Todo entity to response DTO
   */
  static toResponseDTO(todo: Todo): TodoResponseDTO {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    };
  }

  /**
   * Map array of Todo entities to response DTOs
   */
  static toResponseDTOs(todos: Todo[]): TodoResponseDTO[] {
    return todos.map(this.toResponseDTO);
  }
}
