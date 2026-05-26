import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PRIMARY_NAV = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/roadmap', icon: '🗺️', label: 'Roadmap' },
  { path: '/tasks', icon: '📋', label: 'Tasks' },
];

const SECONDARY_NAV = [
  { path: '/quiz', icon: '🧠', label: 'Quiz' },
  { path: '/progress', icon: '📊', label: 'Progress' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-full md:h-full pt-6">
      <div className="flex flex-col gap-6 md:sticky md:top-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg">
            🎯
          </div>
          <div>
            <div className="text-[#F2EDE6] font-semibold text-2xl" style={{ fontFamily: '"Fraunces", serif' }}>
              LearnPath AI
            </div>
            <p className="text-xs text-[#8A857C]">Personalized learning space</p>
          </div>
        </div>
        <div className="panel p-5 md:min-h-[70vh] flex flex-col gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8A857C] mb-3">Learning</p>
            <nav className="flex gap-2 md:flex-col md:gap-2 overflow-x-auto md:overflow-visible">
              {PRIMARY_NAV.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-[#B9B1A7] hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`h-6 w-1 rounded-full ${isActive ? 'bg-[#F08A4B]' : 'bg-transparent'}`} />
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8A857C] mb-3">Insights</p>
            <nav className="flex gap-2 md:flex-col md:gap-2 overflow-x-auto md:overflow-visible">
              {SECONDARY_NAV.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-[#B9B1A7] hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`h-6 w-1 rounded-full ${isActive ? 'bg-[#7C8CFF]' : 'bg-transparent'}`} />
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto">
            <div className="panel-outline p-4">
              <p className="text-xs text-[#8A857C]">Next milestone</p>
              <p className="text-sm font-semibold text-[#F2EDE6] mt-2">Plan your next week</p>
              <NavLink
                to="/goal-setup"
                className="mt-3 w-full inline-flex items-center justify-center bg-[#F08A4B] text-white py-2 rounded-lg text-xs font-semibold hover:bg-[#DE7C40] transition"
              >
                New Goal
              </NavLink>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-semibold text-[#F2EDE6] hover:bg-white/10 transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
