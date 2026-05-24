import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: '🏠', label: 'Home' },
  { path: '/roadmap', icon: '🗺️', label: 'Roadmap' },
  { path: '/tasks', icon: '📋', label: 'Tasks' },
  { path: '/quiz', icon: '🧠', label: 'Quiz' },
  { path: '/progress', icon: '📊', label: 'Progress' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = (user?.name || user?.email || 'U')[0].toUpperCase();

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <h1
          onClick={() => navigate('/dashboard')}
          className="text-xl font-bold text-indigo-600 cursor-pointer select-none"
        >
          🎯 LearnPath AI
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/goal-setup')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            ✨ New Goal
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            🚪 Logout
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold flex items-center justify-center hover:bg-indigo-200 transition"
          >
            {initials}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-6 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <div className="border-t pt-3 mt-3 space-y-1">
            <button
              onClick={() => { navigate('/profile'); setMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              👤 Profile
            </button>
            <button
              onClick={() => { navigate('/goal-setup'); setMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              ✨ New Goal
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}