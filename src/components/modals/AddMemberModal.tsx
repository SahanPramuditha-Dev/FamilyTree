import React, { useState, useRef } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember, Gender, RelationshipType } from '../../types';
import { X, UserPlus, Image as ImageIcon, Heart, User, MapPin, Briefcase, GraduationCap, Upload, Trash2, Camera } from 'lucide-react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTargetMemberId?: string;
  initialRelationType?: RelationshipType;
  editingMember?: FamilyMember;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  initialTargetMemberId,
  initialRelationType = 'child',
  editingMember
}) => {
  const { members, branches, addMember, updateMember } = useFamily();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(editingMember?.firstName || '');
  const [middleName, setMiddleName] = useState(editingMember?.middleName || '');
  const [lastName, setLastName] = useState(editingMember?.lastName || '');
  const [maidenName, setMaidenName] = useState(editingMember?.maidenName || '');
  const [nickname, setNickname] = useState(editingMember?.nickname || '');
  const [gender, setGender] = useState<Gender>(editingMember?.gender || 'male');
  const [isLiving, setIsLiving] = useState<boolean>(editingMember ? editingMember.isLiving : true);
  const [birthDate, setBirthDate] = useState(editingMember?.birthDate || '');
  const [birthPlace, setBirthPlace] = useState(editingMember?.birthPlace || '');
  const [deathDate, setDeathDate] = useState(editingMember?.deathDate || '');
  const [deathPlace, setDeathPlace] = useState(editingMember?.deathPlace || '');
  const [avatarUrl, setAvatarUrl] = useState(editingMember?.avatarUrl || '');
  const [occupation, setOccupation] = useState(editingMember?.occupation || '');
  const [education, setEducation] = useState(editingMember?.education || '');
  const [biography, setBiography] = useState(editingMember?.biography || '');
  const [branchId, setBranchId] = useState(editingMember?.branchId || branches[0]?.id || '');
  const [generation, setGeneration] = useState(editingMember?.generation || 3);
  const [currentLocation, setCurrentLocation] = useState(editingMember?.currentLocation || '');

  // Relationship attachment settings
  const [targetMemberId, setTargetMemberId] = useState(initialTargetMemberId || '');
  const [relationType, setRelationType] = useState<RelationshipType>(initialRelationType);

  // Sync state whenever editingMember, initialTargetMemberId, or isOpen changes
  React.useEffect(() => {
    if (isOpen) {
      setFirstName(editingMember?.firstName || '');
      setMiddleName(editingMember?.middleName || '');
      setLastName(editingMember?.lastName || '');
      setMaidenName(editingMember?.maidenName || '');
      setNickname(editingMember?.nickname || '');
      setGender(editingMember?.gender || 'male');
      setIsLiving(editingMember ? editingMember.isLiving : true);
      setBirthDate(editingMember?.birthDate || '');
      setBirthPlace(editingMember?.birthPlace || '');
      setDeathDate(editingMember?.deathDate || '');
      setDeathPlace(editingMember?.deathPlace || '');
      setAvatarUrl(editingMember?.avatarUrl || '');
      setOccupation(editingMember?.occupation || '');
      setEducation(editingMember?.education || '');
      setBiography(editingMember?.biography || '');
      setBranchId(editingMember?.branchId || branches[0]?.id || '');
      setGeneration(editingMember?.generation || 3);
      setCurrentLocation(editingMember?.currentLocation || '');
      setTargetMemberId(initialTargetMemberId || '');
      setRelationType(initialRelationType);
    }
  }, [isOpen, editingMember, initialTargetMemberId, initialRelationType, branches]);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    if (editingMember) {
      updateMember(editingMember.id, {
        firstName,
        middleName: middleName || undefined,
        lastName,
        maidenName: maidenName || undefined,
        nickname: nickname || undefined,
        gender,
        isLiving,
        birthDate: birthDate || undefined,
        birthPlace: birthPlace || undefined,
        deathDate: !isLiving ? (deathDate || undefined) : undefined,
        deathPlace: !isLiving ? (deathPlace || undefined) : undefined,
        avatarUrl: avatarUrl || undefined,
        occupation: occupation || undefined,
        education: education || undefined,
        biography: biography || undefined,
        branchId: branchId || undefined,
        generation,
        currentLocation: currentLocation || undefined
      });
    } else {
      addMember({
        firstName,
        middleName: middleName || undefined,
        lastName,
        maidenName: maidenName || undefined,
        nickname: nickname || undefined,
        gender,
        isLiving,
        birthDate: birthDate || undefined,
        birthPlace: birthPlace || undefined,
        deathDate: !isLiving ? (deathDate || undefined) : undefined,
        deathPlace: !isLiving ? (deathPlace || undefined) : undefined,
        avatarUrl: avatarUrl || undefined,
        occupation: occupation || undefined,
        education: education || undefined,
        biography: biography || undefined,
        branchId: branchId || undefined,
        generation,
        currentLocation: currentLocation || undefined
      }, targetMemberId || undefined, targetMemberId ? relationType : undefined);
    }

    onClose();
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-forest-800 to-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-forest-200" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold">
                {editingMember ? 'Edit Family Member Record' : 'Add New Family Member'}
              </h3>
              <p className="text-xs text-forest-200">
                {editingMember ? 'Update bio, vital statistics and relations' : 'Preserve and link lineage to your family tree'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Photo & Avatar Upload Block */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar Preview" 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-forest-600 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-forest-100 text-forest-800 font-serif font-bold text-2xl flex items-center justify-center border-2 border-dashed border-forest-300">
                  {firstName.charAt(0) || '👤'}
                </div>
              )}
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow"
                  title="Remove photo"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold text-stone-800 block">Person Photo / Portrait</span>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Enter Image URL:');
                    if (url) setAvatarUrl(url);
                  }}
                  className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold"
                >
                  Paste URL
                </button>
              </div>

              {/* Sample avatar presets */}
              <div className="flex items-center gap-1.5 pt-1 justify-center sm:justify-start">
                <span className="text-[10px] text-stone-400">Presets:</span>
                {sampleAvatars.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Preset"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-6 h-6 rounded-lg object-cover cursor-pointer border transition hover:scale-110 ${
                      avatarUrl === url ? 'border-forest-600 ring-2 ring-forest-400' : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Relationship Connection (only when adding new member) */}
          {!editingMember && (
            <div className="p-4 bg-forest-50/80 border border-forest-100 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-3 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-forest-600" /> Tree Connection & Relationship
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Connect To Relative
                  </label>
                  <select 
                    value={targetMemberId}
                    onChange={(e) => setTargetMemberId(e.target.value)}
                    className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 bg-white p-2.5 shadow-sm"
                  >
                    <option value="">None (Independent Root Node)</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} (Gen {m.generation})
                      </option>
                    ))}
                  </select>
                </div>

                {targetMemberId && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Relationship Role
                    </label>
                    <select
                      value={relationType}
                      onChange={(e) => setRelationType(e.target.value as RelationshipType)}
                      className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 bg-white p-2.5 shadow-sm capitalize"
                    >
                      <option value="child">Child (Next Generation)</option>
                      <option value="parent">Parent (Previous Generation)</option>
                      <option value="spouse">Spouse / Partner</option>
                      <option value="sibling">Sibling (Same Generation)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Names & Identity */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Middle Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g. William"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Sterling / Smith"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Maiden Name (if applicable)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Montgomery"
                  value={maidenName}
                  onChange={(e) => setMaidenName(e.target.value)}
                  className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nickname / Title
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Uncle John"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Gender
                </label>
                <div className="flex gap-2">
                  {(['male', 'female', 'other'] as Gender[]).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl capitalize border transition ${
                        gender === g 
                          ? 'bg-forest-700 text-white border-forest-700 shadow-sm' 
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Living status and Vital Dates */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800">
                Is this person living?
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLiving(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${isLiving ? 'bg-forest-700 text-white' : 'bg-stone-200 text-stone-600'}`}
                >
                  Living
                </button>
                <button
                  type="button"
                  onClick={() => setIsLiving(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${!isLiving ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-600'}`}
                >
                  Deceased ✝
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Birth Date
                </label>
                <input 
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Birth Place
                </label>
                <input 
                  type="text"
                  placeholder="City, Country"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm bg-white"
                />
              </div>
            </div>

            {!isLiving && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date of Passing
                  </label>
                  <input 
                    type="date"
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                    className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Place of Passing
                  </label>
                  <input 
                    type="text"
                    placeholder="City, Country"
                    value={deathPlace}
                    onChange={(e) => setDeathPlace(e.target.value)}
                    className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Branch & Generation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Family Branch
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
              >
                <option value="">No Branch Assigned</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Generation Level
              </label>
              <select
                value={generation}
                onChange={(e) => setGeneration(Number(e.target.value))}
                className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
              >
                <option value={1}>Generation 1 (Founders / Great-Grandparents)</option>
                <option value={2}>Generation 2 (Grandparents / Parents)</option>
                <option value={3}>Generation 3 (Current / Adults)</option>
                <option value={4}>Generation 4 (Children / Youth)</option>
                <option value={5}>Generation 5 (Infants / Descendants)</option>
              </select>
            </div>
          </div>

          {/* Career & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-stone-400" /> Occupation
              </label>
              <input 
                type="text"
                placeholder="e.g. Architect"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-stone-400" /> Education
              </label>
              <input 
                type="text"
                placeholder="e.g. University Graduate"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
              />
            </div>
          </div>

          {/* Biography */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Biography & Historical Notes
            </label>
            <textarea
              rows={3}
              placeholder="Write memories, character traits, notable achievements, stories..."
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              className="w-full text-xs rounded-xl border-stone-200 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-sm"
            />
          </div>

          {/* Modal Footer actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-forest-700 hover:bg-forest-800 rounded-xl shadow-md transition active:scale-95"
            >
              {editingMember ? 'Save Changes' : 'Add to Family Tree'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
