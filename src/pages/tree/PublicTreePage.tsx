import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  NodeTypes,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FamilyNode } from '../../components/tree/FamilyNode';
import { buildTreeLayout } from '../../utils/treeLayout';
import { loadPublicTree } from '../../services/publicTreeFirestore';
import { FamilyMember } from '../../types';
import { Trees, ShieldCheck, ArrowLeft, AlertTriangle } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

const nodeTypes: NodeTypes = {
  familyNode: FamilyNode,
};

const PublicTreeCanvas: React.FC<{
  members: FamilyMember[];
  familyName: string;
}> = ({ members, familyName }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const { nodes: layoutNodes, edges: layoutEdges } = buildTreeLayout(members, [], 'vertical');
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [members, setNodes, setEdges]);

  return (
    <div className="h-[70vh] rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-stone-50 dark:bg-stone-900 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background gap={20} color="#78716c" className="opacity-20" />
        <Controls showInteractive={false} className="!bg-white dark:!bg-stone-800 !border-stone-200 dark:!border-stone-700 !shadow-soft !rounded-xl overflow-hidden [&>button]:!border-stone-200 dark:[&>button]:!border-stone-700 [&>button]:!text-stone-700 dark:[&>button]:!text-stone-200 [&>button]:!bg-transparent hover:[&>button]:!bg-stone-100 dark:hover:[&>button]:!bg-stone-700" />
        <MiniMap
          nodeColor={() => '#166534'}
          maskColor="rgba(0, 0, 0, 0.4)"
          className="!bg-white/90 dark:!bg-stone-900/90 !border-stone-200 dark:!border-stone-800 !rounded-2xl"
        />
      </ReactFlow>
      <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-stone-950/90 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 shadow-sm backdrop-blur-xs">
        {familyName} — Public View
      </div>
    </div>
  );
};

export const PublicTreePage: React.FC = () => {
  const { familyId } = useParams<{ familyId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<Awaited<ReturnType<typeof loadPublicTree>>>(null);

  useEffect(() => {
    if (!familyId) {
      setError('No family tree identifier provided.');
      setLoading(false);
      return;
    }

    loadPublicTree(familyId)
      .then((data) => {
        if (!data || (data as { unpublished?: boolean }).unpublished) {
          setError('This family tree is not publicly shared.');
        } else {
          setSnapshot(data);
        }
      })
      .catch(() => {
        setError('Unable to load the public family tree.');
      })
      .finally(() => setLoading(false));
  }, [familyId]);

  const memberCount = useMemo(() => snapshot?.members.length ?? 0, [snapshot]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <p className="text-sm text-stone-500 dark:text-stone-400">Loading public family tree...</p>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 text-center space-y-4 shadow-soft">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
          <h1 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">Tree Unavailable</h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">{error || 'This tree could not be loaded.'}</p>
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 dark:text-forest-400 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors">
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-900 dark:bg-forest-800 text-white flex items-center justify-center">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">{snapshot.family.name}</h1>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">{memberCount} individuals • Read-only public view</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Living members masked</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {snapshot.family.motto && (
          <p className="text-sm text-stone-600 dark:text-stone-300 italic text-center font-serif">"{snapshot.family.motto}"</p>
        )}

        <ReactFlowProvider>
          <div className="relative">
            <PublicTreeCanvas members={snapshot.members} familyName={snapshot.family.name} />
          </div>
        </ReactFlowProvider>

        <p className="text-center text-[11px] text-stone-400 dark:text-stone-500">
          This is a privacy-protected public snapshot.{' '}
          <Link to="/register" className="text-forest-700 dark:text-forest-400 font-semibold hover:underline">
            Create an account
          </Link>{' '}
          to collaborate on your own family tree.
        </p>
      </main>
    </div>
  );
};
