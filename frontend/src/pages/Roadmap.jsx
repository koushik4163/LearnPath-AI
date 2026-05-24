import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import RoadmapTimeline from '../components/RoadmapTimeline';
import api from '../api/axios';

export default function Roadmap() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockMsg, setUnlockMsg] = useState('');
  const [unlockError, setUnlockError] = useState('');

  useEffect(() => {
    api.get('/roadmap/my')
      .then(res => setRoadmap(res.data))
      .catch(() => navigate('/goal-setup'))
      .finally(() => setLoading(false));
  }, []);

  const handleUnlockNextWeek = async () => {
    setUnlocking(true);
    setUnlockMsg('');
    setUnlockError('');
    try {
      const res = await api.post('/roadmap/unlock-next-week');
      setUnlockMsg(res.data.message);
      // Refresh roadmap
      const updated = await api.get('/roadmap/my');
      setRoadmap(updated.data);
    } catch (err) {
      setUnlockError(err.response?.data?.detail || 'Failed to unlock next week');
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const plan = roadmap?.generated_plan;
  const currentWeek = roadmap?.current_week || 1;
  const totalWeeks = roadmap?.duration_weeks || 4;
  const isLastWeek = currentWeek >= totalWeeks;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Goal Banner */}
        <div className="bg-indigo-600 text-white rounded-2xl p-6 mb-6">
          <p className="text-indigo-200 text-sm mb-1">Your Goal</p>
          <h2 className="text-xl font-bold">{roadmap?.goal}</h2>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-indigo-200">
            <span>⏱ {totalWeeks} weeks total</span>
            <span>📍 Currently on Week {currentWeek}</span>
            <span>🧠 {roadmap?.current_skills?.join(', ')}</span>
          </div>
          {/* Week progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-indigo-200 mb-1">
              <span>Week {currentWeek} of {totalWeeks}</span>
              <span>{Math.round((currentWeek / totalWeeks) * 100)}% complete</span>
            </div>
            <div className="w-full bg-indigo-500 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Unlock Next Week */}
        {!isLastWeek && (
          <div className="bg-white rounded-xl border p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">
                  Ready for Week {currentWeek + 1}?
                </p>
                <p className="text-sm text-gray-400 mt-0.5">
                  Complete all Week {currentWeek} tasks to unlock
                </p>
              </div>
              <button
                onClick={handleUnlockNextWeek}
                disabled={unlocking}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm
                  font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {unlocking ? 'Unlocking...' : `Unlock Week ${currentWeek + 1} 🔓`}
              </button>
            </div>
            {unlockMsg && (
              <p className="text-green-600 text-sm mt-3">✅ {unlockMsg}</p>
            )}
            {unlockError && (
              <p className="text-red-500 text-sm mt-3">⚠️ {unlockError}</p>
            )}
          </div>
        )}

        {isLastWeek && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 text-center">
            <p className="text-2xl mb-1">🎓</p>
            <p className="font-semibold text-green-800">
              You've unlocked all {totalWeeks} weeks!
            </p>
          </div>
        )}

        {/* Week Accordions */}
        {plan?.weeks ? (
          <RoadmapTimeline weeks={plan.weeks} currentWeek={currentWeek} />
        ) : (
          <p className="text-gray-400 text-center py-12">No plan data found.</p>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/tasks')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Start Today's Tasks 📋
          </button>
        </div>
      </div>
    </div>
  );
}