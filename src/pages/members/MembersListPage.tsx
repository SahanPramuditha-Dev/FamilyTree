import React, { useState, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
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
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedGen, setSelectedGen] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'living' | 'deceased'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | undefined>(undefined);

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchQuery = `${m.firstName} ${m.middleName || ''} ${m.lastName} ${m.nickname || ''} ${m.occupation || ''}`.toLowerCase().includes(search.toLowerCase());
      const matchBranch = selectedBranch === 'all' || m.branchId === selectedBranch;
      const matchGen = selectedGen === 'all' || m.generation === Number(selectedGen);
      const matchStatus = statusFilter === 'all' || (statusFilter === 'living' ? m.isLiving : !m.isLiving);

      return matchQuery && matchBranch && matchGen && matchStatus;
    });
  }, [members, search, selectedBranch, selectedGen, statusFilter]);

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
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Family Directory
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Browse and manage all {members.length} registered individuals in your family lineage.
          </p>
        </div>

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
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-soft flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, nickname, occupation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:border-forest-500 focus:ring-forest-500"
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
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-xs text-forest-800' : 'text-stone-400'}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-white shadow-xs text-forest-800' : 'text-stone-400'}`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Members Output */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMembers.map((m) => {
            const branchName = m.branchId ? branchMap.get(m.branchId) : null;
            return (
              <div
                key={m.id}
                onClick={() => navigate(`/members/${m.id}`)}
                className="bg-white rounded-3xl p-4 border border-stone-200 shadow-soft hover:shadow-elevated hover:border-forest-300 cursor-pointer transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    {branchName ? (
                      <span className="text-[10px] bg-forest-100 text-forest-800 font-bold px-2 py-0.5 rounded-full truncate max-w-[150px]">
                        {branchName}
                      </span>
                    ) : <div />}

                    <span className="text-[10px] text-stone-400 font-mono font-semibold">
                      Gen {m.generation}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover border border-stone-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 font-serif font-bold flex items-center justify-center text-sm">
                        {m.firstName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif font-bold text-sm text-stone-900 group-hover:text-forest-700 truncate">
                        {m.firstName} {m.lastName}
                      </h3>
                      {m.maidenName && (
                        <p className="text-[11px] text-stone-500 italic truncate">née {m.maidenName}</p>
                      )}
                      <p className="text-[11px] text-stone-600 truncate mt-0.5">{m.occupation || (m.isLiving ? 'Living' : 'Deceased')}</p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{m.birthDate ? m.birthDate.split('-')[0] : '?'} — {m.isLiving ? 'Present' : (m.deathDate ? m.deathDate.split('-')[0] : '✝')}</span>
                    </div>
                    {m.birthPlace && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span className="truncate">{m.birthPlace}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-xs text-forest-700 font-medium">
                  <span>View Profile & Timeline</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-soft">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
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
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50 transition cursor-pointer" onClick={() => navigate(`/members/${m.id}`)}>
                  <td className="p-4 font-bold text-stone-900 flex items-center gap-3">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs">
                        {m.firstName.charAt(0)}
                      </div>
                    )}
                    <span>{m.firstName} {m.lastName} {m.nickname && <span className="font-normal text-stone-500">({m.nickname})</span>}</span>
                  </td>
                  <td className="p-4 font-mono font-semibold">Gen {m.generation}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${m.isLiving ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'}`}>
                      {m.isLiving ? 'Living' : 'Deceased'}
                    </span>
                  </td>
                  <td className="p-4">{m.birthDate || 'Unknown'} — {m.isLiving ? 'Present' : (m.deathDate || 'Deceased')}</td>
                  <td className="p-4">{m.branchId ? branchMap.get(m.branchId) : '—'}</td>
                  <td className="p-4 truncate max-w-[150px]">{m.occupation || '—'}</td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setEditingMember(m);
                        setIsAddOpen(true);
                      }}
                      className="p-1 text-stone-400 hover:text-stone-700 mr-2"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMember(m.id)}
                      className="p-1 text-stone-400 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
