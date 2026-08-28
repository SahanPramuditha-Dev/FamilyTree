import React, { useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { 
  BarChart3, 
  Users, 
  GitFork, 
  Split, 
  TrendingUp, 
  Award
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { members, branches, photos, documents, stories } = useFamily();

  // Metrics computation
  const totalCount = members.length;
  const livingCount = members.filter(m => m.isLiving).length;

  // Generation distribution
  const genDistribution = useMemo(() => {
    const counts = new Map<number, number>();
    members.forEach(m => {
      const g = m.generation || 1;
      counts.set(g, (counts.get(g) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => a[0] - b[0]);
  }, [members]);

  // Gender breakdown
  const genderBreakdown = useMemo(() => {
    const male = members.filter(m => m.gender === 'male').length;
    const female = members.filter(m => m.gender === 'female').length;
    const other = totalCount - male - female;
    return { male, female, other };
  }, [members, totalCount]);

  // Top Surnames
  const topSurnames = useMemo(() => {
    const map = new Map<string, number>();
    members.forEach(m => {
      const s = m.lastName.trim();
      map.set(s, (map.get(s) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [members]);

  const memberYears = members
    .map(m => m.birthDate ? parseInt(m.birthDate.split('-')[0], 10) : null)
    .filter((y): y is number => y !== null && !isNaN(y));
  const minYear = memberYears.length > 0 ? Math.min(...memberYears) : null;
  const maxYear = memberYears.length > 0 ? Math.max(...memberYears) : null;
  const genSpanText = minYear ? `${minYear} to ${maxYear || 'Present'}` : 'Generational records';
  const branchSummary = branches.length > 0 ? branches.map(b => b.name).slice(0, 2).join(', ') : 'Lineage divisions';

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-transparent dark:border-blue-800/50 text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Genealogical Analytics & Statistics</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Family Lineage Reports & Metrics
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mt-1">
          Deep demographic insights, generational distribution, surname longevity, and branch analytics across your family archives.
        </p>
      </div>

      {/* Top 4 Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Lineage</span>
            <Users className="w-5 h-5 text-forest-700 dark:text-forest-400" />
          </div>
          <span className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">{totalCount}</span>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{livingCount} Living ({Math.round((livingCount / (totalCount || 1)) * 100)}%)</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Spanning Depth</span>
            <GitFork className="w-5 h-5 text-blue-700 dark:text-blue-400" />
          </div>
          <span className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">{genDistribution.length} Generations</span>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{genSpanText}</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Branches</span>
            <Split className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
          <span className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">{branches.length} Branches</span>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 truncate">{branchSummary}</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Media & Assets</span>
            <Award className="w-5 h-5 text-purple-700 dark:text-purple-400" />
          </div>
          <span className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">{photos.length + documents.length + stories.length}</span>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Photos, Deeds & Oral Memoirs</p>
        </div>
      </div>

      {/* Generation Breakdown & Surnames Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Generational Breakdown */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-soft space-y-6">
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <GitFork className="w-5 h-5 text-forest-700 dark:text-forest-400" />
            <span>Generation Distribution</span>
          </h3>

          <div className="space-y-4">
            {genDistribution.map(([gen, count]) => {
              const pct = Math.round((count / (totalCount || 1)) * 100);
              return (
                <div key={gen} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-stone-800 dark:text-stone-200">Generation {gen}</span>
                    <span className="text-stone-500 dark:text-stone-400 font-mono">{count} members ({pct}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-forest-600 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Surnames & Demographic Distribution */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-soft space-y-6">
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-forest-700 dark:text-forest-400" />
            <span>Predominant Family Surnames</span>
          </h3>

          <div className="space-y-3">
            {topSurnames.map(([surname, count], idx) => {
              const pct = Math.round((count / (totalCount || 1)) * 100);
              return (
                <div key={idx} className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold text-xs flex items-center justify-center font-mono border border-forest-200 dark:border-forest-800">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100">{surname}</span>
                  </div>
                  <div className="text-right font-mono text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-bold text-stone-800 dark:text-stone-200">{count} individuals</span> ({pct}%)
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gender breakdown pill */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Male ({genderBreakdown.male})
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-pink-500 inline-block" /> Female ({genderBreakdown.female})
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-stone-400 inline-block" /> Other ({genderBreakdown.other})
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
