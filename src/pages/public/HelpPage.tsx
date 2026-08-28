import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Mail } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I start building a family tree from scratch?',
      a: 'After creating an account, use the Welcome Onboarding wizard to name your family and add your first node. Then navigate to the Interactive Tree or Members section and click "Add Member" or the "+" button on any card to add parents, spouses, and children.'
    },
    {
      q: 'How does the Relationship Finder calculate complex kinship?',
      a: 'The platform executes a Breadth-First Search (BFS) algorithm across the family relationship graph. It identifies the shortest path connecting Person A and Person B, evaluates generational offsets, and derives the exact kinship terminology (e.g. second cousin once removed).'
    },
    {
      q: 'What is GEDCOM format and how do I use it?',
      a: 'GEDCOM (Genealogical Data Communication) is the global standard format for exchanging genealogical data. Under the "Export & Print" tab, you can download a full GEDCOM 5.5 file to import into other software or archival tools.'
    },
    {
      q: 'Are living family members protected from public view?',
      a: 'Yes. In the Privacy Center, you can enable "Hide Living Members" so that living relatives’ contact details, dates, and locations remain private and only accessible to authorized collaborators.'
    },
    {
      q: 'Can multiple relatives collaborate on the same tree simultaneously?',
      a: 'Absolutely. Use the "Invite Relatives" modal to share an invite link, email, or QR code with designated roles (Admin, Editor, Contributor, or Viewer).'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(search.toLowerCase()) || 
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-forest-700 dark:text-forest-400">Support & Guidance</span>
        <h1 className="font-serif text-4xl font-bold text-stone-900 dark:text-stone-100">Help Center & Frequently Asked Questions</h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm max-w-xl mx-auto">
          Find answers on adding family records, tree navigation, privacy controls, and data exports.
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto relative pt-4">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-7" />
          <input
            type="text"
            placeholder="Search questions (e.g. GEDCOM, privacy, roles)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:ring-forest-500 focus:border-forest-500 shadow-sm"
          />
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div key={idx} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-soft">
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition"
              >
                <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-stone-500 dark:text-stone-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-500 dark:text-stone-400 flex-shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-stone-600 dark:text-stone-400 leading-relaxed border-t border-stone-100 dark:border-stone-800">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Support Card */}
      <div className="p-8 rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">Still have questions?</h3>
          <p className="text-xs text-stone-600 dark:text-stone-400">Our genealogy support team is here to assist you with custom archives.</p>
        </div>
        <a
          href="mailto:support@familytree.dev"
          className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact Support</span>
        </a>
      </div>

    </div>
  );
};
