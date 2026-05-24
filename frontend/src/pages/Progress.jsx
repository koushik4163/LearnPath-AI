import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, LineChart, Line, XAxis,
  YAxis, Tooltip, CartesianGrid
} from 'recharts';
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
      <div className="w-8 h-8 border-4 border-[#F08A4B]
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
    <div className="w-full">

      <div className="max-w-none mx-0 px-2 md:px-3 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')}
            className="text-[#8A857C] hover:text-[#F2EDE6] text-sm">
            ← Back
          </button>
          <h1 className="text-lg font-bold text-[#F08A4B]">
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
            <div key={i} className="panel p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#F2EDE6]">
                {s.value}
              </p>
              <p className="text-xs text-[#8A857C] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Radar Chart */}
        <div className="panel p-6 shadow-sm">
          <h3 className="font-semibold text-[#F2EDE6] mb-4">
            🎯 Skill Radar
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fontSize: 12, fill: '#B9B1A7' }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#7C8CFF"
                fill="#7C8CFF"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Quiz History Chart */}
        {quizHistory.length > 0 && (
          <div className="panel p-6 shadow-sm">
            <h3 className="font-semibold text-[#F2EDE6] mb-4">
              📈 Quiz Score History
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={quizHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)"/>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#B9B1A7' }}
                />
                <YAxis domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#B9B1A7' }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="percent"
                  stroke="#7C8CFF"
                  strokeWidth={2}
                  dot={{ fill: '#7C8CFF', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Streak Calendar placeholder */}
        <div className="panel p-6 shadow-sm">
          <h3 className="font-semibold text-[#F2EDE6] mb-4">
            📅 Activity This Month
          </h3>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 30 }, (_, i) => {
              const active = data?.active_days?.includes(i + 1);
              return (
                <div key={i}
                  className={`w-full aspect-square rounded-md ${
                  active
                    ? 'bg-[#F08A4B]'
                    : 'bg-white/10'
                }`}
                  title={`Day ${i + 1}`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-[#8A857C]">
            <div className="w-3 h-3 rounded-sm bg-white/10" />
            <span>No activity</span>
            <div className="w-3 h-3 rounded-sm bg-[#F08A4B] ml-2" />
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}