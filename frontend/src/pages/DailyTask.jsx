import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function DailyTask() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks/week/current')
      .then(res => {
        setTasks(res.data || []);
        setCurrentWeek(res.data?.[0]?.week_number ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleTask = async (taskId, current) => {
    await api.patch(`/tasks/${taskId}/complete`,
      { is_completed: !current });
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, is_completed: !current } : t
    ));
  };

  const completed = tasks.filter(t => t.is_completed).length;
  const percent = tasks.length
    ? Math.round((completed / tasks.length) * 100) : 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-[#F08A4B]
        border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full">

      <div className="max-w-none mx-0 px-2 md:px-3 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/dashboard')}
            className="text-[#8A857C] hover:text-[#F2EDE6] text-sm">
            ← Back
          </button>
          <h1 className="text-lg font-bold text-[#F08A4B]">
            📋 Week {currentWeek || '—'} Tasks
          </h1>
        </div>
        {/* Progress Bar */}
        <div className="panel p-5 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-[#F2EDE6]">
              Week Progress
            </p>
            <p className="text-sm font-bold text-[#F08A4B]">
              {completed}/{tasks.length} done
            </p>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className="bg-[#F08A4B] h-3 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-[#8A857C] mt-2">{percent}% complete</p>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🎉</p>
            <p className="text-[#B9B1A7]">No tasks for this week yet!</p>
            <button onClick={() => navigate('/goal-setup')}
              className="mt-4 text-[#7C8CFF] text-sm hover:underline">
              Generate a roadmap first →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id}
                className={`panel p-5
                  shadow-sm transition ${
                  task.is_completed
                    ? 'opacity-60 border-emerald-500/40'
                    : 'hover:border-white/20'
                }`}>
                <div className="flex items-start gap-4">
                  <button onClick={() => toggleTask(task.id, task.is_completed)}
                    className={`w-6 h-6 rounded-full border-2
                      flex items-center justify-center shrink-0 mt-0.5
                      transition ${
                      task.is_completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-white/20 hover:border-[#F08A4B]'
                    }`}>
                    {task.is_completed && (
                      <svg className="w-3 h-3 text-white" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8A857C]">
                      Day {task.day_number || 1}
                    </p>
                    <p className={`font-semibold text-sm ${
                      task.is_completed
                        ? 'line-through text-[#8A857C]'
                        : 'text-[#F2EDE6]'
                    }`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-[#8A857C] mt-1">
                      {task.description}
                    </p>
                    {task.resource_url && (
                      <a href={task.resource_url} target="_blank"
                        rel="noreferrer"
                        className="text-[#7C8CFF] text-xs mt-2
                          inline-block hover:underline">
                        📚 Open Resource →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quiz CTA */}
        {percent === 100 && (
          <div className="mt-6 panel-soft p-5 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-semibold text-[#F2EDE6]">
              All tasks done! Take a quiz?
            </p>
            <button onClick={() => navigate('/quiz')}
              className="mt-3 bg-[#F08A4B] text-white px-6 py-2
                rounded-lg text-sm font-semibold hover:bg-[#DE7C40]
                transition">
              Start Quiz 🧠
            </button>
          </div>
        )}
      </div>
    </div>
  );
}