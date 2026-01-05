import { ITodoRepository } from '@/domain/interfaces/ITodoRepository';
import { Todo } from '@/domain/entities/Todo';
import { CreateTodoDTO } from './in-dtos/create-todo.dto';
import { UpdateTodoDTO } from './in-dtos/update-todo.dto';
import { TodoResponseDTO } from './out-dtos/todo-response.dto';
import { TodoMapper } from './mappers/todo.mapper';
import { TODO_STATUS } from '@/domain/enums';

/**
 * Todo Service
 * Handles business operations for todos
 * Replaces use-cases with service-oriented architecture
 */
export class TodoService {
  constructor(private readonly todoRepository: ITodoRepository) {}

  /**
   * Get all todos
   */
  async getAllTodos(): Promise<TodoResponseDTO[]> {
    const todos = await this.todoRepository.findAll();
    return todos.map(TodoMapper.toResponseDTO);
  }

  /**
   * Get todo by ID
   */
  async getTodoById(id: string): Promise<TodoResponseDTO | null> {
    const todo = await this.todoRepository.findById(id);
    return todo ? TodoMapper.toResponseDTO(todo) : null;
  }

  /**
   * Create a new todo
   */
  async createTodo(dto: CreateTodoDTO): Promise<TodoResponseDTO> {
    const todo = new Todo(
      this.generateId(),
      dto.title,
      dto.description,
      TODO_STATUS.PENDING,
      new Date(),
      new Date()
    );

    const createdTodo = await this.todoRepository.create(todo);
    return TodoMapper.toResponseDTO(createdTodo);
  }

  /**
   * Update an existing todo
   */
  async updateTodo(id: string, dto: UpdateTodoDTO): Promise<TodoResponseDTO> {
    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    if (dto.title !== undefined) {
      existingTodo.updateTitle(dto.title);
    }
    if (dto.description !== undefined) {
      existingTodo.updateDescription(dto.description);
    }

    const updatedTodo = await this.todoRepository.update(existingTodo);
    return TodoMapper.toResponseDTO(updatedTodo);
  }

  /**
   * Toggle todo status between pending and completed
   */
  async toggleTodoStatus(id: string): Promise<TodoResponseDTO> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    if (todo.status === TODO_STATUS.COMPLETED) {
      todo.markAsPending();
    } else {
      todo.complete();
    }

    const updatedTodo = await this.todoRepository.update(todo);
    return TodoMapper.toResponseDTO(updatedTodo);
  }

  /**
   * Delete a todo
   */
  async deleteTodo(id: string): Promise<void> {
    await this.todoRepository.delete(id);
  }

  /**
   * Generate unique ID for todos
   */
  private generateId(): string {
    return `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
