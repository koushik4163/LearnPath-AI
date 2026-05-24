export default function TaskCard({ task, onToggle }) {
  return (
    <div
      className={`bg-white rounded-xl border p-5 shadow-sm transition ${
        task.is_completed
          ? 'opacity-60 border-green-200'
          : 'hover:border-indigo-300'
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(task.id, task.is_completed)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${
            task.is_completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-indigo-500'
          }`}
        >
          {task.is_completed && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
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
          <p className="text-xs text-gray-400 mt-1">{task.description}</p>
          {task.resource_url && (
            <a
              href={task.resource_url}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-500 text-xs mt-2 inline-block hover:underline"
            >
              📚 Open Resource →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}