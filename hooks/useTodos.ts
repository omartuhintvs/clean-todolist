'use client';

import { useCallback, useEffect } from 'react';
import { useTodoStore } from '@/application/store/TodoStore';
import { AppDependencyFactory } from '@/infrastructure/factories/app-dependency.factory';
import { TodoService } from '@/application/services/todo/todo.service';
import { CreateTodoDTO } from '@/application/services/todo/in-dtos/create-todo.dto';
import { UpdateTodoDTO } from '@/application/services/todo/in-dtos/update-todo.dto';
import { Todo } from '@/domain/entities/Todo';
import { TodoMapper } from '@/application/services/todo/mappers/todo.mapper';

/**
 * useTodos Hook
 * Provides todo operations using the BYO-DPP service invoker pattern
 */
export function useTodos() {
  const { todos, isLoading, error, setTodos, addTodo, updateTodo, removeTodo, setLoading, setError } = useTodoStore();

  // Get service via invoker pattern
  const getTodoService = useCallback((): TodoService => {
    const factory = AppDependencyFactory.getInstance();
    const serviceInvoker = factory.getServiceInvoker();
    return serviceInvoker.invoke<TodoService>('todoService');
  }, []);

  // Load all todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      const service = getTodoService();
      const todoDTOs = await service.getAllTodos();

      // Convert DTOs to domain entities
      const todos = todoDTOs.map(dto =>
        new Todo(dto.id, dto.title, dto.description, dto.status, new Date(dto.createdAt), new Date(dto.updatedAt))
      );

      setTodos(todos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [getTodoService, setTodos, setLoading, setError]);

  const createTodo = useCallback(
    async (dto: CreateTodoDTO) => {
      try {
        setLoading(true);
        const service = getTodoService();
        const todoDTO = await service.createTodo(dto);

        const todo = new Todo(
          todoDTO.id,
          todoDTO.title,
          todoDTO.description,
          todoDTO.status,
          new Date(todoDTO.createdAt),
          new Date(todoDTO.updatedAt)
        );

        addTodo(todo);
        return todo;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create todo');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getTodoService, addTodo, setLoading, setError]
  );

  const updateTodoItem = useCallback(
    async (id: string, dto: UpdateTodoDTO) => {
      try {
        setLoading(true);
        const service = getTodoService();
        const todoDTO = await service.updateTodo(id, dto);

        const todo = new Todo(
          todoDTO.id,
          todoDTO.title,
          todoDTO.description,
          todoDTO.status,
          new Date(todoDTO.createdAt),
          new Date(todoDTO.updatedAt)
        );

        updateTodo(todo);
        return todo;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update todo');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getTodoService, updateTodo, setLoading, setError]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const service = getTodoService();
        await service.deleteTodo(id);
        removeTodo(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete todo');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getTodoService, removeTodo, setLoading, setError]
  );

  const toggleTodoStatus = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const service = getTodoService();
        const todoDTO = await service.toggleTodoStatus(id);

        const todo = new Todo(
          todoDTO.id,
          todoDTO.title,
          todoDTO.description,
          todoDTO.status,
          new Date(todoDTO.createdAt),
          new Date(todoDTO.updatedAt)
        );

        updateTodo(todo);
        return todo;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to toggle todo status');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getTodoService, updateTodo, setLoading, setError]
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
