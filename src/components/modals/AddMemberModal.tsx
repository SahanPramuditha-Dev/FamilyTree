import React, { useState, useRef, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember, Gender, RelationshipType } from '../../types';
import { X, UserPlus, Link2, Search, Check, Briefcase, GraduationCap, Upload, Users, Heart, Calendar } from 'lucide-react';
import { LocationSelector } from '../common/LocationSelector';
import { LocationDetails } from '../../types';
import { SelectDropdown, SelectOption } from '../ui/Dropdown';

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
  const { members, branches, addMember, updateMember, linkExistingMembers } = useFamily();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modalMode, setModalMode] = useState<'create' | 'link'>('create');
  const [linkSearchQuery, setLinkSearchQuery] = useState('');

  const [firstName, setFirstName] = useState(editingMember?.firstName || '');
  const [middleName, setMiddleName] = useState(editingMember?.middleName || '');
  const [lastName, setLastName] = useState(editingMember?.lastName || '');
  const [nameNative, setNameNative] = useState(editingMember?.nameNative || '');
  const [geName, setGeName] = useState(editingMember?.geName || '');
  const [geNameNative, setGeNameNative] = useState(editingMember?.geNameNative || '');
  const [ancestralEstate, setAncestralEstate] = useState(editingMember?.ancestralEstate || '');
  const [maidenName, setMaidenName] = useState(editingMember?.maidenName || '');
  const [nickname, setNickname] = useState(editingMember?.nickname || '');
  const [gender, setGender] = useState<Gender>(editingMember?.gender || 'male');
  const [isLiving, setIsLiving] = useState<boolean>(editingMember ? editingMember.isLiving : true);
  const [birthDate, setBirthDate] = useState(editingMember?.birthDate || '');
  const [birthPlace, setBirthPlace] = useState(editingMember?.birthPlace || '');
  const [birthPlaceDetails, setBirthPlaceDetails] = useState<LocationDetails | undefined>(editingMember?.birthPlaceDetails);
  const [deathDate, setDeathDate] = useState(editingMember?.deathDate || '');
  const [deathPlace, setDeathPlace] = useState(editingMember?.deathPlace || '');
  const [placeOfPassingDetails, setPlaceOfPassingDetails] = useState<LocationDetails | undefined>(editingMember?.placeOfPassingDetails);
  const [avatarUrl, setAvatarUrl] = useState(editingMember?.avatarUrl || '');
  const [occupation, setOccupation] = useState(editingMember?.occupation || '');
  const [education, setEducation] = useState(editingMember?.education || '');
  const [biography, setBiography] = useState(editingMember?.biography || '');
  const [branchId, setBranchId] = useState(editingMember?.branchId || branches[0]?.id || '');
  const [generation, setGeneration] = useState(editingMember?.generation || 3);
  const [currentLocation, setCurrentLocation] = useState(editingMember?.currentLocation || '');
  const [currentLocationDetails, setCurrentLocationDetails] = useState<LocationDetails | undefined>(editingMember?.currentLocationDetails);
  const [marriageDate, setMarriageDate] = useState(editingMember?.marriageDate || '');
  const [marriageLocation, setMarriageLocation] = useState(editingMember?.marriageLocation || '');
  const [marriageLocationDetails, setMarriageLocationDetails] = useState<LocationDetails | undefined>(editingMember?.marriageLocationDetails);

  // Relationship attachment settings
  const [targetMemberId, setTargetMemberId] = useState(initialTargetMemberId || '');
  const [relationType, setRelationType] = useState<RelationshipType>(initialRelationType);

  // Target member object
  const targetMember = useMemo(() => {
    return members.find(m => m.id === targetMemberId);
  }, [members, targetMemberId]);

  const targetMemberOptions: SelectOption[] = useMemo(() => [
    { value: '', label: 'None (Independent Root Node)' },
    ...members.map(m => ({
      value: m.id,
      label: `${m.firstName} ${m.lastName} (Gen ${m.generation})`,
      badge: `Gen ${m.generation}`
    }))
  ], [members]);

  const relationOptions: SelectOption[] = useMemo(() => [
    { value: 'child', label: 'Child (Next Generation)', description: 'Direct descendant' },
    { value: 'parent', label: 'Parent (Previous Generation)', description: 'Direct ancestor / elder' },
    { value: 'spouse', label: 'Spouse / Partner', description: 'Matrimonial or civil partner' },
    { value: 'sibling', label: 'Sibling (Same Generation)', description: 'Brother or sister' }
  ], []);

  const branchOptions: SelectOption[] = useMemo(() => [
    { value: '', label: 'No Branch Assigned' },
    ...branches.map(b => ({
      value: b.id,
      label: b.name,
      icon: <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: b.color }} />
    }))
  ], [branches]);

  const generationOptions: SelectOption[] = useMemo(() => [
    { value: '1', label: 'Generation 1 (Founders / Great-Grandparents)' },
    { value: '2', label: 'Generation 2 (Grandparents / Parents)' },
    { value: '3', label: 'Generation 3 (Current / Adults)' },
    { value: '4', label: 'Generation 4 (Children / Youth)' },
    { value: '5', label: 'Generation 5 (Infants / Descendants)' }
  ], []);

  // Candidates for linking with strict genealogical kinship validation
  const linkCandidates = useMemo(() => {
    if (!targetMemberId || !targetMember) return [];
    
    const memberMap = new Map<string, FamilyMember>();
    members.forEach(m => memberMap.set(m.id, m));

    // Helper: Collect all ancestor IDs recursively
    const getAncestorIds = (id: string, visited = new Set<string>()): Set<string> => {
      const m = memberMap.get(id);
      if (m && m.parentIds) {
        for (const pid of m.parentIds) {
          if (!visited.has(pid)) {
            visited.add(pid);
            getAncestorIds(pid, visited);
          }
        }
      }
      return visited;
    };

    // Helper: Collect all descendant IDs recursively
    const getDescendantIds = (id: string, visited = new Set<string>()): Set<string> => {
      const m = memberMap.get(id);
      if (m && m.childIds) {
        for (const cid of m.childIds) {
          if (!visited.has(cid)) {
            visited.add(cid);
            getDescendantIds(cid, visited);
          }
        }
      }
      return visited;
    };

    const targetAncestors = getAncestorIds(targetMember.id);
    const targetDescendants = getDescendantIds(targetMember.id);
    const targetSpouses = new Set(targetMember.spouseIds || []);
    const targetSiblings = new Set(targetMember.siblingIds || []);
    const targetParents = new Set(targetMember.parentIds || []);
    const targetChildren = new Set(targetMember.childIds || []);

    return members.filter(candidate => {
      const cid = candidate.id;
      if (cid === targetMember.id) return false;

      // Kinship logic based on requested relationship type
      if (relationType === 'child') {
        if (targetSpouses.has(cid)) return false;
        if (targetParents.has(cid)) return false;
        if (targetAncestors.has(cid)) return false;
        if (targetChildren.has(cid)) return false;
        if (targetSiblings.has(cid)) return false;
      } else if (relationType === 'parent') {
        if (targetSpouses.has(cid)) return false;
        if (targetChildren.has(cid)) return false;
        if (targetDescendants.has(cid)) return false;
        if (targetParents.has(cid)) return false;
        if (targetSiblings.has(cid)) return false;
      } else if (relationType === 'spouse' || relationType === 'partner') {
        if (targetSpouses.has(cid)) return false;
        if (targetParents.has(cid) || targetAncestors.has(cid)) return false;
        if (targetChildren.has(cid) || targetDescendants.has(cid)) return false;
        if (targetSiblings.has(cid)) return false;
      } else if (relationType === 'sibling') {
        if (targetSiblings.has(cid)) return false;
        if (targetSpouses.has(cid)) return false;
        if (targetParents.has(cid) || targetAncestors.has(cid)) return false;
        if (targetChildren.has(cid) || targetDescendants.has(cid)) return false;
      }

      if (linkSearchQuery.trim()) {
        const full = `${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`.toLowerCase();
        return full.includes(linkSearchQuery.toLowerCase());
      }
      return true;
    });
  }, [members, targetMemberId, targetMember, relationType, linkSearchQuery]);

  // Sync state whenever editingMember, initialTargetMemberId, or isOpen changes
  React.useEffect(() => {
    if (isOpen) {
      setModalMode('create');
      setLinkSearchQuery('');
      setFirstName(editingMember?.firstName || '');
      setMiddleName(editingMember?.middleName || '');
      setLastName(editingMember?.lastName || '');
      setMaidenName(editingMember?.maidenName || '');
      setNickname(editingMember?.nickname || '');
      setGender(editingMember?.gender || 'male');
      setIsLiving(editingMember ? editingMember.isLiving : true);
      setBirthDate(editingMember?.birthDate || '');
      setBirthPlace(editingMember?.birthPlace || '');
      setBirthPlaceDetails(editingMember?.birthPlaceDetails);
      setDeathDate(editingMember?.deathDate || '');
      setDeathPlace(editingMember?.deathPlace || '');
      setPlaceOfPassingDetails(editingMember?.placeOfPassingDetails);
      setAvatarUrl(editingMember?.avatarUrl || '');
      setOccupation(editingMember?.occupation || '');
      setEducation(editingMember?.education || '');
      setBiography(editingMember?.biography || '');
      setBranchId(editingMember?.branchId || branches[0]?.id || '');
      setGeneration(editingMember?.generation || 1);
      setCurrentLocation(editingMember?.currentLocation || '');
      setCurrentLocationDetails(editingMember?.currentLocationDetails);
      setMarriageDate(editingMember?.marriageDate || '');
      setMarriageLocation(editingMember?.marriageLocation || '');
      setMarriageLocationDetails(editingMember?.marriageLocationDetails);
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

  const handleLinkExisting = (relativeId: string) => {
    if (!targetMemberId) return;
    linkExistingMembers(targetMemberId, relativeId, relationType);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const resolvedCoords: [number, number] | undefined = currentLocationDetails 
      ? [currentLocationDetails.latitude, currentLocationDetails.longitude]
      : (birthPlaceDetails ? [birthPlaceDetails.latitude, birthPlaceDetails.longitude] : undefined);

    if (editingMember) {
      updateMember(editingMember.id, {
        firstName,
        middleName: middleName || undefined,
        lastName,
        nameNative: nameNative || undefined,
        geName: geName || undefined,
        geNameNative: geNameNative || undefined,
        ancestralEstate: ancestralEstate || undefined,
        maidenName: maidenName || undefined,
        nickname: nickname || undefined,
        gender,
        isLiving,
        birthDate: birthDate || undefined,
        birthPlace: birthPlaceDetails?.formatted || birthPlace || undefined,
        birthPlaceDetails: birthPlaceDetails || undefined,
        deathDate: !isLiving ? (deathDate || undefined) : undefined,
        deathPlace: !isLiving ? (placeOfPassingDetails?.formatted || deathPlace || undefined) : undefined,
        placeOfPassingDetails: !isLiving ? placeOfPassingDetails : undefined,
        avatarUrl: avatarUrl || undefined,
        occupation: occupation || undefined,
        education: education || undefined,
        biography: biography || undefined,
        branchId: branchId || undefined,
        generation,
        currentLocation: currentLocationDetails?.formatted || currentLocation || undefined,
        currentLocationDetails: currentLocationDetails || undefined,
        coordinates: resolvedCoords,
        marriageDate: marriageDate || undefined,
        marriageLocation: marriageLocationDetails?.formatted || marriageLocation || undefined,
        marriageLocationDetails: marriageLocationDetails || undefined
      });
    } else {
      addMember({
        firstName,
        middleName: middleName || undefined,
        lastName,
        nameNative: nameNative || undefined,
        geName: geName || undefined,
        geNameNative: geNameNative || undefined,
        ancestralEstate: ancestralEstate || undefined,
        maidenName: maidenName || undefined,
        nickname: nickname || undefined,
        gender,
        isLiving,
        birthDate: birthDate || undefined,
        birthPlace: birthPlaceDetails?.formatted || birthPlace || undefined,
        birthPlaceDetails: birthPlaceDetails || undefined,
        deathDate: !isLiving ? (deathDate || undefined) : undefined,
        deathPlace: !isLiving ? (placeOfPassingDetails?.formatted || deathPlace || undefined) : undefined,
        placeOfPassingDetails: !isLiving ? placeOfPassingDetails : undefined,
        avatarUrl: avatarUrl || undefined,
        occupation: occupation || undefined,
        education: education || undefined,
        biography: biography || undefined,
        branchId: branchId || undefined,
        generation,
        currentLocation: currentLocationDetails?.formatted || currentLocation || undefined,
        currentLocationDetails: currentLocationDetails || undefined,
        coordinates: resolvedCoords,
        marriageDate: marriageDate || undefined,
        marriageLocation: marriageLocationDetails?.formatted || marriageLocation || undefined,
        marriageLocationDetails: marriageLocationDetails || undefined
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
    <div className="fixed inset-0 z-50 bg-stone-950/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-forest-800 to-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              {modalMode === 'link' ? <Link2 className="w-5 h-5 text-forest-200" /> : <UserPlus className="w-5 h-5 text-forest-200" />}
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                {editingMember 
                  ? 'Edit Family Member Record' 
                  : targetMember 
                    ? `Add ${relationType.charAt(0).toUpperCase() + relationType.slice(1)} to ${targetMember.firstName}`
                    : 'Add New Family Member'}
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

        {/* Mode Switcher Tabs (Only when target relative is present and not in edit mode) */}
        {!editingMember && targetMemberId && members.length > 1 && (
          <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 px-6 pt-3 gap-3">
            <button
              type="button"
              onClick={() => setModalMode('create')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
                modalMode === 'create'
                  ? 'border-forest-700 dark:border-forest-400 text-forest-900 dark:text-forest-200 font-bold'
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create New Person</span>
            </button>
            <button
              type="button"
              onClick={() => setModalMode('link')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
                modalMode === 'link'
                  ? 'border-forest-700 dark:border-forest-400 text-forest-900 dark:text-forest-200 font-bold'
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Link Existing Person ({linkCandidates.length})</span>
            </button>
          </div>
        )}

        {/* Modal Body: Link Existing Person Mode */}
        {modalMode === 'link' && !editingMember && targetMember ? (
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            <div className="p-3.5 bg-forest-50 dark:bg-forest-950/60 border border-forest-200 dark:border-forest-800/80 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-forest-800 dark:text-forest-300 font-semibold block">Connecting to:</span>
                <span className="text-sm font-bold text-forest-950 dark:text-forest-100">{targetMember.firstName} {targetMember.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">As:</span>
                <SelectDropdown
                  options={relationOptions}
                  value={relationType}
                  onChange={(val) => setRelationType(val as RelationshipType)}
                  size="sm"
                  menuWidth="w-48"
                />
              </div>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search relative by name..."
                value={linkSearchQuery}
                onChange={(e) => setLinkSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:border-forest-600 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              />
            </div>

            {/* Candidates list */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {linkCandidates.length === 0 ? (
                <div className="text-center py-8 text-stone-400 dark:text-stone-500">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No matching relatives found to link as {relationType}.</p>
                </div>
              ) : (
                linkCandidates.map(candidate => (
                  <div
                    key={candidate.id}
                    className="p-3 bg-stone-50 dark:bg-stone-800/60 hover:bg-forest-50/50 dark:hover:bg-forest-950/40 border border-stone-200 dark:border-stone-700 hover:border-forest-300 rounded-2xl flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-3">
                      {candidate.avatarUrl ? (
                        <img
                          src={candidate.avatarUrl}
                          alt={candidate.firstName}
                          className="w-10 h-10 rounded-xl object-cover border border-stone-200 dark:border-stone-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold flex items-center justify-center text-sm border border-forest-200 dark:border-forest-800">
                          {candidate.firstName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                          {candidate.firstName} {candidate.lastName}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-stone-500 dark:text-stone-400">
                          <span>Gen {candidate.generation || 1}</span>
                          <span>•</span>
                          <span>{candidate.gender || 'Person'}</span>
                          {candidate.birthDate && (
                            <>
                              <span>•</span>
                              <span>Born {candidate.birthDate.split('-')[0]}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLinkExisting(candidate.id)}
                      className="px-3.5 py-1.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Link as {relationType.charAt(0).toUpperCase() + relationType.slice(1)}</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
        /* Modal Body / Form */
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Photo & Avatar Upload Block */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar Preview" 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-forest-600 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-serif font-bold text-2xl flex items-center justify-center border-2 border-dashed border-forest-300 dark:border-forest-700">
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
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">Person Photo / Portrait</span>
              
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
                  className="px-3 py-1.5 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold transition"
                >
                  Paste URL
                </button>
              </div>

              {/* Sample avatar presets */}
              <div className="flex items-center gap-1.5 pt-1 justify-center sm:justify-start">
                <span className="text-[10px] text-stone-400 dark:text-stone-500">Presets:</span>
                {sampleAvatars.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Preset"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-6 h-6 rounded-lg object-cover cursor-pointer border transition hover:scale-110 ${
                      avatarUrl === url ? 'border-forest-600 ring-2 ring-forest-400' : 'border-stone-200 dark:border-stone-700 opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Relationship Connection (only when adding new member) */}
          {!editingMember && (
            <div className="p-4 bg-forest-50/80 dark:bg-forest-950/60 border border-forest-100 dark:border-forest-800/80 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-forest-300 mb-3 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" /> Tree Connection & Relationship
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Connect To Relative
                  </label>
                  <SelectDropdown
                    options={targetMemberOptions}
                    value={targetMemberId}
                    onChange={setTargetMemberId}
                    fullWidth
                    searchable
                    searchPlaceholder="Search relative name..."
                  />
                </div>

                {targetMemberId && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                      Relationship Role
                    </label>
                    <SelectDropdown
                      options={relationOptions}
                      value={relationType}
                      onChange={(val) => setRelationType(val as RelationshipType)}
                      fullWidth
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Names & Identity */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Middle Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g. William"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Sterling / Smith"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Name in Native Script (Sinhala / Tamil)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. අමල් දිනංජ / அமல்"
                  value={nameNative}
                  onChange={(e) => setNameNative(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  වාසගම / Traditional Ge-Name (English & Native)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Kuruppu Arachchige / කුරුප්පු ආරච්චිගේ"
                  value={geName}
                  onChange={(e) => setGeName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Ancestral Estate / Maha Gedara (මහ ගෙදර)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Walauwa / Maha Gedara, Kotugoda"
                  value={ancestralEstate}
                  onChange={(e) => setAncestralEstate(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Nickname / Title
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Uncle John"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
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
                          ? 'bg-forest-700 dark:bg-forest-600 text-white border-forest-700 dark:border-forest-600 shadow-sm' 
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-750'
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
          <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            {/* Vital Status Segmented Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">Vital Status</span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">Specify whether this relative is currently living or deceased</span>
              </div>
              <div className="inline-flex p-1 rounded-xl bg-stone-200/80 dark:bg-stone-800 border border-stone-300/60 dark:border-stone-700 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsLiving(true)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isLiving 
                      ? 'bg-forest-700 text-white shadow-xs' 
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  Living
                </button>
                <button
                  type="button"
                  onClick={() => setIsLiving(false)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    !isLiving 
                      ? 'bg-stone-800 dark:bg-stone-700 text-white shadow-xs' 
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  Deceased †
                </button>
              </div>
            </div>

            {/* Dates Row */}
            <div className={!isLiving ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-1"}>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
                  <span>Birth Date</span>
                </label>
                <input 
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-xs bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              {!isLiving && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                    <span>Date of Passing</span>
                  </label>
                  <input 
                    type="date"
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 p-2.5 shadow-xs bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              )}
            </div>

            {/* Location 1: Birth Place */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <LocationSelector
                label="Birth Place / Ancestral Town"
                value={birthPlaceDetails || birthPlace}
                onChange={(loc) => {
                  setBirthPlaceDetails(loc);
                  setBirthPlace(loc.formatted);
                }}
                placeholder="Select ancestral country, province, village..."
              />
            </div>

            {/* Location 2: Current Residence (if living) or Place of Passing (if deceased) */}
            {isLiving ? (
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <LocationSelector
                  label="Current Residence / Living Location"
                  value={currentLocationDetails || currentLocation}
                  onChange={(loc) => {
                    setCurrentLocationDetails(loc);
                    setCurrentLocation(loc.formatted);
                  }}
                  placeholder="e.g. Colombo, Sri Lanka / Melbourne, Australia"
                />
              </div>
            ) : (
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <LocationSelector
                  label="Place of Passing"
                  value={placeOfPassingDetails || deathPlace}
                  onChange={(loc) => {
                    setPlaceOfPassingDetails(loc);
                    setDeathPlace(loc.formatted);
                  }}
                  placeholder="Select country, province, city..."
                />
              </div>
            )}
          </div>

          {/* Marriage / Matrimonial Record (Show if member has spouses or when adding a spouse) */}
          {((editingMember?.spouseIds && editingMember.spouseIds.length > 0) || relationType === 'spouse') && (
            <div className="p-4 sm:p-5 bg-pink-50/40 dark:bg-stone-900 rounded-2xl border border-pink-200/70 dark:border-stone-800 space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Marriage & Matrimonial Record
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Record wedding anniversary date and ceremonial marriage location
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-pink-200/50 dark:border-stone-800">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                    <span>Marriage Date</span>
                  </label>
                  <input
                    type="date"
                    value={marriageDate}
                    onChange={(e) => setMarriageDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-pink-500 focus:ring-pink-500 p-2.5 shadow-xs bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="pt-2 border-t border-pink-200/30 dark:border-stone-800">
                  <LocationSelector
                    label="Marriage / Wedding Location"
                    value={marriageLocationDetails || marriageLocation}
                    onChange={(loc) => {
                      setMarriageLocationDetails(loc);
                      setMarriageLocation(loc.formatted);
                    }}
                    placeholder="Select wedding country, city, church..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Branch & Generation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Family Branch
              </label>
              <SelectDropdown
                options={branchOptions}
                value={branchId}
                onChange={setBranchId}
                fullWidth
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Generation Level
              </label>
              <SelectDropdown
                options={generationOptions}
                value={String(generation)}
                onChange={(val) => setGeneration(Number(val))}
                fullWidth
              />
            </div>
          </div>

          {/* Career & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-stone-400" /> Occupation
              </label>
              <input 
                type="text"
                placeholder="e.g. Architect"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-stone-400" /> Education
              </label>
              <input 
                type="text"
                placeholder="e.g. University Graduate"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm"
              />
            </div>
          </div>

          {/* Biography */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Biography & Historical Notes
            </label>
            <textarea
              rows={3}
              placeholder="Write memories, character traits, notable achievements, stories..."
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 focus:border-forest-500 focus:ring-forest-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 shadow-sm"
            />
          </div>

          {/* Modal Footer actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-forest-700 hover:bg-forest-800 dark:bg-forest-600 dark:hover:bg-forest-500 rounded-xl shadow-md transition active:scale-95"
            >
              {editingMember ? 'Save Changes' : 'Add to Family Tree'}
            </button>
          </div>

        </form>
        )}
      </div>
    </div>
  );
};
