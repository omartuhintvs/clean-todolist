# Folder Architecture - BYO-DPP Structure

## Overview

This project follows the **BYO-DPP (Build Your Own Digital Product Passport)** architecture pattern, which is an enterprise-grade implementation of Clean Architecture with additional abstraction layers using the **Invoker Pattern**.

### Key Architectural Patterns

1. **Invoker Pattern**: Runtime dependency resolution through invokers (repository, service, logic)
2. **Service-Oriented**: Services replace traditional use-cases for better scalability
3. **DTO Mapping**: Clear separation between domain entities and data transfer objects
4. **Dependency Injection**: Centralized dependency management through factories and providers

## Root Project Structure

```
project-root/
├── app/                                # Next.js App Router
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── application/                        # Application Layer
│   ├── in-dtos/                        # Input Data Transfer Objects
│   │   ├── CreateTodoRequest.ts
│   │   └── UpdateTodoRequest.ts
│   ├── interfaces/                     # Application interfaces
│   │   ├── dependency-invoker.interface.ts
│   │   └── repository.interface.ts
│   ├── providers/                      # Dependency providers
│   │   └── app-dependency.provider.ts
│   ├── repositories/                   # Repository layer (NOT in infrastructure!)
│   │   ├── repository.ts               # Base repository class
│   │   ├── repository.invoker.ts       # Repository invoker
│   │   └── todos/                      # Todo repository module
│   │       ├── InMemoryTodoRepository.ts
│   │       ├── requests/               # API request DTOs
│   │       └── responses/              # API response DTOs
│   ├── services/                       # Service layer (replaces use-cases)
│   │   ├── service.invoker.ts          # Service invoker
│   │   └── todo/                       # Todo service module
│   │       ├── in-dtos/                # Service input DTOs
│   │       │   ├── create-todo.dto.ts
│   │       │   └── update-todo.dto.ts
│   │       ├── out-dtos/               # Service output DTOs
│   │       │   └── todo-response.dto.ts
│   │       ├── mappers/                # Entity-DTO mappers
│   │       │   └── todo.mapper.ts
│   │       └── todo.service.ts         # Todo service
│   ├── store/                          # State management (Zustand)
│   │   └── TodoStore.ts
│   └── constants/                      # Application constants
├── components/                         # React Components
│   ├── feature/                        # Feature-specific components
│   │   └── todos/
│   │       ├── TodoList.tsx
│   │       └── CreateTodoForm.tsx
│   ├── shared/                         # Shared components
│   │   └── TodoItem.tsx
│   └── page-components/                # Page-level components
├── config/                             # Application configuration
│   └── index.ts
├── constants/                          # Global constants
│   └── index.ts
├── context/                            # React contexts
├── domain/                             # Domain Layer (Pure business logic)
│   ├── constants/                      # Domain constants
│   ├── entities/                       # Domain entities
│   │   └── Todo.ts
│   ├── enums/                          # Domain enumerations
│   │   ├── todo-status.enum.ts
│   │   └── index.ts
│   ├── interfaces/                     # Domain interfaces
│   │   ├── ITodoRepository.ts
│   │   └── dependency-invoker.interface.ts
│   ├── invokers/                       # Domain logic invokers
│   │   └── logic.invoker.ts
│   ├── logics/                         # Business logic classes
│   └── types/                          # Domain types
│       └── TodoStatus.ts               # (Legacy - moved to enums)
├── hooks/                              # Custom React hooks
│   └── useTodos.ts
├── infrastructure/                     # Infrastructure Layer
│   ├── adapters/                       # External adapters
│   │   ├── api-client/                 # HTTP client adapters
│   │   ├── store/                      # State management adapters
│   │   └── validators/                 # Validation adapters
│   ├── factories/                      # Dependency factories
│   │   ├── app-dependency.factory.ts   # Main factory
│   │   ├── core-dependency.factory.ts  # Core dependencies
│   │   └── di/                         # (Legacy DI - replaced by invokers)
│   └── libs/                           # Third-party library wrappers
├── presentation/                       # Presentation interfaces
│   └── interfaces/
├── public/                             # Static assets
├── services/                           # External service integrations
│   └── index.ts
├── types/                              # Shared TypeScript types
│   └── index.ts
├── utils/                              # Utility functions
│   └── index.ts
├── .gitignore
├── ARCHITECTURE.md                     # Onion Architecture documentation
├── FOLDER_ARCHITECTURE.md              # This file
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Layer Descriptions

### 1. Domain Layer (`/domain`)
**The core - Pure business logic with ZERO external dependencies**

```
domain/
├── constants/          # Domain-level constants
├── entities/           # Business objects with methods
│   └── Todo.ts
├── enums/              # Domain enumerations
│   └── todo-status.enum.ts
├── interfaces/         # Contracts for outer layers
│   ├── ITodoRepository.ts
│   └── dependency-invoker.interface.ts
├── invokers/           # Logic invokers for business rules
│   └── logic.invoker.ts
├── logics/             # Complex business logic classes
└── types/              # Domain type definitions
```

**Rules:**
- No framework imports (React, Next.js, etc.)
- No infrastructure dependencies
- Pure TypeScript/JavaScript only
- Contains all business rules and validation

### 2. Application Layer (`/application`)
**Orchestration - Services, repositories, and DTOs**

```
application/
├── in-dtos/            # Input DTOs (from clients)
├── interfaces/         # Application-level interfaces
│   ├── dependency-invoker.interface.ts
│   └── repository.interface.ts
├── providers/          # Dependency registration
│   └── app-dependency.provider.ts
├── repositories/       # Repository implementations (YES, in application!)
│   ├── repository.ts   # Base class
│   ├── repository.invoker.ts  # Invoker pattern
│   └── todos/
│       ├── InMemoryTodoRepository.ts
│       ├── requests/   # API request DTOs
│       └── responses/  # API response DTOs
├── services/           # Service layer (replaces use-cases)
│   ├── service.invoker.ts
│   └── todo/
│       ├── in-dtos/    # Service input DTOs
│       ├── out-dtos/   # Service output DTOs
│       ├── mappers/    # Entity ↔ DTO mappers
│       └── todo.service.ts
├── store/              # State management
│   └── TodoStore.ts
└── constants/          # Application constants
```

**Rules:**
- Depends ONLY on domain layer
- Uses interfaces from domain
- Implements business orchestration
- Framework-agnostic

**Important**: In BYO-DPP, repositories live in the application layer, NOT infrastructure!

### 3. Infrastructure Layer (`/infrastructure`)
**External dependencies and technical implementations**

```
infrastructure/
├── adapters/           # Adapter pattern for external libs
│   ├── api-client/     # HTTP clients (Axios, Fetch)
│   ├── store/          # State management adapters
│   └── validators/     # Validation library adapters
├── factories/          # Dependency creation factories
│   ├── app-dependency.factory.ts  # Main factory
│   └── core-dependency.factory.ts
└── libs/               # Third-party library wrappers
```

**Rules:**
- Wraps third-party libraries
- Implements adapters
- Provides factories for dependency creation
- NO business logic

### 4. UI Layer (`/components`, `/app`, `/hooks`)
**User interface and interactions**

```
components/
├── feature/            # Feature-specific UI
│   └── todos/
├── shared/             # Reusable components
└── page-components/    # Page-level components

