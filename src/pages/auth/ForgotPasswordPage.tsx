import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Trees, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await resetPassword(email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-elevated border border-stone-200/80 max-w-md w-full p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center mx-auto shadow-md">
            <Trees className="w-6 h-6 text-forest-200" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Reset Password</h2>
          <p className="text-xs text-stone-500">We will send password reset instructions to your email</p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-forest-50 border border-forest-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-forest-700 mx-auto" />
            <h4 className="font-bold text-sm text-stone-900">Check Your Inbox</h4>
            <p className="text-xs text-stone-600">
              If an account exists for <strong>{email}</strong>, a recovery link has been delivered.
            </p>
            <Link
              to="/login"
              className="inline-block pt-2 text-xs font-bold text-forest-700 hover:underline"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 text-xs rounded-xl border border-stone-300 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
            >
              Send Password Reset Link
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <Link to="/login" className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
