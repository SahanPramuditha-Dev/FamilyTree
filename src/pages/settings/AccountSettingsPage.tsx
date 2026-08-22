import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Check, 
  Smartphone, 
  Globe, 
  Clock, 
  Sparkles,
  Key
} from 'lucide-react';

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-2">
          <User className="w-3.5 h-3.5 text-forest-600" />
          <span>Personal Account & Security</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
          Manage your personal profile, email preferences, two-factor authentication, and security logs.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Account Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6">
        <form onSubmit={handleSave} className="space-y-5">
          
          <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-16 h-16 rounded-2xl object-cover border border-stone-200" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xl font-serif">
                {displayName.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">{displayName}</h3>
              <p className="text-xs text-stone-500">{user?.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-300 p-2.5 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Personal Historian Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-300 p-2.5 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 p-2.5 bg-stone-50"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Sinhala">Sinhala (සිංහල)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 p-2.5 shadow-sm"
              />
            </div>
          </div>

          {/* 2FA Section */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-forest-700" />
                <span className="font-bold text-xs text-stone-900">Two-Factor Authentication (2FA)</span>
              </div>
              <p className="text-[11px] text-stone-500">Add an extra layer of security with mobile authenticator apps.</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-forest-700 focus:ring-forest-500"
            />
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
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