app/                    # Next.js App Router
├── layout.tsx
└── page.tsx

hooks/                  # Custom React hooks
└── useTodos.ts         # Bridge to application layer via invokers
```

**Rules:**
- Can use all layers via hooks
- Uses service invoker pattern
- Thin layer - delegates to services
- Framework-specific (React, Next.js)

### 5. Presentation Layer (`/presentation`)
**Minimal presentation interfaces**

```
presentation/
└── interfaces/         # Presentation-layer interfaces
```

**Note**: In BYO-DPP, this is minimal. Most UI lives in `/components`.

## The Invoker Pattern

### What is the Invoker Pattern?

The invoker pattern provides **runtime dependency resolution** through a registry system. Instead of direct instantiation, dependencies are:

1. **Registered** in providers
2. **Invoked** through invokers
3. **Resolved** at runtime

### Three Types of Invokers

#### 1. Repository Invoker
```typescript
// application/repositories/repository.invoker.ts
const repositoryInvoker = RepositoryInvoker.getInstance();
const todoRepo = repositoryInvoker.invoke<ITodoRepository>('todoRepository');
```

#### 2. Service Invoker
```typescript
// application/services/service.invoker.ts
const serviceInvoker = ServiceInvoker.getInstance();
const todoService = serviceInvoker.invoke<TodoService>('todoService');
```

#### 3. Logic Invoker
```typescript
// domain/invokers/logic.invoker.ts
const logicInvoker = LogicInvoker.getInstance();
const businessLogic = logicInvoker.invoke<SomeLogic>('todoLogic');
```

### Why Use Invokers?

✅ **Runtime flexibility** - Swap implementations without code changes
✅ **Centralized dependency management** - Single source of truth
✅ **Testability** - Easy to mock dependencies
✅ **Scalability** - Supports plugin architectures
✅ **Enterprise-ready** - Handles complex dependency graphs

## Dependency Flow

```
┌─────────────────────────────────────────────────┐
│  UI Layer (Components, Hooks)                   │
│  ↓ uses ServiceInvoker                          │
├─────────────────────────────────────────────────┤
│  Application Layer (Services, Repositories)     │
│  ↓ Services use RepositoryInvoker               │
│  ↓ Repositories implement domain interfaces     │
├─────────────────────────────────────────────────┤
│  Infrastructure Layer (Factories, Adapters)     │
│  ↓ Factories register dependencies              │
│  ↓ Adapters wrap external libraries             │
├─────────────────────────────────────────────────┤
│  Domain Layer (Entities, Interfaces, Enums)     │
│  ↓ depends on NOTHING                           │
└─────────────────────────────────────────────────┘
```

**Key Principle**: Dependencies point INWARD. Inner layers define interfaces, outer layers implement them.

## Service vs Use Case

### BYO-DPP Uses Services (NOT Use Cases)

**Traditional Clean Architecture:**
```
application/
└── use-cases/
    ├── CreateTodoUseCase.ts
    ├── UpdateTodoUseCase.ts
    └── DeleteTodoUseCase.ts
