import { FamilyMember, Branch } from '../types';
import { Node, Edge, MarkerType } from '@xyflow/react';
import { normalizeFamilyMembers } from '../context/FamilyContext';

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
  rawMembers: FamilyMember[],
  branches: Branch[],
  highlightedMemberId?: string,
  collapsedMemberIds: Set<string> = new Set(),
  layoutMode: 'vertical' | 'pedigree' | 'compact' = 'vertical'
): { nodes: Node[]; edges: Edge[] } {
  const members = normalizeFamilyMembers(rawMembers);
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

  const NODE_WIDTH = layoutMode === 'compact' ? 220 : 260;
  const NODE_HEIGHT = layoutMode === 'compact' ? 120 : 140;
  const X_GAP = layoutMode === 'compact' ? 40 : 60;
  const Y_GAP = layoutMode === 'compact' ? 110 : 150;
  const isPedigree = layoutMode === 'pedigree';

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

  // Calculate layout per generation with chronological sibling sorting
  sortedGens.forEach((genIndex, rowIndex) => {
    const membersInGen = (genMap.get(genIndex) || []).filter(m => !hiddenMembers.has(m.id));
    if (membersInGen.length === 0) return;

    // Sort siblings by birthDate or name for consistent natural placement
    const sortedMembersInGen = [...membersInGen].sort((a, b) => {
      const aYear = a.birthDate ? parseInt(a.birthDate.split('-')[0], 10) : 9999;
      const bYear = b.birthDate ? parseInt(b.birthDate.split('-')[0], 10) : 9999;
      if (aYear !== bYear) return aYear - bYear;
      return a.firstName.localeCompare(b.firstName);
    });

    // Group spouses together
    const processed = new Set<string>();
    const orderedGenMembers: FamilyMember[] = [];

    sortedMembersInGen.forEach(m => {
      if (processed.has(m.id)) return;
      orderedGenMembers.push(m);
      processed.add(m.id);

      // Place spouse immediately adjacent
      m.spouseIds.forEach(sId => {
        const spouse = sortedMembersInGen.find(sm => sm.id === sId);
        if (spouse && !processed.has(spouse.id)) {
          orderedGenMembers.push(spouse);
          processed.add(spouse.id);
        }
      });
    });

    const totalWidth = orderedGenMembers.length * (NODE_WIDTH + X_GAP) - X_GAP;
    const startX = -totalWidth / 2;
    const yPos = isPedigree ? 0 : rowIndex * (NODE_HEIGHT + Y_GAP);
    const xBase = isPedigree ? rowIndex * (NODE_WIDTH + X_GAP) : startX;

    orderedGenMembers.forEach((member, colIndex) => {
      const xPos = isPedigree ? xBase : startX + colIndex * (NODE_WIDTH + X_GAP);
      const yPosFinal = isPedigree ? colIndex * (NODE_HEIGHT + Y_GAP) - ((orderedGenMembers.length - 1) * (NODE_HEIGHT + Y_GAP)) / 2 : yPos;

      const isHighlighted = highlightedMemberId === member.id;
      const isCollapsed = collapsedMemberIds.has(member.id);
      const hasChildren = member.childIds.length > 0;

      nodes.push({
        id: member.id,
        type: 'familyNode',
        position: { x: xPos, y: yPosFinal },
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

  // Generate Clean Edges without criss-crossing overlaps
  const processedSpouseEdges = new Set<string>();
  const processedChildEdges = new Set<string>();
  const memberMap = new Map(members.map(m => [m.id, m]));

  members.forEach(member => {
    if (hiddenMembers.has(member.id)) return;

    // 1. Spouse connection (Horizontal pink/rose dashed line)
    member.spouseIds.forEach(sId => {
      if (hiddenMembers.has(sId)) return;
      const pairKey = [member.id, sId].sort().join('-');
      if (!processedSpouseEdges.has(pairKey)) {
        processedSpouseEdges.add(pairKey);
        const spouseMember = memberMap.get(sId);
        const mDate = member.marriageDate || spouseMember?.marriageDate;
        const mYear = mDate ? mDate.split('-')[0] : '';
        const edgeLabel = mYear ? `⚭ Marriage (${mYear})` : '⚭ Marriage';

        edges.push({
          id: `spouse-${pairKey}`,
          source: member.id,
          target: sId,
          sourceHandle: 'right',
          targetHandle: 'left',
          type: 'straight',
          style: { stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '4,4' },
          animated: false,
          label: edgeLabel,
          labelStyle: { fill: '#be185d', fontSize: 10, fontWeight: 600 },
          labelBgStyle: { fill: '#fdf2f8', fillOpacity: 0.9, rx: 4, ry: 4 }
        });
      }
    });

    // 2. Streamlined Parent-Child Descent (Prevent duplicate 2x lines for married parents)
    if (!collapsedMemberIds.has(member.id)) {
      member.childIds.forEach(cId => {
        if (hiddenMembers.has(cId)) return;
        const child = memberMap.get(cId);
        if (!child) return;

        // Check if child has both parents in tree who are married to each other
        const otherParentId = child.parentIds.find(pId => pId !== member.id && member.spouseIds.includes(pId));
        
        // If married couple shares child, route from the primary parent (alphabetically first ID) to avoid dual overlapping lines
        if (otherParentId && member.id > otherParentId) {
          return; // The other spouse handles the single descent line for this child
        }

        const edgeKey = `descent-${member.id}->${cId}`;
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
