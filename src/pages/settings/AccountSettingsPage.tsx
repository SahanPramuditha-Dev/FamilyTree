import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Check, 
  Smartphone,
  Globe
} from 'lucide-react';
import { SelectDropdown, SelectOption } from '../../components/ui/Dropdown';

const languageOptions: SelectOption[] = [
  { value: 'English (US)', label: 'English (US)' },
  { value: 'English (UK)', label: 'English (UK)' },
  { value: 'Sinhala', label: 'Sinhala (සිංහල)' },
  { value: 'Tamil', label: 'Tamil (தமிழ்)' }
];

export const AccountSettingsPage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [language, setLanguage] = useState(user?.language || 'English (US)');
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Colombo (GMT+5:30)');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      displayName,
      bio,
      language,
      timezone,
      twoFactorEnabled
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-3xl">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-forest-300 border border-transparent dark:border-forest-700/50 text-xs font-semibold mb-2">
          <User className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
          <span>Personal Account & Security</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mt-1">
          Manage your personal profile, email preferences, two-factor authentication, and security logs.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Account Form */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-soft space-y-6">
        <form onSubmit={handleSave} className="space-y-5">
          
          <div className="flex items-center gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-16 h-16 rounded-2xl object-cover border border-stone-200 dark:border-stone-700" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold flex items-center justify-center text-xl font-serif border border-forest-200 dark:border-forest-800">
                {displayName.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">{displayName}</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">{user?.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 shadow-sm focus:ring-forest-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
              Personal Historian Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 shadow-sm focus:ring-forest-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Preferred Language
              </label>
              <SelectDropdown
                options={languageOptions}
                value={language}
                onChange={setLanguage}
                fullWidth
                icon={<Globe className="w-3.5 h-3.5" />}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 shadow-sm focus:ring-forest-500"
              />
            </div>
          </div>

          {/* 2FA Section */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-forest-700 dark:text-forest-400" />
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100">Two-Factor Authentication (2FA)</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">Add an extra layer of security with mobile authenticator apps.</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-forest-700 focus:ring-forest-500 cursor-pointer"
            />
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
            >
              Save Profile
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
