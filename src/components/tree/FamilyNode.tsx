import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CustomNodeData } from '../../utils/treeLayout';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  User, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FamilyNodeComponent: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  const { member, branch, isHighlighted, isCollapsed, hasChildren, onAddRelative, onToggleCollapse, onSelectMember } = data;
  const navigate = useNavigate();

  const isDeceased = !member.isLiving;
  const birthYear = member.birthDate ? member.birthDate.split('-')[0] : '?';
  const deathYear = isDeceased ? (member.deathDate ? member.deathDate.split('-')[0] : '✝') : 'Present';

  // Calculate Age if birth year is known
  const calculateAge = () => {
    if (!member.birthDate) return null;
    const bYear = parseInt(member.birthDate.split('-')[0], 10);
    if (isNaN(bYear)) return null;
    if (member.isLiving) {
      const currentYear = new Date().getFullYear();
      const age = currentYear - bYear;
      return age >= 0 ? `Age ${age}` : null;
    } else if (member.deathDate) {
      const dYear = parseInt(member.deathDate.split('-')[0], 10);
      if (!isNaN(dYear)) {
        const ageAtDeath = dYear - bYear;
        return ageAtDeath >= 0 ? `Aged ${ageAtDeath}` : null;
      }
    }
    return null;
  };
  const ageDisplay = calculateAge();

  return (
    <div className="relative group">
      {/* React Flow handles for connectors */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top"
        className="w-3 h-3 bg-forest-600 border-2 border-white dark:border-stone-900 rounded-full transition-transform hover:scale-125 shadow-xs" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom"
        className="w-3 h-3 bg-forest-600 border-2 border-white dark:border-stone-900 rounded-full transition-transform hover:scale-125 shadow-xs" 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left"
        className="w-3 h-3 bg-pink-500 border-2 border-white dark:border-stone-900 rounded-full transition-transform hover:scale-125 shadow-xs" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right"
        className="w-3 h-3 bg-pink-500 border-2 border-white dark:border-stone-900 rounded-full transition-transform hover:scale-125 shadow-xs" 
      />

      {/* Main Node Card */}
      <div 
        className={`w-64 rounded-2xl p-3.5 transition-all duration-200 cursor-pointer shadow-card bg-white dark:bg-stone-900 border ${
          isHighlighted 
            ? 'ring-4 ring-forest-500/40 border-forest-600 dark:border-forest-400 shadow-elevated scale-105' 
            : 'border-stone-200 dark:border-stone-800 hover:border-forest-400 dark:hover:border-forest-600 hover:shadow-elevated'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelectMember?.(member.id);
        }}
      >
        {/* Branch ribbon/pill if assigned */}
        {branch && (
          <div 
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 mb-2 text-white shadow-2xs"
            style={{ backgroundColor: branch.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {branch.name}
          </div>
        )}

        <div className="flex items-start gap-3">
          {/* Avatar / Photo */}
          <div className="relative flex-shrink-0">
            {member.avatarUrl ? (
              <img 
                src={member.avatarUrl} 
                alt={`${member.firstName} ${member.lastName}`}
                className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shadow-sm" 
              />
            ) : (
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                member.gender === 'female' 
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40' 
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
              }`}>
                {member.firstName.charAt(0)}
              </div>
            )}
            
            {/* Gender icon indicator */}
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center text-[9px] text-white font-bold shadow-xs ${
              member.gender === 'female' ? 'bg-pink-500' : member.gender === 'other' ? 'bg-purple-500' : 'bg-blue-500'
            }`}>
              {member.gender === 'female' ? '♀' : member.gender === 'other' ? '⚧' : '♂'}
            </span>
          </div>

          {/* Member Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm leading-snug truncate">
              {member.firstName} {member.lastName}
            </h4>
            {member.nameNative && (
              <p className="text-[10px] text-forest-700 dark:text-forest-400 font-semibold truncate">
                {member.nameNative}
              </p>
            )}
            {member.geName && (
              <p className="text-[9px] text-amber-700 dark:text-amber-400 font-medium truncate">
                {member.geName}
              </p>
            )}
            {member.maidenName && (
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate italic">
                (née {member.maidenName})
              </p>
            )}
            {member.occupation && (
              <p className="text-[11px] text-stone-600 dark:text-stone-300 truncate mt-0.5 font-medium">
                {member.occupation}
              </p>
            )}
          </div>
        </div>

        {/* Vital metadata */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
            <span>
              {birthYear} – {deathYear}
              {ageDisplay && <span className="ml-1 text-[10px] text-forest-700 dark:text-forest-400 font-semibold">({ageDisplay})</span>}
            </span>
          </div>

          {member.birthPlace && (
            <div className="flex items-center gap-1 truncate max-w-[90px] text-stone-500 dark:text-stone-400" title={member.birthPlace}>
              <MapPin className="w-3 h-3 text-stone-400 dark:text-stone-500 flex-shrink-0" />
              <span className="truncate">{member.birthPlace.split(',')[0]}</span>
            </div>
          )}
        </div>

        {/* Generation Tag & Profile Link */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded font-medium border border-stone-200/50 dark:border-stone-700/50">
            Gen {member.generation || 1}
          </span>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/members/${member.id}`);
            }}
            className="text-[10px] text-forest-700 dark:text-forest-400 hover:text-forest-800 dark:hover:text-forest-300 font-semibold flex items-center gap-0.5 hover:underline"
          >
            Profile <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Quick Add and Collapse Action Buttons */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 shadow-sm">
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse?.(member.id);
            }}
            className="p-1 bg-stone-800 dark:bg-stone-700 text-white rounded-full shadow hover:bg-stone-950 dark:hover:bg-stone-600 transition-transform active:scale-95 border border-stone-700 dark:border-stone-600"
            title={isCollapsed ? "Expand Children" : "Collapse Children"}
          >
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}

        {onAddRelative && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddRelative(member.id, 'parent');
              }}
              className="px-1.5 py-0.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] rounded-full shadow transition flex items-center gap-0.5 font-medium active:scale-95 border border-amber-500/50"
              title="Add Parent"
            >
              <Plus className="w-2.5 h-2.5" /> Parent
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddRelative(member.id, 'child');
              }}
              className="px-1.5 py-0.5 bg-forest-600 hover:bg-forest-700 text-white text-[10px] rounded-full shadow transition flex items-center gap-0.5 font-medium active:scale-95 border border-forest-500/50"
              title="Add Child"
            >
              <Plus className="w-2.5 h-2.5" /> Child
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddRelative(member.id, 'spouse');
              }}
              className="px-1.5 py-0.5 bg-pink-600 hover:bg-pink-700 text-white text-[10px] rounded-full shadow transition flex items-center gap-0.5 font-medium active:scale-95 border border-pink-500/50"
              title="Add Spouse"
            >
              <Heart className="w-2.5 h-2.5" /> Spouse
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const FamilyNode = memo(FamilyNodeComponent);
