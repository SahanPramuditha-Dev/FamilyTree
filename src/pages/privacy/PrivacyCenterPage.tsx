import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  Globe, 
  Search, 
  Check, 
  Sparkles, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { PrivacySettings } from '../../types';

export const PrivacyCenterPage: React.FC = () => {
  const { family, updateFamilySettings } = useFamily();
  const [saved, setSaved] = useState(false);

  const [privacy, setPrivacy] = useState<PrivacySettings>(family.privacy);

  const handleSave = () => {
    updateFamilySettings({ privacy });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
          <span>Genealogical Privacy Architecture</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Privacy Center & Controls
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
          Configure living person protection, data masking, and public visibility rules across your family archives.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Privacy preferences saved successfully across all branch nodes!</span>
        </div>
      )}

      {/* Critical Golden Rule Banner */}
      <div className="p-5 rounded-3xl bg-forest-950 text-white flex items-start gap-4 shadow-elevated border border-forest-800">
        <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-sm text-white">Living Person Shield Guarantee</h4>
          <p className="text-forest-200 leading-relaxed">
            By genealogical standards, living relatives' sensitive information (exact birthdays, contact details, residence addresses) is never made publicly searchable without explicit consent.
          </p>
        </div>
      </div>

      {/* Privacy Controls Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6">
        
        {/* Toggle 1: Tree Visibility */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-100">
          <div className="space-y-0.5 max-w-md">
            <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-forest-700" />
              <span>Public Family Tree Portal</span>
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              When enabled, a read-only public version of your tree (with living individuals masked) can be viewed by relatives via link.
            </p>
          </div>
          <input
            type="checkbox"
            checked={privacy.isPublic}
            onChange={(e) => setPrivacy({ ...privacy, isPublic: e.target.checked })}
            className="w-5 h-5 rounded text-forest-700 focus:ring-forest-500"
          />
        </div>

        {/* Toggle 2: Hide Living Members */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-100">
          <div className="space-y-0.5 max-w-md">
            <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-forest-700" />
              <span>Hide Living Members Details</span>
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Mask living relatives with generic placeholder labels (e.g. "Living Relative") for non-collaborator viewers.
            </p>
          </div>
          <input
            type="checkbox"
            checked={privacy.hideLivingMembers}
            onChange={(e) => setPrivacy({ ...privacy, hideLivingMembers: e.target.checked })}
            className="w-5 h-5 rounded text-forest-700 focus:ring-forest-500"
          />
        </div>

        {/* Toggle 3: Hide Sensitive Dates */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-100">
          <div className="space-y-0.5 max-w-md">
            <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-forest-700" />
              <span>Mask Exact Vital Dates</span>
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Only display the year (e.g. "1994") rather than the exact month and day on public views to protect identity.
            </p>
          </div>
          <input
            type="checkbox"
            checked={privacy.hideSensitiveDates}
            onChange={(e) => setPrivacy({ ...privacy, hideSensitiveDates: e.target.checked })}
            className="w-5 h-5 rounded text-forest-700 focus:ring-forest-500"
          />
        </div>

        {/* Media Visibilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Photo Album Visibility
            </label>
            <select
              value={privacy.photoVisibility}
              onChange={(e) => setPrivacy({ ...privacy, photoVisibility: e.target.value as any })}
              className="w-full text-xs rounded-xl border border-stone-200 p-2.5 bg-stone-50"
            >
              <option value="public">Public (Visible with tree link)</option>
              <option value="family">Family Collaborators Only</option>
              <option value="members_only">Admins & Owners Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Family Stories Visibility
            </label>
            <select
              value={privacy.storyVisibility}
              onChange={(e) => setPrivacy({ ...privacy, storyVisibility: e.target.value as any })}
              className="w-full text-xs rounded-xl border border-stone-200 p-2.5 bg-stone-50"
            >
              <option value="family">Family Collaborators Only</option>
              <option value="public">Public (Visible with tree link)</option>
              <option value="members_only">Admins & Owners Only</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-stone-100 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
          >
            Save Privacy Rules
          </button>
        </div>

      </div>

    </div>
  );
};
