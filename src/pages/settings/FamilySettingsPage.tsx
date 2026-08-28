import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../../context/FamilyContext';
import { 
  Settings, 
  Check, 
  Trash2, 
  Sparkles, 
  PlusCircle
} from 'lucide-react';
import { LocationSelector } from '../../components/common/LocationSelector';
import { LocationDetails } from '../../types';

export const FamilySettingsPage: React.FC = () => {
  const { family, updateFamilySettings, clearAllMembers, createNewBlankFamily } = useFamily();
  const navigate = useNavigate();

  const [name, setName] = useState(family.name);
  const [geName, setGeName] = useState(family.geName || '');
  const [geNameNative, setGeNameNative] = useState(family.geNameNative || '');
  const [ancestralEstate, setAncestralEstate] = useState(family.ancestralEstate || '');
  const [motto, setMotto] = useState(family.motto || '');
  const [description, setDescription] = useState(family.description || '');
  const [originCountry, setOriginCountry] = useState(family.originCountry);
  const [originRegion, setOriginRegion] = useState(family.originRegion || '');
  const [originLocationDetails, setOriginLocationDetails] = useState<LocationDetails | undefined>(family.originLocationDetails);
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
      geName,
      geNameNative,
      ancestralEstate,
      motto,
      description,
      originCountry: originLocationDetails?.countryName || originCountry,
      originRegion: originLocationDetails?.region || originRegion,
      originLocationDetails,
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-forest-300 border border-transparent dark:border-forest-700/50 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
            <span>Lineage & Profile Configuration</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            Family Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mt-1">
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
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Family configuration saved successfully!</span>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-soft space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
              Family Tree Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 shadow-sm focus:ring-forest-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
              Family Motto / Words of Wisdom
            </label>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              placeholder="e.g. Honoring our roots, blooming for generations"
              className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm focus:ring-forest-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                වාසගම / Traditional Ge-Name (English & Native)
              </label>
              <input
                type="text"
                value={geName}
                onChange={(e) => setGeName(e.target.value)}
                placeholder="e.g. Kuruppu Arachchige / කුරුප්පු ආරච්චිගේ"
                className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Ancestral Estate / Maha Gedara (මහ ගෙදර)
              </label>
              <input
                type="text"
                value={ancestralEstate}
                onChange={(e) => setAncestralEstate(e.target.value)}
                placeholder="e.g. Walauwa / Maha Gedara, Kotugoda"
                className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm focus:ring-forest-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <LocationSelector
              label="Ancestral Land & Country/Village of Origin"
              value={originLocationDetails || originCountry}
              onChange={(loc) => {
                setOriginLocationDetails(loc);
                setOriginCountry(loc.countryName);
                setOriginRegion(loc.region || '');
              }}
              placeholder="Select ancestral country, province, or village..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Earliest Established Year
              </label>
              <input
                type="text"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                placeholder="e.g. 1920"
                className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm focus:ring-forest-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
              Historical Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 shadow-sm focus:ring-forest-500"
            />
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end">
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
      <div className="bg-stone-50 dark:bg-stone-850 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-750 space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">Tree Management & Reset</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Reset all members, media, and records in this family tree to start over with a fresh blank canvas.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => navigate('/onboarding')}
            className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch 5-Step Setup Wizard</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all family members, photos, and events to start with a blank tree? This action cannot be undone.')) {
                clearAllMembers();
                alert('Family tree has been reset to a blank canvas.');
              }
            }}
            className="px-4 py-2 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900 border border-transparent dark:border-rose-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Tree to Blank Canvas</span>
          </button>
        </div>
      </div>

      {/* Create New Tree Modal */}
      {showNewTreeModal && (
        <div className="fixed inset-0 bg-stone-950/70 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 dark:border-stone-800 space-y-5 animate-in fade-in zoom-in-95">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">Initialize New Family Tree</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Start documenting a new family branch or a completely fresh ancestral lineage.
            </p>

            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Family Tree Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Harrison Lineage"
                  value={newTreeName}
                  onChange={(e) => setNewTreeName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Country of Origin</label>
                <input
                  type="text"
                  placeholder="e.g. Australia, Canada, Spain..."
                  value={newTreeCountry}
                  onChange={(e) => setNewTreeCountry(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewTreeModal(false)}
                  className="px-4 py-2 text-xs rounded-xl font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs rounded-xl font-bold bg-forest-700 hover:bg-forest-800 text-white shadow transition"
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
