import React from 'react';
import { 
  GitFork, 
  Route, 
  Map, 
  Image as ImageIcon, 
  BookOpen, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  Download, 
  Clock, 
  Split,
  Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturesPage: React.FC = () => {
  const featureList = [
    {
      icon: GitFork,
      title: 'Interactive Family Tree Graph',
      desc: 'Zoom, pan, center, and expand/collapse branches. Supports spouse pairings, multi-parent linkages, and multi-generation hierarchy.'
    },
    {
      icon: Route,
      title: 'Genealogical Relationship Finder',
      desc: 'Graph pathfinding engine calculates exact relationship terminology (first cousins, aunts, second cousins once removed).'
    },
    {
      icon: Map,
      title: 'Family Geography & Migration Trails',
      desc: 'Interactive world map tracking ancestral birthplaces, current locations, and global diaspora migrations.'
    },
    {
      icon: Split,
      title: 'Branch Segmentation',
      desc: 'Organize large extended lineages into color-coded family branches with dedicated branch leaders and statistics.'
    },
    {
      icon: Clock,
      title: 'Chronological Life Timeline',
      desc: 'View births, weddings, graduations, migrations, and milestones chronologically on an interactive vertical timeline.'
    },
    {
      icon: Calendar,
      title: 'Family Events & Reunions',
      desc: 'Schedule milestone birthdays, anniversaries, and reunions with participant tracking and RSVP response handling.'
    },
    {
      icon: ImageIcon,
      title: 'Photo System & Albums',
      desc: 'Categorized albums with face-tagging of relatives, captioning, historical dates, and comment discussions.'
    },
    {
      icon: BookOpen,
      title: 'Preserved Family Stories',
      desc: 'Rich story narrative editor to document oral histories, childhood recollections, and landmark family chapters.'
    },
    {
      icon: FileText,
      title: 'Historical Documents Vault',
      desc: 'Store scanned birth certificates, marriage certificates, deeds, and letters linked directly to individual relatives.'
    },
    {
      icon: Download,
      title: 'GEDCOM 5.5 Export & Import',
      desc: 'Standard genealogy file interchange support for migrating records across international genealogy databases.'
    },
    {
      icon: Printer,
      title: 'High-Resolution Poster Printing',
      desc: 'Generate printable family tree posters formatted in A4, A3, and custom landscape/portrait framing.'
    },
    {
      icon: ShieldCheck,
      title: 'Granular Privacy & Collaboration',
      desc: 'Role-based invitations (Owner, Admin, Editor, Contributor, Viewer) with automatic living member data shields.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
      
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-forest-700 dark:text-forest-400">Platform Capabilities</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
          A Complete Genealogical Platform for Modern Families
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
          Explore the rich feature suite built specifically for family historians, researchers, and close-knit relatives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featureList.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-soft hover:shadow-elevated transition">
              <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-900/60 text-forest-800 dark:text-forest-300 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-2">{f.title}</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-r from-forest-800 to-forest-900 text-white text-center space-y-4 shadow-lg">
        <h3 className="font-serif font-bold text-2xl">Experience All Features in the Interactive Demo</h3>
        <p className="text-xs text-forest-200 max-w-xl mx-auto">
          Explore a pre-seeded 4-generation family tree with all features unlocked.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-2.5 bg-white text-forest-900 font-bold rounded-xl text-xs shadow hover:bg-forest-50 transition"
        >
          Launch Platform Demo
        </Link>
      </div>

    </div>
  );
};
