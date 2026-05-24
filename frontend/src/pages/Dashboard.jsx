import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/roadmap/my').catch(() => null),
      api.get('/progress/me').catch(() => null),
    ]).then(([r, p]) => {
      setRoadmap(r?.data || null);
      setProgress(p?.data || null);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-500
        border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
         Welcome back, {user?.name || user?.email}! 👋
        </h2>
          <p className="text-gray-500 mt-1">
            Here's your learning overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Current Streak', value: `${progress?.current_streak || 0} 🔥`, color: 'orange' },
            { label: 'Tasks Done', value: progress?.total_tasks_done || 0, color: 'green' },
            { label: 'Week', value: roadmap ? `Week ${roadmap.current_week || 1}` : '—', color: 'indigo' },
            { label: 'Longest Streak', value: `${progress?.longest_streak || 0} 🏆`, color: 'purple' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl
              border p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-800">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        {!roadmap ? (
          <div className="bg-indigo-50 border border-indigo-200
            rounded-2xl p-8 text-center">
            <p className="text-4xl mb-4">🚀</p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No roadmap yet!
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Tell us your goal and we'll build a personalized
              learning plan for you.
            </p>
            <button onClick={() => navigate('/goal-setup')}
              className="bg-indigo-600 text-white px-6 py-3
                rounded-lg font-semibold hover:bg-indigo-700
                transition">
              Create My Roadmap ✨
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '📋', label: "Today's Tasks", desc: 'Complete your daily learning tasks', path: '/tasks', color: 'indigo' },
              { icon: '🗺️', label: 'My Roadmap', desc: 'View your full learning plan', path: '/roadmap', color: 'purple' },
              { icon: '🧠', label: 'Take a Quiz', desc: 'Test what you have learned today', path: '/quiz', color: 'green' },
              { icon: '📊', label: 'My Progress', desc: 'View streaks, scores and charts', path: '/progress', color: 'orange' },
              { icon: '🎓', label: 'My Certificate', desc: 'Download your completion certificate', path: '/certificate', color: 'blue' },
            ].map((item, i) => (
              <button key={i} onClick={() => navigate(item.path)}
                className="bg-white rounded-xl border p-5 text-left
                  hover:shadow-md hover:border-indigo-300
                  transition flex items-start gap-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.label}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}