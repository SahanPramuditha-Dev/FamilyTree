import React, { useState, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Filter, 
  Calendar, 
  Heart, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  User,
  Plane
} from 'lucide-react';
import { getMigrationMeta } from '../../utils/migrationRegistry';

export const TimelinePage: React.FC = () => {
  const { members, events, family } = useFamily();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('all');

  // Synthesize complete chronological events from members, relationships, and family events
  const timelineEvents = useMemo(() => {
    const list: {
      id: string;
      year: number;
      fullDate?: string;
      title: string;
      description: string;
      type: 'birth' | 'marriage' | 'death' | 'event' | 'career' | 'migration';
      location?: string;
      memberId?: string;
      memberName?: string;
      avatarUrl?: string;
      isEstimated?: boolean;
    }[] = [];

    if (!members || members.length === 0) return list;

    // Helper map to quickly find member by ID
    const memberMap = new Map(members.map(m => [m.id, m]));

    // Find if any member has an explicit birth year to anchor calculations
    const memberWithBirthDate = members.find(m => m.birthDate && !isNaN(parseInt(m.birthDate.split('-')[0], 10)));
    const anchorYear = memberWithBirthDate ? parseInt(memberWithBirthDate.birthDate!.split('-')[0], 10) : 1960;
    const anchorGen = memberWithBirthDate ? memberWithBirthDate.generation : 1;

    // Helper to get or estimate birth year for a member
    const getMemberBirthYear = (m: typeof members[0]): { year: number; isEstimated: boolean; displayDate: string } => {
      if (m.birthDate) {
        const y = parseInt(m.birthDate.split('-')[0], 10);
        if (!isNaN(y)) {
          return { year: y, isEstimated: false, displayDate: m.birthDate };
        }
      }
      // Estimate based on generation relative to anchor
      const estimated = Math.max(1800, anchorYear + (m.generation - anchorGen) * 25);
      return { 
        year: estimated, 
        isEstimated: true, 
        displayDate: `~${estimated} (Gen ${m.generation})` 
      };
    };

    // Track processed spouse pairs to avoid duplicate wedding events
    const processedSpousePairs = new Set<string>();

    members.forEach(m => {
      const birthInfo = getMemberBirthYear(m);

      // 1. Birth / Arrival Milestone
      const parents = (m.parentIds || [])
        .map(pid => memberMap.get(pid))
        .filter(Boolean);

      let birthDesc = `Generation ${m.generation} family member${m.birthPlace ? ` in ${m.birthPlace}` : ''}.`;
      if (parents.length > 0) {
        birthDesc = `Welcomed into Generation ${m.generation} by parents ${parents.map(p => p!.firstName).join(' & ')}${m.birthPlace ? ` in ${m.birthPlace}` : ''}.`;
      }

      list.push({
        id: `birth-${m.id}`,
        year: birthInfo.year,
        fullDate: birthInfo.displayDate,
        title: birthInfo.isEstimated 
          ? `Arrival of ${m.firstName} ${m.lastName} (Gen ${m.generation})` 
          : `${m.firstName} ${m.lastName} Born`,
        description: birthDesc,
        type: 'birth',
        location: m.birthPlace,
        memberId: m.id,
        memberName: `${m.firstName} ${m.lastName}`,
        avatarUrl: m.avatarUrl,
        isEstimated: birthInfo.isEstimated
      });

      // 2. Marriages / Spouse Unions
      (m.spouseIds || []).forEach(spouseId => {
        const pairKey = [m.id, spouseId].sort().join('_');
        if (!processedSpousePairs.has(pairKey)) {
          processedSpousePairs.add(pairKey);
          const spouse = memberMap.get(spouseId);
          if (spouse) {
            const explicitMarriageDate = m.marriageDate || spouse.marriageDate;
            const spouseBirth = getMemberBirthYear(spouse);
            const weddingYear = explicitMarriageDate 
              ? parseInt(explicitMarriageDate.split('-')[0], 10) 
              : Math.max(birthInfo.year, spouseBirth.year) + 24;
            const marriageLoc = m.marriageLocation || spouse.marriageLocation;

            list.push({
              id: `marriage-${pairKey}`,
              year: weddingYear,
              fullDate: explicitMarriageDate || `~${weddingYear}`,
              title: `Marriage Union: ${m.firstName} & ${spouse.firstName}`,
              description: explicitMarriageDate
                ? `Matrimonial wedding celebrated on ${explicitMarriageDate}${marriageLoc ? ` in ${marriageLoc}` : ''}.`
                : `Family union established between ${m.firstName} ${m.lastName} and ${spouse.firstName} ${spouse.lastName}.`,
              type: 'marriage',
              memberId: m.id,
              memberName: `${m.firstName} & ${spouse.firstName}`,
              isEstimated: !explicitMarriageDate
            });
          }
        }
      });

      // 3. Career & Education Milestones
      if (m.occupation) {
        const careerYear = birthInfo.year + 25;
        list.push({
          id: `career-${m.id}`,
          year: careerYear,
          fullDate: `~${careerYear}`,
          title: `${m.firstName} appointed as ${m.occupation}`,
          description: `${m.education ? `Educated at ${m.education}. ` : ''}Professional milestone recorded in family lineage.`,
          type: 'career',
          memberId: m.id,
          memberName: `${m.firstName} ${m.lastName}`,
          avatarUrl: m.avatarUrl,
          isEstimated: true
        });
      }

      // 4. Migrations & Geographical Relocations
      (m.migrations || []).forEach(mig => {
        const meta = getMigrationMeta(mig.reason);
        list.push({
          id: `mig-${m.id}-${mig.id}`,
          year: mig.year || birthInfo.year + 20,
          fullDate: mig.year ? `${mig.year}` : undefined,
          title: `Relocation (${meta.label}): ${mig.fromLocation.locality || mig.fromLocation.city || mig.fromLocation.countryName} ➔ ${mig.toLocation.locality || mig.toLocation.city || mig.toLocation.countryName}`,
          description: mig.notes 
            ? `${m.firstName} ${m.lastName} relocated (${meta.label}): "${mig.notes}"`
            : `${m.firstName} ${m.lastName} relocated to ${mig.toLocation.formatted} for ${meta.label.toLowerCase()}.`,
          type: 'migration',
          location: mig.toLocation.formatted,
          memberId: m.id,
          memberName: `${m.firstName} ${m.lastName}`,
          avatarUrl: m.avatarUrl,
          isEstimated: !mig.year
        });
      });

      // 5. Memorials / Deaths
      if (!m.isLiving) {
        let deathYear = birthInfo.year + 75;
        let displayDeath = `~${deathYear}`;
        let isDeathEstimated = true;

        if (m.deathDate) {
          const y = parseInt(m.deathDate.split('-')[0], 10);
          if (!isNaN(y)) {
            deathYear = y;
            displayDeath = m.deathDate;
            isDeathEstimated = false;
          }
        }

        list.push({
          id: `death-${m.id}`,
          year: deathYear,
          fullDate: displayDeath,
          title: `In Loving Memory: ${m.firstName} ${m.lastName}`,
          description: `Passed peacefully${m.deathPlace ? ` in ${m.deathPlace}` : ''}. Life and contributions preserved in memory archives.`,
          type: 'death',
          location: m.deathPlace,
          memberId: m.id,
          memberName: `${m.firstName} ${m.lastName}`,
          avatarUrl: m.avatarUrl,
          isEstimated: isDeathEstimated
        });
      }
    });

    // 6. Custom Family Events
    (events || []).forEach(e => {
      const year = parseInt(e.date.split('-')[0], 10);
      list.push({
        id: e.id,
        year: isNaN(year) ? 2026 : year,
        fullDate: e.date,
        title: e.title,
        description: e.description || '',
        type: e.eventType === 'wedding' || e.eventType === 'anniversary' ? 'marriage' : 'event',
        location: e.location
      });
    });

    // Sort chronologically ascending
    return list.sort((a, b) => a.year - b.year);
  }, [members, events]);

  const filteredTimeline = useMemo(() => {
    if (filterType === 'all') return timelineEvents;
    return timelineEvents.filter(e => e.type === filterType);
  }, [timelineEvents, filterType]);

  // Group events by Decade
  const groupedByDecade = useMemo(() => {
    const map = new Map<string, typeof filteredTimeline>();
    filteredTimeline.forEach(ev => {
      const decade = `${Math.floor(ev.year / 10) * 10}s`;
      if (!map.has(decade)) map.set(decade, []);
      map.get(decade)!.push(ev);
    });
    return map;
  }, [filteredTimeline]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-transparent dark:border-blue-800/50 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Chronological Family Chronicle</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            Family Heritage Timeline
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mt-1">
            Explore births, marriages, career achievements, and migrations across a continuous historical timeline.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-soft">
          {[
            { key: 'all', label: 'All Milestones' },
            { key: 'birth', label: 'Births' },
            { key: 'marriage', label: 'Marriages & Unions' },
            { key: 'migration', label: '✈️ Moves & Diaspora' },
            { key: 'career', label: 'Careers' },
            { key: 'death', label: 'Memorials' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterType === tab.key 
                  ? 'bg-forest-700 hover:bg-forest-800 text-white shadow-sm' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      {groupedByDecade.size === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 space-y-2">
          <Clock className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
          <p className="text-xs">No chronological events or member milestones recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-12 max-w-4xl mx-auto">
          {Array.from(groupedByDecade.entries()).map(([decade, decadeEvents]) => (
            <div key={decade} className="space-y-6">
            
            {/* Decade Marker */}
            <div className="flex items-center gap-4">
              <span className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800/80 px-4 py-1.5 rounded-2xl border border-stone-300 dark:border-stone-700 shadow-xs">
                The {decade}
              </span>
              <div className="flex-1 h-0.5 bg-stone-200 dark:bg-stone-800" />
            </div>

            {/* Events within Decade */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-forest-300 dark:border-forest-700/60 space-y-6 ml-4 sm:ml-6">
              {decadeEvents.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Dot Badge */}
                  <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-stone-950 ring-2 transition group-hover:scale-125 ${
                    item.type === 'birth' ? 'bg-forest-600 ring-forest-200 dark:ring-forest-800' :
                    item.type === 'marriage' ? 'bg-pink-500 ring-pink-200 dark:ring-pink-800' :
                    item.type === 'migration' ? 'bg-emerald-600 ring-emerald-200 dark:ring-emerald-800' :
                    item.type === 'death' ? 'bg-stone-800 dark:bg-stone-600 ring-stone-300 dark:ring-stone-700' :
                    item.type === 'career' ? 'bg-blue-600 ring-blue-200 dark:ring-blue-800' :
                    'bg-amber-500 ring-amber-200 dark:ring-amber-800'
                  }`} />

                  {/* Card Content */}
                  <div 
                    onClick={() => item.memberId && navigate(`/members/${item.memberId}`)}
                    className={`bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-soft dark:shadow-none transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      item.memberId ? 'hover:shadow-elevated hover:border-forest-300 dark:hover:border-forest-700 cursor-pointer' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {item.avatarUrl ? (
                        <img src={item.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-serif font-bold text-sm flex items-center justify-center flex-shrink-0 border border-forest-200 dark:border-forest-800/40">
                          {item.year}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-forest-700 dark:text-forest-300 bg-forest-50 dark:bg-forest-950/80 px-2 py-0.5 rounded-md border border-forest-100 dark:border-forest-800/40">
                            {item.fullDate || item.year}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            item.type === 'birth' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/40' :
                            item.type === 'marriage' ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-800 dark:text-pink-300 border border-transparent dark:border-pink-800/40' :
                            item.type === 'migration' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800/40' :
                            item.type === 'death' ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border border-transparent dark:border-stone-700/40' :
                            item.type === 'career' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-transparent dark:border-blue-800/40' :
                            'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-transparent dark:border-amber-800/40'
                          }`}>
                            {item.type === 'migration' ? '✈️ Relocation' : item.type}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                          {item.description}
                        </p>

                        {item.location && (
                          <div className="flex items-center gap-1 text-[11px] text-stone-400 dark:text-stone-500 pt-1">
                            <MapPin className="w-3 h-3 text-stone-400 dark:text-stone-500" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {item.memberId && (
                      <div className="flex items-center gap-1 text-xs text-forest-700 dark:text-forest-400 font-semibold self-end sm:self-center">
                        <span>Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
      )}

    </div>
  );
};
