'use client';

import { useCallback, useEffect } from 'react';
import { useTodoStore } from '@infrastructure/store/TodoStore';
import DependencyContainer from '@infrastructure/factories/di/DependencyContainer';
import { CreateTodoRequest } from '@application/dtos/CreateTodoRequest';
import { UpdateTodoRequest } from '@application/dtos/UpdateTodoRequest';

export function useTodos() {
  const { todos, isLoading, error, setTodos, addTodo, updateTodo, removeTodo, setLoading, setError } = useTodoStore();
  const container = DependencyContainer.getInstance();

  // Load all todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      const useCase = container.getAllTodosUseCase();
      const todos = await useCase.execute();
      setTodos(todos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [container, setTodos, setLoading, setError]);

  const createTodo = useCallback(
    async (request: CreateTodoRequest) => {
      try {
        setLoading(true);
        const useCase = container.createTodoUseCase();
        const todo = await useCase.execute(request);
        addTodo(todo);
        return todo;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create todo');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [container, addTodo, setLoading, setError]
  );

  const updateTodoItem = useCallback(
    async (request: UpdateTodoRequest) => {
      try {
        setLoading(true);
        const useCase = container.updateTodoUseCase();
        const todo = await useCase.execute(request);
        updateTodo(todo);
        return todo;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update todo');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [container, updateTodo, setLoading, setError]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const useCase = container.deleteTodoUseCase();
        await useCase.execute(id);
        removeTodo(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete todo');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [container, removeTodo, setLoading, setError]
  );

  const toggleTodoStatus = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const useCase = container.toggleTodoStatusUseCase();
        const todo = await useCase.execute(id);
        updateTodo(todo);
        return todo;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to toggle todo status');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [container, updateTodo, setLoading, setError]
  );

  return {
    todos,
    isLoading,
    error,
    loadTodos,
    createTodo,
    updateTodo: updateTodoItem,
    deleteTodo,
    toggleTodoStatus,
  };
}
