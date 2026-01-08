# DPP Todo List - BYO-DPP Architecture Demo

A simple todo list application built with **Next.js 15**, **React 19**, **TypeScript**, and **Zustand**, following the **BYO-DPP (Build Your Own Digital Product Passport)** enterprise architecture pattern.

## Architecture Overview

This project demonstrates the BYO-DPP architecture pattern - an enterprise-grade implementation of Clean Architecture with the **Invoker Pattern** for runtime dependency resolution.

```
┌─────────────────────────────────────────────┐
│        UI Layer                             │
│     (React Components, Hooks)               │
│     ↓ uses ServiceInvoker                   │
├─────────────────────────────────────────────┤
│        Application Layer                    │
│     (Services, Repositories, DTOs)          │
│     ↓ Services use RepositoryInvoker        │
├─────────────────────────────────────────────┤
│        Infrastructure Layer                 │
│     (Factories, Adapters)                   │
│     ↓ Registers dependencies                │
├─────────────────────────────────────────────┤
│        Domain Layer                         │
│     (Entities, Business Logic)              │
│     ↓ depends on NOTHING                    │
└─────────────────────────────────────────────┘
```

### Key Architectural Patterns

1. **Invoker Pattern** - Runtime dependency resolution through invokers
2. **Service-Oriented** - Services replace traditional use-cases for better cohesion
3. **DTO Mapping** - Clean separation between domain entities and data transfer objects
4. **Dependency Injection** - Centralized dependency management via providers and factories

### Dependency Rule
Dependencies flow **inward**: Each layer depends only on layers below it. The domain layer has zero external dependencies.

## Project Structure

```
dpp-todolist/
├── domain/                          # Core business logic (zero dependencies)
│   ├── entities/
│   │   └── Todo.ts                  # Todo entity with business rules
│   ├── enums/
│   │   └── todo-status.enum.ts      # Domain enumerations
│   ├── interfaces/
│   │   ├── ITodoRepository.ts       # Repository contract
│   │   └── dependency-invoker.interface.ts
│   ├── invokers/
│   │   └── logic.invoker.ts         # Domain logic invoker
│   └── types/
│       └── TodoStatus.ts            # Domain types
│
├── application/                     # Application layer (depends on domain only)
│   ├── services/                    # Services (replace use-cases)
│   │   ├── service.invoker.ts       # Service invoker
│   │   └── todo/
│   │       ├── todo.service.ts      # Todo service (all operations)
│   │       ├── in-dtos/             # Input DTOs
│   │       ├── out-dtos/            # Output DTOs
│   │       └── mappers/
│   │           └── todo.mapper.ts   # Entity ↔ DTO mapper
│   ├── repositories/                # Repository implementations
│   │   ├── repository.ts            # Base repository class
│   │   ├── repository.invoker.ts    # Repository invoker
│   │   └── todos/
│   │       └── InMemoryTodoRepository.ts
│   ├── providers/
│   │   └── app-dependency.provider.ts  # Dependency registration
│   ├── interfaces/
│   │   ├── dependency-invoker.interface.ts
│   │   └── repository.interface.ts
│   ├── store/
│   │   └── TodoStore.ts             # Zustand state management
│   └── in-dtos/
│       ├── CreateTodoRequest.ts
│       └── UpdateTodoRequest.ts
│
├── infrastructure/                  # Technical implementations
│   └── factories/
│       └── app-dependency.factory.ts   # Dependency factory
│
├── components/                      # UI components
│   ├── feature/
│   │   └── todos/
│   │       ├── CreateTodoForm.tsx
│   │       └── TodoList.tsx
│   └── shared/
│       └── TodoItem.tsx
│
├── hooks/
│   └── useTodos.ts                  # Custom hook using invoker pattern
│
└── app/
    └── page.tsx                     # Main page
```

## Key Features

### Domain Layer (Pure Business Logic)
- **Todo Entity**: Contains business rules like validation, status changes
- **No external dependencies**: Can be tested without any framework
- **Business methods**: `complete()`, `markAsPending()`, `updateTitle()`, etc.
- **Enums**: TodoStatus enum for type-safe status values

### Application Layer (Services & Repositories)
- **TodoService**: Centralized service for all todo operations
- **DTO Mappers**: Convert between domain entities and DTOs
- **Repository Invoker**: Runtime dependency resolution for repositories
- **Service Invoker**: Runtime dependency resolution for services
- **Repositories in Application**: Following BYO-DPP pattern (not in infrastructure!)

