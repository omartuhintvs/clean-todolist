import { create } from 'zustand';
import { Todo } from '@domain/entities/Todo';

// Store state interface
interface TodoStoreState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
}

// Store actions
interface TodoStoreActions {
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  removeTodo: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export type TodoStore = TodoStoreState & TodoStoreActions;

export const useTodoStore = create<TodoStore>((set) => ({
  // Initial state
  todos: [],
  isLoading: false,
  error: null,

  // Actions
  setTodos: (todos) => set({ todos, error: null }),

  addTodo: (todo) =>
    set((state) => ({ todos: [todo, ...state.todos], error: null })),

  updateTodo: (todo) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todo.id ? todo : t)),
      error: null,
    })),

  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
      error: null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),
}));
