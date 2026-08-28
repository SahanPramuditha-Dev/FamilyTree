import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Trees, Mail, Lock, ShieldCheck, Clock } from 'lucide-react';

function authErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code: string }).code);
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      return 'Incorrect email or password.';
    }
    if (code === 'auth/user-not-found') return 'No account found with that email.';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Try again later.';
    if (code === 'auth/popup-closed-by-user') return 'Google sign-in was cancelled.';
  }
  return 'Sign in failed. Check your credentials and try again.';
}

export const LoginPage: React.FC = () => {
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';
  const redirectTo =
    searchParams.get('redirect') ||
    (location.state as { from?: string } | null)?.from ||
    '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      navigate(redirectTo);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      await signInWithGoogle(rememberMe);
      navigate(redirectTo);
    } catch (err) {
      setError(authErrorMessage(err));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-elevated border border-stone-200/80 dark:border-stone-800 max-w-md w-full p-8 space-y-6">
        
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 dark:bg-forest-800 text-white flex items-center justify-center mx-auto shadow-md">
            <Trees className="w-6 h-6 text-forest-200" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">Welcome Back</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">Sign in to access and manage your family tree</p>
        </div>

        {/* Expired Session Notice */}
        {isExpired && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 text-xs border border-amber-200 dark:border-amber-800/80 flex items-start gap-2.5 animate-in fade-in duration-200">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold block text-amber-950 dark:text-amber-100">Session Expired</span>
              <span>Your session has expired due to inactivity. Please sign in to securely continue.</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full py-3 px-4 bg-white dark:bg-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-xl text-xs font-bold border border-stone-300 dark:border-stone-700 shadow-sm flex items-center justify-center gap-3 transition hover:scale-[1.01] active:scale-98"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/>
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"/>
          </svg>
          <span>Sign In with Google</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
          <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500">or sign in with email</span>
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-forest-700 dark:text-forest-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-forest-700 focus:ring-forest-500 w-3.5 h-3.5"
              />
              <span>Remember me (Keep active for 7 days)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to FamilyTree'}
          </button>
        </form>

        <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
          <span>Protected by Firebase Authentication</span>
        </div>

        {/* Registration footer */}
        <p className="text-center text-xs text-stone-500 dark:text-stone-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-forest-700 dark:text-forest-400 hover:underline">
            Create Free Account
          </Link>
        </p>

      </div>
    </div>
  );
};
