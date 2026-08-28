import { FamilyMember, Family } from '../types';

/**
 * Exports family tree data into standard GEDCOM 5.5 text format.
 */
export function exportToGEDCOM(family: Family, members: FamilyMember[]): string {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  const timeStr = new Date().toTimeString().split(' ')[0];

  let lines: string[] = [
    '0 HEAD',
    '1 SOUR FAMILYTREE_APP',
    '2 VERS 1.0',
    '2 NAME FamilyTree Web Platform',
    '1 DEST ANY',
    `1 DATE ${dateStr}`,
    `2 TIME ${timeStr}`,
    '1 GEDC',
    '2 VERS 5.5',
    '2 FORM LINEAGE-LINKED',
    '1 CHAR UTF-8',
    `1 NOTE ${family.name} - ${family.motto || ''}`,
  ];

  // Map individuals
  members.forEach(m => {
    lines.push(`0 @I${m.id}@ INDI`);
    lines.push(`1 NAME ${m.firstName} /${m.lastName}/`);
    if (m.nickname) lines.push(`2 NICK ${m.nickname}`);
    lines.push(`1 SEX ${m.gender === 'male' ? 'M' : m.gender === 'female' ? 'F' : 'U'}`);
    
    if (m.birthDate || m.birthPlace) {
      lines.push('1 BIRT');
      if (m.birthDate) lines.push(`2 DATE ${m.birthDate}`);
      if (m.birthPlace) lines.push(`2 PLAC ${m.birthPlace}`);
    }

    if (!m.isLiving && (m.deathDate || m.deathPlace)) {
      lines.push('1 DEAT');
      if (m.deathDate) lines.push(`2 DATE ${m.deathDate}`);
      if (m.deathPlace) lines.push(`2 PLAC ${m.deathPlace}`);
    }

    if (m.occupation) {
      lines.push(`1 OCCU ${m.occupation}`);
    }

    if (m.biography) {
      lines.push(`1 NOTE ${m.biography.replace(/\n/g, ' ')}`);
    }

    // Family links
    if (m.parentIds.length > 0) {
      lines.push(`1 FAMC @F_PARENTS_${m.parentIds.sort().join('_')}@`);
    }
    if (m.spouseIds.length > 0) {
      m.spouseIds.forEach(sId => {
        const famKey = [m.id, sId].sort().join('_');
        lines.push(`1 FAMS @F_SPOUSE_${famKey}@`);
      });
    }
  });

  // Map family union records
  const processedUnions = new Set<string>();
  members.forEach(m => {
    m.spouseIds.forEach(sId => {
      const famKey = [m.id, sId].sort().join('_');
      if (!processedUnions.has(famKey)) {
        processedUnions.add(famKey);
        lines.push(`0 @F_SPOUSE_${famKey}@ FAM`);
        const partner = members.find(p => p.id === sId);
        
        if (m.gender === 'male') {
          lines.push(`1 HUSB @I${m.id}@`);
          if (partner) lines.push(`1 WIFE @I${partner.id}@`);
        } else {
          lines.push(`1 WIFE @I${m.id}@`);
          if (partner) lines.push(`1 HUSB @I${partner.id}@`);
        }

        // Shared children
        const children = members.filter(c => c.parentIds.includes(m.id) && c.parentIds.includes(sId));
        children.forEach(c => {
          lines.push(`1 CHIL @I${c.id}@`);
        });
      }
    });
  });

  lines.push('0 TRLR');
  return lines.join('\n');
}

interface ParsedIndi {
  xref: string;
  firstName: string;
  lastName: string;
  sex: 'M' | 'F' | 'U';
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  occupation?: string;
  biography?: string;
  famc: string[];
  fams: string[];
}

interface ParsedFam {
  xref: string;
  husband?: string;
  wife?: string;
  children: string[];
}

function normalizeGedcomDate(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  const isoMatch = trimmed.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  const dmyMatch = trimmed.match(/(\d{1,2})\s+\w+\s+(\d{4})/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    return `${dmyMatch[2]}-01-${day}`;
  }
  const yearMatch = trimmed.match(/\b(\d{4})\b/);
  if (yearMatch) return `${yearMatch[1]}-01-01`;
  return undefined;
}

function parseNameValue(value: string): { firstName: string; lastName: string } {
  const parts = value.split('/');
  const given = parts[0]?.trim() || 'Unknown';
  const surname = parts[1]?.trim() || 'Unknown';
  const firstName = given.split(/\s+/)[0] || 'Unknown';
  return { firstName, lastName: surname || 'Unknown' };
}

