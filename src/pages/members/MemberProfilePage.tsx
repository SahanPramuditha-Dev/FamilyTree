import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import { useFamilyAccess } from '../../hooks/useFamilyAccess';
import { uploadFamilyFile } from '../../services/storage';
import { AddMemberModal } from '../../components/modals/AddMemberModal';
import { AddMigrationModal } from '../../components/modals/AddMigrationModal';
import { AIBiographerModal } from '../../components/modals/AIBiographerModal';
import { getMigrationMeta } from '../../utils/migrationRegistry';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Edit, 
  Trash2, 
  Heart, 
  User, 
  Users, 
  Clock, 
  Image as ImageIcon, 
  FileText, 
  BookOpen, 
  Plus, 
  Sparkles,
  Share2,
  Camera,
  Upload,
  Check,
  Plane,
  Globe,
  Home,
  Shield
} from 'lucide-react';
import { RelationshipType, MigrationEvent } from '../../types';

export const MemberProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { family, members, branches, photos, deleteMember, updateMember, addMigration, deleteMigration } = useFamily();
  const { firebaseUser } = useAuth();
  const { maskMember, canEditMembers, canDeleteMembers, canUploadMedia } = useFamilyAccess();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddRelativeOpen, setIsAddRelativeOpen] = useState(false);
  const [addRelationType, setAddRelationType] = useState<RelationshipType>('child');
  const [isAddMigrationOpen, setIsAddMigrationOpen] = useState(false);
  const [editingMigration, setEditingMigration] = useState<MigrationEvent | undefined>(undefined);
  const [isAIBioOpen, setIsAIBioOpen] = useState(false);
  const [photoUpdated, setPhotoUpdated] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const rawMember = useMemo(() => members.find(m => m.id === id), [members, id]);
  const member = useMemo(
    () => (rawMember ? maskMember(rawMember) : undefined),
    [rawMember, maskMember]
  );

  const parents = useMemo(
    () => (member ? members.filter(m => m.id !== member.id && ((member.parentIds || []).includes(m.id) || (m.childIds || []).includes(member.id))) : []),
    [members, member]
  );
  const spouses = useMemo(
    () => (member ? members.filter(m => m.id !== member.id && ((member.spouseIds || []).includes(m.id) || (m.spouseIds || []).includes(member.id))) : []),
    [members, member]
  );
  const children = useMemo(
    () => (member ? members.filter(m => m.id !== member.id && ((member.childIds || []).includes(m.id) || (m.parentIds || []).includes(member.id))) : []),
    [members, member]
  );
  const siblings = useMemo(
    () => {
      if (!member) return [];
      const parentSet = new Set(member.parentIds || []);
      return members.filter(m => {
        if (m.id === member.id) return false;
        // 1. Explicit sibling link in either direction
        if ((member.siblingIds || []).includes(m.id) || (m.siblingIds || []).includes(member.id)) return true;
        // 2. Shared parents
        if (parentSet.size > 0 && m.parentIds && m.parentIds.some(pid => parentSet.has(pid))) return true;
        // 3. Parent has both in childIds
        return members.some(p => (p.childIds || []).includes(member.id) && (p.childIds || []).includes(m.id));
      });
    },
    [members, member]
  );

  const taggedPhotos = useMemo(
    () => (member ? photos.filter(p => p.taggedMemberIds.includes(member.id)) : []),
    [photos, member]
  );

  const personalTimeline = useMemo(() => {
    if (!member) return [];

    const eventsList: { year: string; title: string; desc: string; type: string }[] = [];

    const birthYear = member.birthDate ? parseInt(member.birthDate.split('-')[0], 10) : 1960 + (member.generation - 1) * 25;
    const birthYearStr = member.birthDate ? member.birthDate.split('-')[0] : `~${birthYear}`;

    eventsList.push({
      year: birthYearStr,
      title: member.birthDate ? 'Born into the Family Lineage' : `Arrival in Generation ${member.generation}`,
      desc: member.birthPlace ? `Born in ${member.birthPlace}` : `Generation ${member.generation} lineage milestone`,
      type: 'birth'
    });

    if (member.education) {
      eventsList.push({
        year: `~${birthYear + 22}`,
        title: 'Graduation & Education',
        desc: member.education,
        type: 'education'
      });
    }

    if (member.occupation) {
      eventsList.push({
        year: `~${birthYear + 25}`,
        title: `Career as ${member.occupation}`,
        desc: `Professional path in ${member.occupation}`,
        type: 'career'
      });
    }

    if (spouses.length > 0) {
      const mDate = member.marriageDate || spouses.find(s => s.marriageDate)?.marriageDate;
      const mYear = mDate ? mDate.split('-')[0] : `~${birthYear + 26}`;
      const mLoc = member.marriageLocation || spouses.find(s => s.marriageLocation)?.marriageLocation;
      eventsList.push({
        year: mYear,
        title: `Marriage with ${spouses.map(s => s.firstName).join(' & ')}`,
        desc: mDate ? `Matrimonial union celebrated on ${mDate}${mLoc ? ` in ${mLoc}` : ''}` : 'Matrimonial union recorded in archives',
        type: 'marriage'
      });
    }

    if (children.length > 0) {
      children.forEach((c) => {
        const cYear = c.birthDate ? c.birthDate.split('-')[0] : `~${birthYear + 28}`;
        eventsList.push({
          year: cYear,
          title: `Welcome Child: ${c.firstName}`,
          desc: `Continuation of Generation ${c.generation}`,
          type: 'child'
        });
      });
    }

    if (member.migrations && member.migrations.length > 0) {
      member.migrations.forEach((m) => {
        const meta = getMigrationMeta(m.reason);
        eventsList.push({
          year: m.year ? `${m.year}` : `~${birthYear + 22}`,
          title: `Relocation (${meta.label}): ${m.fromLocation.locality || m.fromLocation.city || m.fromLocation.countryName} → ${m.toLocation.locality || m.toLocation.city || m.toLocation.countryName}`,
          desc: m.notes ? `${meta.label} - ${m.notes}` : `${meta.label} move to ${m.toLocation.formatted}`,
          type: 'migration'
        });
      });
    }

    if (!member.isLiving) {
      eventsList.push({
        year: member.deathDate ? member.deathDate.split('-')[0] : `~${birthYear + 75}`,
        title: 'Passing & Eternal Memory',
        desc: member.deathPlace ? `Passed peacefully in ${member.deathPlace}` : 'Memorial preserved in family archives',
        type: 'death'
      });
    }

    return eventsList.sort((a, b) => a.year.localeCompare(b.year));
  }, [member, spouses, children]);

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('Failed to read file'));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!member || !canUploadMedia) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let photoUrl = '';
      if (firebaseUser) {
        try {
          photoUrl = await uploadFamilyFile(firebaseUser.uid, family.id, 'avatars', file);
        } catch (uploadErr) {
          console.warn('Firebase Storage upload failed, falling back to local data URL:', uploadErr);
          photoUrl = await readFileAsDataUrl(file);
        }
      } else {
        photoUrl = await readFileAsDataUrl(file);
      }

      if (photoUrl) {
        updateMember(member.id, { avatarUrl: photoUrl });
        setPhotoUpdated(true);
        setTimeout(() => setPhotoUpdated(false), 3000);
      }
    } catch (err) {
      console.error('Photo upload error:', err);
    } finally {
      e.target.value = '';
    }
  };

  const handleDelete = () => {
    if (!member) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      // Auto-reset if user doesn't confirm within 5 seconds
      setTimeout(() => setConfirmDelete(false), 5000);
      return;
    }
    deleteMember(member.id);
    navigate('/members');
  };

  if (!member) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">Family Member Not Found</h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">The person you are searching for may have been removed or does not exist.</p>
        <Link to="/members" className="inline-block px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-semibold">
          Return to Member Directory
        </Link>
      </div>
    );
  }

  const branch = branches.find(b => b.id === member.branchId);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Back link */}
      <div>
        <Link to="/members" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Member Directory</span>
        </Link>
      </div>

      {photoUpdated && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile photo updated successfully!</span>
        </div>
      )}

      {/* Hero Profile Banner Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          
          {/* Avatar with Direct Photo Upload Camera Button */}
          <div className="relative group">
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              className="hidden" 
            />

            {member.avatarUrl ? (
              <img 
                src={member.avatarUrl} 
                alt={`${member.firstName} ${member.lastName}`}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-forest-100 dark:border-forest-900 shadow-md group-hover:opacity-90 transition" 
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-serif font-bold text-4xl flex items-center justify-center border-2 border-forest-200 dark:border-forest-800">
                {member.firstName.charAt(0)}
              </div>
            )}

            {/* Change Photo Overlay Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 hover:bg-black/60 text-white rounded-3xl opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 cursor-pointer"
              title="Click to change profile picture"
            >
              <Camera className="w-6 h-6" />
              <span className="text-[10px] font-bold">Change Photo</span>
            </button>

            <span className={`absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow ${
              member.gender === 'female' ? 'bg-pink-500' : 'bg-blue-600'
            }`}>
              {member.gender === 'female' ? 'Female' : 'Male'}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1.5">
            {/* Traditional Vasagama / Ge-Name */}
            {(member.geName || member.geNameNative) && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-[11px] font-semibold">
                <Shield className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>වාසගම / Ge-Name: <strong>{member.geName || member.geNameNative}</strong> {member.geNameNative && member.geName ? `(${member.geNameNative})` : ''}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                {member.firstName} {member.middleName ? `${member.middleName} ` : ''}{member.lastName}
              </h1>
              {member.nameNative && (
                <span className="font-serif text-lg text-forest-800 dark:text-forest-300 font-semibold">
                  ({member.nameNative})
                </span>
              )}
              {member.nickname && (
                <span className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2.5 py-0.5 rounded-full font-medium border border-stone-200/50 dark:border-stone-700/50">
                  "{member.nickname}"
                </span>
              )}
            </div>

            {member.maidenName && (
              <p className="text-xs text-stone-500 dark:text-stone-400 italic">née {member.maidenName}</p>
            )}

            {member.ancestralEstate && (
              <p className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1.5 font-medium">
                <Home className="w-3.5 h-3.5 text-amber-600" />
                <span>Ancestral Estate: <strong>{member.ancestralEstate}</strong></span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-forest-800 dark:text-forest-300 bg-forest-100 dark:bg-forest-950/60 border border-transparent dark:border-forest-800/40 px-2.5 py-0.5 rounded-full">
                Generation {member.generation}
              </span>
              {branch && (
                <span className="text-xs font-semibold text-white px-2.5 py-0.5 rounded-full shadow-2xs" style={{ backgroundColor: branch.color }}>
                  {branch.name}
                </span>
              )}
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                member.isLiving ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/40' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}>
                {member.isLiving ? 'Living' : 'Deceased ✝'}
              </span>
            </div>

            <div className="pt-2 text-xs text-stone-600 dark:text-stone-400 flex flex-wrap gap-4">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                <span>
                  {member.birthDate || 'Unknown'} — {member.isLiving ? 'Present' : (member.deathDate || '✝')}
                </span>
              </div>
              {member.birthPlace && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                  <span>{member.birthPlace}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {(canEditMembers || canDeleteMembers || canUploadMedia) && (
        <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
          {canEditMembers && (
          <button
            onClick={() => setIsAIBioOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-900/10 transition active:scale-95"
            title="Generate comprehensive biographical story with AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Biographer</span>
          </button>
          )}
          {canUploadMedia && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-transparent dark:border-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            title="Upload picture from device"
          >
            <Camera className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
            <span>Change Photo</span>
          </button>
          )}
          {canEditMembers && (
          <button
            onClick={() => setIsEditOpen(true)}
            className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Record</span>
          </button>
          )}
          {canDeleteMembers && (
            confirmDelete ? (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition animate-pulse"
                title="Click again to permanently delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            ) : (
              <button
                onClick={handleDelete}
                className="p-2 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                title="Delete Member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )
          )}
        </div>
        )}
      </div>

      {/* 2-Column Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans): Bio, Timeline, Connected Media */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Biography */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">Personal Biography & Achievements</h3>
              {canEditMembers && (
                <button
                  type="button"
                  onClick={() => setIsAIBioOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold border border-amber-200 dark:border-amber-800/60 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Synthesize with AI</span>
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
              {member.biography || 'No written biography recorded yet. Click "AI Biographer" to instantly generate a story from their life milestones, or edit manually.'}
            </p>

            {(member.occupation || member.education) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
                {member.occupation && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-forest-700 dark:text-forest-400" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">Career</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{member.occupation}</span>
                    </div>
                  </div>
                )}
                {member.education && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">Education</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{member.education}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Geographical Journey & Migration History */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-soft space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-forest-700 dark:text-forest-400" />
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  Geographical Journey & Migration History
                </h3>
              </div>
              {canEditMembers && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingMigration(undefined);
                    setIsAddMigrationOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-50 dark:bg-forest-950/80 text-forest-700 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-900/60 rounded-xl text-xs font-bold transition border border-forest-200/60 dark:border-forest-800/40"
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Record Move / Relocation</span>
                </button>
              )}
            </div>

            {/* Structured Origin & Current Residence Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">Birth Place / Ancestral Town</span>
                  <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 block mt-0.5">
                    {member.birthPlaceDetails?.formatted || member.birthPlace || 'Not recorded'}
                  </span>
                  {member.birthPlaceDetails && (
                    <span className="text-[10px] text-stone-400 font-mono">
                      GPS: {member.birthPlaceDetails.latitude.toFixed(3)}, {member.birthPlaceDetails.longitude.toFixed(3)}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">Current Living Residence</span>
                  <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 block mt-0.5">
                    {member.currentLocationDetails?.formatted || member.currentLocation || (member.isLiving ? 'Same as ancestral origin' : 'Deceased')}
                  </span>
                  {member.currentLocationDetails && (
                    <span className="text-[10px] text-stone-400 font-mono">
                      GPS: {member.currentLocationDetails.latitude.toFixed(3)}, {member.currentLocationDetails.longitude.toFixed(3)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* List of Recorded Migration Milestones */}
            {(!member.migrations || member.migrations.length === 0) ? (
              <div className="p-5 text-center bg-stone-50 dark:bg-stone-800/30 rounded-2xl border border-stone-200/50 dark:border-stone-800 text-stone-400 text-xs">
                <p>No inter-city or international migrations recorded yet. Click "Record Move / Relocation" to track life movements (e.g. marriage moves, job relocations, or diaspora emigration).</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {member.migrations.map((mig) => {
                  const meta = getMigrationMeta(mig.reason);
                  return (
                    <div
                      key={mig.id}
                      className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${meta.badgeBgLight} ${meta.badgeTextLight} ${meta.badgeBgDark} ${meta.badgeTextDark}`}>
                            <span>{meta.icon}</span>
                            <span>{meta.label}</span>
                          </span>
                          {mig.year && (
                            <span className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400">
                              Year {mig.year}
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-medium text-stone-800 dark:text-stone-200 flex items-center gap-1.5 flex-wrap">
                          <span>{mig.fromLocation.formatted}</span>
                          <span className="text-stone-400 font-bold">➔</span>
                          <span className="font-bold text-stone-900 dark:text-stone-100">{mig.toLocation.formatted}</span>
                        </div>

                        {mig.notes && (
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                            "{mig.notes}"
                          </p>
                        )}
                      </div>

                      {canEditMembers && (
                        <div className="flex items-center gap-1 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMigration(mig);
                              setIsAddMigrationOpen(true);
                            }}
                            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition"
                            title="Edit Migration Record"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMigration(member.id, mig.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                            title="Delete Migration Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Personal Chronological Timeline */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-soft space-y-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-forest-700 dark:text-forest-400" />
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">Life Journey & Key Milestones</h3>
            </div>

            <div className="relative pl-6 border-l-2 border-forest-200 dark:border-forest-800 space-y-6 ml-3">
              {personalTimeline.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-forest-600 border-2 border-white dark:border-stone-900 ring-2 ring-forest-200 dark:ring-forest-800" />
                  
                  <span className="text-xs font-mono font-bold text-forest-700 dark:text-forest-300 bg-forest-50 dark:bg-forest-950/80 px-2 py-0.5 rounded-md border border-forest-100 dark:border-forest-800/40">
                    {item.year}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">{item.title}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tagged Photos & Media */}
          {taggedPhotos.length > 0 && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-forest-700 dark:text-forest-400" />
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">Archival Photos Featuring {member.firstName}</h3>
                </div>
                <Link to="/photos" className="text-xs text-forest-700 dark:text-forest-400 font-semibold hover:underline">
                  View in gallery
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {taggedPhotos.map(p => (
                  <div key={p.id} className="rounded-2xl overflow-hidden aspect-video border border-stone-200 dark:border-stone-800 shadow-xs relative group">
                    <img src={p.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                      <span className="text-[10px] text-white font-medium line-clamp-1">{p.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (1 span): Family Relationships Matrix */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-soft space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">Family Relations</h3>
              {canEditMembers && (
                <button
                  onClick={() => {
                    setAddRelationType('child');
                    setIsAddRelativeOpen(true);
                  }}
                  className="text-xs font-bold text-forest-700 dark:text-forest-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Relative
                </button>
              )}
            </div>

            {/* Parents */}
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block mb-2">Parents</span>
              <div className="space-y-2">
                {parents.length === 0 ? (
                  <p className="text-xs text-stone-400 dark:text-stone-500 italic">No parents recorded.</p>
                ) : (
                  parents.map(p => (
                    <div
                      key={p.id}
                      onClick={() => navigate(`/members/${p.id}`)}
                      className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-forest-50/50 dark:hover:bg-forest-950/40 border border-stone-200 dark:border-stone-700/60 cursor-pointer transition flex items-center gap-3"
                    >
                      {p.avatarUrl ? (
                        <img src={p.avatarUrl} alt="" className="w-8 h-8 rounded-xl object-cover border border-stone-200 dark:border-stone-700" />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold flex items-center justify-center text-xs">
                          {p.firstName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{p.firstName} {p.lastName}</p>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400">{p.gender === 'female' ? 'Mother' : 'Father'} • Gen {p.generation}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Spouse / Partner */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block mb-2">Spouse / Partner</span>
              <div className="space-y-2">
                {spouses.length === 0 ? (
                  <p className="text-xs text-stone-400 dark:text-stone-500 italic">No spouse recorded.</p>
                ) : (
                  spouses.map(s => (
                    <div
                      key={s.id}
                      onClick={() => navigate(`/members/${s.id}`)}
                      className="p-2.5 rounded-2xl bg-pink-50/40 dark:bg-pink-950/20 hover:bg-pink-50 dark:hover:bg-pink-950/40 border border-pink-100 dark:border-pink-900/40 cursor-pointer transition flex items-center gap-3"
                    >
                      {s.avatarUrl ? (
                        <img src={s.avatarUrl} alt="" className="w-8 h-8 rounded-xl object-cover border border-pink-200 dark:border-pink-800/50" />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold flex items-center justify-center text-xs">
                          {s.firstName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{s.firstName} {s.lastName}</p>
                        <p className="text-[10px] text-pink-700 dark:text-pink-400 font-medium">
                          ⚭ Spouse {member.marriageDate ? `(m. ${member.marriageDate.split('-')[0]})` : (s.marriageDate ? `(m. ${s.marriageDate.split('-')[0]})` : '')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Children */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block mb-2">Children ({children.length})</span>
              <div className="space-y-2">
                {children.length === 0 ? (
                  <p className="text-xs text-stone-400 dark:text-stone-500 italic">No children recorded.</p>
                ) : (
                  children.map(c => (
                    <div
                      key={c.id}
                      onClick={() => navigate(`/members/${c.id}`)}
                      className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-forest-50/50 dark:hover:bg-forest-950/40 border border-stone-200 dark:border-stone-700/60 cursor-pointer transition flex items-center gap-3"
                    >
                      {c.avatarUrl ? (
                        <img src={c.avatarUrl} alt="" className="w-8 h-8 rounded-xl object-cover border border-stone-200 dark:border-stone-700" />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold flex items-center justify-center text-xs">
                          {c.firstName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{c.firstName} {c.lastName}</p>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400">{c.gender === 'female' ? 'Daughter' : 'Son'} • Gen {c.generation}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Siblings */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block mb-2">Siblings ({siblings.length})</span>
              <div className="space-y-2">
                {siblings.length === 0 ? (
                  <p className="text-xs text-stone-400 dark:text-stone-500 italic">No siblings recorded.</p>
                ) : (
                  siblings.map(sib => (
                    <div
                      key={sib.id}
                      onClick={() => navigate(`/members/${sib.id}`)}
                      className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-forest-50/50 dark:hover:bg-forest-950/40 border border-stone-200 dark:border-stone-700/60 cursor-pointer transition flex items-center gap-3"
                    >
                      {sib.avatarUrl ? (
                        <img src={sib.avatarUrl} alt="" className="w-8 h-8 rounded-xl object-cover border border-stone-200 dark:border-stone-700" />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold flex items-center justify-center text-xs">
                          {sib.firstName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{sib.firstName} {sib.lastName}</p>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400">Sibling</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Relationship Explorer Shortcut Card */}
          <div className="bg-gradient-to-br from-forest-900 to-forest-950 text-white rounded-3xl p-6 border border-forest-800 shadow-soft space-y-3">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h4 className="font-serif font-bold text-sm">Explore Kinship Paths</h4>
            <p className="text-xs text-forest-200">
              Discover how {member.firstName} connects genealogically to any other relative in your database.
            </p>
            <Link
              to={`/relationships?from=${member.id}`}
              className="inline-block py-2 px-4 bg-emerald-400 text-forest-950 rounded-xl text-xs font-bold shadow hover:bg-emerald-300 transition"
            >
              Open Relationship Finder
            </Link>
          </div>

        </div>

      </div>

      {/* Edit Modal */}
      <AddMemberModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        editingMember={member}
      />

      {/* Add Relative Modal */}
      <AddMemberModal
        isOpen={isAddRelativeOpen}
        onClose={() => setIsAddRelativeOpen(false)}
        initialTargetMemberId={member.id}
        initialRelationType={addRelationType}
      />

      {/* Migration / Relocation Modal */}
      <AddMigrationModal
        isOpen={isAddMigrationOpen}
        onClose={() => {
          setIsAddMigrationOpen(false);
          setEditingMigration(undefined);
        }}
        member={member}
        editingMigration={editingMigration}
        onSaveMigration={(event) => addMigration(member.id, event)}
      />

      {/* AI Biographer Modal */}
      <AIBiographerModal
        isOpen={isAIBioOpen}
        onClose={() => setIsAIBioOpen(false)}
        member={member}
        allMembers={members}
        onSaveBio={(narrative) => updateMember(member.id, { biography: narrative })}
      />

    </div>
  );
};
