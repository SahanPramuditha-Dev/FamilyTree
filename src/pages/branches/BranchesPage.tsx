import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useNavigate } from 'react-router-dom';
import { 
  Split, 
  Plus, 
  Users, 
  MapPin, 
  Calendar, 
  User, 
  ChevronRight, 
  X, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { Branch } from '../../types';

export const BranchesPage: React.FC = () => {
  const { branches, members, addBranch } = useFamily();
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
    setIsCreateOpen(false);
  };

  const sampleColors = ['#059669', '#3b82f6', '#d97706', '#8b5cf6', '#ec4899', '#ef4444', '#14b8a6'];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
            <Split className="w-3.5 h-3.5 text-amber-600" />
            <span>Lineage Branch Management</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
            Family Branches & Lineages
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
            Organize large extended lineages into distinct, color-coded family branches across regions, cities, and migrations.
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

      {/* Branches List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map(branch => {
          const branchMembers = members.filter(m => m.branchId === branch.id);
          const leader = members.find(m => m.id === branch.leaderMemberId);

          return (
            <div
              key={branch.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft hover:shadow-elevated transition flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Branch Badge & Color */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: branch.color }} />
                    <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-forest-700">
                      {branch.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    {branchMembers.length} Members
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {branch.description || 'No description recorded for this branch lineage.'}
                </p>

                {/* Metadata */}
                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-500">
                  {branch.originLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{branch.originLocation}</span>
                    </div>
                  )}

                  {leader && (
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>Branch Anchor: <strong className="text-stone-800">{leader.firstName} {leader.lastName}</strong></span>
                    </div>
                  )}
                </div>

                {/* Member Avatars Preview */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                    Branch Members Roster
                  </span>
                  <div className="flex items-center -space-x-2 overflow-hidden py-1">
                    {branchMembers.slice(0, 6).map(bm => (
                      bm.avatarUrl ? (
                        <img
                          key={bm.id}
                          src={bm.avatarUrl}
                          alt={bm.firstName}
                          title={`${bm.firstName} ${bm.lastName}`}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                        />
                      ) : (
                        <div
                          key={bm.id}
                          title={`${bm.firstName} ${bm.lastName}`}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs"
                        >
                          {bm.firstName.charAt(0)}
                        </div>
                      )
                    ))}
                    {branchMembers.length > 6 && (
                      <span className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-stone-200 text-stone-700 font-bold items-center justify-center text-[10px]">
                        +{branchMembers.length - 6}
                      </span>
                    )}
                  </div>
                </div>

              </div>

              <button
                onClick={() => navigate(`/tree`)}
                className="w-full py-2.5 bg-stone-50 hover:bg-forest-50 text-forest-800 rounded-xl text-xs font-semibold border border-stone-200 flex items-center justify-center gap-1.5 transition"
              >
                <span>View Branch in Interactive Tree</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Create Branch Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-base text-stone-900">Create New Branch</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fernando Colombo Branch"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Branch Badge Color</label>
                <div className="flex items-center gap-2">
                  {sampleColors.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition ${color === c ? 'border-stone-900 scale-110' : 'border-white'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Origin Location</label>
                <input
                  type="text"
                  placeholder="e.g. Kandy, Sri Lanka"
                  value={originLocation}
                  onChange={(e) => setOriginLocation(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Branch Leader / Patriarch</label>
                <select
                  value={leaderMemberId}
                  onChange={(e) => setLeaderMemberId(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                >
                  <option value="">Select a member...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description & History</label>
                <textarea
                  rows={3}
                  placeholder="Historical notes about this branch..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold shadow"
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
