import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

interface LocationState {
  from?: { pathname: string };
}

export default function Login() {
  const { login, token, loading, initializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!initializing && token) {
    const from = (location.state as LocationState)?.from?.pathname || '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }
    try {
      await login({ email: email.trim(), password });
      toast.success('Welcome back!');
      const from = (location.state as LocationState)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const message = (err as { message?: string }).message || 'Invalid credentials';
      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-blue to-purple flex items-center justify-center text-white font-bold text-2xl shadow-glow">
            IU
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-text-dark dark:text-white">
            Super Admin Portal
          </h1>
          <p className="text-sm text-text-light dark:text-slate-400 mt-1">
            Sign in to manage IU Chat
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-dark dark:text-white mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@iuindia.com"
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-text-dark dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-dark dark:text-white mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-12 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-text-dark dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-light dark:text-slate-400 hover:text-text-dark dark:hover:text-white"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary-blue to-purple text-white font-semibold shadow-glow hover:shadow-glow-lg disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-center text-xs text-text-light dark:text-slate-500">
            Trouble signing in? Contact your platform administrator.
          </p>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-sm text-text-light dark:text-slate-400 hover:text-primary-blue"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
