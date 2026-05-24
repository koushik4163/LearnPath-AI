export default function StreakTracker({ activeDays = [] }) {
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  return (
    <div className="panel p-6 shadow-sm">
      <h3 className="font-semibold text-[#F2EDE6] mb-4">📅 Activity This Month</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const active = activeDays.includes(i + 1);
          const isToday = i + 1 === today.getDate();
          return (
            <div
              key={i}
              className={`w-full aspect-square rounded-md transition ${
                active
                  ? 'bg-[#F08A4B]'
                  : isToday
                  ? 'bg-[#7C8CFF]/20 border border-[#7C8CFF]/60'
                  : 'bg-white/10'
              }`}
              title={`Day ${i + 1}${active ? ' ✓' : ''}${isToday ? ' (today)' : ''}`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-[#8A857C]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-white/10" />
          <span>No activity</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#F08A4B]" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#7C8CFF]/20 border border-[#7C8CFF]/60" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}