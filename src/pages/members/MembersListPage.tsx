import React, { useState, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useFamilyAccess } from '../../hooks/useFamilyAccess';
import { useNavigate } from 'react-router-dom';
import { SelectDropdown } from '../../components/ui/Dropdown';
import { AddMemberModal } from '../../components/modals/AddMemberModal';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Grid, 
  List, 
  Calendar, 
  MapPin, 
  Briefcase, 
  ExternalLink,
  Split,
  Trash2,
  Edit
} from 'lucide-react';
import { FamilyMember } from '../../types';

export const MembersListPage: React.FC = () => {
  const { members, branches, deleteMember } = useFamily();
  const { maskMembers, canEditMembers, canDeleteMembers } = useFamilyAccess();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedGen, setSelectedGen] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'living' | 'deceased'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | undefined>(undefined);

  const visibleMembers = useMemo(() => maskMembers(members), [members, maskMembers]);

  const filteredMembers = useMemo(() => {
    return visibleMembers.filter(m => {
      const matchQuery = `${m.firstName} ${m.middleName || ''} ${m.lastName} ${m.nickname || ''} ${m.occupation || ''}`.toLowerCase().includes(search.toLowerCase());
      const matchBranch = selectedBranch === 'all' || m.branchId === selectedBranch;
      const matchGen = selectedGen === 'all' || m.generation === Number(selectedGen);
      const matchStatus = statusFilter === 'all' || (statusFilter === 'living' ? m.isLiving : !m.isLiving);

      return matchQuery && matchBranch && matchGen && matchStatus;
    });
  }, [visibleMembers, search, selectedBranch, selectedGen, statusFilter]);

  const branchMap = useMemo(() => {
    const map = new Map<string, string>();
    branches.forEach(b => map.set(b.id, b.name));
    return map;
  }, [branches]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Family Directory
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Browse and manage all {members.length} registered individuals in your family lineage.
          </p>
        </div>

        {canEditMembers && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingMember(undefined);
                setIsAddOpen(true);
              }}
              className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, nickname, occupation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:border-forest-500 focus:ring-forest-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <SelectDropdown
            value={selectedBranch}
            onChange={setSelectedBranch}
            menuWidth="w-48"
            options={[
              { value: 'all', label: 'All Branches' },
              ...branches.map(b => ({ value: b.id, label: b.name }))
            ]}
          />

          <SelectDropdown
            value={selectedGen}
            onChange={setSelectedGen}
            menuWidth="w-52"
            options={[
              { value: 'all', label: 'All Generations' },
              { value: '1', label: 'Gen 1 (Founders)' },
              { value: '2', label: 'Gen 2 (Parents / Elders)' },
              { value: '3', label: 'Gen 3 (Current / Adults)' },
              { value: '4', label: 'Gen 4 (Children)' }
            ]}
          />

          <SelectDropdown
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as any)}
            menuWidth="w-44"
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'living', label: 'Living Members' },
              { value: 'deceased', label: 'Deceased ✝' }
            ]}
          />

          {/* Toggle Grid vs Table */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-stone-700 shadow-xs text-forest-800 dark:text-forest-300' : 'text-stone-400'}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-white dark:bg-stone-700 shadow-xs text-forest-800 dark:text-forest-300' : 'text-stone-400'}`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Members Output */}
      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-400 space-y-2">
          <Users className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
          <p className="text-xs">No family members found matching your search and filter criteria.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMembers.map((m) => {
            const branchName = m.branchId ? branchMap.get(m.branchId) : null;
            return (
              <div
                key={m.id}
                onClick={() => navigate(`/members/${m.id}`)}
                className="bg-white dark:bg-stone-900 rounded-3xl p-4 border border-stone-200 dark:border-stone-800 shadow-soft hover:shadow-elevated hover:border-forest-300 dark:hover:border-forest-600 cursor-pointer transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    {branchName ? (
                      <span className="text-[10px] bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-forest-300 font-bold px-2 py-0.5 rounded-full truncate max-w-[150px] border border-transparent dark:border-forest-800/40">
                        {branchName}
                      </span>
                    ) : <div />}

                    <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono font-semibold">
                      Gen {m.generation}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover border border-stone-200 dark:border-stone-700" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-serif font-bold flex items-center justify-center text-sm border border-forest-200 dark:border-forest-800/40">
                        {m.firstName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-forest-700 dark:group-hover:text-forest-400 truncate">
                        {m.firstName} {m.lastName}
                      </h3>
                      {m.maidenName && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 italic truncate">née {m.maidenName}</p>
                      )}
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 truncate mt-0.5">{m.occupation || (m.isLiving ? 'Living' : 'Deceased')}</p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                      <span>{m.birthDate ? m.birthDate.split('-')[0] : '?'} — {m.isLiving ? 'Present' : (m.deathDate ? m.deathDate.split('-')[0] : '✝')}</span>
                    </div>
                    {m.birthPlace && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                        <span className="truncate">{m.birthPlace}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-xs text-forest-700 dark:text-forest-400 font-medium">
                  <span>View Profile & Timeline</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-soft">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Generation</th>
                <th className="p-4">Status</th>
                <th className="p-4">Birth / Death</th>
                <th className="p-4">Branch</th>
                <th className="p-4">Occupation</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition cursor-pointer" onClick={() => navigate(`/members/${m.id}`)}>
                  <td className="p-4 font-bold text-stone-900 dark:text-stone-100 flex items-center gap-3">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover border border-stone-200 dark:border-stone-700" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold flex items-center justify-center text-xs">
                        {m.firstName.charAt(0)}
                      </div>
                    )}
                    <span>{m.firstName} {m.lastName} {m.nickname && <span className="font-normal text-stone-500 dark:text-stone-400">({m.nickname})</span>}</span>
                  </td>
                  <td className="p-4 font-mono font-semibold text-stone-600 dark:text-stone-300">Gen {m.generation}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${m.isLiving ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'}`}>
                      {m.isLiving ? 'Living' : 'Deceased ✝'}
                    </span>
                  </td>
                  <td className="p-4 text-stone-600 dark:text-stone-400">
                    {m.birthDate ? m.birthDate.split('-')[0] : '?'} — {m.isLiving ? 'Present' : (m.deathDate ? m.deathDate.split('-')[0] : '✝')}
                  </td>
                  <td className="p-4">
                    {m.branchId && branchMap.get(m.branchId) ? (
                      <span className="text-[10px] bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold px-2 py-0.5 rounded-full">
                        {branchMap.get(m.branchId)}
                      </span>
                    ) : (
                      <span className="text-stone-400 dark:text-stone-600">—</span>
                    )}
                  </td>
                  <td className="p-4 text-stone-600 dark:text-stone-400">{m.occupation || '—'}</td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    {canEditMembers && (
                      <button
                        onClick={() => {
                          setEditingMember(members.find(item => item.id === m.id));
                          setIsAddOpen(true);
                        }}
                        className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 mr-2"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {canDeleteMembers && (
                      <button
                        onClick={() => deleteMember(m.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      <AddMemberModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingMember(undefined);
        }}
        editingMember={editingMember}
      />

    </div>
  );
};
