import React from 'react';
import { Trees, Shield, Heart, Award, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-forest-700">About Roots & Heritage</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
          Preserving the Human Story Across Generations
        </h1>
        <p className="text-stone-600 text-base max-w-2xl mx-auto leading-relaxed">
          We believe family history is not just names on a chart—it is the living tapestry of sacrifices, traditions, courage, and love that shaped who we are today.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-soft space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">Our Mission</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            To provide families worldwide with an intuitive, beautiful, and privacy-first digital platform to record lineage, celebrate milestones, and hand down oral histories to future generations.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-soft space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">Our Privacy Philosophy</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            You own 100% of your data. We never sell genealogical records or personal photos to advertisers. Living members are shielded with default privacy protections.
          </p>
        </div>
      </div>

      {/* Why preserve history */}
      <div className="p-8 sm:p-12 rounded-3xl bg-stone-900 text-white space-y-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">Why Preserve Family History?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-xs text-stone-300">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">1. Identity & Belonging</h4>
            <p className="leading-relaxed">Understanding ancestral journeys gives children and youth a profound sense of self and cultural connection.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">2. Connecting Global Relatives</h4>
            <p className="leading-relaxed">Bring together diaspora branches spread across multiple continents on one shared canvas.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">3. Rescuing Oral Memories</h4>
            <p className="leading-relaxed">Prevent precious grandparent memories and historical documents from being lost to time.</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-forest-700 hover:bg-forest-800 text-white rounded-2xl text-xs font-bold shadow-lg transition"
        >
          <span>Start Your Family Tree Today</span>
        </Link>
      </div>

    </div>
  );
};
