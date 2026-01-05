import { TodoStatus, TODO_STATUS } from '@domain/types/TodoStatus';

export class Todo {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public status: TodoStatus,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  // Pure business logic - no dependencies
  canBeCompleted(): boolean {
    return this.status === TODO_STATUS.PENDING && this.title.trim().length > 0;
  }

  canBeUncompleted(): boolean {
    return this.status === TODO_STATUS.COMPLETED;
  }

  complete(): void {
    if (!this.canBeCompleted()) {
      throw new Error('Todo cannot be completed');
    }
    this.status = TODO_STATUS.COMPLETED;
    this.updatedAt = new Date();
  }

  uncomplete(): void {
    if (!this.canBeUncompleted()) {
      throw new Error('Todo is not completed');
    }
    this.status = TODO_STATUS.PENDING;
    this.updatedAt = new Date();
  }

  updateTitle(newTitle: string): void {
    if (newTitle.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    this.title = newTitle.trim();
    this.updatedAt = new Date();
  }

  updateDescription(newDescription: string): void {
    this.description = newDescription.trim();
    this.updatedAt = new Date();
  }

  isCompleted(): boolean {
    return this.status === TODO_STATUS.COMPLETED;
  }

  isPending(): boolean {
    return this.status === TODO_STATUS.PENDING;
  }
}
