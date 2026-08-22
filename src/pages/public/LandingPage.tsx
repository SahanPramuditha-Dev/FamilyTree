import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trees, 
  GitFork, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Image as ImageIcon, 
  Map, 
  Download, 
  Users, 
  Heart, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  ShieldAlert,
  Award,
  Globe,
  Lock,
  Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
// Static demo lineage nodes for public landing showcase preview
const DEMO_SHOWCASE_NODES = [
  {
    id: 'demo-founder',
    firstName: 'Arthur',
    lastName: 'Sterling',
    generation: 1,
    occupation: 'Master Architect',
    isLiving: false,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    currentLocation: 'London, UK',
    childCount: 3,
    roleLabel: 'Gen 1 (Founders)'
  },
  {
    id: 'demo-parent',
    firstName: 'Robert',
    lastName: 'Sterling',
    generation: 2,
    occupation: 'Professor of Medicine',
    isLiving: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    currentLocation: 'Oxford, UK',
    childCount: 2,
    roleLabel: 'Gen 2 (Parents / Elders)'
  },
  {
    id: 'demo-current',
    firstName: 'Alexander',
    lastName: 'Sterling',
    generation: 3,
    occupation: 'Software Engineer',
    isLiving: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    currentLocation: 'San Francisco, USA',
    childCount: 2,
    roleLabel: 'Gen 3 (Current / Active)'
  }
];

