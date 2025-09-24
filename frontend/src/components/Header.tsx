import { Link } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth';
import { MSALService } from '../services/oauth';

export default function Header() {
  const { isAuthenticated, user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await MSALService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: clear local state and redirect
      window.location.href = '/auth/login';
    }
  };

  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>
      </nav>

      <div className="flex items-center gap-4">
        {isAuthenticated && user && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Welcome, {user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
