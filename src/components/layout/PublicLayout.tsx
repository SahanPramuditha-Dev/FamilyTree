import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Trees, Shield, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';

export const PublicLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-forest-500 selection:text-white transition-colors">
      
      {/* Public Header */}
      <header className="h-20 bg-stone-900/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-800 sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-forest-600 flex items-center justify-center text-white shadow-md">
            <Trees className="w-6 h-6 text-forest-100" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl text-white tracking-tight block">
              FamilyTree
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-forest-400 block -mt-1">
              Lineage • Memory • Heritage
            </span>
          </div>
        </Link>

        {/* Center navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-stone-300">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/about" className="hover:text-white transition">About Platform</Link>
          <Link to="/features" className="hover:text-white transition">Features</Link>
          <Link to="/help" className="hover:text-white transition">Help & FAQ</Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-forest-600 hover:bg-forest-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-stone-300 hover:text-white text-xs font-semibold transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-forest-600 hover:bg-forest-500 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-stone-950 text-stone-400 text-xs py-14 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <Trees className="w-5 h-5 text-forest-400" />
              <span className="font-serif font-bold text-base">FamilyTree</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              The modern platform for preserving generations of family lineage, memories, historical records, and interactive genealogy trees.
            </p>
            <div className="pt-2 text-stone-500 text-[11px]">
              © {new Date().getFullYear()} FamilyTree Roots Platform. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Explore Product</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/features" className="hover:text-white transition">Interactive Family Tree</Link></li>
              <li><Link to="/features" className="hover:text-white transition">Relationship Finder</Link></li>
              <li><Link to="/features" className="hover:text-white transition">Family Migration Map</Link></li>
              <li><Link to="/features" className="hover:text-white transition">GEDCOM 5.5 Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Privacy & Trust</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition">Cookie Preferences</Link></li>
              <li><Link to="/about" className="hover:text-white transition">Living Person Privacy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Support & Community</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/help" className="hover:text-white transition">Help Center & FAQ</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About the Team</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Demo Access</Link></li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  );
};
