import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFamily } from '../../context/FamilyContext';
import { AddMemberModal } from '../../components/modals/AddMemberModal';
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
  Check
} from 'lucide-react';
import { RelationshipType } from '../../types';

export const MemberProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { members, branches, photos, documents, stories, deleteMember, updateMember } = useFamily();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddRelativeOpen, setIsAddRelativeOpen] = useState(false);
  const [addRelationType, setAddRelationType] = useState<RelationshipType>('child');
  const [photoUpdated, setPhotoUpdated] = useState(false);

  const member = useMemo(() => members.find(m => m.id === id), [members, id]);

  if (!member) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Family Member Not Found</h2>
        <p className="text-xs text-stone-500">The person you are searching for may have been removed or does not exist.</p>
        <Link to="/members" className="inline-block px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-semibold">
          Return to Member Directory
        </Link>
      </div>
    );
  }

  const branch = branches.find(b => b.id === member.branchId);

  // Direct relatives lookup (excluding self from any erroneous parent/child loop)
  const parents = members.filter(m => m.id !== member.id && member.parentIds.includes(m.id));
  const spouses = members.filter(m => m.id !== member.id && member.spouseIds.includes(m.id));
  const children = members.filter(m => m.id !== member.id && member.childIds.includes(m.id));
  const siblings = members.filter(m => m.id !== member.id && member.siblingIds.includes(m.id));

  // Linked Media
  const taggedPhotos = photos.filter(p => p.taggedMemberIds.includes(member.id));
  const linkedDocs = documents.filter(d => d.linkedMemberIds.includes(member.id));
  const linkedStories = stories.filter(s => s.taggedMemberIds.includes(member.id));

  // Direct profile avatar uploader handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateMember(member.id, { avatarUrl: reader.result });
          setPhotoUpdated(true);
          setTimeout(() => setPhotoUpdated(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Build Chronological Personal Timeline events
  const personalTimeline = useMemo(() => {
    const eventsList: { year: string; title: string; desc: string; type: string }[] = [];

    if (member.birthDate) {
      eventsList.push({
        year: member.birthDate.split('-')[0],
        title: 'Born into the Family Lineage',
        desc: member.birthPlace ? `Born in ${member.birthPlace}` : 'Birth recorded',
        type: 'birth'
      });
    }

    if (member.education) {
      eventsList.push({
        year: member.birthDate ? String(Number(member.birthDate.split('-')[0]) + 22) : 'Academic',
        title: 'Graduation & Education',
        desc: member.education,
        type: 'education'
      });
    }

    if (spouses.length > 0) {
      eventsList.push({
        year: member.birthDate ? String(Number(member.birthDate.split('-')[0]) + 28) : 'Union',
        title: `Marriage with ${spouses.map(s => s.firstName).join(' & ')}`,
        desc: 'Matrimonial union recorded in archives',
        type: 'marriage'
      });
    }

    if (children.length > 0) {
      children.forEach((c) => {
        if (c.birthDate) {
          eventsList.push({
            year: c.birthDate.split('-')[0],
            title: `Welcome Child: ${c.firstName}`,
            desc: `Continuation of Generation ${c.generation}`,
            type: 'child'
          });
        }
      });
    }

    if (!member.isLiving && member.deathDate) {
      eventsList.push({
        year: member.deathDate.split('-')[0],
        title: 'Passing & Eternal Memory',
        desc: member.deathPlace ? `Passed peacefully in ${member.deathPlace}` : 'Memorial preserved',
        type: 'death'
      });
    }

    return eventsList.sort((a, b) => a.year.localeCompare(b.year));
  }, [member, spouses, children]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove ${member.firstName} ${member.lastName} from the tree?`)) {
      deleteMember(member.id);
      navigate('/members');
    }
  };

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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
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
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-forest-100 shadow-md group-hover:opacity-90 transition" 
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-forest-100 text-forest-800 font-serif font-bold text-4xl flex items-center justify-center border-2 border-forest-200">
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
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {member.firstName} {member.middleName ? `${member.middleName} ` : ''}{member.lastName}
              </h1>
              {member.nickname && (
                <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full font-medium">
                  "{member.nickname}"
                </span>
              )}
            </div>

            {member.maidenName && (
              <p className="text-xs text-stone-500 italic">née {member.maidenName}</p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded-full">
                Generation {member.generation}
              </span>
              {branch && (
                <span className="text-xs font-semibold text-white px-2.5 py-0.5 rounded-full" style={{ backgroundColor: branch.color }}>
                  {branch.name}
                </span>
              )}
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                member.isLiving ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
              }`}>
                {member.isLiving ? 'Living' : 'Deceased ✝'}
              </span>
            </div>

            <div className="pt-2 text-xs text-stone-600 flex flex-wrap gap-4">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  {member.birthDate || 'Unknown'} — {member.isLiving ? 'Present' : (member.deathDate || '✝')}
                </span>
              </div>
              {member.birthPlace && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{member.birthPlace}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            title="Upload picture from device"
          >
            <Camera className="w-3.5 h-3.5 text-forest-700" />
            <span>Change Photo</span>
          </button>
          <button
            onClick={() => setIsEditOpen(true)}
            className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Record</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
            title="Delete Member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2-Column Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans): Bio, Timeline, Connected Media */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Biography */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">Personal Biography & Achievements</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {member.biography || 'No written biography recorded yet. Click "Edit Record" to add oral memories and milestones.'}
            </p>

            {(member.occupation || member.education) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
                {member.occupation && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-forest-700" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Career</span>
                      <span className="font-semibold text-stone-800">{member.occupation}</span>
                    </div>
                  </div>
                )}
                {member.education && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-blue-700" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Education</span>
                      <span className="font-semibold text-stone-800">{member.education}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Personal Chronological Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-forest-700" />
              <h3 className="font-serif font-bold text-lg text-stone-900">Life Journey & Key Milestones</h3>
            </div>

            <div className="relative pl-6 border-l-2 border-forest-200 space-y-6 ml-3">
              {personalTimeline.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-forest-600 border-2 border-white ring-2 ring-forest-200" />
                  
                  <span className="text-xs font-mono font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md">
                    {item.year}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-stone-900 mt-1">{item.title}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tagged Photos & Media */}
          {taggedPhotos.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-forest-700" />
                  <h3 className="font-serif font-bold text-base text-stone-900">Archival Photos Featuring {member.firstName}</h3>
                </div>
                <Link to="/photos" className="text-xs text-forest-700 font-semibold hover:underline">
                  View in gallery
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {taggedPhotos.map(p => (
                  <div key={p.id} className="rounded-2xl overflow-hidden aspect-video border border-stone-200 shadow-xs relative group">
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
          
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900">Family Relations</h3>
              <button
                onClick={() => {
                  setAddRelationType('child');
                  setIsAddRelativeOpen(true);
                }}
                className="text-xs font-bold text-forest-700 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Relative
              </button>
            </div>

            {/* Parents */}
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Parents</span>
              <div className="space-y-2">
                {parents.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No parents recorded.</p>
                ) : (
                  parents.map(p => (
                    <div
                      key={p.id}
                      onClick={() => navigate(`/members/${p.id}`)}
                      className="p-2.5 rounded-2xl bg-stone-50 hover:bg-forest-50/50 border border-stone-200 cursor-pointer transition flex items-center gap-3"
                    >
                      {p.avatarUrl ? (
                        <img src={p.avatarUrl} alt="" className="w-8 h-8 rounded-xl object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs">
                          {p.firstName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{p.firstName} {p.lastName}</p>
                        <p className="text-[10px] text-stone-500">{p.gender === 'female' ? 'Mother' : 'Father'} • Gen {p.generation}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Spouse / Partner */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Spouse / Partner</span>
              <div className="space-y-2">
                {spouses.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No spouse recorded.</p>
                ) : (
                  spouses.map(s => (
                    <div
                      key={s.id}
                      onClick={() => navigate(`/members/${s.id}`)}
                      className="p-2.5 rounded-2xl bg-pink-50/40 hover:bg-pink-50 border border-pink-100 cursor-pointer transition flex items-center gap-3"
                    >
                      {s.avatarUrl ? (
                        <img src={s.avatarUrl} alt="" className="w-8 h-8 rounded-xl object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-xs">
                          {s.firstName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{s.firstName} {s.lastName}</p>
                        <p className="text-[10px] text-pink-700 font-medium">⚭ Spouse</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Children */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Children ({children.length})</span>
              <div className="space-y-2">
                {children.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No children recorded.</p>
                ) : (
                  children.map(c => (
                    <div
                      key={c.id}
                      onClick={() => navigate(`/members/${c.id}`)}
                      className="p-2.5 rounded-2xl bg-stone-50 hover:bg-forest-50/50 border border-stone-200 cursor-pointer transition flex items-center gap-3"
                    >
                      {c.avatarUrl ? (
                        <img src={c.avatarUrl} alt="" className="w-8 h-8 rounded-xl object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs">
                          {c.firstName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{c.firstName} {c.lastName}</p>
                        <p className="text-[10px] text-stone-500">{c.gender === 'female' ? 'Daughter' : 'Son'} • Gen {c.generation}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Siblings */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Siblings ({siblings.length})</span>
              <div className="space-y-2">
                {siblings.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No siblings recorded.</p>
                ) : (
                  siblings.map(sib => (
                    <div
                      key={sib.id}
                      onClick={() => navigate(`/members/${sib.id}`)}
                      className="p-2.5 rounded-2xl bg-stone-50 hover:bg-forest-50/50 border border-stone-200 cursor-pointer transition flex items-center gap-3"
                    >
                      {sib.avatarUrl ? (
                        <img src={sib.avatarUrl} alt="" className="w-8 h-8 rounded-xl object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs">
                          {sib.firstName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{sib.firstName} {sib.lastName}</p>
                        <p className="text-[10px] text-stone-500">Sibling</p>
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

    </div>
  );
};