```

**BYO-DPP Pattern:**
```
application/
└── services/
    └── todo/
        ├── todo.service.ts  ← All operations in one service
        ├── in-dtos/
        ├── out-dtos/
        └── mappers/
```

**Why Services?**
- ✅ Better cohesion - related operations grouped
- ✅ Easier to maintain - one service per domain
- ✅ Enterprise scalability - services can have sub-services
- ✅ Clearer boundaries - service = feature

## DTO Pattern

### Three Types of DTOs

#### 1. Input DTOs (`in-dtos/`)
Data coming INTO the application
```typescript
// application/services/todo/in-dtos/create-todo.dto.ts
export interface CreateTodoDTO {
  title: string;
  description: string;
}
```

#### 2. Output DTOs (`out-dtos/`)
Data going OUT of the application
```typescript
// application/services/todo/out-dtos/todo-response.dto.ts
export interface TodoResponseDTO {
  id: string;
  title: string;
  status: string;
  createdAt: string;  // ← Serialized for transport
}
```

#### 3. Request/Response DTOs
For repository-level API calls
```
application/repositories/todos/
├── requests/   # HTTP request DTOs
└── responses/  # HTTP response DTOs
```

### Mapper Pattern

Mappers convert between domain entities and DTOs:

```typescript
// application/services/todo/mappers/todo.mapper.ts
export class TodoMapper {
  static toResponseDTO(todo: Todo): TodoResponseDTO {
    return {
      id: todo.id,
      title: todo.title,
      status: todo.status,
      createdAt: todo.createdAt.toISOString(),
    };
  }
}
```

**Why Mappers?**
- Keep domain pure (no serialization logic in entities)
- Transform types (Date → string)
- Hide internal details
- Version API responses independently

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Services** | `{feature}.service.ts` | `todo.service.ts` |
| **Repositories** | `{Implementation}{Feature}Repository.ts` | `InMemoryTodoRepository.ts` |
| **Invokers** | `{type}.invoker.ts` | `repository.invoker.ts` |
| **DTOs** | `{action}-{entity}.dto.ts` | `create-todo.dto.ts` |
| **Mappers** | `{entity}.mapper.ts` | `todo.mapper.ts` |
| **Entities** | PascalCase | `Todo.ts` |
| **Enums** | `{entity}-{name}.enum.ts` | `todo-status.enum.ts` |
| **Interfaces** | `I{Name}.ts` or `{name}.interface.ts` | `ITodoRepository.ts` |

## How Data Flows (Example: Create Todo)

1. **User Action** (UI Layer)
   ```typescript
   // components/feature/todos/CreateTodoForm.tsx
   await createTodo({ title: 'New Todo', description: 'Description' });
   ```

2. **Hook Invokes Service** (Hooks Layer)
   ```typescript
   // hooks/useTodos.ts
   const service = serviceInvoker.invoke<TodoService>('todoService');
   const todoDTO = await service.createTodo(dto);
   ```

3. **Service Processes** (Application Layer)
   ```typescript
   // application/services/todo/todo.service.ts
   const todo = new Todo(...);  // Create domain entity
   const created = await todoRepository.create(todo);
   return TodoMapper.toResponseDTO(created);
   ```

4. **Repository Persists** (Application Layer)
   ```typescript
   // application/repositories/todos/InMemoryTodoRepository.ts
   this.todos.set(todo.id, todo);
   return todo;
   ```

5. **State Updates** (Application Layer)
   ```typescript
   // application/store/TodoStore.ts
   addTodo(todo);  // Zustand store updates
   ```

6. **UI Re-renders** (UI Layer)
   ```typescript
   // Components re-render with new data
   ```

## Best Practices

### 1. Always Use Invokers
```typescript
// ✅ GOOD - Use invoker pattern
const service = serviceInvoker.invoke<TodoService>('todoService');

