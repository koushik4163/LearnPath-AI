import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const initials = (user?.name || user?.email || 'U')[0].toUpperCase();

  return (
    <nav className="bg-[#1B1B1B]/90 border-b border-white/10 sticky top-0 z-50 backdrop-blur">
      <div className="px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <h1
          onClick={() => navigate('/dashboard')}
          className="text-xl font-bold text-[#F2EDE6] cursor-pointer select-none"
        >
          🎯 LearnPath AI
        </h1>

        <div className="hidden md:flex items-center gap-1" />

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/goal-setup')}
            className="bg-[#F08A4B] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#DE7C40] transition"
          >
            ✨ New Goal
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg text-sm font-medium text-[#F08A4B] hover:bg-white/10 transition"
          >
            🚪 Logout
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-8 h-8 bg-white/10 text-white rounded-full text-sm font-bold flex items-center justify-center hover:bg-white/20 transition"
          >
            {initials}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block w-5 h-0.5 bg-[#B9B1A7] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#B9B1A7] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#B9B1A7] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#1B1B1B] px-6 py-4 space-y-1">
          <button
            onClick={() => { navigate('/profile'); setMenuOpen(false); }}
            className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-[#B9B1A7] hover:bg-white/5"
          >
            👤 Profile
          </button>
          <button
            onClick={() => { navigate('/goal-setup'); setMenuOpen(false); }}
            className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-[#B9B1A7] hover:bg-white/5"
          >
            ✨ New Goal
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-[#F08A4B] hover:bg-white/10"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
}