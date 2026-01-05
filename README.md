# DPP Todo List - Onion Architecture Demo

A simple todo list application built with **Next.js 15**, **React 19**, **TypeScript**, and **Zustand**, following the **Onion Architecture** pattern used in the DPP (Digital Product Passport) platform.

## Architecture Overview

This project demonstrates clean architecture principles with clear separation of concerns across four layers:

```
┌─────────────────────────────────────────────┐
│        Presentation Layer                   │
│     (React Components, Hooks)               │
├─────────────────────────────────────────────┤
│        Application Layer                    │
│     (Use Cases, DTOs)                       │
├─────────────────────────────────────────────┤
│        Domain Layer                         │
│     (Entities, Business Logic)              │
├─────────────────────────────────────────────┤
│        Infrastructure Layer                 │
│     (Repositories, State Management)        │
└─────────────────────────────────────────────┘
```

### Dependency Rule
Dependencies flow **inward**: Each layer depends only on layers below it. The domain layer has zero external dependencies.

## Project Structure

```
dpp-todolist/
├── domain/                          # Core business logic (no dependencies)
│   ├── entities/
│   │   └── Todo.ts                 # Todo entity with business rules
│   ├── interfaces/
│   │   └── ITodoRepository.ts      # Repository contract
│   └── types/
│       └── TodoStatus.ts           # Domain types
│
├── application/                     # Use cases (depends on domain only)
│   ├── use-cases/
│   │   ├── GetAllTodosUseCase.ts
│   │   ├── CreateTodoUseCase.ts
│   │   ├── UpdateTodoUseCase.ts
│   │   ├── DeleteTodoUseCase.ts
│   │   └── ToggleTodoStatusUseCase.ts
│   └── dtos/
│       ├── CreateTodoRequest.ts
│       └── UpdateTodoRequest.ts
│
├── infrastructure/                  # Implementation details
│   ├── repositories/
│   │   └── InMemoryTodoRepository.ts  # ITodoRepository implementation
│   ├── stores/
│   │   └── TodoStore.ts            # Zustand state management
│   └── di/
│       └── DependencyContainer.ts  # Dependency injection
│
├── presentation/                    # UI layer
│   ├── components/
│   │   ├── CreateTodoForm.tsx
│   │   ├── TodoItem.tsx
│   │   └── TodoList.tsx
│   └── hooks/
│       └── useTodos.ts             # Custom hook for todo operations
│
└── app/
    └── page.tsx                    # Main page
```

## Key Features

### Domain Layer (Pure Business Logic)
- **Todo Entity**: Contains business rules like validation, status changes
- **No external dependencies**: Can be tested without any framework
- **Business methods**: `complete()`, `uncomplete()`, `updateTitle()`, etc.

### Application Layer (Use Cases)
- **Single Responsibility**: Each use case does one thing
- **Framework agnostic**: Can work with any UI or data source
- **Testable**: Easy to mock dependencies

### Infrastructure Layer (Implementation)
- **Repository Pattern**: Abstracts data storage
- **Zustand Store**: Manages UI state
- **Dependency Injection**: Wires up dependencies

### Presentation Layer (UI)
- **React Components**: Built with Tailwind CSS
- **Custom Hooks**: Encapsulate business logic interaction
- **Separation of Concerns**: Components are simple and focused

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5.7 |
| State Management | Zustand 5 |
| Styling | Tailwind CSS 4 |
| Architecture | Onion Architecture |

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
cd ~/tvs/dpp-todolist
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build

```bash
pnpm build
pnpm start
```

## How It Works

### Creating a Todo

```
User fills form
  └─> CreateTodoForm.tsx (Presentation)
      └─> useTodos.createTodo() (Hook)
          └─> CreateTodoUseCase.execute() (Application)
              └─> Todo entity created (Domain)
                  └─> InMemoryTodoRepository.create() (Infrastructure)
                      └─> Zustand store updated
                          └─> UI re-renders
```

### Architecture Benefits

1. **Testability**: Pure business logic can be tested without UI or database
2. **Flexibility**: Easy to swap implementations (e.g., API instead of in-memory)
3. **Maintainability**: Clear boundaries and single responsibility
4. **Scalability**: Can grow complex features without tangling code
5. **Team Collaboration**: Clear layers make code ownership easier

## Example: Domain Logic

The `Todo` entity contains all business rules:

```typescript
// domain/entities/Todo.ts
export class Todo {
  complete(): void {
    if (!this.canBeCompleted()) {
      throw new Error('Todo cannot be completed');
    }
    this.status = TODO_STATUS.COMPLETED;
    this.updatedAt = new Date();
  }

  canBeCompleted(): boolean {
    return this.status === TODO_STATUS.PENDING &&
           this.title.trim().length > 0;
  }
}
```

No dependencies on React, Next.js, or any external library!

## Path Aliases

The project uses TypeScript path aliases for clean imports:

```typescript
import { Todo } from '@domain/entities/Todo';
import { CreateTodoUseCase } from '@application/use-cases/CreateTodoUseCase';
import { InMemoryTodoRepository } from '@infrastructure/repositories/InMemoryTodoRepository';
import { useTodos } from '@presentation/hooks/useTodos';
```

## Future Enhancements

- Replace in-memory repository with API client
- Add unit tests for domain entities
- Add integration tests for use cases
- Implement local storage persistence
- Add todo categories and tags
- Add date picker for due dates
- Add filtering and sorting

## Learn More

This architecture is based on:
- [Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [DDD (Domain-Driven Design)](https://martinfowler.com/bliki/DomainDrivenDesign.html)

## License

MIT
