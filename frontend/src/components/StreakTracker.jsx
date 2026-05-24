export default function StreakTracker({ activeDays = [] }) {
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">📅 Activity This Month</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const active = activeDays.includes(i + 1);
          const isToday = i + 1 === today.getDate();
          return (
            <div
              key={i}
              className={`w-full aspect-square rounded-md transition ${
                active
                  ? 'bg-indigo-500'
                  : isToday
                  ? 'bg-indigo-100 border border-indigo-300'
                  : 'bg-gray-100'
              }`}
              title={`Day ${i + 1}${active ? ' ✓' : ''}${isToday ? ' (today)' : ''}`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100" />
          <span>No activity</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-indigo-500" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-indigo-100 border border-indigo-300" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}