export const LandingPage: React.FC = () => {
  const { signInWithGoogle, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (e) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. Hero Section with Live Animated Particles & Gradients */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-radial from-stone-900 via-stone-950 to-stone-950 text-white">
        
        {/* Animated Background Mesh & Floating Lineage Nodes */}
        <div className="absolute inset-0 bg-[radial-gradient(#295f41_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
        
        {/* Glowing Animated Radial Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-forest-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/80 border border-forest-600/60 text-forest-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner hover:scale-105 transition duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-forest-400" />
            <span>Interactive Multi-Generation Genealogy Platform</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.15] text-stone-100">
            Preserve Your Heritage. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-400 via-emerald-300 to-teal-200 animate-gradient">
              Visualize Your Lineage.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Build interactive multi-generation family trees, calculate complex relationships, map migrations, and preserve ancestral stories and historical documents.
          </p>

          {/* Primary CTA Buttons with Google Sign-In */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            
            {/* Build Tree Button */}
            <Link
              to="/register"
              className="px-8 py-4 bg-forest-600 hover:bg-forest-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-forest-950/60 flex items-center gap-2.5 transition hover:scale-105 active:scale-95"
            >
              <span>Build Your Family Tree Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Google Sign In Direct Button */}
            <button
              onClick={handleGoogleAuth}
              className="px-6 py-4 bg-white hover:bg-stone-50 text-stone-900 rounded-2xl text-sm font-bold shadow-lg flex items-center gap-3 transition hover:scale-105 active:scale-95 border border-stone-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Live 4-Gen Demo */}
            <button
              onClick={() => {
                quickDemoLogin('owner');
                navigate('/tree');
              }}
              className="px-6 py-4 bg-stone-900/90 hover:bg-stone-800 text-stone-300 border border-stone-700 rounded-2xl text-sm font-bold flex items-center gap-2 transition hover:text-white"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Explore Live 4–Gen Demo</span>
            </button>

          </div>

          {/* Live Interactive Tree Preview Showcase Card */}
          <div className="mt-16 max-w-5xl mx-auto bg-stone-900/95 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative group text-left">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-forest-300">
                  Interactive Multi-Generation Lineage Preview
                </span>
              </div>
              <button 
                onClick={() => {
                  quickDemoLogin('owner');
                  navigate('/tree');
                }}
                className="text-xs text-forest-400 hover:text-forest-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                Explore In Interactive Tree Canvas <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Generational Nodes Carousel / Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DEMO_SHOWCASE_NODES.map((m) => (
                <div 
                  key={m.id} 
                  onClick={() => navigate('/tree')}
                  className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-forest-500/60 transition cursor-pointer shadow-sm hover:shadow-elevated hover:-translate-y-1 duration-200"
                >
                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-2">
                    <span>{m.roleLabel}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt="" className="w-11 h-11 rounded-xl object-cover border border-stone-700 shadow-sm" />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-forest-900 text-forest-300 font-bold flex items-center justify-center font-serif">
                        {m.firstName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-sm text-stone-200 truncate">
                        {m.firstName} {m.lastName}
                      </h4>
                      <p className="text-[11px] text-stone-400 truncate mt-0.5">
                        {m.occupation}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-800/80 text-[11px] text-stone-500 flex justify-between">
                    <span>{m.currentLocation}</span>
                    <span className="text-forest-400 font-semibold">
                      {m.childCount} Children (Gen {m.generation + 1})
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 2. Key Features Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Engineered for Every Family & Every Generation
          </h2>
          <p className="mt-4 text-stone-600 text-base">
            Modern graph visualization, privacy-first controls, and archival fidelity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-soft hover:shadow-elevated transition hover:-translate-y-1.5 duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Interactive Tree Graph
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Navigate fluidly across generations. Zoom, pan, expand/collapse branches, and view spouse and child connectors with ease.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-soft hover:shadow-elevated transition hover:-translate-y-1.5 duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Smart Relationship Finder
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Pick any two relatives and instantly compute their exact relationship path with visual step-by-step connections.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-soft hover:shadow-elevated transition hover:-translate-y-1.5 duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Migration & Geography Map
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Pinpoint ancestral birthplaces, tracking family movements across cities, countries, and global diaspora migrations on an interactive world map.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-soft hover:shadow-elevated transition hover:-translate-y-1.5 duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Photo & Memory Vault
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Preserve vintage portraits and milestone photos in categorized albums with face-tagging of relatives and timeline integration.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-soft hover:shadow-elevated transition hover:-translate-y-1.5 duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Family Stories & Lore
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Record oral traditions, immigration journeys, and cherished anecdotes in rich, formatted articles with member tags.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-soft hover:shadow-elevated transition hover:-translate-y-1.5 duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              GEDCOM 5.5 & Print Posters
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Export and import standard GEDCOM genealogy files or generate high-resolution, print-ready family tree posters formatted for A4, A3, and large frames.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Universal Privacy Section */}
      <section className="bg-forest-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-900 border border-forest-700 text-forest-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-400" />
                <span>Privacy-First Architecture</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-snug">
                Your Family’s Sensitive Heritage Stays Strictly In Your Control
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                Genealogy data is deeply personal. We implement strict privacy boundaries by default:
              </p>
              
              <ul className="space-y-3 text-xs text-stone-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Living Member Protection:</strong> Sensitive details of living individuals are masked from public indexers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Granular Role Controls:</strong> Assign relatives as Admins, Editors, Contributors, or Viewers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Complete Data Ownership:</strong> Export your full dataset at any time in standard GEDCOM, JSON, or CSV formats.</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl bg-forest-900/60 border border-forest-800/80 shadow-xl space-y-6">
              <h3 className="font-serif font-bold text-xl text-forest-200">
                Start Your Family Archive in 3 Simple Steps
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-forest-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Create Your Family Profile</h4>
                    <p className="text-xs text-stone-400 mt-0.5">Name your lineage, define origin country, and select privacy level.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-forest-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Add Relatives & Connect Generations</h4>
                    <p className="text-xs text-stone-400 mt-0.5">Add yourself, parents, spouses, and children with our intuitive tree tools.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-forest-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Invite Relatives to Collaborate</h4>
                    <p className="text-xs text-stone-400 mt-0.5">Share invite links or QR codes so cousins and elders can add stories and photos.</p>
                  </div>
                </div>
              </div>

              <Link
                to="/onboarding"
                className="block text-center py-3 px-6 bg-forest-500 hover:bg-forest-400 text-forest-950 font-bold rounded-2xl text-xs transition active:scale-95"
              >
                Launch Onboarding Wizard
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Statistics */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-stone-100 border border-stone-200">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">Unlimited</span>
            <p className="text-xs text-stone-600 font-semibold mt-1">Generations Supported</p>
          </div>
          <div className="p-6 rounded-2xl bg-stone-100 border border-stone-200">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">100%</span>
            <p className="text-xs text-stone-600 font-semibold mt-1">GEDCOM 5.5 Compliant</p>
          </div>
          <div className="p-6 rounded-2xl bg-stone-100 border border-stone-200">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">&lt; 1s</span>
            <p className="text-xs text-stone-600 font-semibold mt-1">Pathfinding Kinship Calculations</p>
          </div>
          <div className="p-6 rounded-2xl bg-stone-100 border border-stone-200">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">256-Bit</span>
            <p className="text-xs text-stone-600 font-semibold mt-1">Secure Cloud Encryption</p>
          </div>
        </div>
      </section>

      {/* 5. Call To Action Footer Banner */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold">
              Ready to Document Your Family’s Lineage?
            </h2>
            <p className="text-forest-200 text-sm">
              Create your free interactive family tree today.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white text-forest-900 hover:bg-forest-50 font-bold rounded-2xl text-xs shadow-lg transition active:scale-95"
              >
                Create Your Free Tree
              </Link>
              <button
                onClick={handleGoogleAuth}
                className="px-6 py-3.5 bg-forest-800 hover:bg-forest-700 text-white font-bold rounded-2xl text-xs border border-forest-600/60 transition flex items-center gap-2"
              >
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