// ❌ BAD - Direct instantiation
const service = new TodoService(repository);
```

### 2. Keep Services Cohesive
```typescript
// ✅ GOOD - One service per domain aggregate
export class TodoService {
  getAllTodos() {}
  createTodo() {}
  updateTodo() {}
  deleteTodo() {}
}

// ❌ BAD - Fragmented use cases
export class GetAllTodosUseCase {}
export class CreateTodoUseCase {}
export class UpdateTodoUseCase {}
```

### 3. Use Mappers for DTO Conversion
```typescript
// ✅ GOOD - Mapper handles conversion
return TodoMapper.toResponseDTO(todo);

// ❌ BAD - Manual mapping in service
return {
  id: todo.id,
  title: todo.title,
  // ...
};
```

### 4. Repositories in Application Layer
```
// ✅ GOOD - BYO-DPP structure
application/
└── repositories/
    └── todos/
        └── InMemoryTodoRepository.ts

// ❌ BAD - Traditional clean arch (not BYO-DPP)
infrastructure/
└── repositories/
```

### 5. Register Dependencies in Providers
```typescript
// ✅ GOOD - Centralized registration
// application/providers/app-dependency.provider.ts
export class AppDependencyProvider {
  static initialize() {
    repositoryInvoker.register('todoRepository', new InMemoryTodoRepository());
    serviceInvoker.register('todoService', new TodoService(todoRepository));
  }
}
```

## Testing Strategy

### Domain Layer
- Unit tests only
- No mocks (pure functions)
- Test business rules directly

### Application Layer
- Unit tests with mocked repositories
- Test service orchestration
- Test mappers

### Infrastructure Layer
- Integration tests
- Test actual adapters
- Test factory registrations

### UI Layer
- Component tests
- Mock service invoker
- Test user interactions

## Migration from Use Cases to Services

If you have existing use-cases, migrate to services:

### Before (Use Cases)
```
application/
├── use-cases/
│   ├── CreateTodoUseCase.ts
│   ├── UpdateTodoUseCase.ts
│   └── DeleteTodoUseCase.ts
└── dtos/
    └── CreateTodoRequest.ts
```

### After (Services)
```
application/
├── services/
│   └── todo/
│       ├── todo.service.ts
│       ├── in-dtos/
│       ├── out-dtos/
│       └── mappers/
└── in-dtos/  ← Renamed from dtos
```

## Quick Reference

| Layer | Location | Key Files | Purpose |
|-------|----------|-----------|---------|
| **Domain** | `/domain` | entities, enums, interfaces, invokers | Business rules & logic |
| **Application** | `/application` | services, repositories, store | Orchestration & data flow |
| **Infrastructure** | `/infrastructure` | factories, adapters, libs | External dependencies |
| **UI** | `/components`, `/app`, `/hooks` | components, hooks | User interface |
| **Presentation** | `/presentation` | interfaces | Presentation contracts |

## Summary

The BYO-DPP architecture provides:
- **Enterprise-grade** dependency management via invokers
- **Service-oriented** architecture for better scalability
- **Clear separation** with DTO mappers
- **Framework independence** of business logic
- **Testable** and **maintainable** codebase

### Key Differences from Traditional Clean Architecture:
1. ✅ **Invoker pattern** for runtime dependency resolution
2. ✅ **Services** instead of use-cases
3. ✅ **Repositories in application layer** (not infrastructure)
4. ✅ **DTO mappers** for clean entity-DTO separation
5. ✅ **Providers** for centralized dependency registration

This structure is battle-tested in enterprise applications and scales from small projects to large distributed systems.
