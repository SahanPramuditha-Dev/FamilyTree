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
