import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Setup } from './pages/Setup';
import { Login } from './pages/Login';
import { Leaderboard } from './pages/Leaderboard';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { auth } from './utils/api';
import { initTheme } from './utils/theme';

function App() {
  const [user, setUser] = useState(null);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initTheme();
    checkAuth();
    createSnowflakes();
  }, []);

  const createSnowflakes = () => {
    const numFlakes = 50;
    const colors = ['#ffffff', '#d4f1f9', '#e8f8ff'];

    for (let i = 0; i < numFlakes; i++) {
      const flake = document.createElement('div');
      flake.classList.add('snowflake');
      flake.innerHTML = '❄';
      document.body.appendChild(flake);

      const size = Math.random() * 10 + 10 + 'px';
      flake.style.left = Math.random() * 100 + 'vw';
      flake.style.fontSize = size;
      flake.style.color = colors[Math.floor(Math.random() * colors.length)];
      flake.style.animationDuration = Math.random() * 3 + 2 + 's';
      flake.style.animationDelay = Math.random() * 5 + 's';
    }
  };

  const checkAuth = async () => {
    try {
      const [authResponse, setupResponse] = await Promise.all([
        auth.check(),
        auth.setupNeeded(),
      ]);

      if (authResponse.authenticated) {
        setUser(authResponse.user);
      }

      setSetupNeeded(setupResponse.setupNeeded);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🥧</div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (setupNeeded) {
    return (
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/setup" element={<Setup />} />
            <Route path="*" element={<Navigate to="/setup" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Leaderboard user={user} onLogout={handleLogout} />}
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/users"
            element={
              user ? (
                <Users user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
