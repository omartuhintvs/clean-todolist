'use client';

import { useTodos } from '@/hooks/useTodos';
import { TodoItem } from '@/components/shared/TodoItem';

export function TodoList() {
  const { todos, isLoading, error } = useTodos();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading && todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="animate-pulse">Loading todos...</div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No todos yet. Create your first todo above!</p>
      </div>
    );
  }

  const pendingTodos = todos.filter((todo) => todo.isPending());
  const completedTodos = todos.filter((todo) => todo.isCompleted());

  return (
    <div className="space-y-6">
      {pendingTodos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Pending ({pendingTodos.length})
          </h2>
          <div className="space-y-3">
            {pendingTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      )}

      {completedTodos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Completed ({completedTodos.length})
          </h2>
          <div className="space-y-3">
            {completedTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
