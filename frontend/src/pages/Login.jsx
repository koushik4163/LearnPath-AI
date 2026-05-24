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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50
      to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl
        shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🎯 LearnPath AI</h1>
          <p className="text-gray-500 mt-2">Welcome back!</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm
            rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium
              text-gray-700 mb-1">Email</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="john@example.com"
              className="w-full border border-gray-300 rounded-lg
                px-4 py-3 text-sm focus:outline-none
                focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium
              text-gray-700 mb-1">Password</label>
            <input
              type="password" name="password" required
              value={form.password} onChange={handleChange}
              placeholder="Your password"
              className="w-full border border-gray-300 rounded-lg
                px-4 py-3 text-sm focus:outline-none
                focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700
              text-white font-semibold py-3 rounded-lg
              transition disabled:opacity-60 mt-2">
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register"
            className="text-indigo-600 font-medium hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}