# Architecture Documentation

## Overview

This project implements the **Onion Architecture** pattern, which ensures clean separation of concerns and testable, maintainable code. The architecture follows the **dependency inversion principle** where all dependencies point inward toward the domain core.

## Layer Breakdown

### 1. Domain Layer (Core)
**Location**: `/domain`

The innermost layer containing pure business logic with **zero external dependencies**.

#### Files:
- `domain/entities/Todo.ts` - Todo entity with business methods
- `domain/interfaces/ITodoRepository.ts` - Repository contract
- `domain/types/TodoStatus.ts` - Domain value types

#### Responsibilities:
- Define business entities and their behavior
- Enforce business rules and validation
- Declare abstractions (interfaces) that outer layers implement

#### Example:
```typescript
export class Todo {
  complete(): void {
    if (!this.canBeCompleted()) {
      throw new Error('Todo cannot be completed');
    }
    this.status = TODO_STATUS.COMPLETED;
    this.updatedAt = new Date();
  }
}
```

**Key Point**: No imports from React, Next.js, or any external library!

---

### 2. Application Layer (Use Cases)
**Location**: `/application`

Orchestrates the flow of data between the domain and infrastructure layers.

#### Files:
- `application/use-cases/GetAllTodosUseCase.ts`
- `application/use-cases/CreateTodoUseCase.ts`
- `application/use-cases/UpdateTodoUseCase.ts`
- `application/use-cases/DeleteTodoUseCase.ts`
- `application/use-cases/ToggleTodoStatusUseCase.ts`
- `application/dtos/CreateTodoRequest.ts`
- `application/dtos/UpdateTodoRequest.ts`

#### Responsibilities:
- Define application-specific business rules
- Coordinate between domain entities
- Use repository interfaces (not implementations)
- Transform data using DTOs

#### Example:
```typescript
export class CreateTodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(request: CreateTodoRequest): Promise<Todo> {
    const todo = new Todo(
      this.generateId(),
      request.title.trim(),
      request.description.trim(),
      TODO_STATUS.PENDING,
      new Date(),
      new Date()
    );

    return this.todoRepository.create(todo);
  }
}
```

**Key Point**: Depends only on domain layer interfaces, not implementations!

---

### 3. Infrastructure Layer (Implementation Details)
**Location**: `/infrastructure`

Implements the abstractions defined in the domain layer.

#### Files:
- `infrastructure/repositories/InMemoryTodoRepository.ts` - ITodoRepository implementation
- `infrastructure/stores/TodoStore.ts` - Zustand state management
- `infrastructure/di/DependencyContainer.ts` - Dependency injection container

#### Responsibilities:
- Implement repository interfaces
- Manage application state (Zustand)
- Handle data persistence
- Provide dependency injection

#### Example:
```typescript
export class InMemoryTodoRepository implements ITodoRepository {
  private todos: Map<string, Todo> = new Map();

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values());
  }

  async create(todo: Todo): Promise<Todo> {
    this.todos.set(todo.id, todo);
    return todo;
  }
}
```

**Key Point**: Infrastructure depends on domain interfaces, not the other way around!

---

### 4. Presentation Layer (UI)
**Location**: `/presentation` and `/app`

The outermost layer that users interact with.

#### Files:
- `presentation/components/CreateTodoForm.tsx`
- `presentation/components/TodoItem.tsx`
- `presentation/components/TodoList.tsx`
- `presentation/hooks/useTodos.ts`
- `app/page.tsx`

#### Responsibilities:
- Render UI components
- Handle user interactions
- Display data from use cases
- Manage component-level state

#### Example:
```typescript
export function useTodos() {
  const container = DependencyContainer.getInstance();

  const createTodo = async (request: CreateTodoRequest) => {
    const useCase = container.createTodoUseCase();
    const todo = await useCase.execute(request);
    addTodo(todo);
  };

  return { createTodo };
}
```

**Key Point**: Presentation depends on all layers but is replaceable (could be mobile, CLI, etc.)!

---

## Dependency Flow

```
┌──────────────────────────────────────────────────┐
│          Presentation Layer                      │
│  - React Components                              │
│  - Custom Hooks                                  │
│  - Next.js Pages                                 │
│                                                  │
│  Depends on: Application, Infrastructure, Domain │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│         Infrastructure Layer                     │
│  - Repository Implementations                    │
│  - State Management (Zustand)                    │
│  - Dependency Injection                          │
│                                                  │
│  Depends on: Domain                              │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│          Application Layer                       │
│  - Use Cases                                     │
│  - DTOs                                          │
│                                                  │
│  Depends on: Domain                              │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│            Domain Layer                          │
│  - Entities                                      │
│  - Interfaces                                    │
│  - Types                                         │
│                                                  │
│  Depends on: NOTHING                             │
└──────────────────────────────────────────────────┘
```

## Data Flow Example: Creating a Todo

