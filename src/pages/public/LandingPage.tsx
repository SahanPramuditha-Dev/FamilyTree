import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GitFork,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Image as ImageIcon,
  Map,
  Download,
  ArrowRight,
  ChevronRight,
  Lock,
  Zap,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DEMO_NODES = [
  {
    id: 'demo-founder',
    firstName: 'Arthur',
    lastName: 'Sterling',
    generation: 1,
    occupation: 'Master Architect',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    location: 'London, UK',
    childCount: 3,
    label: 'Gen 1 · Founder',
  },
  {
    id: 'demo-parent',
    firstName: 'Robert',
    lastName: 'Sterling',
    generation: 2,
    occupation: 'Professor of Medicine',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    location: 'Oxford, UK',
    childCount: 2,
    label: 'Gen 2 · Elder',
  },
  {
    id: 'demo-current',
    firstName: 'Alexander',
    lastName: 'Sterling',
    generation: 3,
    occupation: 'Software Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    location: 'San Francisco, USA',
    childCount: 2,
    label: 'Gen 3 · Active',
  },
];

const FEATURES = [
  {
    icon: GitFork,
    color: 'bg-forest-100 dark:bg-forest-900/60 text-forest-700 dark:text-forest-300',
    title: 'Interactive Tree Graph',
    desc: 'Navigate fluidly across generations. Zoom, pan, expand/collapse branches, and view spouse and child connectors with ease.',
  },
  {
    icon: Sparkles,
    color: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    title: 'Smart Relationship Finder',
    desc: 'Pick any two relatives and instantly compute their exact relationship path with visual step-by-step connections.',
  },
  {
    icon: Map,
    color: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
    title: 'Migration & Geography Map',
    desc: 'Pinpoint ancestral birthplaces and track family movements across cities, countries, and diaspora migrations on an interactive world map.',
  },
  {
    icon: ImageIcon,
    color: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300',
    title: 'Photo & Memory Vault',
    desc: 'Preserve vintage portraits and milestone photos in categorised albums with face-tagging and timeline integration.',
  },
  {
    icon: BookOpen,
    color: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    title: 'Family Stories & Lore',
    desc: 'Record oral traditions, immigration journeys, and cherished anecdotes in rich, formatted articles with member tags.',
  },
  {
    icon: Download,
    color: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
    title: 'GEDCOM 5.5 & Posters',
    desc: 'Export/import standard GEDCOM files or generate high-resolution print-ready family tree posters in A4, A3, and large frames.',
  },
];

const STATS = [
  { value: 'Unlimited', label: 'Generations Supported' },
  { value: '100%', label: 'GEDCOM 5.5 Compliant' },
  { value: '< 1s', label: 'Kinship Calculations' },
  { value: '256-bit', label: 'Cloud Encryption' },
];

const PRIVACY_POINTS = [
  {
    icon: Lock,
    title: 'Living Member Protection',
    desc: 'Sensitive details of living individuals are automatically masked from public indexers and search engines.',
  },
  {
    icon: ShieldCheck,
    title: 'Granular Role Controls',
    desc: 'Assign relatives as Admins, Editors, Contributors, or Viewers—with per-branch privacy settings.',
  },
  {
    icon: Globe,
    title: 'Complete Data Ownership',
    desc: 'Export your full dataset at any time in standard GEDCOM, JSON, or CSV formats with zero lock-in.',
  },
];

