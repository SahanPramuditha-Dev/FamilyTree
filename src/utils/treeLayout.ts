import { FamilyMember, Branch } from '../types';
import { Node, Edge, MarkerType } from '@xyflow/react';

export interface CustomNodeData {
  [key: string]: unknown;
  member: FamilyMember;
  branch?: Branch;
  isRoot?: boolean;
  isHighlighted?: boolean;
  onAddRelative?: (memberId: string, relationType: 'parent' | 'spouse' | 'child' | 'sibling') => void;
  onSelectMember?: (memberId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (memberId: string) => void;
  hasChildren?: boolean;
}

export function buildTreeLayout(
  members: FamilyMember[],
  branches: Branch[],
  highlightedMemberId?: string,
  collapsedMemberIds: Set<string> = new Set(),
  layoutMode: 'vertical' | 'pedigree' | 'compact' = 'vertical'
): { nodes: Node[]; edges: Edge[] } {
  const branchMap = new Map<string, Branch>();
  branches.forEach(b => branchMap.set(b.id, b));

  // Determine generations
  const genMap = new Map<number, FamilyMember[]>();
  members.forEach(m => {
    const g = m.generation || 1;
    if (!genMap.has(g)) genMap.set(g, []);
    genMap.get(g)!.push(m);
  });

  const sortedGens = Array.from(genMap.keys()).sort((a, b) => a - b);

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const NODE_WIDTH = 260;
  const NODE_HEIGHT = 140;
  const X_GAP = 70;
  const Y_GAP = 160;

  // Track coordinates for each member
  const memberPositions = new Map<string, { x: number; y: number }>();

  // Filter out children of collapsed nodes
  const hiddenMembers = new Set<string>();
  const collectHiddenDescendants = (mId: string) => {
    const mem = members.find(m => m.id === mId);
    if (!mem) return;
    mem.childIds.forEach(cId => {
      hiddenMembers.add(cId);
      collectHiddenDescendants(cId);
    });
  };

  collapsedMemberIds.forEach(cId => {
    collectHiddenDescendants(cId);
  });

  // Calculate layout per generation
  sortedGens.forEach((genIndex, rowIndex) => {
    const membersInGen = (genMap.get(genIndex) || []).filter(m => !hiddenMembers.has(m.id));
    if (membersInGen.length === 0) return;

    // Group spouses together
    const processed = new Set<string>();
    const orderedGenMembers: FamilyMember[] = [];

    membersInGen.forEach(m => {
      if (processed.has(m.id)) return;
      orderedGenMembers.push(m);
      processed.add(m.id);

      // Place spouse immediately adjacent
      m.spouseIds.forEach(sId => {
        const spouse = membersInGen.find(sm => sm.id === sId);
        if (spouse && !processed.has(spouse.id)) {
          orderedGenMembers.push(spouse);
          processed.add(spouse.id);
        }
      });
    });

    const totalWidth = orderedGenMembers.length * (NODE_WIDTH + X_GAP) - X_GAP;
    const startX = -totalWidth / 2;
    const yPos = rowIndex * (NODE_HEIGHT + Y_GAP);

    orderedGenMembers.forEach((member, colIndex) => {
      const xPos = startX + colIndex * (NODE_WIDTH + X_GAP);
      memberPositions.set(member.id, { x: xPos, y: yPos });

      const isHighlighted = highlightedMemberId === member.id;
      const isCollapsed = collapsedMemberIds.has(member.id);
      const hasChildren = member.childIds.length > 0;

      nodes.push({
        id: member.id,
        type: 'familyNode',
        position: { x: xPos, y: yPos },
        data: {
          member,
          branch: member.branchId ? branchMap.get(member.branchId) : undefined,
          isRoot: (member.parentIds || []).length === 0,
          isHighlighted,
          isCollapsed,
          hasChildren
        } as CustomNodeData
      });
    });
  });

  // Generate Edges
  const processedSpouseEdges = new Set<string>();
  const processedChildEdges = new Set<string>();

  members.forEach(member => {
    if (hiddenMembers.has(member.id)) return;

    // 1. Spouse connection (Horizontal pink/rose dashed or solid line)
    member.spouseIds.forEach(sId => {
      if (hiddenMembers.has(sId)) return;
      const pairKey = [member.id, sId].sort().join('-');
      if (!processedSpouseEdges.has(pairKey)) {
        processedSpouseEdges.add(pairKey);
        edges.push({
          id: `spouse-${pairKey}`,
          source: member.id,
          target: sId,
          sourceHandle: 'right',
          targetHandle: 'left',
          type: 'straight',
          style: { stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '4,4' },
          animated: false,
          label: '⚭ Marriage',
          labelStyle: { fill: '#be185d', fontSize: 10, fontWeight: 600 },
          labelBgStyle: { fill: '#fdf2f8', fillOpacity: 0.9, rx: 4, ry: 4 }
        });
      }
    });

    // 2. Parent-Child connection (Vertical smooth line)
    if (!collapsedMemberIds.has(member.id)) {
      member.childIds.forEach(cId => {
        if (hiddenMembers.has(cId)) return;
        const edgeKey = `${member.id}->${cId}`;
        if (!processedChildEdges.has(edgeKey)) {
          processedChildEdges.add(edgeKey);
          edges.push({
            id: `parent-child-${edgeKey}`,
            source: member.id,
            target: cId,
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'smoothstep',
            style: { stroke: '#439466', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#439466',
              width: 14,
              height: 14
            }
          });
        }
      });
    }
  });

  return { nodes, edges };
}
