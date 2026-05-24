import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function DailyTask() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks/today')
      .then(res => setTasks(res.data))
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
      <div className="w-8 h-8 border-4 border-indigo-500
        border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-gray-600 text-sm">
            ← Back
          </button>
          <h1 className="text-lg font-bold text-indigo-600">
            📋 Today's Tasks
          </h1>
        </div>
        {/* Progress Bar */}
        <div className="bg-white rounded-xl border p-5 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">
              Daily Progress
            </p>
            <p className="text-sm font-bold text-indigo-600">
              {completed}/{tasks.length} done
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{percent}% complete</p>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🎉</p>
            <p className="text-gray-500">No tasks for today!</p>
            <button onClick={() => navigate('/goal-setup')}
              className="mt-4 text-indigo-600 text-sm hover:underline">
              Generate a roadmap first →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id}
                className={`bg-white rounded-xl border p-5
                  shadow-sm transition ${
                  task.is_completed
                    ? 'opacity-60 border-green-200'
                    : 'hover:border-indigo-300'
                }`}>
                <div className="flex items-start gap-4">
                  <button onClick={() => toggleTask(task.id, task.is_completed)}
                    className={`w-6 h-6 rounded-full border-2
                      flex items-center justify-center shrink-0 mt-0.5
                      transition ${
                      task.is_completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-indigo-500'
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
                    <p className={`font-semibold text-sm ${
                      task.is_completed
                        ? 'line-through text-gray-400'
                        : 'text-gray-800'
                    }`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {task.description}
                    </p>
                    {task.resource_url && (
                      <a href={task.resource_url} target="_blank"
                        rel="noreferrer"
                        className="text-indigo-500 text-xs mt-2
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
          <div className="mt-6 bg-green-50 border border-green-200
            rounded-xl p-5 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-semibold text-gray-800">
              All tasks done! Take a quiz?
            </p>
            <button onClick={() => navigate('/quiz')}
              className="mt-3 bg-green-600 text-white px-6 py-2
                rounded-lg text-sm font-semibold hover:bg-green-700
                transition">
              Start Quiz 🧠
            </button>
          </div>
        )}
      </div>
    </div>
  );
}