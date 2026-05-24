import { useState } from 'react';

export default function RoadmapTimeline({ weeks = [], currentWeek = 1 }) {
  const [openWeek, setOpenWeek] = useState(0);

  return (
    <div className="space-y-4">
      {weeks.map((week, wi) => {
        const isLocked = week.week > currentWeek;
        return (
          <div key={wi} className={`bg-white rounded-xl border overflow-hidden shadow-sm ${isLocked ? 'opacity-50' : ''}`}>
            <button
              onClick={() => !isLocked && setOpenWeek(openWeek === wi ? -1 : wi)}
              className={`w-full flex items-center justify-between px-6 py-4 transition ${
                isLocked ? 'cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center ${
                  isLocked
                    ? 'bg-gray-100 text-gray-400'
                    : week.week < currentWeek
                    ? 'bg-green-100 text-green-700'
                    : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {isLocked ? '🔒' : week.week < currentWeek ? '✓' : week.week}
                </span>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Week {week.week}</p>
                  <p className="text-sm text-indigo-500">{week.theme}</p>
                </div>
              </div>
              <span className="text-gray-400 text-lg">
                {isLocked ? '🔒' : openWeek === wi ? '▲' : '▼'}
              </span>
            </button>

            {openWeek === wi && !isLocked && (
              <div className="border-t divide-y">
                {week.days?.map((day, di) => (
                  <div key={di} className="flex gap-4 items-start px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shrink-0 mt-0.5">
                      {day.day}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{day.topic}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{day.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        {day.resource && (
                          <a href={day.resource} target="_blank" rel="noreferrer"
                            className="text-indigo-500 text-xs hover:underline">
                            📚 Resource →
                          </a>
                        )}
                        <span className="text-gray-300 text-xs">⏱ {day.estimated_hours}h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}