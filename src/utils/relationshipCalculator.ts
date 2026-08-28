import { FamilyMember } from '../types';

export interface PathStep {
  fromMember: FamilyMember;
  toMember: FamilyMember;
  relationType: string;
}

export interface RelationshipResult {
  relationshipName: string;
  degree: number;
  description: string;
  path: FamilyMember[];
  steps: PathStep[];
}

export function findRelationship(
  personAId: string,
  personBId: string,
  members: FamilyMember[]
): RelationshipResult | null {
  if (personAId === personBId) {
    const member = members.find(m => m.id === personAId);
    if (!member) return null;
    return {
      relationshipName: 'Self',
      degree: 0,
      description: `${member.firstName} is the same person.`,
      path: [member],
      steps: []
    };
  }

  const memberMap = new Map<string, FamilyMember>();
  members.forEach(m => memberMap.set(m.id, m));

  const startMember = memberMap.get(personAId);
  const targetMember = memberMap.get(personBId);

  if (!startMember || !targetMember) return null;

  // Build adjacency graph with directional relationship tags
  interface Edge {
    targetId: string;
    label: string;
  }
  const adj = new Map<string, Edge[]>();

  members.forEach(m => {
    if (!adj.has(m.id)) adj.set(m.id, []);

    // Parents
    m.parentIds.forEach(pId => {
      const p = memberMap.get(pId);
      const label = p?.gender === 'female' ? 'Mother' : 'Father';
      adj.get(m.id)!.push({ targetId: pId, label });
    });

    // Children
    m.childIds.forEach(cId => {
      const c = memberMap.get(cId);
      const label = c?.gender === 'female' ? 'Daughter' : 'Son';
      adj.get(m.id)!.push({ targetId: cId, label });
    });

    // Spouses
    m.spouseIds.forEach(sId => {
      const s = memberMap.get(sId);
      const label = s?.gender === 'female' ? 'Wife' : 'Husband';
      adj.get(m.id)!.push({ targetId: sId, label });
    });

    // Siblings (explicit + shared parents)
    const knownSiblingIds = new Set(m.siblingIds);
    m.parentIds.forEach(pId => {
      const p = memberMap.get(pId);
      if (p) {
        p.childIds.forEach(cId => {
          if (cId !== m.id) knownSiblingIds.add(cId);
        });
      }
    });

    knownSiblingIds.forEach(sId => {
      const s = memberMap.get(sId);
      const label = s?.gender === 'female' ? 'Sister' : 'Brother';
      adj.get(m.id)!.push({ targetId: sId, label });
    });
  });

  // Breadth-First Search (BFS) to find shortest genealogical path
  const queue: { id: string; path: string[]; stepLabels: string[] }[] = [
    { id: personAId, path: [personAId], stepLabels: [] }
  ];
  const visited = new Set<string>([personAId]);

  let foundPath: string[] | null = null;
  let foundStepLabels: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.id === personBId) {
      foundPath = current.path;
      foundStepLabels = current.stepLabels;
      break;
    }

    const neighbors = adj.get(current.id) || [];
    for (const edge of neighbors) {
      if (!visited.has(edge.targetId)) {
        visited.add(edge.targetId);
        queue.push({
          id: edge.targetId,
          path: [...current.path, edge.targetId],
          stepLabels: [...current.stepLabels, edge.label]
        });
      }
    }
  }

  if (!foundPath) {
    return null;
  }

  const pathMembers = foundPath.map(id => memberMap.get(id)!).filter(Boolean);
  const steps: PathStep[] = [];
  for (let i = 0; i < pathMembers.length - 1; i++) {
    steps.push({
      fromMember: pathMembers[i],
      toMember: pathMembers[i + 1],
      relationType: foundStepLabels[i] || 'Related'
    });
  }

  // Calculate genealogical relationship terminology
  const relationshipName = determineGenealogicalTitle(pathMembers, targetMember);

  return {
    relationshipName,
    degree: pathMembers.length - 1,
    description: `${targetMember.firstName} is ${startMember.firstName}'s ${relationshipName}.`,
    path: pathMembers,
    steps
  };
}

function determineGenealogicalTitle(path: FamilyMember[], target: FamilyMember): string {
  const stepsCount = path.length - 1;
  const isFemale = target.gender === 'female';

  if (stepsCount === 1) {
    const from = path[0];
    if (from.childIds.includes(target.id)) return isFemale ? 'Daughter' : 'Son';
    if (from.parentIds.includes(target.id)) return isFemale ? 'Mother' : 'Father';
    if (from.spouseIds.includes(target.id)) return isFemale ? 'Wife' : 'Husband';
    if (from.siblingIds.includes(target.id)) return isFemale ? 'Sister' : 'Brother';
    return isFemale ? 'Partner' : 'Partner';
  }

  if (stepsCount === 2) {
    const middle = path[1];
    // Grandparent or Grandchild
    if (path[0].parentIds.includes(middle.id) && middle.parentIds.includes(target.id)) {
      return isFemale ? 'Grandmother' : 'Grandfather';
    }
    if (path[0].childIds.includes(middle.id) && middle.childIds.includes(target.id)) {
      return isFemale ? 'Granddaughter' : 'Grandson';
    }
    // Aunt / Uncle
    if (path[0].parentIds.includes(middle.id) && middle.siblingIds.includes(target.id)) {
      return isFemale ? 'Aunt' : 'Uncle';
    }
    // Niece / Nephew
    if (path[0].siblingIds.includes(middle.id) && middle.childIds.includes(target.id)) {
      return isFemale ? 'Niece' : 'Nephew';
    }
    // In-law
    if (path[0].spouseIds.includes(middle.id) && middle.siblingIds.includes(target.id)) {
      return isFemale ? 'Sister-in-Law' : 'Brother-in-Law';
    }
    if (path[0].spouseIds.includes(middle.id) && middle.parentIds.includes(target.id)) {
      return isFemale ? 'Mother-in-Law' : 'Father-in-Law';
    }
  }

  if (stepsCount === 3) {
    // Great-grandparent / Great-grandchild
    const genDiff = (target.generation || 0) - (path[0].generation || 0);
    if (genDiff === -3 || (path[0].parentIds.includes(path[1].id) && path[1].parentIds.includes(path[2].id) && path[2].parentIds.includes(target.id))) {
      return isFemale ? 'Great-Grandmother' : 'Great-Grandfather';
    }
    if (genDiff === 3) {
      return isFemale ? 'Great-Granddaughter' : 'Great-Grandson';
    }
    // First Cousin
    return 'First Cousin';
  }

  // Generation difference heuristic for deeper chains
  const genDiff = (target.generation || 0) - (path[0].generation || 0);
  if (genDiff === 0) {
    if (stepsCount >= 4) return 'Extended Cousin';
    return isFemale ? 'Relative' : 'Relative';
  } else if (genDiff === 1) {
    return isFemale ? 'Cousin Once Removed (Younger)' : 'Cousin Once Removed (Younger)';
  } else if (genDiff === -1) {
    return isFemale ? 'Cousin Once Removed (Elder)' : 'Cousin Once Removed (Elder)';
  } else if (genDiff < -2) {
    return isFemale ? 'Ancestral Relative' : 'Ancestral Relative';
  }

  return 'Extended Relative';
}
