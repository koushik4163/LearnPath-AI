import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex items-center justify-center px-4">
      <div className="panel w-full max-w-lg shadow-lg p-9">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#F2EDE6]">🎯 LearnPath AI</h1>
          <p className="text-[#B9B1A7] mt-2">Welcome back!</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-200 text-sm
            rounded-lg px-4 py-3 mb-4 border border-rose-400/40">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium
              text-[#B9B1A7] mb-1">Email</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="john@example.com"
              className="w-full border border-white/10 rounded-lg
                px-4 py-3 text-sm bg-[#111111] text-[#F2EDE6] placeholder:text-[#8A857C]
                focus:outline-none focus:ring-2 focus:ring-[#7C8CFF]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium
              text-[#B9B1A7] mb-1">Password</label>
            <input
              type="password" name="password" required
              value={form.password} onChange={handleChange}
              placeholder="Your password"
              className="w-full border border-white/10 rounded-lg
                px-4 py-3 text-sm bg-[#111111] text-[#F2EDE6] placeholder:text-[#8A857C]
                focus:outline-none focus:ring-2 focus:ring-[#7C8CFF]"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-[#F08A4B] hover:bg-[#DE7C40]
              text-white font-semibold py-3 rounded-lg
              transition disabled:opacity-60 mt-2">
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-sm text-[#B9B1A7] mt-6">
          Don't have an account?{' '}
          <Link to="/register"
            className="text-[#7C8CFF] font-medium hover:underline">
            Sign up free
          </Link>
        </p>
        <p className="text-center text-xs text-[#8A857C] mt-3">
          <Link to="/" className="hover:text-[#F2EDE6] transition">
            ← Back to Landing
          </Link>
        </p>
      </div>
    </div>
  );
}