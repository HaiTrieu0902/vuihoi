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
      window.location.href = '/auth/login';
    }
  };

  return (
    <header
      className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm"
      style={{ minHeight: 64 }}
    >
      <nav className="flex items-center gap-4">
        <button className="text-2xl text-gray-500 hover:text-gray-700 focus:outline-none mr-2" aria-label="Menu">
          <span className="material-icons">menu</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-800 tracking-wide">VuiHoi AI Platform</h1>
        <div className="px-2 font-medium text-gray-600">
          <Link to="/">Home</Link>
        </div>
      </nav>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-700">Hello, {user.name || user.email}</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 border border-gray-300">
              {user.name ? user.name[0] : 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors border border-gray-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <span className="text-base text-gray-500">Welcome, Guest</span>
        )}
      </div>
    </header>
  );
}
