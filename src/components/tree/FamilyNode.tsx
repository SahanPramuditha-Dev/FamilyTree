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
  const { member, branch, isHighlighted, isCollapsed, hasChildren, onAddRelative, onToggleCollapse } = data;
  const navigate = useNavigate();

  const isDeceased = !member.isLiving;
  const birthYear = member.birthDate ? member.birthDate.split('-')[0] : '?';
  const deathYear = isDeceased ? (member.deathDate ? member.deathDate.split('-')[0] : '✝') : 'Present';

  return (
    <div className="relative group">
      {/* React Flow handles for connectors */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top"
        className="w-3 h-3 bg-forest-600 border-2 border-white rounded-full transition-transform hover:scale-125" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom"
        className="w-3 h-3 bg-forest-600 border-2 border-white rounded-full transition-transform hover:scale-125" 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left"
        className="w-3 h-3 bg-pink-500 border-2 border-white rounded-full transition-transform hover:scale-125" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right"
        className="w-3 h-3 bg-pink-500 border-2 border-white rounded-full transition-transform hover:scale-125" 
      />

      {/* Main Node Card */}
      <div 
        className={`w-64 rounded-2xl p-3.5 transition-all duration-200 cursor-pointer shadow-card bg-white border ${
          isHighlighted 
            ? 'ring-4 ring-forest-500/40 border-forest-600 shadow-elevated scale-105' 
            : 'border-stone-200 hover:border-forest-400 hover:shadow-elevated'
        }`}
        onClick={() => navigate(`/members/${member.id}`)}
      >
        {/* Branch ribbon/pill if assigned */}
        {branch && (
          <div 
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 mb-2 text-white"
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
                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-sm" 
              />
            ) : (
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                member.gender === 'female' 
                  ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {member.firstName.charAt(0)}
              </div>
            )}
            
            {/* Gender icon indicator */}
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold ${
              member.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
            }`}>
              {member.gender === 'female' ? '♀' : '♂'}
            </span>
          </div>

          {/* Member Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-bold text-stone-900 text-sm leading-snug truncate">
              {member.firstName} {member.lastName}
            </h4>
            {member.maidenName && (
              <p className="text-[11px] text-stone-500 truncate italic">
                (née {member.maidenName})
              </p>
            )}
            {member.occupation && (
              <p className="text-[11px] text-stone-600 truncate mt-0.5 font-medium">
                {member.occupation}
              </p>
            )}
          </div>
        </div>

        {/* Vital metadata */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{birthYear} – {deathYear}</span>
          </div>

          {member.birthPlace && (
            <div className="flex items-center gap-1 truncate max-w-[100px] text-stone-500" title={member.birthPlace}>
              <MapPin className="w-3 h-3 text-stone-400 flex-shrink-0" />
              <span className="truncate">{member.birthPlace.split(',')[0]}</span>
            </div>
          )}
        </div>

        {/* Generation Tag */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">
            Gen {member.generation || 1}
          </span>

          <span className="text-[10px] text-forest-700 font-medium flex items-center gap-0.5 group-hover:underline">
            Profile <ExternalLink className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      {/* Quick Add and Collapse Action Buttons (visible on hover / active) */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse?.(member.id);
            }}
            className="p-1 bg-stone-800 text-white rounded-full shadow hover:bg-stone-950 transition-transform active:scale-95"
            title={isCollapsed ? "Expand Children" : "Collapse Children"}
          >
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddRelative?.(member.id, 'child');
          }}
          className="px-1.5 py-0.5 bg-forest-600 text-white text-[10px] rounded-full shadow hover:bg-forest-700 transition flex items-center gap-0.5 font-medium"
          title="Add Child"
        >
          <Plus className="w-2.5 h-2.5" /> Child
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddRelative?.(member.id, 'spouse');
          }}
          className="px-1.5 py-0.5 bg-pink-600 text-white text-[10px] rounded-full shadow hover:bg-pink-700 transition flex items-center gap-0.5 font-medium"
          title="Add Spouse"
        >
          <Heart className="w-2.5 h-2.5" /> Spouse
        </button>
      </div>
    </div>
  );
};

export const FamilyNode = memo(FamilyNodeComponent);
