import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, LineChart, Line, XAxis,
  YAxis, Tooltip, CartesianGrid
} from 'recharts';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Progress() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/progress/me')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-500
        border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const radarData = data?.skill_scores || [
    { skill: 'Python', score: 70 },
    { skill: 'SQL', score: 50 },
    { skill: 'ML', score: 40 },
    { skill: 'Stats', score: 60 },
    { skill: 'Viz', score: 55 },
  ];

  const quizHistory = data?.quiz_history || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-gray-600 text-sm">
            ← Back
          </button>
          <h1 className="text-lg font-bold text-indigo-600">
            📊 My Progress
          </h1>
        </div>
        {/* Streak Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Current Streak', value: `${data?.current_streak || 0} 🔥` },
            { label: 'Longest Streak', value: `${data?.longest_streak || 0} 🏆` },
            { label: 'Tasks Completed', value: data?.total_tasks_done || 0 },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border
              p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-800">
                {s.value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">
            🎯 Skill Radar
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#6366F1"
                fill="#6366F1"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Quiz History Chart */}
        {quizHistory.length > 0 && (
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">
              📈 Quiz Score History
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={quizHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                />
                <YAxis domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="percent"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={{ fill: '#6366F1', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Streak Calendar placeholder */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">
            📅 Activity This Month
          </h3>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 30 }, (_, i) => {
              const active = data?.active_days?.includes(i + 1);
              return (
                <div key={i}
                  className={`w-full aspect-square rounded-md ${
                  active
                    ? 'bg-indigo-500'
                    : 'bg-gray-100'
                }`}
                  title={`Day ${i + 1}`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <span>No activity</span>
            <div className="w-3 h-3 rounded-sm bg-indigo-500 ml-2" />
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}