### Infrastructure Layer (Factories & Adapters)
- **AppDependencyFactory**: Central factory for accessing dependencies
- **Providers**: Register and initialize all dependencies
- **Clean separation**: No business logic, only wiring

### UI Layer (Components & Hooks)
- **React Components**: Built with Tailwind CSS
- **Custom Hooks**: Use service invoker pattern to access business logic
- **Separation of Concerns**: Components are simple and focused

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5.7 |
| State Management | Zustand 5 |
| Styling | Tailwind CSS 4 |
| Architecture | BYO-DPP (Clean Architecture + Invoker Pattern) |

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

### Creating a Todo (BYO-DPP Flow)

```
User fills form
  └─> CreateTodoForm.tsx (UI Layer)
      └─> useTodos.createTodo() (Hook)
          └─> ServiceInvoker.invoke('todoService') (Invoker)
              └─> TodoService.createTodo() (Application)
                  └─> Todo entity created (Domain)
                      └─> TodoMapper.toResponseDTO() (Mapper)
                          └─> InMemoryTodoRepository.create() (Application)
                              └─> Zustand store updated
                                  └─> UI re-renders
```

### The Invoker Pattern

Instead of direct instantiation, dependencies are resolved at runtime:

```typescript
// Get service via invoker
const factory = AppDependencyFactory.getInstance();
const serviceInvoker = factory.getServiceInvoker();
const todoService = serviceInvoker.invoke<TodoService>('todoService');

// Use service
const todoDTO = await todoService.createTodo({ title: 'New Todo', description: '' });
```

**Benefits:**
- Runtime flexibility - swap implementations without code changes
- Centralized dependency management
- Easy to mock for testing
- Supports plugin architectures

### Architecture Benefits

1. **Enterprise-Ready**: Invoker pattern supports complex dependency graphs
2. **Testability**: Pure business logic, easy mocking via invokers
3. **Flexibility**: Swap implementations at runtime
4. **Maintainability**: Service-oriented with clear boundaries
5. **Scalability**: Services can have sub-services, supports large systems
6. **Team Collaboration**: Clear layers and patterns

## Example: Service Layer

The `TodoService` centralizes all todo operations:

```typescript
// application/services/todo/todo.service.ts
export class TodoService {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async createTodo(dto: CreateTodoDTO): Promise<TodoResponseDTO> {
    const todo = new Todo(...);  // Create domain entity
    const created = await this.todoRepository.create(todo);
    return TodoMapper.toResponseDTO(created);  // Map to DTO
  }

  async getAllTodos(): Promise<TodoResponseDTO[]> {
    const todos = await this.todoRepository.findAll();
    return todos.map(TodoMapper.toResponseDTO);
  }
}
```

All operations in one cohesive service, with clean DTO mapping!

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

  markAsPending(): void {
    this.status = TODO_STATUS.PENDING;
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
import { Todo } from '@/domain/entities/Todo';
import { TodoService } from '@/application/services/todo/todo.service';
import { InMemoryTodoRepository } from '@/application/repositories/todos/InMemoryTodoRepository';
import { AppDependencyFactory } from '@/infrastructure/factories/app-dependency.factory';
```

## BYO-DPP vs Traditional Clean Architecture

| Aspect | Traditional Clean Arch | BYO-DPP Pattern |
|--------|----------------------|-----------------|
| Business Logic | Use Cases | Services |
| Dependency Resolution | Direct injection | Invoker pattern |
| Repository Location | Infrastructure layer | Application layer |
| DTO Handling | Manual mapping | Dedicated mappers |
| Flexibility | Compile-time | Runtime |

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed Onion Architecture explanation
- **[FOLDER_ARCHITECTURE.md](./FOLDER_ARCHITECTURE.md)** - Complete BYO-DPP structure guide

## Future Enhancements

- Replace in-memory repository with API client
- Add unit tests for domain entities
- Add integration tests for services
- Implement local storage persistence
- Add todo categories and tags
- Add date picker for due dates
- Add filtering and sorting
- Implement authentication with user-specific todos

## Learn More

This architecture is based on:
- [BYO-DPP Reference Implementation](https://github.com/tvsltd/byo-dpp-frontend)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/)
- [DDD (Domain-Driven Design)](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)

## License

MIT

---

**Built with BYO-DPP architecture** - Enterprise-grade Clean Architecture with Invoker Pattern