function parseGedcomRecords(content: string): { individuals: ParsedIndi[]; families: ParsedFam[]; familyName?: string } {
  const lines = content.split(/\r?\n/).filter(Boolean);
  const individuals = new Map<string, ParsedIndi>();
  const families = new Map<string, ParsedFam>();
  let familyName: string | undefined;

  let currentIndi: ParsedIndi | null = null;
  let currentFam: ParsedFam | null = null;
  let currentEvent: 'BIRT' | 'DEAT' | null = null;

  for (const line of lines) {
    const match = line.match(/^(\d+)\s+(@[^@]+@\s+)?(\S+)(?:\s+(.*))?$/);
    if (!match) continue;

    const level = Number(match[1]);
    const xref = match[2]?.trim().replace(/@/g, '') || undefined;
    const tag = match[3];
    const value = match[4]?.trim() || '';

    if (level === 0) {
      currentEvent = null;
      if (tag === 'INDI' && xref) {
        currentIndi = {
          xref,
          firstName: 'Unknown',
          lastName: 'Unknown',
          sex: 'U',
          famc: [],
          fams: [],
        };
        currentFam = null;
        individuals.set(xref, currentIndi);
        continue;
      }
      if (tag === 'FAM' && xref) {
        currentFam = { xref, children: [] };
        currentIndi = null;
        families.set(xref, currentFam);
        continue;
      }
      currentIndi = null;
      currentFam = null;
      continue;
    }

    if (level === 1 && tag === 'NOTE' && !currentIndi && !currentFam && value) {
      familyName = value.split(' - ')[0]?.trim();
    }

    if (currentIndi) {
      if (level === 1) currentEvent = null;
      if (level === 1 && tag === 'NAME') {
        const parsed = parseNameValue(value);
        currentIndi.firstName = parsed.firstName;
        currentIndi.lastName = parsed.lastName;
      } else if (level === 1 && tag === 'SEX') {
        currentIndi.sex = value === 'M' || value === 'F' ? value : 'U';
      } else if (level === 1 && tag === 'BIRT') {
        currentEvent = 'BIRT';
      } else if (level === 1 && tag === 'DEAT') {
        currentEvent = 'DEAT';
      } else if (level === 2 && tag === 'DATE' && currentEvent === 'BIRT') {
        currentIndi.birthDate = normalizeGedcomDate(value);
      } else if (level === 2 && tag === 'PLAC' && currentEvent === 'BIRT') {
        currentIndi.birthPlace = value;
      } else if (level === 2 && tag === 'DATE' && currentEvent === 'DEAT') {
        currentIndi.deathDate = normalizeGedcomDate(value);
      } else if (level === 2 && tag === 'PLAC' && currentEvent === 'DEAT') {
        currentIndi.deathPlace = value;
      } else if (level === 1 && tag === 'OCCU') {
        currentIndi.occupation = value;
      } else if (level === 1 && tag === 'NOTE') {
        currentIndi.biography = value;
      } else if (level === 1 && tag === 'FAMC') {
        currentIndi.famc.push(value.replace(/@/g, ''));
      } else if (level === 1 && tag === 'FAMS') {
        currentIndi.fams.push(value.replace(/@/g, ''));
      }
    }

    if (currentFam) {
      if (level === 1 && tag === 'HUSB') currentFam.husband = value.replace(/@/g, '');
      if (level === 1 && tag === 'WIFE') currentFam.wife = value.replace(/@/g, '');
      if (level === 1 && tag === 'CHIL') currentFam.children.push(value.replace(/@/g, ''));
    }
  }

  return {
    individuals: Array.from(individuals.values()),
    families: Array.from(families.values()),
    familyName,
  };
}

function assignGenerations(
  memberIds: string[],
  parentMap: Map<string, string[]>,
  childMap: Map<string, string[]>
): Map<string, number> {
  const generations = new Map<string, number>();
  const roots = memberIds.filter((id) => (parentMap.get(id)?.length ?? 0) === 0);
  const queue = [...roots];

  roots.forEach((id) => generations.set(id, 1));

  if (roots.length === 0 && memberIds.length > 0) {
    generations.set(memberIds[0], 1);
    queue.push(memberIds[0]);
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const gen = generations.get(current) ?? 1;
    for (const childId of childMap.get(current) ?? []) {
      if (!generations.has(childId)) {
        generations.set(childId, gen + 1);
        queue.push(childId);
      }
    }
  }

  memberIds.forEach((id) => {
    if (!generations.has(id)) generations.set(id, 2);
  });

  return generations;
}

export interface GedcomImportResult {
  members: FamilyMember[];
  familyName?: string;
  warnings: string[];
}

