import { ITodoRepository } from '@domain/interfaces/ITodoRepository';
import { Todo } from '@domain/entities/Todo';

export class InMemoryTodoRepository implements ITodoRepository {
  private todos: Map<string, Todo> = new Map();

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todos.get(id) || null;
  }

  async create(todo: Todo): Promise<Todo> {
    this.todos.set(todo.id, todo);
    return todo;
  }

  async update(todo: Todo): Promise<Todo> {
    if (!this.todos.has(todo.id)) {
      throw new Error(`Todo with id ${todo.id} not found`);
    }
    this.todos.set(todo.id, todo);
    return todo;
  }

  async delete(id: string): Promise<void> {
    if (!this.todos.has(id)) {
      throw new Error(`Todo with id ${id} not found`);
    }
    this.todos.delete(id);
  }
}
