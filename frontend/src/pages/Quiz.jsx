import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/quiz/generate')
      .then(res => setQuestions(res.data))
      .catch(err => {
        const message = err.response?.data?.detail || 'Failed to generate quiz';
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = idx => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const handleNext = async () => {
    const updatedAnswers = [
      ...answers,
      {
        question: questions[current].question,
        correct: questions[current].correct,
        selected,
      }
    ];
    setAnswers(updatedAnswers);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      const score = updatedAnswers.filter(
        a => a.selected === a.correct
      ).length;
      await api.post('/quiz/submit', {
        score,
        total: questions.length
      }).catch(() => {});
      setDone(true);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-500
        border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Show error state
  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <p className="text-5xl mb-4">⚠️</p>
        <p className="text-gray-600 mb-2 font-medium">Could not load quiz</p>
        <p className="text-sm text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-indigo-600 hover:underline text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );

  const q = questions[current];
  const score = answers.filter(a => a.selected === a.correct).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-indigo-600">
            🧠 Daily Quiz
          </h1>
        </div>

        {done ? (
          /* Results */
          <div className="bg-white rounded-2xl border p-8 text-center shadow-sm">
            <p className="text-5xl mb-4">
              {score >= questions.length * 0.7 ? '🏆' : '💪'}
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Quiz Complete!
            </h2>
            <p className="text-gray-500 mb-6">
              You scored{' '}
              <span className="text-indigo-600 font-bold">
                {score}/{questions.length}
              </span>
            </p>

            {/* Answer Review */}
            <div className="space-y-3 text-left mb-8">
              {answers.map((a, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 text-sm ${
                    a.selected === a.correct
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p className="font-medium text-gray-800 mb-1">
                    Q{i + 1}: {a.question}
                  </p>
                  <p className={a.selected === a.correct ? 'text-green-600' : 'text-red-600'}>
                    {a.selected === a.correct
                      ? '✅ Correct'
                      : `❌ Wrong — correct was option ${a.correct + 1}`}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/progress')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
              >
                View Progress 📊
              </button>
            </div>
          </div>
        ) : (
          /* Question Card */
          questions.length > 0 && (
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              {/* Progress dots */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-400">
                  Question {current + 1} of {questions.length}
                </p>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < current
                          ? 'bg-indigo-600'
                          : i === current
                          ? 'bg-indigo-300'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                {q.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {q.options.map((opt, idx) => {
                  let style = 'border-gray-200 text-gray-700 hover:border-indigo-400';
                  if (selected !== null) {
                    if (idx === q.correct)
                      style = 'border-green-500 bg-green-50 text-green-700';
                    else if (idx === selected && selected !== q.correct)
                      style = 'border-red-400 bg-red-50 text-red-600';
                    else
                      style = 'border-gray-200 text-gray-400';
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition ${style}`}
                    >
                      <span className="mr-2 font-bold">
                        {['A', 'B', 'C', 'D'][idx]}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {selected !== null && q.explanation && (
                <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700 mb-4">
                  💡 {q.explanation}
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={selected === null}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-40"
              >
                {current + 1 === questions.length ? 'Finish Quiz 🎉' : 'Next Question →'}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}