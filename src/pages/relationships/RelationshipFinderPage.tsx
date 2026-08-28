import React, { useState, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { findRelationship, RelationshipResult } from '../../utils/relationshipCalculator';
import { 
  Route, 
  Sparkles, 
  ArrowRight, 
  Info, 
  HelpCircle,
  User
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SelectDropdown, SelectOption } from '../../components/ui/Dropdown';

export const RelationshipFinderPage: React.FC = () => {
  const { members } = useFamily();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const defaultFromId = searchParams.get('from') || members.find(m => m.nickname?.includes('You'))?.id || members[0]?.id || '';
  const defaultToId = members.find(m => m.id !== defaultFromId)?.id || '';

  const [personAId, setPersonAId] = useState<string>(defaultFromId);
  const [personBId, setPersonBId] = useState<string>(defaultToId);

  const result: RelationshipResult | null = useMemo(() => {
    if (!personAId || !personBId) return null;
    return findRelationship(personAId, personBId, members);
  }, [personAId, personBId, members]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-forest-300 border border-transparent dark:border-forest-700/50 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
          <span>Genealogical Kinship Engine</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Relationship Finder & Path Explorer
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl">
          Select any two family members to calculate their shortest genealogical connection and discover their exact kinship title.
        </p>
      </div>

      {/* Content */}
      {members.length < 2 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 space-y-3">
          <Route className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
          <h3 className="font-serif font-bold text-base text-stone-700 dark:text-stone-300">Not Enough Relatives Recorded</h3>
          <p className="text-xs max-w-md mx-auto text-stone-500 dark:text-stone-400">
            At least two family members are required to calculate genealogical relationships. Add relatives in the Interactive Tree or Members directory to begin exploring kinship paths.
          </p>
        </div>
      ) : (
        <>
          {/* Selectors Card */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-soft">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              
              {/* Person A Selector */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Person A (Origin Relative)
                </label>
                <SelectDropdown
                  options={members.map(m => ({
                    value: m.id,
                    label: `${m.firstName} ${m.lastName} (Gen ${m.generation})${m.nickname ? ` — ${m.nickname}` : ''}`,
                    badge: `Gen ${m.generation}`
                  }))}
                  value={personAId}
                  onChange={setPersonAId}
                  fullWidth
                  size="lg"
                  searchable
                  searchPlaceholder="Search person A..."
                />
              </div>

              {/* Swap / Arrow Center */}
              <div className="flex items-center justify-center pt-2 md:pt-6">
                <button
                  onClick={() => {
                    const temp = personAId;
                    setPersonAId(personBId);
                    setPersonBId(temp);
                  }}
                  className="p-3.5 rounded-2xl bg-forest-50 dark:bg-forest-950/80 hover:bg-forest-100 dark:hover:bg-forest-900 text-forest-800 dark:text-forest-300 border border-forest-200 dark:border-forest-800 shadow-sm transition hover:scale-105 active:scale-95"
                  title="Swap Relatives"
                >
                  <Route className="w-5 h-5" />
                </button>
              </div>

              {/* Person B Selector */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Person B (Target Relative)
                </label>
                <SelectDropdown
                  options={members.map(m => ({
                    value: m.id,
                    label: `${m.firstName} ${m.lastName} (Gen ${m.generation})${m.nickname ? ` — ${m.nickname}` : ''}`,
                    badge: `Gen ${m.generation}`
                  }))}
                  value={personBId}
                  onChange={setPersonBId}
                  fullWidth
                  size="lg"
                  searchable
                  searchPlaceholder="Search person B..."
                />
              </div>

            </div>
          </div>

          {/* Results Card */}
          {result ? (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-stone-800 shadow-soft space-y-8 animate-in fade-in duration-200">
          
          {/* Main Title Badge Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-forest-900 to-forest-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Kinship Result</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {result.relationshipName}
              </h2>
              <p className="text-xs text-forest-200">
                {result.description}
              </p>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-forest-950/80 border border-forest-700/80 text-center flex-shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Degree of Separation</span>
              <span className="text-xl font-mono font-bold text-emerald-400">{result.degree} {result.degree === 1 ? 'Step' : 'Steps'}</span>
            </div>
          </div>

          {/* Visual Step-by-Step Path */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Route className="w-5 h-5 text-forest-700 dark:text-forest-400" />
              <span>Step-by-Step Lineage Path</span>
            </h3>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {result.path.map((nodeMember, idx) => {
                const isStart = idx === 0;
                const isEnd = idx === result.path.length - 1;
                const nextStep = result.steps[idx];

                return (
                  <React.Fragment key={nodeMember.id}>
                    {/* Node Card */}
                    <div 
                      onClick={() => navigate(`/members/${nodeMember.id}`)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer shadow-soft hover:shadow-elevated flex items-center gap-3 ${
                        isStart 
                          ? 'bg-forest-50 dark:bg-forest-950/60 border-forest-300 dark:border-forest-700 ring-2 ring-forest-400' 
                          : isEnd 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-400' 
                          : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-forest-200 dark:hover:border-forest-700'
                      }`}
                    >
                      {nodeMember.avatarUrl ? (
                        <img src={nodeMember.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-stone-200 dark:border-stone-700" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold flex items-center justify-center text-xs border border-forest-200 dark:border-forest-800">
                          {nodeMember.firstName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100 block truncate max-w-[130px]">
                          {nodeMember.firstName} {nodeMember.lastName}
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                          Gen {nodeMember.generation} {isStart ? '(Origin)' : isEnd ? '(Target)' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Step Linker Arrow with Relation tag */}
                    {nextStep && (
                      <div className="flex flex-col items-center px-1">
                        <span className="text-[10px] font-bold text-forest-700 dark:text-forest-300 bg-forest-50 dark:bg-forest-950/80 px-2 py-0.5 rounded-full border border-forest-200 dark:border-forest-800 shadow-xs mb-1">
                          {nextStep.relationType}
                        </span>
                        <ArrowRight className="w-4 h-4 text-forest-500 dark:text-forest-400" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Genealogical Explanation Box */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-750 text-xs text-stone-600 dark:text-stone-300 space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-forest-700 dark:text-forest-400" /> Kinship Terminology Explanation
            </h4>
            <p className="leading-relaxed">
              In genealogy, cousins share common ancestors (such as grandparents or great-grandparents). The degree ("first", "second") indicates how many generations back the common ancestor is, while "removed" accounts for differences in generational level.
            </p>
          </div>

        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 space-y-2">
          <HelpCircle className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
          <p className="text-xs">No kinship connection found between the selected members in the current tree graph.</p>
        </div>
      )}
      </>
      )}

    </div>
  );
};
