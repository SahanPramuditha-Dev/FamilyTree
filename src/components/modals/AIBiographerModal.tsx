import React, { useState, useMemo } from 'react';
import { FamilyMember } from '../../types';
import { generateAIBiography, BiographerTone, GeneratedBiography } from '../../services/aiBiographer';
import { 
  Sparkles, 
  X, 
  Check, 
  Copy, 
  RotateCcw, 
  BookOpen, 
  Feather, 
  Clock, 
  FileText,
  Heart,
  Save
} from 'lucide-react';

export interface AIBiographerModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember;
  allMembers: FamilyMember[];
  onSaveBio: (narrative: string) => void;
}

export const AIBiographerModal: React.FC<AIBiographerModalProps> = ({
  isOpen,
  onClose,
  member,
  allMembers,
  onSaveBio
}) => {
  const [tone, setTone] = useState<BiographerTone>('warm');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const bioResult: GeneratedBiography = useMemo(() => {
    return generateAIBiography(member, allMembers, tone);
  }, [member, allMembers, tone]);

  const [editedNarrative, setEditedNarrative] = useState<string>(bioResult.narrative);

  // Sync narrative when tone changes
  React.useEffect(() => {
    setEditedNarrative(bioResult.narrative);
  }, [bioResult]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(editedNarrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplySave = () => {
    onSaveBio(editedNarrative);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const tones: { id: BiographerTone; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      id: 'warm', 
      label: 'Warm & Nostalgic', 
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      desc: 'Heartfelt storytelling highlighting values, warmth, and family devotion.'
    },
    { 
      id: 'documentary', 
      label: 'Archival & Historic', 
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      desc: 'Fact-first, formal genealogical chronicle suitable for historical archives.'
    },
    { 
      id: 'poetic', 
      label: 'Poetic & Commemorative', 
      icon: <Feather className="w-4 h-4 text-purple-500" />,
      desc: 'Lyrical and honoring, capturing the enduring spirit across generations.'
    },
    { 
      id: 'chronological', 
      label: 'Structured Timeline', 
      icon: <Clock className="w-4 h-4 text-emerald-500" />,
      desc: 'Organized chronological bulleted narrative of life stages.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-gradient-to-r from-forest-900 via-forest-850 to-forest-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-white">AI Family Biographer</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-forest-950 text-[10px] font-bold uppercase tracking-wider">
                  GenAI Synthesis
                </span>
              </div>
              <p className="text-xs text-forest-200">
                Crafting authentic heritage biography for <strong>{member.firstName} {member.lastName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-forest-300 hover:text-white rounded-xl hover:bg-forest-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Select Narrative Tone & Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {tones.map((t) => {
                const isSelected = tone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`p-3 rounded-2xl border text-left text-xs transition flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'border-forest-600 dark:border-forest-500 ring-2 ring-forest-500/20 bg-forest-50/70 dark:bg-forest-950/40 text-stone-900 dark:text-stone-100 font-bold'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {t.icon}
                      <span className="font-semibold text-xs">{t.label}</span>
                    </div>
                    <p className="text-[10px] font-normal text-stone-500 dark:text-stone-400 line-clamp-2 leading-tight">
                      {t.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generated Narrative Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Generated Heritage Narrative
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={10}
              value={editedNarrative}
              onChange={(e) => setEditedNarrative(e.target.value)}
              className="w-full text-xs sm:text-sm leading-relaxed rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 p-4 shadow-inner focus:ring-forest-500 font-serif"
            />
          </div>

          {/* Extracted Key Milestones & Themes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-forest-50/40 dark:bg-forest-950/20 border border-forest-100 dark:border-forest-900/40 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-forest-900 dark:text-forest-200 block text-[11px] uppercase tracking-wider">
                Synthesized Life Milestones
              </span>
              <ul className="space-y-1 text-stone-600 dark:text-stone-300 text-[11px]">
                {bioResult.bulletMilestones.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-600 flex-shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-forest-900 dark:text-forest-200 block text-[11px] uppercase tracking-wider">
                Heritage Themes
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {bioResult.keyThemes.map((th, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 text-forest-800 dark:text-forest-300 text-[10px] font-semibold border border-forest-200 dark:border-forest-800">
                    {th}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-850/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-xl transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplySave}
            className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 active:scale-95"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Saved to Profile!' : 'Save & Inscribe to Biography'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
