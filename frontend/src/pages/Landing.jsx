import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: '🎯', title: 'AI-Powered Roadmaps', desc: 'Tell us your goal and get a personalized week-by-week learning plan built by AI.' },
  { icon: '📋', title: 'Daily Tasks', desc: 'Every day you get specific tasks to complete. No guessing what to study next.' },
  { icon: '🧠', title: 'Daily Quizzes', desc: 'Test your knowledge with AI-generated quizzes based on exactly what you learned.' },
  { icon: '🔥', title: 'Streak Tracking', desc: 'Build learning habits with streak tracking and activity calendar.' },
  { icon: '📊', title: 'Progress Charts', desc: 'Visualize your growth with skill radar charts and quiz score history.' },
  { icon: '🔓', title: 'Weekly Unlocks', desc: 'Complete a week to unlock the next one. Stay motivated and on track.' },
];

const STEPS = [
  { step: '01', title: 'Set Your Goal', desc: 'Tell us what you want to learn and your current skill level.' },
  { step: '02', title: 'Get Your Roadmap', desc: 'AI generates a personalized week-by-week plan in seconds.' },
  { step: '03', title: 'Learn Daily', desc: 'Complete tasks, take quizzes, build streaks every day.' },
  { step: '04', title: 'Get the Job', desc: 'Track your progress and land your dream role.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="text-xl font-bold text-indigo-600">🎯 LearnPath AI</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          🚀 AI-Powered Learning Platform
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Your Personal AI Tutor for{' '}
          <span className="text-indigo-600">Landing Your Dream Job</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Set your goal. Get a personalized roadmap. Learn daily with AI-generated
          tasks and quizzes. Track your progress. Get hired.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            Start Learning Free 🚀
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition"
          >
            Sign In →
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-4">Free forever. No credit card needed.</p>
      </section>

      {/* Stats */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center text-white">
          {[
            { value: '10+', label: 'Skills You Can Learn' },
            { value: 'AI', label: 'Powered Roadmaps' },
            { value: '100%', label: 'Free to Use' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-4xl font-extrabold">{s.value}</p>
              <p className="text-indigo-200 mt-1 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to learn faster
          </h2>
          <p className="text-gray-500">
            Built for people who want to get jobs, not just certificates.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition">
              <p className="text-3xl mb-4">{f.icon}</p>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-500">From zero to job-ready in 4 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-sm mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
          Ready to start your learning journey?
        </h2>
        <p className="text-gray-500 mb-10 text-lg">
          Join thousands of learners building skills and getting hired.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          Create Free Account 🎯
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-gray-400">
        <p>🎯 LearnPath AI — Built with React, FastAPI, Supabase & Groq</p>
      </footer>
    </div>
  );
}