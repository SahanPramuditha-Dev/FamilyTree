import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { 
  Settings, 
  Trees, 
  Globe, 
  Check, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  PlusCircle,
  ShieldCheck 
} from 'lucide-react';

export const FamilySettingsPage: React.FC = () => {
  const { family, updateFamilySettings, resetToSampleData, clearAllMembers, createNewBlankFamily } = useFamily();

  const [name, setName] = useState(family.name);
  const [motto, setMotto] = useState(family.motto || '');
  const [description, setDescription] = useState(family.description || '');
  const [originCountry, setOriginCountry] = useState(family.originCountry);
  const [originRegion, setOriginRegion] = useState(family.originRegion || '');
  const [foundedYear, setFoundedYear] = useState(family.foundedYear || '');
  const [saved, setSaved] = useState(false);

  // New Tree Modal State
  const [showNewTreeModal, setShowNewTreeModal] = useState(false);
  const [newTreeName, setNewTreeName] = useState('');
  const [newTreeCountry, setNewTreeCountry] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFamilySettings({
      name,
      motto,
      description,
      originCountry,
      originRegion,
      foundedYear
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTreeName.trim()) return;
    createNewBlankFamily(newTreeName.trim(), newTreeCountry.trim() || 'Global');
    setName(newTreeName.trim());
    setOriginCountry(newTreeCountry.trim() || 'Global');
    setShowNewTreeModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-3xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5 text-forest-600" />
            <span>Lineage & Profile Configuration</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
            Family Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
            Customize family lineage naming, origin regions, mottos, and heritage branding.
          </p>
        </div>

        <button
          onClick={() => setShowNewTreeModal(true)}
          className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95 self-start sm:self-center"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create New Tree</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Family configuration saved successfully!</span>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Family Tree Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-300 p-2.5 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Family Motto / Words of Wisdom
            </label>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              placeholder="e.g. Honoring our roots, blooming for generations"
              className="w-full text-xs rounded-xl border border-stone-300 p-2.5 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Country of Origin
              </label>
              <input
                type="text"
                required
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 p-2.5 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Origin Region / Province
              </label>
              <input
                type="text"
                value={originRegion}
                onChange={(e) => setOriginRegion(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 p-2.5 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Earliest Established Year
              </label>
              <input
                type="text"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                placeholder="e.g. 1920"
                className="w-full text-xs rounded-xl border border-stone-300 p-2.5 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Historical Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-300 p-2.5 shadow-sm"
            />
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
            >
              Save Family Settings
            </button>
          </div>
        </form>
      </div>

      {/* Database Management & Tools Zone */}
      <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-900">Database Tools & Lineage Reset</h3>
        <p className="text-xs text-stone-500">
          Easily switch between a clean slate for your own family or load a sample 4-generation demonstration tree.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => {
              if (window.confirm('Clear all members and start with a completely empty tree?')) {
                clearAllMembers();
                alert('Family tree cleared. You can now add your own relatives.');
              }
            }}
            className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Tree to Blank Canvas</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Load the sample 4-generation multi-branch demonstration dataset?')) {
                resetToSampleData();
                alert('Sample 4-generation tree loaded.');
              }
            }}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Sample 4-Gen Demo Data</span>
          </button>
        </div>
      </div>

      {/* Create New Tree Modal */}
      {showNewTreeModal && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <h3 className="font-serif font-bold text-lg text-stone-900">Initialize New Family Tree</h3>
            <p className="text-xs text-stone-500">
              Start documenting a new family branch or a completely fresh ancestral lineage.
            </p>

            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Family Tree Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Harrison Lineage"
                  value={newTreeName}
                  onChange={(e) => setNewTreeName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Country of Origin</label>
                <input
                  type="text"
                  placeholder="e.g. Australia, Canada, Spain..."
                  value={newTreeCountry}
                  onChange={(e) => setNewTreeCountry(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewTreeModal(false)}
                  className="px-4 py-2 text-xs rounded-xl font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs rounded-xl font-bold bg-forest-700 hover:bg-forest-800 text-white shadow"
                >
                  Create Tree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
