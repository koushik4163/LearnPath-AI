import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const SKILL_OPTIONS = [
  'Python', 'JavaScript', 'React', 'SQL', 'Machine Learning',
  'Excel', 'HTML/CSS', 'Java', 'Git', 'Statistics',
  'Node.js', 'Data Analysis', 'Deep Learning', 'MongoDB', 'Docker'
];

export default function GoalSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goal, setGoal] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [weeks, setWeeks] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSkill = skill =>
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );

  const handleSubmit = async () => {
    if (!goal.trim()) return setError('Please enter your goal');
    if (selectedSkills.length === 0)
      return setError('Please select at least one skill');

    setError('');
    setLoading(true);

    try {
      await api.post('/roadmap/generate', {
        goal,
        current_skills: selectedSkills,
        duration_weeks: weeks,
        user_id: user.uid,
      });

      navigate('/roadmap');

    } catch (err) {
      console.error('Error:', err);
      const message = err.response?.data?.detail || err.message || 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-4xl mb-3">🎯</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Set Your Learning Goal
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Tell us what you want to achieve and we'll build your perfect roadmap
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6 border border-red-200">
            {error}
          </div>
        )}

        {/* Goal Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is your goal?
          </label>
          <textarea
            rows={3}
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="e.g. Get a data science job in 3 months, Learn React to build my startup..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your current skills{' '}
            <span className="text-gray-400 font-normal">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  selectedSkills.includes(skill)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration:{' '}
            <span className="text-indigo-600 font-semibold">{weeks} weeks</span>
          </label>
          <input
            type="range"
            min="2"
            max="12"
            value={weeks}
            onChange={e => setWeeks(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>2 weeks</span>
            <span>12 weeks</span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white
            font-semibold py-4 rounded-xl transition disabled:opacity-60 text-base"
        >
          {loading ? '✨ Building your roadmap...' : 'Generate My Roadmap 🚀'}
        </button>

        {loading && (
          <p className="text-center text-xs text-gray-400 mt-3">
            This may take 15–30 seconds. AI is thinking...
          </p>
        )}
      </div>
    </div>
  );
}