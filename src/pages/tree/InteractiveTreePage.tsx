import React, { useState, useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  NodeTypes, 
  Panel,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFamily } from '../../context/FamilyContext';
import { useFamilyAccess } from '../../hooks/useFamilyAccess';
import { useTheme } from '../../context/ThemeContext';
import { FamilyNode } from '../../components/tree/FamilyNode';
import { buildTreeLayout } from '../../utils/treeLayout';
import { AddMemberModal } from '../../components/modals/AddMemberModal';
import { 
  Plus, 
  Search, 
  RotateCcw, 
  Trees,
  Layers, 
  X, 
  Calendar, 
  Split,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FamilyMember, RelationshipType } from '../../types';
import { SelectDropdown } from '../../components/ui/Dropdown';

const nodeTypes: NodeTypes = {
  familyNode: FamilyNode,
};

const TreeCanvas: React.FC = () => {
  const { members, branches } = useFamily();
  const { maskMembers, canEditMembers } = useFamilyAccess();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const { fitView, setCenter } = useReactFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [selectedGen, setSelectedGen] = useState<string>('all');
  const [highlightedId, setHighlightedId] = useState<string | undefined>(undefined);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [layoutMode] = useState<'vertical' | 'pedigree' | 'compact'>('vertical');

  // Quick Member Detail Drawer state
  const [activeDrawerMember, setActiveDrawerMember] = useState<FamilyMember | null>(null);

  // Add Relative Modal from Tree Node
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [modalTargetId, setModalTargetId] = useState<string | undefined>(undefined);
  const [modalRelationType, setModalRelationType] = useState<RelationshipType>('child');

  const visibleMembers = useMemo(() => maskMembers(members), [members, maskMembers]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    let list = visibleMembers;
    if (selectedBranchId !== 'all') {
      list = list.filter(m => m.branchId === selectedBranchId);
    }
    if (selectedGen !== 'all') {
      list = list.filter(m => m.generation === Number(selectedGen));
    }
    return list;
  }, [visibleMembers, selectedBranchId, selectedGen]);

  // Handle node interaction callbacks
  const handleAddRelative = useCallback((memberId: string, relType: 'parent' | 'spouse' | 'child' | 'sibling') => {
    setModalTargetId(memberId);
    setModalRelationType(relType as RelationshipType);
    setAddModalOpen(true);
  }, []);

  const handleToggleCollapse = useCallback((memberId: string) => {
    setCollapsedIds(prev => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  }, []);

  const handleSelectMember = useCallback((id: string) => {
    const m = members.find(item => item.id === id);
    if (m) setActiveDrawerMember(m);
  }, [members]);

  const treeLayoutKey = useMemo(() => {
    return `tree-${layoutMode}-${filteredMembers.map(m => m.id).join('_')}-${highlightedId || 'none'}-${Array.from(collapsedIds).join('_')}`;
  }, [layoutMode, filteredMembers, highlightedId, collapsedIds]);

  // Compute layout whenever filtered members or tree options change
  const { nodes, edges } = useMemo(() => {
    const layout = buildTreeLayout(
      filteredMembers,
      branches,
      highlightedId,
      collapsedIds,
      layoutMode
    );

    const nodesWithHandlers = layout.nodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        onAddRelative: canEditMembers ? handleAddRelative : undefined,
        onToggleCollapse: handleToggleCollapse,
        onSelectMember: handleSelectMember
      }
    }));

    return { nodes: nodesWithHandlers, edges: layout.edges };
  }, [filteredMembers, branches, highlightedId, collapsedIds, layoutMode, canEditMembers, handleAddRelative, handleToggleCollapse, handleSelectMember]);

  // Search matching handler with smooth center focus
  const handleSearchSelect = (memberId: string) => {
    setHighlightedId(memberId);
    const m = members.find(item => item.id === memberId);
    if (m) setActiveDrawerMember(m);
    setSearchQuery('');

    const targetNode = nodes.find(n => n.id === memberId);
    if (targetNode) {
      setCenter(targetNode.position.x + 130, targetNode.position.y + 70, { zoom: 1.15, duration: 700 });
    }
  };

  const matchingSearchMembers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return visibleMembers.filter(m => 
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery, visibleMembers]);

  return (
    <div className="relative w-full h-[calc(100vh-8.5rem)] bg-stone-100 dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-2xl transition-colors duration-200">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Search & Filter group */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-white/90 dark:bg-stone-950/80 backdrop-blur-md p-2 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-elevated text-xs">
          
          {/* Tree Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Find relative in tree..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-200 rounded-xl text-xs focus:ring-forest-500 focus:border-forest-500 w-44 sm:w-56 shadow-xs"
            />

            {matchingSearchMembers.length > 0 && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl shadow-2xl p-1.5 z-50 space-y-1 divide-y divide-stone-100 dark:divide-stone-800">
                {matchingSearchMembers.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleSearchSelect(m.id)}
                    className="w-full text-left p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-xs text-stone-800 dark:text-stone-200 flex items-center justify-between transition"
                  >
                    <span className="font-semibold">{m.firstName} {m.lastName}</span>
                    <span className="text-[10px] text-forest-700 dark:text-forest-400 font-mono">Gen {m.generation}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Branch Select Dropdown */}
          <SelectDropdown
            icon={<Split className="w-3.5 h-3.5" />}
            value={selectedBranchId}
            onChange={setSelectedBranchId}
            menuWidth="w-48"
            options={[
              { value: 'all', label: `All Branches (${branches.length})` },
              ...branches.map(b => ({ value: b.id, label: b.name }))
            ]}
          />

          {/* Generation Select Dropdown */}
          <SelectDropdown
            icon={<Layers className="w-3.5 h-3.5" />}
            value={selectedGen}
            onChange={setSelectedGen}
            menuWidth="w-52"
            options={[
              { value: 'all', label: 'All Generations' },
              { value: '1', label: 'Gen 1 (Founders)' },
              { value: '2', label: 'Gen 2 (Parents / Elders)' },
              { value: '3', label: 'Gen 3 (Adults / Cousins)' },
              { value: '4', label: 'Gen 4 (Children)' }
            ]}
          />

          {highlightedId && (
            <button
              onClick={() => setHighlightedId(undefined)}
              className="px-2 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg text-[11px] border border-stone-200 dark:border-stone-700"
            >
              Clear Highlight
            </button>
          )}

        </div>

        {/* Right: Quick action Add + View re-align */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => fitView({ padding: 0.25, duration: 600 })}
            className="px-3 py-2 bg-white/90 hover:bg-stone-50 dark:bg-stone-950/80 dark:hover:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5 transition active:scale-95"
            title="Auto-Fit & Align Tree View"
          >
            <RotateCcw className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
            <span className="hidden sm:inline">Align Tree</span>
          </button>

          {canEditMembers && (
            <button
              onClick={() => {
                setModalTargetId(undefined);
                setModalRelationType('child');
                setAddModalOpen(true);
              }}
              className="px-4 py-2 bg-forest-600 hover:bg-forest-500 text-white rounded-2xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          )}
        </div>

      </div>

      {/* Main React Flow Canvas */}
      {members.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 z-10 bg-white/50 dark:bg-transparent">
          <div className="w-16 h-16 rounded-3xl bg-forest-100 dark:bg-forest-900/80 border border-forest-200 dark:border-forest-700 text-forest-700 dark:text-forest-300 flex items-center justify-center shadow-lg">
            <Trees className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white">Your Family Tree Canvas is Ready</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Start by adding your first family member (yourself or a founding ancestor).
            </p>
          </div>
          <button
            onClick={() => {
              setModalTargetId(undefined);
              setModalRelationType('child');
              setAddModalOpen(true);
            }}
            className="px-6 py-3 bg-forest-600 hover:bg-forest-500 text-white rounded-2xl text-xs font-bold shadow-xl transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Family Member</span>
          </button>
        </div>
      ) : null}

      <ReactFlow
        key={treeLayoutKey}
        defaultNodes={nodes}
        defaultEdges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        elementsSelectable={true}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        attributionPosition="bottom-right"
        className="bg-stone-100 dark:bg-stone-900 transition-colors"
      >
        <Background 
          color={resolvedTheme === 'dark' ? '#295f41' : '#a8a29e'} 
          gap={28} 
          size={1.2} 
        />
        
        {/* React Flow Controls Overlay */}
        <Controls 
          position="bottom-left"
          className="!mb-24 !ml-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-white rounded-2xl overflow-hidden shadow-elevated"
          showInteractive={false}
        />

        {/* MiniMap in bottom right */}
        <MiniMap 
          nodeColor={(n) => (n.data as any)?.branch?.color || '#439466'}
          maskColor={resolvedTheme === 'dark' ? 'rgba(14, 35, 25, 0.7)' : 'rgba(240, 244, 241, 0.7)'}
          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xl hidden md:block"
        />

        {/* Bottom Left Status Legend */}
        <Panel position="bottom-left" className="m-4">
          <div className="bg-white/90 dark:bg-stone-950/85 backdrop-blur-md p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-elevated text-[11px] text-stone-600 dark:text-stone-400 space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-forest-500 inline-block" /> Lineage Descent
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-pink-500 border-b border-dashed border-pink-400 inline-block" /> ⚭ Marriage
              </span>
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">
              Drag canvas to pan • Scroll to zoom • Click node to inspect details
            </p>
          </div>
        </Panel>
      </ReactFlow>

      {/* Quick Member Inspector Drawer */}
      {activeDrawerMember && (
        <div className="absolute top-4 right-4 bottom-4 w-80 sm:w-96 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 z-30 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right-8 duration-200">
          <div className="space-y-4">
            
            {/* Drawer Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {activeDrawerMember.avatarUrl ? (
                  <img src={activeDrawerMember.avatarUrl} alt="" className="w-14 h-14 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shadow-sm" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold font-serif flex items-center justify-center text-xl border border-forest-200 dark:border-forest-800/40">
                    {activeDrawerMember.firstName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    {activeDrawerMember.firstName} {activeDrawerMember.lastName}
                  </h3>
                  {activeDrawerMember.maidenName && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 italic">née {activeDrawerMember.maidenName}</p>
                  )}
                  <span className="inline-block mt-1 text-[10px] bg-forest-100 dark:bg-forest-900/60 text-forest-800 dark:text-forest-300 px-2 py-0.5 rounded-full font-semibold border border-transparent dark:border-forest-700/40">
                    Generation {activeDrawerMember.generation}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveDrawerMember(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 bg-stone-100 dark:bg-stone-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Vital Info */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-700/60 space-y-2 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-stone-400" />
                <span>
                  Born: {activeDrawerMember.birthDate || 'Unknown'} {activeDrawerMember.birthPlace ? `in ${activeDrawerMember.birthPlace}` : ''}
                </span>
              </div>
              {!activeDrawerMember.isLiving && (
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <span className="text-stone-400 font-bold">✝</span>
                  <span>
                    Passed: {activeDrawerMember.deathDate || 'Unknown'} {activeDrawerMember.deathPlace ? `in ${activeDrawerMember.deathPlace}` : ''}
                  </span>
                </div>
              )}
              {activeDrawerMember.occupation && (
                <div className="flex items-center gap-2">
                  <span className="text-stone-400 font-bold">💼</span>
                  <span>{activeDrawerMember.occupation}</span>
                </div>
              )}
            </div>

            {/* Biography excerpt */}
            {activeDrawerMember.biography && (
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1">Biography</h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 max-h-32 overflow-y-auto">
                  {activeDrawerMember.biography}
                </p>
              </div>
            )}

            {/* Direct Relations List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">Immediate Connections</h4>
              
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/70 dark:border-stone-700/60">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">Parents ({activeDrawerMember.parentIds.length})</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 truncate block">
                    {activeDrawerMember.parentIds.map(pid => members.find(m => m.id === pid)?.firstName).filter(Boolean).join(', ') || 'None recorded'}
                  </span>
                </div>

                <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/70 dark:border-stone-700/60">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">Spouse ({activeDrawerMember.spouseIds.length})</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 truncate block">
                    {activeDrawerMember.spouseIds.map(sid => members.find(m => m.id === sid)?.firstName).filter(Boolean).join(', ') || 'None recorded'}
                  </span>
                </div>

                <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/70 dark:border-stone-700/60 col-span-2">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">Children ({activeDrawerMember.childIds.length})</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 truncate block">
                    {activeDrawerMember.childIds.map(cid => members.find(m => m.id === cid)?.firstName).filter(Boolean).join(', ') || 'None recorded'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
            <button
              onClick={() => navigate(`/members/${activeDrawerMember.id}`)}
              className="flex-1 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Full Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            {canEditMembers && (
              <button
                onClick={() => {
                  setModalTargetId(activeDrawerMember.id);
                  setModalRelationType('child');
                  setAddModalOpen(true);
                }}
                className="p-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition"
                title="Add Child"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        initialTargetMemberId={modalTargetId}
        initialRelationType={modalRelationType}
      />

    </div>
  );
};

export const InteractiveTreePage: React.FC = () => {
  return (
    <ReactFlowProvider>
      <TreeCanvas />
    </ReactFlowProvider>
  );
};
