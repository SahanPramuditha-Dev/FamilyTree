import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFamily } from '../../context/FamilyContext';
import { useFamilyAccess } from '../../hooks/useFamilyAccess';
import { 
  ShieldCheck, 
  EyeOff, 
  Lock, 
  Globe, 
  Check, 
  Copy
} from 'lucide-react';
import { PrivacySettings } from '../../types';
import { SelectDropdown, SelectOption } from '../../components/ui/Dropdown';

const visibilityOptions: SelectOption[] = [
  { value: 'public', label: 'Public (Visible with tree link)', description: 'Accessible to anyone with the tree link' },
  { value: 'family', label: 'Family Collaborators Only', description: 'Restricted to invited family members' },
  { value: 'members_only', label: 'Admins & Owners Only', description: 'Restricted to administrators' }
];

export const PrivacyCenterPage: React.FC = () => {
  const { family, updateFamilySettings, unpublishTree } = useFamily();
  const { canManagePrivacy } = useFamilyAccess();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const [privacy, setPrivacy] = useState<PrivacySettings>(family.privacy);
  const publicTreeUrl = `${window.location.origin}/tree/public/${family.id}`;

  const handleCopyPublicLink = async () => {
    await navigator.clipboard.writeText(publicTreeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    updateFamilySettings({ privacy });
    // If the tree is being made private, remove the public Firestore snapshot
    if (!privacy.isPublic && family.privacy.isPublic) {
      await unpublishTree();
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-forest-300 border border-transparent dark:border-forest-700/50 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
          <span>Genealogical Privacy Architecture</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Privacy Center & Controls
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mt-1">
          Configure living person protection, data masking, and public visibility rules across your family archives.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Privacy preferences saved successfully across all branch nodes!</span>
        </div>
      )}

      {/* Critical Golden Rule Banner */}
      <div className="p-5 rounded-3xl bg-forest-950 dark:bg-stone-900 text-white flex items-start gap-4 shadow-elevated border border-forest-800 dark:border-stone-800">
        <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-sm text-white">Living Person Shield Guarantee</h4>
          <p className="text-forest-200 dark:text-stone-300 leading-relaxed">
            By genealogical standards, living relatives' sensitive information (exact birthdays, contact details, residence addresses) is never made publicly searchable without explicit consent.
          </p>
        </div>
      </div>

      {/* Privacy Controls Form */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-soft space-y-6">
        
        {/* Toggle 1: Tree Visibility */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-100 dark:border-stone-800">
          <div className="space-y-0.5 max-w-md">
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-forest-700 dark:text-forest-400" />
              <span>Public Family Tree Portal</span>
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              When enabled, a read-only public version of your tree (with living individuals masked) can be viewed by relatives via link.
            </p>
          </div>
          <input
            type="checkbox"
            checked={privacy.isPublic}
            disabled={!canManagePrivacy}
            onChange={(e) => setPrivacy({ ...privacy, isPublic: e.target.checked })}
            className="w-5 h-5 rounded text-forest-700 focus:ring-forest-500 cursor-pointer"
          />
        </div>

        {(privacy.isPublic || family.privacy.isPublic) && (
          <div className="pb-6 border-b border-stone-100 dark:border-stone-800 space-y-2">
            <p className="text-xs text-stone-600 dark:text-stone-400">Public read-only link (living members masked):</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                to={`/tree/public/${family.id}`}
                target="_blank"
                className="flex-1 text-xs text-forest-700 dark:text-forest-400 bg-forest-50 dark:bg-forest-950/80 border border-forest-200 dark:border-forest-800 rounded-xl px-3 py-2 break-all hover:underline"
              >
                {publicTreeUrl}
              </Link>
              <button
                type="button"
                onClick={handleCopyPublicLink}
                className="px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-center gap-1.5 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}

        {/* Toggle 2: Hide Living Members */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-100 dark:border-stone-800">
          <div className="space-y-0.5 max-w-md">
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-forest-700 dark:text-forest-400" />
              <span>Hide Living Members Details</span>
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Mask living relatives with generic placeholder labels (e.g. "Living Relative") for non-collaborator viewers.
            </p>
          </div>
          <input
            type="checkbox"
            checked={privacy.hideLivingMembers}
            disabled={!canManagePrivacy}
            onChange={(e) => setPrivacy({ ...privacy, hideLivingMembers: e.target.checked })}
            className="w-5 h-5 rounded text-forest-700 focus:ring-forest-500 cursor-pointer"
          />
        </div>

        {/* Toggle 3: Hide Sensitive Dates */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-100 dark:border-stone-800">
          <div className="space-y-0.5 max-w-md">
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-forest-700 dark:text-forest-400" />
              <span>Mask Exact Vital Dates</span>
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Only display the year (e.g. "1994") rather than the exact month and day on public views to protect identity.
            </p>
          </div>
          <input
            type="checkbox"
            checked={privacy.hideSensitiveDates}
            disabled={!canManagePrivacy}
            onChange={(e) => setPrivacy({ ...privacy, hideSensitiveDates: e.target.checked })}
            className="w-5 h-5 rounded text-forest-700 focus:ring-forest-500 cursor-pointer"
          />
        </div>

        {/* Media Visibilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Photo Album Visibility
            </label>
            <SelectDropdown
              options={visibilityOptions}
              value={privacy.photoVisibility}
              disabled={!canManagePrivacy}
              onChange={(val) => setPrivacy({ ...privacy, photoVisibility: val as any })}
              fullWidth
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Family Stories Visibility
            </label>
            <SelectDropdown
              options={visibilityOptions}
              value={privacy.storyVisibility}
              disabled={!canManagePrivacy}
              onChange={(val) => setPrivacy({ ...privacy, storyVisibility: val as any })}
              fullWidth
            />
          </div>
        </div>

        {/* Submit */}
        {canManagePrivacy ? (
        <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
          >
            Save Privacy Rules
          </button>
        </div>
        ) : (
        <div className="pt-6 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
          You have view-only access to privacy settings. Contact a family owner or admin to make changes.
        </div>
        )}

      </div>

    </div>
  );
};