/**
 * Parses a GEDCOM 5.5 file and converts it into FamilyMember records.
 */
export function parseGEDCOM(content: string, familyId: string): GedcomImportResult {
  const warnings: string[] = [];
  const { individuals, families, familyName } = parseGedcomRecords(content);

  if (individuals.length === 0) {
    throw new Error('No individuals found in the GEDCOM file.');
  }

  const xrefToId = new Map<string, string>();
  individuals.forEach((indi, index) => {
    xrefToId.set(indi.xref, `ged-${Date.now()}-${index}`);
  });

  const parentMap = new Map<string, string[]>();
  const childMap = new Map<string, string[]>();
  const spouseMap = new Map<string, Set<string>>();

  const linkSpouse = (a?: string, b?: string) => {
    if (!a || !b) return;
    if (!spouseMap.has(a)) spouseMap.set(a, new Set());
    if (!spouseMap.has(b)) spouseMap.set(b, new Set());
    spouseMap.get(a)!.add(b);
    spouseMap.get(b)!.add(a);
  };

  const linkParentChild = (parentId?: string, childId?: string) => {
    if (!parentId || !childId) return;
    if (!parentMap.has(childId)) parentMap.set(childId, []);
    if (!parentMap.get(childId)!.includes(parentId)) parentMap.get(childId)!.push(parentId);
    if (!childMap.has(parentId)) childMap.set(parentId, []);
    if (!childMap.get(parentId)!.includes(childId)) childMap.get(parentId)!.push(childId);
  };

  for (const fam of families) {
    linkSpouse(fam.husband, fam.wife);
    for (const childXref of fam.children) {
      linkParentChild(fam.husband, childXref);
      linkParentChild(fam.wife, childXref);
    }
  }

  for (const indi of individuals) {
    for (const famcXref of indi.famc) {
      const fam = families.find((f) => f.xref === famcXref);
      if (!fam) {
        warnings.push(`Missing family record ${famcXref} for ${indi.firstName} ${indi.lastName}.`);
        continue;
      }
      linkParentChild(fam.husband, indi.xref);
      linkParentChild(fam.wife, indi.xref);
    }
    for (const famsXref of indi.fams) {
      const fam = families.find((f) => f.xref === famsXref);
      if (fam) linkSpouse(fam.husband, fam.wife);
    }
  }

  const memberIds = individuals.map((indi) => indi.xref);
  const generations = assignGenerations(memberIds, parentMap, childMap);
  const now = new Date().toISOString();

  const members: FamilyMember[] = individuals.map((indi) => {
    const id = xrefToId.get(indi.xref)!;
    const parentXrefs = parentMap.get(indi.xref) ?? [];
    const childXrefs = childMap.get(indi.xref) ?? [];
    const spouseXrefs = Array.from(spouseMap.get(indi.xref) ?? []);
    const siblingXrefs = parentXrefs.flatMap((parentXref) =>
      (childMap.get(parentXref) ?? []).filter((childXref) => childXref !== indi.xref)
    );

    const isLiving = !indi.deathDate;

    return {
      id,
      familyId,
      firstName: indi.firstName,
      lastName: indi.lastName,
      gender: indi.sex === 'M' ? 'male' : indi.sex === 'F' ? 'female' : 'other',
      isLiving,
      birthDate: indi.birthDate,
      birthPlace: indi.birthPlace,
      deathDate: indi.deathDate,
      deathPlace: indi.deathPlace,
      occupation: indi.occupation,
      biography: indi.biography,
      generation: generations.get(indi.xref) ?? 1,
      createdAt: now,
      updatedAt: now,
      parentIds: parentXrefs.map((xref) => xrefToId.get(xref)!).filter(Boolean),
      spouseIds: spouseXrefs.map((xref) => xrefToId.get(xref)!).filter(Boolean),
      childIds: childXrefs.map((xref) => xrefToId.get(xref)!).filter(Boolean),
      siblingIds: [...new Set(siblingXrefs)].map((xref) => xrefToId.get(xref)!).filter(Boolean),
    };
  });

  return { members, familyName, warnings };
}

export interface JsonArchiveImport {
  family?: Partial<Family>;
  members: FamilyMember[];
}

/**
 * Parses a JSON archive exported from FamilyTree.
 */
export function parseJSONArchive(content: string): JsonArchiveImport {
  const parsed = JSON.parse(content) as JsonArchiveImport;
  if (!parsed.members || !Array.isArray(parsed.members)) {
    throw new Error('Invalid JSON archive: members array is required.');
  }
  return parsed;
}

/**
 * Downloads a string payload as a text/GEDCOM file.
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
