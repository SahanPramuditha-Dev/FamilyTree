import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useNavigate } from 'react-router-dom';
import { 
  Split, 
  Plus, 
  MapPin, 
  User, 
  ChevronRight, 
  X,
  Sparkles,
  GitFork
} from 'lucide-react';
import { SelectDropdown } from '../../components/ui/Dropdown';

export const BranchesPage: React.FC = () => {
  const { family, branches, members, addBranch } = useFamily();
  const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#059669');
  const [description, setDescription] = useState('');
  const [originLocation, setOriginLocation] = useState('');
  const [leaderMemberId, setLeaderMemberId] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addBranch({
      name,
      color,
      description: description || undefined,
      originLocation: originLocation || undefined,
      leaderMemberId: leaderMemberId || undefined
    });

    setName('');
    setDescription('');
    setOriginLocation('');
    setLeaderMemberId('');
    setIsCreateOpen(false);
  };

  const handleQuickCreateMain = () => {
    const rootMember = members.find(m => (m.parentIds || []).length === 0) || members[0];
    const cleanFamName = family.name
      ? family.name.replace(/Family Tree|Family Lineage/i, '').trim()
      : '';
    addBranch({
      name: cleanFamName ? `${cleanFamName} Main Branch` : 'Main Family Branch',
      color: '#059669',
      description: 'Primary root ancestral lineage and direct descendants.',
      originLocation: family.originCountry || 'Ancestral Homeland',
      leaderMemberId: rootMember?.id
    });
  };

  const sampleColors = ['#059669', '#3b82f6', '#d97706', '#8b5cf6', '#ec4899', '#ef4444', '#14b8a6'];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-transparent dark:border-amber-800/50 text-xs font-semibold mb-2">
            <Split className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Lineage Branch Management</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            Family Branches & Lineages
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mt-1">
            Organize extended lineages into distinct, color-coded family branches across regions, maternal/paternal lines, and migrations.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95 self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Branch</span>
        </button>
      </div>

      {/* Branches List Grid or Empty State */}
      {branches.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 space-y-4 max-w-2xl mx-auto shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
            <GitFork className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              No Family Branches Established Yet
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
              Every family tree starts with a core branch. You can initialize your primary Main Branch now or organize your relatives into Paternal, Maternal, or regional lineage divisions.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleQuickCreateMain}
              className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Initialize Main Branch</span>
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-5 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold transition"
            >
              Custom Branch
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map(branch => {
          const branchMembers = members.filter(m => m.branchId === branch.id || (branches.length === 1 && !m.branchId));
          const leader = members.find(m => m.id === branch.leaderMemberId);

          return (
            <div
              key={branch.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-soft hover:shadow-elevated transition flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Branch Badge & Color */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: branch.color }} />
                    <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 group-hover:text-forest-700 dark:group-hover:text-forest-400">
                      {branch.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {branchMembers.length} {branchMembers.length === 1 ? 'Member' : 'Members'}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {branch.description || 'No description recorded for this branch lineage.'}
                </p>

                {/* Metadata */}
                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
                  {branch.originLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                      <span>{branch.originLocation}</span>
                    </div>
                  )}

                  {leader && (
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                      <span>Branch Anchor: <strong className="text-stone-800 dark:text-stone-200">{leader.firstName} {leader.lastName}</strong></span>
                    </div>
                  )}
                </div>

                {/* Member Avatars Preview */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-1.5">
                    Branch Members Roster ({branchMembers.length})
                  </span>
                  <div className="flex items-center -space-x-2 overflow-hidden py-1">
                    {branchMembers.slice(0, 6).map(bm => (
                      bm.avatarUrl ? (
                        <img
                          key={bm.id}
                          src={bm.avatarUrl}
                          alt={bm.firstName}
                          title={`${bm.firstName} ${bm.lastName}`}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-stone-900 object-cover"
                        />
                      ) : (
                        <div
                          key={bm.id}
                          title={`${bm.firstName} ${bm.lastName}`}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-stone-900 bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold flex items-center justify-center text-xs border border-forest-200 dark:border-forest-800"
                        >
                          {bm.firstName.charAt(0)}
                        </div>
                      )
                    ))}
                    {branchMembers.length > 6 && (
                      <span className="inline-flex h-8 w-8 rounded-full ring-2 ring-white dark:ring-stone-900 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold items-center justify-center text-[10px]">
                        +{branchMembers.length - 6}
                      </span>
                    )}
                    {branchMembers.length === 0 && (
                      <span className="text-xs text-stone-400 italic">No members assigned to this branch yet.</span>
                    )}
                  </div>
                </div>

              </div>

              <button
                onClick={() => navigate(`/tree`)}
                className="w-full py-2.5 bg-stone-50 dark:bg-stone-800/80 hover:bg-forest-50 dark:hover:bg-forest-950/50 text-forest-800 dark:text-forest-300 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-1.5 transition"
              >
                <span>View Branch in Interactive Tree</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
      )}

      {/* Create Branch Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">Create New Branch</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Colombo Paternal Branch, Galle Maternal Line"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Color Marker</label>
                <div className="flex items-center gap-2">
                  {sampleColors.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-stone-900 dark:ring-white ring-offset-2' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Origin Location / Region</label>
                <input
                  type="text"
                  placeholder="e.g. Kandy, Sri Lanka"
                  value={originLocation}
                  onChange={(e) => setOriginLocation(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Branch Anchor Member</label>
                <SelectDropdown
                  options={[
                    { value: '', label: 'Select Anchor Member (Optional)' },
                    ...members.map(m => ({
                      value: m.id,
                      label: `${m.firstName} ${m.lastName} (Gen ${m.generation})`,
                      badge: `Gen ${m.generation}`
                    }))
                  ]}
                  value={leaderMemberId}
                  onChange={setLeaderMemberId}
                  fullWidth
                  searchable
                  searchPlaceholder="Search member..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Historical context, migration history, or branch characteristics..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 focus:ring-forest-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold shadow transition"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
