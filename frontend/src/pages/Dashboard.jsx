import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
      <div className="w-8 h-8 border-4 border-[#F08A4B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const currentWeek = roadmap?.current_week || 1;
  const totalWeeks = roadmap?.duration_weeks || 4;
  const progressPercent = roadmap
    ? Math.round((currentWeek / totalWeeks) * 100)
    : 0;
  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const stats = [
    {
      label: 'Current Streak',
      value: `${progress?.current_streak || 0} 🔥`,
      icon: '🔥',
    },
    {
      label: 'Tasks Done',
      value: progress?.total_tasks_done || 0,
      icon: '✅',
    },
    {
      label: 'Week',
      value: roadmap ? `Week ${currentWeek}` : '—',
      icon: '🗺️',
    },
    {
      label: 'Longest Streak',
      value: `${progress?.longest_streak || 0} 🏆`,
      icon: '🏆',
    },
  ];
  const modules = [
    {
      title: "Daily Tasks",
      desc: "Checklist and focus",
      type: "Routine",
      status: "Ongoing",
      path: "/tasks",
    },
    {
      title: "My Roadmap",
      desc: "Long-term milestones",
      type: "Plan",
      status: roadmap ? "Active" : "Draft",
      path: "/roadmap",
    },
    {
      title: "Quick Quiz",
      desc: "Recall practice",
      type: "Assessment",
      status: "Available",
      path: "/quiz",
    },
    {
      title: "Progress Review",
      desc: "Streaks and scores",
      type: "Insights",
      status: "Ready",
      path: "/progress",
    },
  ];
  const todayPlan = [
    { time: "08:00", title: "Daily tasks", desc: "Complete your checklist", icon: "📋", path: "/tasks" },
    { time: "10:30", title: "Quick quiz", desc: "5 questions to reinforce", icon: "🧠", path: "/quiz" },
    { time: "14:00", title: "Progress review", desc: "Track streaks and scores", icon: "📊", path: "/progress" },
  ];
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const initials = (user?.name || user?.email || "U")[0].toUpperCase();

  return (
    <div className="w-full">
      <div className="max-w-none mx-0 px-2 md:px-3 py-8 space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#F2EDE6]">Dashboard</h1>
            <p className="text-sm text-[#8A857C] mt-1">
              Welcome back, {user?.name || user?.email}.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 sm:w-72">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A857C]">🔍</span>
              <input
                type="text"
                placeholder="Search topics"
                className="w-full bg-[#111111] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#F2EDE6] placeholder:text-[#8A857C] focus:outline-none focus:ring-2 focus:ring-[#7C8CFF]"
              />
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="bg-[#F08A4B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#DE7C40] transition"
            >
              Start Today
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-white/10 text-white text-sm font-semibold flex items-center justify-center hover:bg-white/20 transition"
            >
              {initials}
            </button>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="panel p-6 shadow-sm space-y-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#8A857C]">Overview</p>
                <h2 className="text-xl font-semibold text-[#F2EDE6] mt-2">
                  Hey, {user?.name || user?.email}! 👋
                </h2>
                <p className="text-sm text-[#8A857C] mt-1">Your learning snapshot for today.</p>
              </div>
              <button
                onClick={() => navigate('/roadmap')}
                className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/15 transition"
              >
                View Roadmap
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="panel-outline p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#8A857C]">{stat.label}</p>
                    <p className="text-lg font-semibold text-[#F2EDE6] mt-2">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#F2EDE6]">Progress</h3>
              <span className="text-xs text-[#8A857C]">Week {currentWeek} of {totalWeeks}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <circle
                    cx="75"
                    cy="75"
                    r={ringRadius}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="15"
                    fill="none"
                  />
                  <circle
                    cx="75"
                    cy="75"
                    r={ringRadius}
                    stroke="#F08A4B"
                    strokeWidth="15"
                    fill="none"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringCircumference - (progressPercent / 100) * ringCircumference}
                    strokeLinecap="round"
                    transform="rotate(-90 75 75)"
                  />
                  <text
                    x="75"
                    y="82"
                    textAnchor="middle"
                    fontSize="24"
                    fill="#F2EDE6"
                    fontWeight="700"
                  >
                    {progressPercent}%
                  </text>
                  <text
                    x="75"
                    y="102"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#8A857C"
                  >
                    Completed
                  </text>
                </svg>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8A857C]">Goal</p>
                  <p className="text-lg font-semibold text-[#F2EDE6]">{roadmap?.goal || 'Set your goal'}</p>
                </div>
                <div className="space-y-1 text-xs text-[#8A857C]">
                  <p><span className="inline-block w-2 h-2 rounded-full bg-[#F08A4B] mr-2" />Completed</p>
                  <p><span className="inline-block w-2 h-2 rounded-full bg-white/20 mr-2" />Remaining</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          {roadmap ? (
            <div className="panel p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8A857C]">Momentum</p>
                  <h3 className="text-lg font-semibold text-[#F2EDE6] mt-2">Learning Trend</h3>
                </div>
                <span className="text-xs text-[#8A857C]">Last 8 weeks</span>
              </div>
              <div className="bg-[#141414] border border-white/5 rounded-2xl p-5">
                <svg viewBox="0 0 560 180" className="w-full h-48">
                  <defs>
                    <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F08A4B" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#F08A4B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 150 C80 120, 120 120, 170 110 C220 100, 250 70, 300 80 C350 90, 380 60, 430 55 C480 50, 520 70, 540 45"
                    fill="none"
                    stroke="#F08A4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 150 C80 120, 120 120, 170 110 C220 100, 250 70, 300 80 C350 90, 380 60, 430 55 C480 50, 520 70, 540 45 L540 180 L20 180 Z"
                    fill="url(#lineFill)"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div className="panel-soft p-6">
              <p className="text-4xl mb-4">🚀</p>
              <h3 className="text-lg font-semibold text-[#F2EDE6] mb-2">
                No roadmap yet
              </h3>
              <p className="text-[#B9B1A7] text-sm mb-6">
                Set a goal and unlock your personalized learning plan.
              </p>
              <button
                onClick={() => navigate('/goal-setup')}
                className="bg-[#F08A4B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#DE7C40] transition"
              >
                Create My Roadmap ✨
              </button>
            </div>
          )}

          <div className="panel p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#F2EDE6]">Today</h3>
                <p className="text-xs text-[#8A857C] mt-1">{todayLabel}</p>
              </div>
              <span className="text-xs text-[#8A857C]">Focus list</span>
            </div>
            <div className="space-y-3">
              {todayPlan.map((item) => (
                <button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 panel-outline px-4 py-3 text-left hover:bg-white/5 transition"
                >
                  <div className="text-xs text-[#8A857C] w-12">{item.time}</div>
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-base">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F2EDE6]">{item.title}</p>
                    <p className="text-xs text-[#8A857C]">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="mt-4 w-full bg-white/10 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-white/15 transition"
            >
              Open Today's Plan
            </button>
          </div>
        </section>

        <section className="panel p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#F2EDE6]">Modules</h3>
            <span className="text-xs text-[#8A857C]">Overview</span>
          </div>
          <div className="grid grid-cols-[1.4fr_0.7fr_0.6fr] gap-3 text-[11px] uppercase tracking-[0.25em] text-[#8A857C] mb-3">
            <span>Module</span>
            <span>Type</span>
            <span className="text-right">Status</span>
          </div>
          <div className="space-y-2">
            {modules.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className="w-full grid grid-cols-[1.4fr_0.7fr_0.6fr] gap-3 items-center panel-outline px-5 py-3.5 text-left hover:bg-white/5 transition"
              >
                <div>
                  <p className="text-sm font-semibold text-[#F2EDE6]">{item.title}</p>
                  <p className="text-xs text-[#8A857C]">{item.desc}</p>
                </div>
                <span className="text-xs text-[#B9B1A7]">{item.type}</span>
                <span className="text-right">
                  <span className="inline-flex px-2 py-1 rounded-full text-[11px] bg-white/10 text-[#F2EDE6]">
                    {item.status}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}