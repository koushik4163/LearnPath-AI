export default function TaskCard({ task, onToggle }) {
  return (
    <div
      className={`panel p-5 shadow-sm transition ${
        task.is_completed
          ? 'opacity-60 border-emerald-500/40'
          : 'hover:border-white/20'
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(task.id, task.is_completed)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${
            task.is_completed
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-white/20 hover:border-[#F08A4B]'
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
              ? 'line-through text-[#8A857C]'
              : 'text-[#F2EDE6]'
          }`}>
            {task.title}
          </p>
          <p className="text-xs text-[#8A857C] mt-1">{task.description}</p>
          {task.resource_url && (
            <a
              href={task.resource_url}
              target="_blank"
              rel="noreferrer"
              className="text-[#7C8CFF] text-xs mt-2 inline-block hover:underline"
            >
              📚 Open Resource →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}