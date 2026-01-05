'use client';

import { useState } from 'react';
import { Todo } from '@domain/entities/Todo';
import { useTodos } from '@presentation/hooks/useTodos';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const { updateTodo, deleteTodo, toggleTodoStatus, isLoading } = useTodos();

  const handleToggle = async () => {
    try {
      await toggleTodoStatus(todo.id);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todo.id);
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleSave = async () => {
    try {
      await updateTodo({
        id: todo.id,
        title: editTitle,
        description: editDescription,
      });
      setIsEditing(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading || !editTitle.trim()}
              className="flex-1 bg-green-600 text-white py-1 px-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 bg-gray-600 text-white py-1 px-3 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={todo.isCompleted()}
              onChange={handleToggle}
              disabled={isLoading}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1">
              <h3
                className={`text-lg font-semibold ${
                  todo.isCompleted() ? 'line-through text-gray-400' : 'text-gray-800'
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={`text-sm mt-1 ${
                    todo.isCompleted() ? 'line-through text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {todo.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span className={`px-2 py-1 rounded-full ${
                  todo.isCompleted()
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {todo.status}
                </span>
                <span>Created: {todo.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
