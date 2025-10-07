import { useTheme } from './ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/api';

export function Header({ user, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.logout();
      if (onLogout) onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary-light transition-colors"
            >
              <img src="/icons/icon-192.png" alt="Pie Tracker Logo" className="w-8 h-8" />
              <span>Pie Tracker</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-secondary text-sm"
                >
                  Dashboard
                </button>
                {user.isAdmin && (
                  <button
                    onClick={() => navigate('/users')}
                    className="btn btn-secondary text-sm"
                  >
                    Users
                  </button>
                )}
                <span className="text-gray-700 dark:text-gray-300">
                  {user.username}
                </span>
                <button onClick={handleLogout} className="btn btn-secondary text-sm">
                  Logout
                </button>
              </>
            )}

            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary text-sm"
              >
                Login
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
