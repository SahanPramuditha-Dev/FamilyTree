import React, { useState } from 'react';
import { Shield, FileText, Cookie } from 'lucide-react';

export const LegalPages: React.FC<{ initialTab?: 'privacy' | 'terms' | 'cookies' }> = ({ initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
      
      {/* Navigation tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 gap-6">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${
            activeTab === 'privacy' 
              ? 'border-forest-600 text-forest-800 dark:text-forest-400' 
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${
            activeTab === 'terms' 
              ? 'border-forest-600 text-forest-800 dark:text-forest-400' 
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Terms & Conditions</span>
        </button>

        <button
          onClick={() => setActiveTab('cookies')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${
            activeTab === 'cookies' 
              ? 'border-forest-600 text-forest-800 dark:text-forest-400' 
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
          }`}
        >
          <Cookie className="w-4 h-4" />
          <span>Cookie Policy</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft text-xs text-stone-600 dark:text-stone-400 space-y-6 leading-relaxed">
        
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">Privacy Policy</h2>
            <p className="text-stone-500 dark:text-stone-400">Last updated: August 2026</p>

            <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200 pt-2">1. Data Ownership & Protection</h3>
            <p>
              Your family tree records, uploaded photographs, historical certificates, and written oral narratives are your sole property. We never license, sell, or commercialize your genealogical data.
            </p>

            <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200 pt-2">2. Protection of Living Individuals</h3>
            <p>
              By default, records marked as living individuals are protected from public visibility and indexing bots. Only authenticated collaborators whom you explicitly invite can view private details.
            </p>

            <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200 pt-2">3. Storage & Encryption</h3>
            <p>
              All genealogical data and documents are stored with industry-standard 256-bit encryption in transit and at rest.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">Terms of Service</h2>
            <p className="text-stone-500 dark:text-stone-400">Last updated: August 2026</p>

            <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200 pt-2">1. User Conduct & Content Standards</h3>
            <p>
              Users agree to upload accurate historical records and respectful family documentation. Content violating copyright or containing hate speech is strictly prohibited.
            </p>

            <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200 pt-2">2. Collaboration & Permissions</h3>
            <p>
              Family owners hold full authority to grant or revoke administrative roles, remove members, or export full tree databases at any time.
            </p>
          </div>
        )}

        {activeTab === 'cookies' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">Cookie & Local Storage Policy</h2>
            <p className="text-stone-500 dark:text-stone-400">Last updated: August 2026</p>

            <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200 pt-2">1. Essential Cookies</h3>
            <p>
              We use essential cookies and browser LocalStorage solely to maintain your authentication state, tree layout preferences, and active persona cache.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
