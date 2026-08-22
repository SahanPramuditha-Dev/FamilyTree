import React, { useState, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { findRelationship, RelationshipResult } from '../../utils/relationshipCalculator';
import { 
  Route, 
  Sparkles, 
  ArrowRight, 
  User, 
  Heart, 
  GitFork, 
  Layers, 
  Info, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

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

  const personA = members.find(m => m.id === personAId);
  const personB = members.find(m => m.id === personBId);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-forest-600" />
          <span>Genealogical Kinship Engine</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Relationship Finder & Path Explorer
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
          Select any two family members to calculate their shortest genealogical connection and discover their exact kinship title.
        </p>
      </div>

      {/* Selectors Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          
          {/* Person A Selector */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
              Person A (Origin Relative)
            </label>
            <select
              value={personAId}
              onChange={(e) => setPersonAId(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-900 focus:ring-forest-500 focus:border-forest-500 shadow-sm"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} (Gen {m.generation}) {m.nickname ? `— ${m.nickname}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Swap / Arrow Center */}
          <div className="flex items-center justify-center pt-2 md:pt-6">
            <button
              onClick={() => {
                const temp = personAId;
                setPersonAId(personBId);
                setPersonBId(temp);
              }}
              className="p-3 rounded-2xl bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200 shadow-sm transition hover:scale-105"
              title="Swap Relatives"
            >
              <Route className="w-5 h-5" />
            </button>
          </div>

          {/* Person B Selector */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
              Person B (Target Relative)
            </label>
            <select
              value={personBId}
              onChange={(e) => setPersonBId(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-900 focus:ring-forest-500 focus:border-forest-500 shadow-sm"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} (Gen {m.generation}) {m.nickname ? `— ${m.nickname}` : ''}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Results Card */}
      {result ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-soft space-y-8 animate-in fade-in duration-200">
          
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
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <Route className="w-5 h-5 text-forest-700" />
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
                          ? 'bg-forest-50 border-forest-300 ring-2 ring-forest-400' 
                          : isEnd 
                          ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400' 
                          : 'bg-stone-50 border-stone-200 hover:border-forest-200'
                      }`}
                    >
                      {nodeMember.avatarUrl ? (
                        <img src={nodeMember.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs">
                          {nodeMember.firstName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-serif font-bold text-xs text-stone-900 block truncate max-w-[130px]">
                          {nodeMember.firstName} {nodeMember.lastName}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          Gen {nodeMember.generation} {isStart ? '(Origin)' : isEnd ? '(Target)' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Step Linker Arrow with Relation tag */}
                    {nextStep && (
                      <div className="flex flex-col items-center px-1">
                        <span className="text-[10px] font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200 shadow-xs mb-1">
                          {nextStep.relationType}
                        </span>
                        <ArrowRight className="w-4 h-4 text-forest-500" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Genealogical Explanation Box */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 space-y-2">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-forest-700" /> Kinship Terminology Explanation
            </h4>
            <p className="leading-relaxed">
              In genealogy, cousins share common ancestors (such as grandparents or great-grandparents). The degree ("first", "second") indicates how many generations back the common ancestor is, while "removed" accounts for differences in generational level.
            </p>
          </div>

        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-400 space-y-2">
          <HelpCircle className="w-8 h-8 mx-auto text-stone-300" />
          <p className="text-xs">No kinship connection found between the selected members in the current tree graph.</p>
        </div>
      )}

    </div>
  );
};
