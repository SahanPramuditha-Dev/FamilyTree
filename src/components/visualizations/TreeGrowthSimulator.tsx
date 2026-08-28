import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FamilyMember } from '../../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  Users, 
  Heart, 
  Plane, 
  Sparkles, 
  ArrowRight, 
  Baby, 
  Compass,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface TreeGrowthSimulatorProps {
  members: FamilyMember[];
}

export const TreeGrowthSimulator: React.FC<TreeGrowthSimulatorProps> = ({ members }) => {
  const navigate = useNavigate();

  // Find min and max chronological years
  const { minYear, maxYear, allEventsChronological } = useMemo(() => {
    const years: number[] = [];
    const events: { year: number; type: 'birth' | 'marriage' | 'migration' | 'passing'; text: string; member: FamilyMember }[] = [];

    members.forEach(m => {
      // 1. Birth
      if (m.birthDate) {
        const bYear = parseInt(m.birthDate.split('-')[0], 10);
        if (!isNaN(bYear)) {
          years.push(bYear);
          events.push({
            year: bYear,
            type: 'birth',
            text: `${m.firstName} ${m.lastName} was born into Generation ${m.generation}${m.birthPlace ? ` in ${m.birthPlace}` : ''}.`,
            member: m
          });
        }
      }

      // 2. Marriage
      if (m.marriageDate) {
        const mYear = parseInt(m.marriageDate.split('-')[0], 10);
        if (!isNaN(mYear)) {
          years.push(mYear);
          events.push({
            year: mYear,
            type: 'marriage',
            text: `${m.firstName} established a new matrimonial household${m.marriageLocation ? ` in ${m.marriageLocation}` : ''}.`,
            member: m
          });
        }
      }

      // 3. Migrations
      if (m.migrations) {
        m.migrations.forEach(mig => {
          if (mig.year) {
            years.push(mig.year);
            events.push({
              year: mig.year,
              type: 'migration',
              text: `${m.firstName} relocated from ${mig.fromLocation.locality || mig.fromLocation.city || mig.fromLocation.formatted} to ${mig.toLocation.locality || mig.toLocation.city || mig.toLocation.formatted} (${mig.reason}).`,
              member: m
            });
          }
        });
      }

      // 4. Passing
      if (m.deathDate) {
        const dYear = parseInt(m.deathDate.split('-')[0], 10);
        if (!isNaN(dYear)) {
          years.push(dYear);
          events.push({
            year: dYear,
            type: 'passing',
            text: `${m.firstName} ${m.lastName} passed into eternal memory.`,
            member: m
          });
        }
      }
    });

    const startYear = years.length > 0 ? Math.min(...years) : 1940;
    const endYear = new Date().getFullYear();

    events.sort((a, b) => a.year - b.year);

    return {
      minYear: startYear,
      maxYear: endYear,
      allEventsChronological: events
    };
  }, [members]);

  const [currentYear, setCurrentYear] = useState<number>(minYear);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 1x, 2x, 4x
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(1200 / speed, 300);
      timerRef.current = setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= maxYear) {
            setIsPlaying(false);
            return maxYear;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, maxYear, speed]);

  // Sliced state at currentYear
  const { bornMembers, pastEvents, currentYearEvents, generationsPresent } = useMemo(() => {
    const born = members.filter(m => {
      if (!m.birthDate) return m.generation <= 2; // fallback
      const y = parseInt(m.birthDate.split('-')[0], 10);
      return !isNaN(y) && y <= currentYear;
    });

    const past = allEventsChronological.filter(e => e.year <= currentYear);
    const thisYear = allEventsChronological.filter(e => e.year === currentYear);

    const gens = Array.from(new Set(born.map(m => m.generation))).sort((a, b) => a - b);

    return {
      bornMembers: born,
      pastEvents: past,
      currentYearEvents: thisYear,
      generationsPresent: gens
    };
  }, [members, currentYear, allEventsChronological]);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      if (currentYear >= maxYear) setCurrentYear(minYear);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Interactive Time-Lapse Player Control Bar */}
      <div className="p-6 bg-gradient-to-r from-forest-900 via-forest-850 to-forest-900 text-white rounded-3xl border border-forest-800 shadow-elevated space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-700/80 text-forest-200 text-[11px] font-semibold">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>Chronological Tree Simulator</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Lineage Growth Simulator
            </h2>
            <p className="text-xs text-forest-200">
              Watch your family tree expand year-by-year from {minYear} to {maxYear}.
            </p>
          </div>

          {/* Large Year Display */}
          <div className="p-4 bg-forest-950/80 rounded-2xl border border-forest-700/60 flex items-center gap-3 self-start sm:self-auto">
            <Calendar className="w-6 h-6 text-amber-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-forest-300 block">Simulated Year</span>
              <span className="font-serif font-bold text-3xl text-white font-mono leading-none">
                {currentYear}
              </span>
            </div>
          </div>
        </div>

        {/* Scrubber Range Slider */}
        <div className="space-y-2 pt-2">
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={currentYear}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentYear(Number(e.target.value));
            }}
            className="w-full h-3 bg-forest-950/90 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[11px] font-mono text-forest-300 font-bold px-1">
            <span>{minYear}</span>
            <span>{Math.round((minYear + maxYear) / 2)}</span>
            <span>{maxYear}</span>
          </div>
        </div>

        {/* Playback Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-forest-700/60">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-forest-950 rounded-xl text-xs font-bold shadow transition flex items-center gap-2 active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Simulator' : 'Play Growth Time-Lapse'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setCurrentYear(minYear);
              }}
              className="p-2.5 text-forest-200 hover:text-white bg-forest-800/60 hover:bg-forest-800 rounded-xl transition"
              title="Reset to Earliest Year"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Multipliers */}
          <div className="flex items-center gap-1.5 bg-forest-950/60 p-1 rounded-xl border border-forest-700/60 text-xs">
            <span className="text-[10px] text-forest-300 px-2 font-bold uppercase">Speed:</span>
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded-lg font-bold font-mono transition ${
                  speed === s ? 'bg-emerald-400 text-forest-950 shadow-xs' : 'text-forest-200 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Simulation View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Living Family Canvas at Current Year (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-forest-700 dark:text-forest-400" />
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  Active Lineage in Year {currentYear}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-forest-300 rounded-full border border-forest-200 dark:border-forest-800">
                {bornMembers.length} of {members.length} relatives present
              </span>
            </div>

            {/* Render Members Grouped by Generation */}
            {generationsPresent.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-xs">
                No recorded relatives born prior to {currentYear}. Advance the slider to begin witnessing lineage expansion.
              </div>
            ) : (
              <div className="space-y-5">
                {generationsPresent.map(gen => {
                  const genMembers = bornMembers.filter(m => m.generation === gen);
                  return (
                    <div key={gen} className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-forest-300 bg-forest-50 dark:bg-forest-950 px-2.5 py-0.5 rounded-lg border border-forest-200 dark:border-forest-800">
                          Generation {gen}
                        </span>
                        <span className="text-[11px] text-stone-400 font-medium">({genMembers.length} individuals)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {genMembers.map(m => {
                          const bYear = m.birthDate ? parseInt(m.birthDate.split('-')[0], 10) : 1960;
                          const ageAtSimYear = currentYear - bYear;
                          const isDeceasedAtYear = m.deathDate && parseInt(m.deathDate.split('-')[0], 10) <= currentYear;
                          const justBornThisYear = bYear === currentYear;

                          return (
                            <div
                              key={m.id}
                              onClick={() => navigate(`/members/${m.id}`)}
                              className={`p-3 rounded-2xl border transition duration-200 cursor-pointer flex items-center gap-3 ${
                                justBornThisYear
                                  ? 'border-amber-400 ring-2 ring-amber-400/40 bg-amber-50/50 dark:bg-amber-950/30 animate-pulse'
                                  : isDeceasedAtYear
                                    ? 'border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-850/40 opacity-60'
                                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 hover:border-forest-300 shadow-2xs'
                              }`}
                            >
                              {m.avatarUrl ? (
                                <img src={m.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-900/60 text-forest-800 dark:text-forest-300 font-bold flex items-center justify-center font-serif text-sm">
                                  {m.firstName.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                                  {m.firstName} {m.lastName}
                                </h4>
                                <p className="text-[10px] text-stone-500 dark:text-stone-400">
                                  {isDeceasedAtYear ? (
                                    <span className="text-stone-400 italic">Passed in {m.deathDate?.split('-')[0]}</span>
                                  ) : justBornThisYear ? (
                                    <span className="text-amber-600 font-bold">✨ Born this year!</span>
                                  ) : (
                                    <span>Age: ~{ageAtSimYear} yrs ({m.occupation || 'Relative'})</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

        {/* Right 1 Column: Live Historical Event Feed */}
        <div className="space-y-4">
          
          {/* Current Year Milestone Spotlight */}
          <div className="p-5 bg-amber-50 dark:bg-amber-950/40 rounded-3xl border border-amber-200 dark:border-amber-900/50 space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Year {currentYear} Milestones ({currentYearEvents.length})
            </span>
            {currentYearEvents.length === 0 ? (
              <p className="text-xs text-amber-900/70 dark:text-amber-300/70 italic">
                A quiet year of peaceful family life and growth.
              </p>
            ) : (
              <div className="space-y-2">
                {currentYearEvents.map((ev, idx) => (
                  <div key={idx} className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-amber-200 dark:border-amber-800 text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {ev.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historical Chronicle Log up to currentYear */}
          <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Chronological Family Log (Up to {currentYear})
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {pastEvents.length === 0 ? (
                <p className="text-xs text-stone-400">No events recorded yet.</p>
              ) : (
                [...pastEvents].reverse().map((ev, idx) => (
                  <div key={idx} className="text-xs flex items-start gap-2.5 pb-2.5 border-b border-stone-100 dark:border-stone-800 last:border-0">
                    <span className="font-mono font-bold text-[11px] text-forest-700 dark:text-forest-400 bg-forest-50 dark:bg-forest-950 px-2 py-0.5 rounded-md border border-forest-100 dark:border-forest-900 flex-shrink-0">
                      {ev.year}
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-snug">
                      {ev.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
