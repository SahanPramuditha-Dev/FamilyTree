import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFamily } from '../../context/FamilyContext';
import { Trees, UserPlus, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { Role } from '../../types';

export const InviteJoinPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const familyId = searchParams.get('family');
  const token = searchParams.get('token');
  const roleParam = searchParams.get('role') as Role | null;
  const { user, loading } = useAuth();
  const { family, collaborators, acceptInvitation } = useFamily();
  const navigate = useNavigate();
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const targetFamilyName = familyId && family.id === familyId ? family.name : 'a family tree';
  const isAlreadyMember = Boolean(
    user &&
      (family.ownerId === user.uid ||
        collaborators.some(
          (c) => c.userId === user.uid || c.email.toLowerCase() === user.email.toLowerCase()
        ))
  );

  useEffect(() => {
    if (status.type === 'success') {
      const timer = window.setTimeout(() => navigate('/dashboard'), 1500);
      return () => window.clearTimeout(timer);
    }
  }, [status.type, navigate]);

  const handleJoin = () => {
    setSubmitting(true);
    const result = acceptInvitation({
      token: token || undefined,
      role: roleParam || undefined,
      familyId: familyId || undefined,
    });
    setStatus({ type: result.success ? 'success' : 'error', message: result.message });
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <p className="text-sm text-stone-500 dark:text-stone-400">Loading invitation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 px-4 py-12 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-elevated p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 dark:bg-forest-800 text-white flex items-center justify-center mx-auto shadow-md">
            <UserPlus className="w-6 h-6 text-forest-200" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">Family Invitation</h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            You have been invited to collaborate on <strong>{targetFamilyName}</strong>.
          </p>
        </div>

        {!familyId && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>This invite link is missing a family identifier. Ask the sender for a new link.</span>
          </div>
        )}

        {status.type === 'error' && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs">
            {status.message}
          </div>
        )}

        {!user ? (
          <div className="space-y-3">
            <p className="text-xs text-stone-600 dark:text-stone-400 text-center">
              Sign in or create an account to accept this invitation.
            </p>
            <Link
              to={`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}
              className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition"
            >
              Sign In to Accept
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold flex items-center justify-center border border-stone-200 dark:border-stone-700 transition"
            >
              Create Free Account
            </Link>
          </div>
        ) : isAlreadyMember || status.type === 'success' ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs text-center space-y-2">
            <ShieldCheck className="w-5 h-5 mx-auto text-emerald-600 dark:text-emerald-400" />
            <p className="font-semibold">
              {status.type === 'success' ? status.message : 'You already have access to this tree.'}
            </p>
            <Link to="/dashboard" className="inline-flex items-center gap-1 text-forest-700 dark:text-forest-400 font-bold hover:underline">
              Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-stone-600 dark:text-stone-400 text-center">
              Signed in as <strong>{user.email}</strong>. Accepting will add you as a collaborator
              {roleParam ? ` with ${roleParam} access` : ''}.
            </p>
            <button
              onClick={handleJoin}
              disabled={submitting || !familyId}
              className="w-full py-3 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition"
            >
              <Trees className="w-4 h-4" />
              {submitting ? 'Accepting...' : 'Accept Invitation'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
