import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/roadmap/my').catch(() => null),
      api.get('/progress/me').catch(() => null),
      api.get('/tasks/today').catch(() => null),
    ]).then(([r, p, t]) => {
      setRoadmap(r?.data || null);
      setProgress(p?.data || null);
      setTodayTasks(t?.data || []);
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
  const ringSize = 140;
  const ringCenter = ringSize / 2;
  const ringRadius = 38;
  const ringStroke = 12;
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
  const tasksTotal = todayTasks.length;
  const tasksDone = todayTasks.filter(task => task.is_completed).length;
  const modules = [
    {
      title: "Daily Tasks",
      desc: tasksTotal ? `${tasksDone} of ${tasksTotal} done` : "No tasks scheduled",
      type: "Routine",
      status: tasksTotal ? "Active" : "Empty",
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
      status: progress?.quiz_history?.length ? "Ready" : "New",
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
  const weekPlan = roadmap?.generated_plan?.weeks?.[currentWeek - 1]?.days || [];
  const currentDayNumber = todayTasks[0]?.day_number || 1;
  const focusItems = [];
  const todayPlan = [];

  if (todayTasks.length) {
    const task = todayTasks[0];
    todayPlan.push({
      time: `Day ${task.day_number || currentDayNumber}`,
      title: task.title || "Today",
      desc: task.description || "Open today’s tasks",
      icon: task.is_completed ? "✅" : "📌",
      path: "/tasks",
    });
  } else if (weekPlan.length) {
    const day = weekPlan.find(item => item.day === currentDayNumber) || weekPlan[0];
    if (day) {
      todayPlan.push({
        time: `Day ${day.day}`,
        title: day.topic || "Today",
        desc: day.description || "Open today’s tasks",
        icon: "📌",
        path: "/tasks",
      });
    }
  }

  for (let offset = 1; offset <= 2; offset += 1) {
    const nextDay = weekPlan.find(item => item.day === currentDayNumber + offset);
    if (nextDay) {
      focusItems.push({
        time: `Day ${nextDay.day}`,
        title: nextDay.topic || `Day ${nextDay.day}`,
        desc: nextDay.description || "Upcoming focus",
        icon: "⏭️",
        path: "/tasks",
      });
    }
  }

  todayPlan.push(...focusItems);
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const initials = (user?.name || user?.email || "U")[0].toUpperCase();

  const quizHistory = progress?.quiz_history || [];
  const recentScores = quizHistory.slice(-8).map(item => item.percent).filter(Boolean);
  const chartWidth = 560;
  const chartHeight = 180;
  const chartPadding = 20;
  const baseY = chartHeight - chartPadding;
  const buildLinePath = (values) => {
    if (values.length === 0) {
      return `M${chartPadding} ${baseY} L${chartWidth - chartPadding} ${baseY}`;
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 1);
    return values.map((value, index) => {
      const x = chartPadding + (index * (chartWidth - chartPadding * 2)) / Math.max(values.length - 1, 1);
      const y = chartHeight - chartPadding - ((value - min) / range) * (chartHeight - chartPadding * 2);
      return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
    }).join(' ');
  };
  const linePath = buildLinePath(recentScores);
  const areaPath = `${linePath} L${chartWidth - chartPadding} ${baseY} L${chartPadding} ${baseY} Z`;

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
                <svg
                  width={ringSize}
                  height={ringSize}
                  viewBox={`0 0 ${ringSize} ${ringSize}`}
                >
                  <circle
                    cx={ringCenter}
                    cy={ringCenter}
                    r={ringRadius}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth={ringStroke}
                    fill="none"
                  />
                  <circle
                    cx={ringCenter}
                    cy={ringCenter}
                    r={ringRadius}
                    stroke="#F08A4B"
                    strokeWidth={ringStroke}
                    fill="none"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringCircumference - (progressPercent / 100) * ringCircumference}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${ringCenter} ${ringCenter})`}
                  />
                  <text
                    x={ringCenter}
                    y={ringCenter + 4}
                    textAnchor="middle"
                    fontSize="22"
                    fill="#F2EDE6"
                    fontWeight="700"
                  >
                    {progressPercent}%
                  </text>
                  <text
                    x={ringCenter}
                    y={ringCenter + 20}
                    textAnchor="middle"
                    fontSize="10"
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
                  <h3 className="text-lg font-semibold text-[#F2EDE6] mt-2">Quiz Trend</h3>
                </div>
                <span className="text-xs text-[#8A857C]">Last 8 quizzes</span>
              </div>
              <div className="bg-[#141414] border border-white/5 rounded-2xl p-5">
                <svg viewBox={`${0} ${0} ${chartWidth} ${chartHeight}`} className="w-full h-48">
                  <defs>
                    <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F08A4B" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#F08A4B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#F08A4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path d={areaPath} fill="url(#lineFill)" />
                </svg>
                {!recentScores.length && (
                  <p className="text-xs text-[#8A857C] mt-3">No quiz data yet. Take a quiz to see your trend.</p>
                )}
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
              {todayPlan.length ? todayPlan.map((item) => (
                <button
                  key={`${item.title}-${item.time}`}
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
              )) : (
                <div className="panel-outline px-4 py-4 text-sm text-[#B9B1A7]">
                  No tasks scheduled for today yet.
                </div>
              )}
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