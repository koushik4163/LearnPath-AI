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
    <div className="w-full">
      <div className="max-w-2xl mx-auto panel shadow-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-4xl mb-3">🎯</p>
          <h1 className="text-2xl font-bold text-[#F2EDE6]">
            Set Your Learning Goal
          </h1>
          <p className="text-[#8A857C] mt-2 text-sm">
            Tell us what you want to achieve and we'll build your perfect roadmap
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 text-rose-200 text-sm rounded-lg px-4 py-3 mb-6 border border-rose-400/40">
            {error}
          </div>
        )}

        {/* Goal Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#B9B1A7] mb-2">
            What is your goal?
          </label>
          <textarea
            rows={3}
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="e.g. Get a data science job in 3 months, Learn React to build my startup..."
            className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm
              bg-[#111111] text-[#F2EDE6] placeholder:text-[#8A857C]
              focus:outline-none focus:ring-2 focus:ring-[#7C8CFF] resize-none"
          />
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#B9B1A7] mb-3">
            Your current skills{' '}
            <span className="text-[#8A857C] font-normal">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  selectedSkills.includes(skill)
                    ? 'bg-[#F08A4B] text-white border-[#F08A4B]'
                    : 'bg-white/5 text-[#B9B1A7] border-white/10 hover:border-[#7C8CFF]'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#B9B1A7] mb-2">
            Duration:{' '}
            <span className="text-[#F08A4B] font-semibold">{weeks} weeks</span>
          </label>
          <input
            type="range"
            min="2"
            max="12"
            value={weeks}
            onChange={e => setWeeks(Number(e.target.value))}
            className="w-full accent-[#F08A4B]"
          />
          <div className="flex justify-between text-xs text-[#8A857C] mt-1">
            <span>2 weeks</span>
            <span>12 weeks</span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#F08A4B] hover:bg-[#DE7C40] text-white
            font-semibold py-4 rounded-xl transition disabled:opacity-60 text-base"
        >
          {loading ? '✨ Building your roadmap...' : 'Generate My Roadmap 🚀'}
        </button>

        {loading && (
          <p className="text-center text-xs text-[#8A857C] mt-3">
            This may take 15–30 seconds. AI is thinking...
          </p>
        )}
      </div>
    </div>
  );
}