1. **User Action** (Presentation Layer)
   - User fills form in `CreateTodoForm.tsx`
   - Clicks "Add Todo" button

2. **Hook Invocation** (Presentation Layer)
   - `useTodos.createTodo()` is called
   - Hook retrieves `CreateTodoUseCase` from DI container

3. **Use Case Execution** (Application Layer)
   - `CreateTodoUseCase.execute()` runs
   - Creates new `Todo` entity with business rules
   - Calls `todoRepository.create()`

4. **Repository Persistence** (Infrastructure Layer)
   - `InMemoryTodoRepository.create()` stores todo
   - Returns the created todo

5. **State Update** (Infrastructure Layer)
   - Zustand store is updated with new todo
   - Store notifies subscribers

6. **UI Re-render** (Presentation Layer)
   - Components subscribed to store re-render
   - New todo appears in the list

## Benefits of This Architecture

### 1. Testability
- **Domain**: Test pure business logic without mocks
- **Application**: Test use cases with simple repository mocks
- **Infrastructure**: Test implementations against interfaces
- **Presentation**: Test components with mocked hooks

### 2. Flexibility
- Swap in-memory repository for API without changing use cases
- Replace React with Vue without touching business logic
- Change state management without affecting domain

### 3. Maintainability
- Clear boundaries between layers
- Single responsibility for each class
- Easy to locate and fix bugs

### 4. Scalability
- Add new use cases without affecting existing ones
- Extend entities without breaking implementations
- Team members can work on different layers independently

## Best Practices Followed

### 1. Single Responsibility Principle
Each use case does exactly one thing:
- `CreateTodoUseCase` - Only creates todos
- `UpdateTodoUseCase` - Only updates todos
- `DeleteTodoUseCase` - Only deletes todos

### 2. Dependency Inversion
- Domain defines interfaces
- Infrastructure implements them
- Application uses interfaces, not implementations

### 3. Separation of Concerns
- Domain: Business rules
- Application: Orchestration
- Infrastructure: Technical implementation
- Presentation: User interaction

### 4. Don't Repeat Yourself (DRY)
- Business logic in one place (domain entities)
- Repository interface defines contract once
- Use cases reuse domain methods

## Testing Strategy

### Domain Layer Tests
```typescript
describe('Todo', () => {
  it('completes a pending todo', () => {
    const todo = new Todo('1', 'Test', '', 'pending', new Date(), new Date());
    todo.complete();
    expect(todo.status).toBe('completed');
  });

  it('throws error when completing completed todo', () => {
    const todo = new Todo('1', 'Test', '', 'completed', new Date(), new Date());
    expect(() => todo.complete()).toThrow();
  });
});
```

### Application Layer Tests
```typescript
describe('CreateTodoUseCase', () => {
  it('creates a todo with pending status', async () => {
    const mockRepo = {
      create: jest.fn(todo => Promise.resolve(todo))
    };
    const useCase = new CreateTodoUseCase(mockRepo);

    const todo = await useCase.execute({ title: 'Test', description: '' });

    expect(todo.status).toBe('pending');
    expect(mockRepo.create).toHaveBeenCalled();
  });
});
```

## File Organization Checklist

- ✅ Domain has no imports from other layers
- ✅ Application only imports from domain
- ✅ Infrastructure implements domain interfaces
- ✅ Presentation coordinates everything
- ✅ Each use case has a single responsibility
- ✅ Business logic is in entities, not use cases
- ✅ Interfaces defined in domain, implemented in infrastructure

## Common Pitfalls to Avoid

1. ❌ **Don't** put business logic in use cases
   - ✅ Put it in domain entities

2. ❌ **Don't** import infrastructure in domain
   - ✅ Define interfaces in domain, implement in infrastructure

3. ❌ **Don't** use concrete repository in use cases
   - ✅ Use the repository interface

4. ❌ **Don't** make components call repositories directly
   - ✅ Use hooks that call use cases

5. ❌ **Don't** put validation in presentation layer
   - ✅ Put it in domain entities

## Extending the Application

### Adding a New Feature: Todo Priority

1. **Domain Layer**: Add priority to entity
```typescript
// domain/entities/Todo.ts
export class Todo {
  constructor(
    public priority: 'low' | 'medium' | 'high',
    // ... other fields
  ) {}

  increasePriority(): void {
    // Business logic here
  }
}
```

2. **Application Layer**: Create use case
```typescript
// application/use-cases/ChangeTodoPriorityUseCase.ts
export class ChangeTodoPriorityUseCase {
  async execute(id: string, priority: string): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    todo.priority = priority;
    return this.todoRepository.update(todo);
  }
}
```

3. **Infrastructure Layer**: No changes needed!
4. **Presentation Layer**: Add UI for priority

## Summary

This architecture ensures:
- **Clean separation** of concerns
- **Testable** business logic
- **Flexible** implementation swapping
- **Maintainable** codebase
- **Scalable** structure

The key is: **Dependencies point inward**, and **business logic is protected** in the domain core.
