export default function QuizCard({ question, options, correct, selected, onSelect, explanation }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-6">{question}</h2>

      <div className="space-y-3 mb-6">
        {options.map((opt, idx) => {
          let style = 'border-gray-200 text-gray-700 hover:border-indigo-400';
          if (selected !== null) {
            if (idx === correct)
              style = 'border-green-500 bg-green-50 text-green-700';
            else if (idx === selected && selected !== correct)
              style = 'border-red-400 bg-red-50 text-red-600';
            else
              style = 'border-gray-200 text-gray-400';
          }
          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition ${style}`}
            >
              <span className="mr-2 font-bold">{['A', 'B', 'C', 'D'][idx]}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && explanation && (
        <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700 mb-4">
          💡 {explanation}
        </div>
      )}
    </div>
  );
}