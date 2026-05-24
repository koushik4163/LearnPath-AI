export default function QuizCard({ question, options, correct, selected, onSelect, explanation }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#F2EDE6] mb-6">{question}</h2>

      <div className="space-y-3 mb-6">
        {options.map((opt, idx) => {
          let style = 'border-white/10 text-[#F2EDE6] hover:border-[#7C8CFF]';
          if (selected !== null) {
            if (idx === correct)
              style = 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200';
            else if (idx === selected && selected !== correct)
              style = 'border-rose-400/60 bg-rose-500/10 text-rose-200';
            else
              style = 'border-white/5 text-[#8A857C]';
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
        <div className="bg-[#232323] rounded-lg p-3 text-sm text-[#7C8CFF] mb-4">
          💡 {explanation}
        </div>
      )}
    </div>
  );
}