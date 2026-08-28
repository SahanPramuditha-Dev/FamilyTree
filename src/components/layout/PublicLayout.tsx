import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Trees, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';

export const PublicLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div
      className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-forest-500 selection:text-white transition-colors duration-200"
    >
      
      {/* Public Header */}
      <header className="h-20 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between transition-colors">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-forest-600 flex items-center justify-center text-white shadow-md group-hover:bg-forest-500 transition">
            <Trees className="w-6 h-6 text-forest-100" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl text-stone-900 dark:text-white tracking-tight block">
              FamilyTree
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-forest-600 dark:text-forest-400 block -mt-0.5">
              Lineage • Memory • Heritage
            </span>
          </div>
        </Link>

        {/* Center navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-stone-600 dark:text-stone-300">
          <Link to="/" className="hover:text-forest-700 dark:hover:text-white transition">Home</Link>
          <Link to="/about" className="hover:text-forest-700 dark:hover:text-white transition">About Platform</Link>
          <Link to="/features" className="hover:text-forest-700 dark:hover:text-white transition">Features</Link>
          <Link to="/help" className="hover:text-forest-700 dark:hover:text-white transition">Help & FAQ</Link>
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
                className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs font-semibold transition"
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
      <footer className="bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-400 text-xs pt-16 pb-12 border-t border-stone-200 dark:border-stone-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
            
            {/* Left Brand Column */}
            <div className="md:col-span-6 space-y-4 max-w-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-forest-600 flex items-center justify-center text-white shadow-xs">
                  <Trees className="w-4.5 h-4.5 text-forest-100" />
                </div>
                <div>
                  <span className="font-serif font-bold text-base text-stone-900 dark:text-white block leading-none">
                    FamilyTree
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-forest-600 dark:text-forest-400">
                    Lineage &bull; Memory &bull; Heritage
                  </span>
                </div>
              </div>
              <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-xs">
                The modern, privacy-first platform for preserving generations of family lineage, memories, and interactive genealogy trees.
              </p>
            </div>

            {/* Navigation Columns */}
            <div className="md:col-span-3">
              <h4 className="text-stone-900 dark:text-stone-200 font-semibold mb-4 text-xs uppercase tracking-wider">Product &amp; Features</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/features" className="text-stone-500 dark:text-stone-400 hover:text-forest-600 dark:hover:text-forest-400 transition">Interactive Tree Visualizer</Link></li>
                <li><Link to="/features" className="text-stone-500 dark:text-stone-400 hover:text-forest-600 dark:hover:text-forest-400 transition">Diaspora &amp; Migration Map</Link></li>
                <li><Link to="/features" className="text-stone-500 dark:text-stone-400 hover:text-forest-600 dark:hover:text-forest-400 transition">Smart Kinship Calculator</Link></li>
                <li><Link to="/features" className="text-stone-500 dark:text-stone-400 hover:text-forest-600 dark:hover:text-forest-400 transition">GEDCOM &amp; PDF Export</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-stone-900 dark:text-stone-200 font-semibold mb-4 text-xs uppercase tracking-wider">Support &amp; Legal</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/about" className="text-stone-500 dark:text-stone-400 hover:text-forest-600 dark:hover:text-forest-400 transition">About Platform</Link></li>
                <li><Link to="/help" className="text-stone-500 dark:text-stone-400 hover:text-forest-600 dark:hover:text-forest-400 transition">Help Center &amp; FAQ</Link></li>
                <li><Link to="/privacy-policy" className="text-stone-500 dark:text-stone-400 hover:text-forest-600 dark:hover:text-forest-400 transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-stone-500 dark:text-stone-400 hover:text-forest-600 dark:hover:text-forest-400 transition">Terms of Service</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-stone-200 dark:border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 dark:text-stone-500">
            <div className="flex items-center gap-2">
              <img src="/nexusis-monogram.svg" alt="NEXUSIS" className="w-3.5 h-3.5 rounded-xs opacity-75" />
              <span>&copy; {new Date().getFullYear()} NEXUSIS. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-stone-400 dark:text-stone-600">
              <span>Privacy-First Architecture</span>
              <span>&bull;</span>
              <span>Encrypted Heritage Storage</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
