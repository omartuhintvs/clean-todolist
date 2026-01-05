import { CreateTodoForm } from '@presentation/components/CreateTodoForm';
import { TodoList } from '@presentation/components/TodoList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo List</h1>
          <p className="text-gray-600">Built with Onion Architecture</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Todo</h2>
            <CreateTodoForm />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Todos</h2>
            <TodoList />
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-600">
          <p>Following DPP Frontend Architecture</p>
          <p className="mt-1">Domain → Application → Infrastructure → Presentation</p>
        </footer>
      </div>
    </div>
  );
}
