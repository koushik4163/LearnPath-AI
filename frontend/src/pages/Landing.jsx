import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🧭',
    title: 'Skill Diagnostic',
    desc: 'Quick assessment to place you at the right starting level.',
  },
  {
    icon: '🎯',
    title: 'Adaptive Roadmaps',
    desc: 'Plans adjust based on your quiz results and task completion.',
  },
  {
    icon: '📋',
    title: 'Daily Tasks',
    desc: 'Clear, bite-sized tasks so you always know what to do next.',
  },
  {
    icon: '🧠',
    title: 'Smart Quizzes',
    desc: 'Short checks that reinforce what you just learned.',
  },
  {
    icon: '🧩',
    title: 'Project Milestones',
    desc: 'Build portfolio-ready projects at key checkpoints.',
  },
  {
    icon: '💬',
    title: 'AI Coach',
    desc: 'Get instant feedback, hints, and next-step guidance.',
  },
  {
    icon: '📈',
    title: 'Progress Insights',
    desc: 'Spot strengths, gaps, and readiness with visual reports.',
  },
  {
    icon: '🔖',
    title: 'Curated Resources',
    desc: 'Recommended readings and tutorials for each skill.',
  },
];

const HERO_HIGHLIGHTS = [
  { label: 'Roadmap', desc: 'Week-by-week plan tailored to your goal.' },
  { label: 'Daily Plan', desc: 'Small tasks that build momentum.' },
  { label: 'Skill Checks', desc: 'Short quizzes to lock in learning.' },
  { label: 'Progress', desc: 'Clear visuals for wins and gaps.' },
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
                onClick={() => navigate('/login')}
                className="bg-[#F08A4B] text-white px-7 py-3.5 rounded-2xl font-semibold text-base shadow-lg shadow-[#F08A4B]/30 hover:bg-[#DE7C40] transition"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="border border-white/15 text-white px-7 py-3.5 rounded-2xl font-semibold text-base hover:bg-white/10 transition"
              >
                Create Free Account
              </button>
            </div>
          </div>

          <div className="bg-[#1B1B1B]/90 border border-white/10 rounded-3xl p-6 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8A857C]">Your toolkit</p>
                <p className="text-lg font-semibold">Everything you need to stay on track</p>
              </div>
              <span className="text-sm bg-white/10 px-3 py-1 rounded-full text-[#B9B1A7]">Personalized</span>
            </div>
            <div className="space-y-4">
              {HERO_HIGHLIGHTS.map((item) => (
                <div key={item.label} className="flex items-center justify-between bg-[#232323] rounded-2xl px-4 py-3">
                  <div>
                    <p className="text-xs text-[#8A857C]">{item.label}</p>
                    <p className="font-medium text-[#F2EDE6]">{item.desc}</p>
                  </div>
                  <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-[#B9B1A7]">Included</span>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-white/10 pt-4 flex items-center justify-between">
              <p className="text-sm text-[#B9B1A7]">Track streaks and milestones automatically</p>
              <span className="text-lg">✅</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-8 pb-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-4xl font-['Fraunces'] mt-1">The most practical learning stack.</h2>
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

      <section className="bg-[#111111] pt-8 pb-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-['Fraunces'] mt-1">A calm, repeatable routine.</h2>
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

      <footer className="border-t border-white/10 py-8 text-center text-xs text-[#8A857C] relative z-10">
        <p>🎯 LearnPath AI — Built with React, FastAPI, Supabase & Groq</p>
      </footer>
    </div>
  );
}
