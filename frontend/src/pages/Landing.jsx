import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🎯',
    title: 'AI-Powered Roadmaps',
    desc: 'Tell us your goal and get a personalized week-by-week learning plan built by AI.',
  },
  {
    icon: '📋',
    title: 'Daily Tasks',
    desc: 'Every day you get specific tasks to complete. No guessing what to study next.',
  },
  {
    icon: '🧠',
    title: 'Daily Quizzes',
    desc: 'Test your knowledge with AI-generated quizzes based on exactly what you learned.',
  },
  {
    icon: '🔥',
    title: 'Streak Tracking',
    desc: 'Build learning habits with streak tracking and activity calendar.',
  },
  {
    icon: '📊',
    title: 'Progress Charts',
    desc: 'Visualize your growth with skill radar charts and quiz score history.',
  },
  {
    icon: '🔓',
    title: 'Weekly Unlocks',
    desc: 'Complete a week to unlock the next one. Stay motivated and on track.',
  },
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
    <div className="app-shell text-[#F2EDE6] overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#F08A4B]/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-10 h-80 w-80 rounded-full bg-[#7C8CFF]/20 blur-3xl" />

      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="text-lg font-semibold tracking-tight">LearnPath AI</p>
            <p className="text-xs text-[#B9B1A7]">Personalized learning, daily</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-[#B9B1A7] hover:text-white font-medium"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-[#F08A4B] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#DE7C40] transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="text-base">⚡</span>
              Focused learning for real careers
            </div>
            <h1 className="text-5xl md:text-6xl font-['Fraunces'] leading-tight mb-6">
              Build the skills for your next role
              <span className="block text-[#F08A4B]">with a plan that fits your life.</span>
            </h1>
            <p className="text-lg text-[#B9B1A7] max-w-xl mb-8">
              Tell us your goal and current level. LearnPath AI creates a focused roadmap,
              daily tasks, and quizzes that keep you moving without burnout.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="bg-[#F08A4B] text-white px-7 py-3.5 rounded-2xl font-semibold text-base shadow-lg shadow-[#F08A4B]/30 hover:bg-[#DE7C40] transition"
              >
                Start Your Plan
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border border-white/15 text-white px-7 py-3.5 rounded-2xl font-semibold text-base hover:bg-white/10 transition"
              >
                I Already Have an Account
              </button>
            </div>
            <p className="text-xs text-[#8A857C] mt-4">No credit card. Learn at your pace.</p>
          </div>

          <div className="bg-[#1B1B1B]/90 border border-white/10 rounded-3xl p-6 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8A857C]">This week</p>
                <p className="text-lg font-semibold">UX Design Foundations</p>
              </div>
              <span className="text-sm bg-white/10 px-3 py-1 rounded-full text-[#B9B1A7]">Week 1</span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Day 1', title: 'Design thinking basics', time: '45 min' },
                { label: 'Day 2', title: 'User interviews & notes', time: '60 min' },
                { label: 'Day 3', title: 'Wireframe your first flow', time: '50 min' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between bg-[#232323] rounded-2xl px-4 py-3">
                  <div>
                    <p className="text-xs text-[#8A857C]">{item.label}</p>
                    <p className="font-medium text-[#F2EDE6]">{item.title}</p>
                  </div>
                  <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-[#B9B1A7]">{item.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-white/10 pt-4 flex items-center justify-between">
              <p className="text-sm text-[#B9B1A7]">Daily quiz + streak tracking</p>
              <span className="text-lg">🔥</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { value: '10+', label: 'Career paths supported' },
            { value: '5 min', label: 'Daily planning time' },
            { value: '100%', label: 'Focus on real skills' },
          ].map((s) => (
            <div key={s.label} className="bg-[#1B1B1B]/80 border border-white/10 rounded-2xl p-5">
              <p className="text-3xl font-semibold">{s.value}</p>
              <p className="text-sm text-[#B9B1A7] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8A857C]">What you get</p>
            <h2 className="text-4xl font-['Fraunces'] mt-3">The most practical learning stack.</h2>
          </div>
          <p className="text-[#B9B1A7] max-w-md">
            Designed for busy learners who want clarity, momentum, and proof of progress.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="bg-[#1B1B1B]/80 border border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
              <p className="text-3xl mb-4">{feature.icon}</p>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-[#B9B1A7] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#111111] py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8A857C]">How it works</p>
            <h2 className="text-4xl font-['Fraunces'] mt-4">A calm, repeatable routine.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.step} className="bg-[#1B1B1B] border border-white/10 rounded-2xl p-5 text-center">
                <div className="w-12 h-12 bg-[#F08A4B] text-white rounded-xl flex items-center justify-center font-semibold text-sm mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-[#B9B1A7]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="bg-[#1B1B1B] text-white rounded-3xl px-8 py-14 shadow-xl shadow-black/40 border border-white/10">
          <h2 className="text-4xl font-['Fraunces'] mb-4">Ready to design your next chapter?</h2>
          <p className="text-[#B9B1A7] mb-8">
            Join learners who want progress without overwhelm. Start free and stay consistent.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-[#F08A4B] text-white px-10 py-4 rounded-2xl font-semibold hover:bg-[#DE7C40] transition"
          >
            Create Free Account
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-[#8A857C] relative z-10">
        <p>🎯 LearnPath AI — Built with React, FastAPI, Supabase & Groq</p>
      </footer>
    </div>
  );
}
