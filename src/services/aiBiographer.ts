import { FamilyMember } from '../types';

export type BiographerTone = 'warm' | 'documentary' | 'poetic' | 'chronological';

export interface GeneratedBiography {
  title: string;
  tagline: string;
  narrative: string;
  bulletMilestones: string[];
  keyThemes: string[];
}

export function generateAIBiography(
  member: FamilyMember,
  allMembers: FamilyMember[],
  tone: BiographerTone = 'warm'
): GeneratedBiography {
  const fullName = `${member.firstName} ${member.middleName ? member.middleName + ' ' : ''}${member.lastName}`;
  const gePrefix = member.geName ? `${member.geName} ` : '';
  const nativeName = member.nameNative ? ` (${member.nameNative})` : '';
  
  // Resolve relatives
  const parents = allMembers.filter(m => (member.parentIds || []).includes(m.id) || (m.childIds || []).includes(member.id));
  const spouses = allMembers.filter(m => (member.spouseIds || []).includes(m.id) || (m.spouseIds || []).includes(member.id));
  const children = allMembers.filter(m => (member.childIds || []).includes(m.id) || (m.parentIds || []).includes(member.id));
  const siblings = allMembers.filter(m => {
    if (m.id === member.id) return false;
    if (member.siblingIds && member.siblingIds.includes(m.id)) return true;
    if (parents.length > 0 && m.parentIds && m.parentIds.some(pid => member.parentIds.includes(pid))) return true;
    return false;
  });

  const birthYear = member.birthDate ? parseInt(member.birthDate.split('-')[0], 10) : null;
  const birthLoc = member.birthPlaceDetails?.locality || member.birthPlaceDetails?.city || member.birthPlace || 'ancestral lands';
  const currentLoc = member.currentLocationDetails?.locality || member.currentLocationDetails?.city || member.currentLocation;

  // Build Chronological Narrative Segments
  const paragraphs: string[] = [];
  const milestones: string[] = [];
  const themes: string[] = [];

  // 1. Origin & Heritage Opening
  if (tone === 'warm') {
    let p1 = `${gePrefix}${fullName}${nativeName} stands as a cherished pillar of Generation ${member.generation} in our family tapestry.`;
    if (birthYear) {
      p1 += ` Born in ${birthYear}${birthLoc ? ` in the scenic historic surroundings of ${birthLoc}` : ''}, `;
    } else if (birthLoc) {
      p1 += ` With roots deeply planted in ${birthLoc}, `;
    } else {
      p1 += ` Deeply rooted in our ancestral lineage, `;
    }

    if (parents.length > 0) {
      const parentNames = parents.map(p => `${p.firstName} ${p.lastName}`).join(' and ');
      p1 += `they were blessed into the care of ${parentNames}.`;
    } else {
      p1 += `they carried forward the honored traditions and values of our family name.`;
    }

    if (siblings.length > 0) {
      const sibNames = siblings.map(s => s.firstName).join(', ');
      p1 += ` Growing up alongside siblings ${sibNames}, their early formative years were steeped in familial warmth, mutual loyalty, and kinship.`;
    }
    paragraphs.push(p1);
    themes.push('Ancestral Heritage & Roots');
  } else if (tone === 'documentary') {
    let p1 = `Archival Record for ${gePrefix}${fullName}${nativeName}, documented within Generation ${member.generation}.`;
    if (birthYear || birthLoc) {
      p1 += ` Primary genealogical records chronicle birth in ${birthYear || 'an unconfirmed year'}${birthLoc ? ` at ${birthLoc}` : ''}.`;
    }
    if (parents.length > 0) {
      p1 += ` Parentage is verified through ${parents.map(p => `${p.firstName} ${p.lastName}`).join(' and ')}.`;
    }
    paragraphs.push(p1);
    themes.push('Archival Documentation');
  } else if (tone === 'poetic') {
    let p1 = `Like a steady banyan branch unfurling towards the morning sun, ${gePrefix}${fullName}${nativeName} represents the enduring spirit of Generation ${member.generation}.`;
    if (birthLoc) {
      p1 += ` Originating in the hallowed soil of ${birthLoc}, their life began amidst the whispers of generational wisdom and steadfast heritage.`;
    }
    paragraphs.push(p1);
    themes.push('Timeless Kinship');
  } else {
    // Chronological
    let p1 = `[Early Years] ${fullName} was born in ${birthYear || 'early lineage era'} in ${birthLoc}. Generation ${member.generation} descendant.`;
    if (parents.length > 0) p1 += ` Child of ${parents.map(p => `${p.firstName} ${p.lastName}`).join(' and ')}.`;
    paragraphs.push(p1);
  }

  if (birthYear) milestones.push(`Born in ${birthYear} (${birthLoc})`);

  // 2. Vocation, Education & Professional Footprint
  if (member.education || member.occupation) {
    let p2 = '';
    if (tone === 'warm') {
      if (member.education && member.occupation) {
        p2 = `Guided by intellect and dedication, they pursued their studies in ${member.education}, eventually establishing a distinguished career as a respected ${member.occupation}. Their vocational journey was defined by integrity, diligence, and service.`;
      } else if (member.occupation) {
        p2 = `Throughout their life, they devoted their energy as a hardworking ${member.occupation}, earning the admiration and respect of peers, neighbours, and relatives alike.`;
      } else if (member.education) {
        p2 = `Their pursuit of knowledge in ${member.education} laid a formidable foundation for a lifetime of wisdom and community leadership.`;
      }
    } else if (tone === 'documentary') {
      p2 = `Professional & Educational Registry: Recorded occupation indicates ${member.occupation || 'civil/commercial vocation'}${member.education ? ` with academic credentials in ${member.education}` : ''}.`;
    } else if (tone === 'poetic') {
      p2 = `In the realm of daily purpose, they laboured with honor as a ${member.occupation || 'steward of our community'}, weaving intellect and dedication into every endeavor.`;
    } else {
      p2 = `[Career & Studies] Vocation: ${member.occupation || 'N/A'} | Academic background: ${member.education || 'N/A'}.`;
    }
    paragraphs.push(p2);
    if (member.occupation) milestones.push(`Vocation: ${member.occupation}`);
    themes.push('Dedication & Life Vocation');
  }

  // 3. Matrimony, Union & Extended Family
  if (spouses.length > 0 || member.marriageDate) {
    let p3 = '';
    const spouse = spouses[0];
    const spouseName = spouse ? `${spouse.firstName} ${spouse.lastName}` : 'their beloved spouse';
    const mYear = member.marriageDate ? member.marriageDate.split('-')[0] : null;
    const mLoc = member.marriageLocationDetails?.locality || member.marriageLocation || currentLoc;

    if (tone === 'warm') {
      p3 = `A profound chapter of companionship began with their matrimonial union to ${spouseName}${mYear ? ` in ${mYear}` : ''}${mLoc ? ` in ${mLoc}` : ''}. Together, they nurtured a home filled with grace, hospitality, and enduring mutual devotion.`;
    } else if (tone === 'documentary') {
      p3 = `Matrimonial Record: Union registered with ${spouseName}${mYear ? ` (Year of Marriage: ${mYear})` : ''}${mLoc ? ` at ${mLoc}` : ''}.`;
    } else if (tone === 'poetic') {
      p3 = `Two streams converged into a single tranquil river when they joined hands with ${spouseName}, anchoring a new haven of love and enduring legacy.`;
    } else {
      p3 = `[Matrimony] United in marriage with ${spouseName} (${mYear || 'Recorded era'}${mLoc ? `, ${mLoc}` : ''}).`;
    }
    paragraphs.push(p3);
    if (mYear) milestones.push(`Marriage to ${spouseName} in ${mYear}`);
    themes.push('Matrimony & Domestic Sanctuary');
  }

  // 4. Geographical Relocations & Diaspora Migrations
  if (member.migrations && member.migrations.length > 0) {
    let p4 = '';
    const migSummaries = member.migrations.map(m => {
      const from = m.fromLocation.locality || m.fromLocation.city || m.fromLocation.formatted;
      const to = m.toLocation.locality || m.toLocation.city || m.toLocation.formatted;
      const yr = m.year ? ` in ${m.year}` : '';
      return `relocated from ${from} to ${to}${yr} (${m.notes || m.reason})`;
    }).join('; and later ');

    if (tone === 'warm' || tone === 'poetic') {
      p4 = `Their life journey traversed meaningful horizons, as they ${migSummaries}. Each new settlement broadened the reach of our family and planted fresh seeds for future generations.`;
    } else {
      p4 = `[Geographical Relocations] Documented movements: ${migSummaries}.`;
    }
    paragraphs.push(p4);
    milestones.push(`Geographical Journey: ${member.migrations.length} recorded relocation(s)`);
    themes.push('Geographical Diaspora & Migration');
  }

  // 5. Descendants, Next Generation & Living Legacy
  if (children.length > 0) {
    let p5 = '';
    const childNames = children.map(c => `${c.firstName} (Gen ${c.generation})`).join(', ');
    if (tone === 'warm') {
      p5 = `Their proudest living legacy flourishes through their ${children.length} ${children.length === 1 ? 'child' : 'children'}, ${childNames}. Through them, the cherished values of integrity, kindness, and family unity continue to illuminate the world.`;
    } else if (tone === 'documentary') {
      p5 = `Descendant Lineage: Parent to ${children.length} recorded offspring: ${childNames}.`;
    } else if (tone === 'poetic') {
      p5 = `The future shines brightly in the eyes of their descendants (${childNames}), carrying forward the flame of ancestry into tomorrow.`;
    } else {
      p5 = `[Descendants] Children (${children.length}): ${childNames}.`;
    }
    paragraphs.push(p5);
    milestones.push(`Lineage continuation with ${children.length} ${children.length === 1 ? 'child' : 'children'}`);
    themes.push('Descendants & Future Generations');
  }

  // 6. Conclusion & Memorial Summary
  let conclusion = '';
  if (!member.isLiving) {
    const dYear = member.deathDate ? member.deathDate.split('-')[0] : null;
    const dPlace = member.placeOfPassingDetails?.locality || member.deathPlace || 'their ancestral homeland';
    if (tone === 'warm' || tone === 'poetic') {
      conclusion = `Though they were called to eternal rest${dYear ? ` in ${dYear}` : ''}${dPlace ? ` in ${dPlace}` : ''}, their warm memory, wisdom, and loving deeds remain permanently etched in the hearts of all who follow. Their life remains a beacon for our entire family lineage.`;
    } else {
      conclusion = `[Memorial] Deceased${dYear ? ` ${dYear}` : ''}${dPlace ? ` at ${dPlace}` : ''}. Eternal memorial inscribed in family archives.`;
    }
    milestones.push(`Passed into eternal memory ${dYear ? `(${dYear})` : ''}`);
  } else {
    conclusion = `Today, as a revered member of our living family circle in ${currentLoc || birthLoc}, they continue to inspire us with their wisdom, generosity, and steadfast presence.`;
  }
  paragraphs.push(conclusion);

  const tagline = member.occupation 
    ? `Honored Generation ${member.generation} relative, ${member.occupation}, and guardian of family traditions.`
    : `Cherished Generation ${member.generation} pillar deeply rooted in ${birthLoc}.`;

  return {
    title: `Life & Heritage Chronicle: ${fullName}`,
    tagline,
    narrative: paragraphs.join('\n\n'),
    bulletMilestones: milestones,
    keyThemes: themes
  };
}