export const LandingPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch {
      navigate('/login');
    }
  };

  return (
    <div className="overflow-hidden transition-colors duration-200">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-36 bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-white px-6 transition-colors">

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1f3f2e_1px,transparent_1px)] dark:bg-[radial-gradient(#295f41_1px,transparent_1px)] [background-size:30px_30px] opacity-15 dark:opacity-20" />

        {/* Radial glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-forest-500/10 dark:bg-forest-700/20 blur-3xl" />

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-50 dark:bg-forest-900/70 border border-forest-200 dark:border-forest-600/40 text-forest-800 dark:text-forest-300 text-xs font-semibold mb-8 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Built by <strong>NEXUSIS</strong> · Next-Generation Family Heritage &amp; Lineage Platform</span>
        </div>

        {/* Title */}
        <h1 className="relative font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.08] mb-6 text-stone-900 dark:text-white">
          Preserve Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 via-teal-600 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-forest-300">
            Ancestral Roots
          </span>{' '}
          Across Generations
        </h1>

        {/* Subtitle */}
        <p className="relative text-sm sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed mb-10">
          An interactive, privacy-first genealogy platform. Chronicle family trees, map diaspora
          migrations, preserve historical photos, and calculate kinship with modern AI-ready
          precision.
        </p>

        {/* CTAs */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            Create Your Family Tree
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleGoogleAuth}
            className="px-6 py-3.5 bg-white hover:bg-stone-50 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-xl text-sm font-bold shadow-md flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 border border-stone-200 dark:border-stone-700"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Live Lineage Preview */}
        <div className="relative mt-16 w-full max-w-4xl mx-auto bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-7 shadow-xl dark:shadow-2xl backdrop-blur-xl text-left transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-forest-700 dark:text-forest-400">
                Interactive Multi-Generation Preview
              </span>
            </div>
            <Link
              to="/login"
              className="text-[11px] text-stone-500 hover:text-forest-700 dark:text-stone-400 dark:hover:text-forest-300 font-semibold flex items-center gap-1 transition"
            >
              Open Tree Canvas <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DEMO_NODES.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate('/login')}
                className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800 hover:border-forest-500/50 hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
              >
                <div className="text-[10px] text-stone-500 dark:text-stone-500 font-bold uppercase tracking-wider mb-3">
                  {m.label}
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={m.avatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover border border-stone-200 dark:border-stone-700"
                  />
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                      {m.firstName} {m.lastName}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{m.occupation}</p>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-200 dark:border-stone-800 text-[11px] flex justify-between text-stone-500 dark:text-stone-400">
                  <span>{m.location}</span>
                  <span className="text-forest-600 dark:text-forest-400 font-semibold">{m.childCount} Children</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-stone-950 py-24 px-6 border-t border-stone-200 dark:border-stone-900 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-forest-50 dark:bg-forest-900/60 border border-forest-200 dark:border-forest-700/50 text-forest-800 dark:text-forest-300 text-xs font-semibold mb-4">
              Platform Features
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
              Engineered for Every Family &amp; Every Generation
            </h2>
            <p className="mt-3 text-stone-600 dark:text-stone-400 text-sm max-w-xl mx-auto">
              Modern graph visualisation, privacy-first controls, and archival fidelity — all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className="group p-6 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:-translate-y-1 transition-all duration-200 shadow-xs hover:shadow-md"
              >
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-2">{title}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="bg-forest-900 dark:bg-forest-950 py-16 px-6 border-t border-forest-800 dark:border-forest-900 text-white transition-colors">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label} className="p-6 rounded-2xl bg-forest-800/70 dark:bg-forest-900/40 border border-forest-700/60 dark:border-forest-800/60 shadow-xs">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-300 dark:text-emerald-400 block">
                {value}
              </span>
              <p className="text-xs text-forest-100 dark:text-forest-300 font-semibold mt-2 leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Privacy ───────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-stone-950 py-24 px-6 border-t border-stone-200 dark:border-stone-900 transition-colors">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <div className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 dark:bg-forest-900/70 border border-forest-200 dark:border-forest-700/50 text-forest-800 dark:text-forest-300 text-xs font-semibold mb-5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Privacy-First Architecture
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white leading-snug">
                Your Family's Heritage Stays Strictly In Your Control
              </h2>
              <p className="mt-4 text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                Genealogy data is deeply personal. We implement strict privacy boundaries by
                default so your family's story remains yours alone.
              </p>
            </div>

            <div className="space-y-5">
              {PRIVACY_POINTS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-forest-50 dark:bg-forest-900/60 border border-forest-200 dark:border-forest-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-forest-700 dark:text-forest-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-200">{title}</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3-step card */}
          <div className="p-7 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-7 shadow-xs">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
              Start Your Family Archive in 3 Simple Steps
            </h3>

            <div className="space-y-5">
              {[
                {
                  n: 1,
                  title: 'Create Your Family Profile',
                  desc: 'Name your lineage, define origin country, and select privacy level.',
                },
                {
                  n: 2,
                  title: 'Add Relatives & Connect Generations',
                  desc: 'Add yourself, parents, spouses, and children with our intuitive tree tools.',
                },
                {
                  n: 3,
                  title: 'Invite Relatives to Collaborate',
                  desc: 'Share invite links or QR codes so cousins and elders can add stories and photos.',
                },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex gap-4 items-start">
                  <div className="w-7 h-7 rounded-full bg-forest-600 dark:bg-forest-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                    {n}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-200">{title}</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/onboarding"
              className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-sm transition-all active:scale-95 shadow-sm"
            >
              Launch Onboarding Wizard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-stone-100/70 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-900 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 dark:bg-forest-900/70 border border-forest-200 dark:border-forest-700/40 text-forest-800 dark:text-forest-300 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5" />
            Free to Start · No Credit Card Required
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white mb-4">
            Ready to Document Your Family's Lineage?
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm mb-8 max-w-lg mx-auto">
            Join families preserving their history for future generations — get started in under a minute.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Create Your Free Tree
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/features"
              className="px-6 py-3.5 bg-white hover:bg-stone-50 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white border border-stone-300 dark:border-stone-700 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-xs"
            >
              View All Features
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
