import React, { useState, useMemo, useRef } from 'react';
import { FamilyMember } from '../../types';
import { 
  Users, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Sparkles, 
  Info,
  ChevronRight,
  User,
  Heart
} from 'lucide-react';
import { SelectDropdown, SelectOption } from '../ui/Dropdown';

export interface FanChartProps {
  members: FamilyMember[];
  onSelectMember?: (memberId: string) => void;
}

interface AncestorNode {
  member: FamilyMember | null;
  positionLabel: string;
  generation: number;
  startAngle: number; // in degrees [0, 360]
  endAngle: number;
}

export const FanChartRenderer: React.FC<FanChartProps> = ({ members, onSelectMember }) => {
  const defaultRootId = members.find(m => m.nickname?.includes('You') || m.generation >= 3)?.id || members[0]?.id || '';
  const [rootMemberId, setRootMemberId] = useState<string>(defaultRootId);
  const [maxGenerations, setMaxGenerations] = useState<number>(4);
  const [hoveredNode, setHoveredNode] = useState<AncestorNode | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  const svgRef = useRef<SVGSVGElement>(null);

  const rootMember = useMemo(() => members.find(m => m.id === rootMemberId) || members[0], [members, rootMemberId]);

  // Recursively collect pedigree ancestors up to maxGenerations
  const fanNodes = useMemo(() => {
    if (!rootMember) return [];

    const memberMap = new Map<string, FamilyMember>();
    members.forEach(m => memberMap.set(m.id, m));

    const nodes: AncestorNode[] = [];

    // Gen 0: Root member in center
    nodes.push({
      member: rootMember,
      positionLabel: 'Root Relative',
      generation: 0,
      startAngle: 0,
      endAngle: 360
    });

    // Helper to traverse parents
    const traverseParents = (
      currentMember: FamilyMember | null,
      gen: number,
      startAngle: number,
      endAngle: number,
      parentType: 'Father' | 'Mother'
    ) => {
      if (gen > maxGenerations) return;

      const span = (endAngle - startAngle) / 2;
      const fatherStart = startAngle;
      const fatherEnd = startAngle + span;
      const motherStart = fatherEnd;
      const motherEnd = endAngle;

      let father: FamilyMember | null = null;
      let mother: FamilyMember | null = null;

      if (currentMember && currentMember.parentIds) {
        const parents = currentMember.parentIds.map(pid => memberMap.get(pid)).filter((p): p is FamilyMember => !!p);
        father = parents.find(p => p.gender === 'male') || parents[0] || null;
        mother = parents.find(p => p.gender === 'female') || (parents.length > 1 ? parents[1] : null);
      }

      // Add Father Node
      nodes.push({
        member: father,
        positionLabel: gen === 1 ? 'Father' : gen === 2 ? 'Paternal Grandfather' : `Ancestor (Gen +${gen})`,
        generation: gen,
        startAngle: fatherStart,
        endAngle: fatherEnd
      });

      // Add Mother Node
      nodes.push({
        member: mother,
        positionLabel: gen === 1 ? 'Mother' : gen === 2 ? 'Paternal Grandmother' : `Ancestor (Gen +${gen})`,
        generation: gen,
        startAngle: motherStart,
        endAngle: motherEnd
      });

      // Recurse to next generation
      traverseParents(father, gen + 1, fatherStart, fatherEnd, 'Father');
      traverseParents(mother, gen + 1, motherStart, motherEnd, 'Mother');
    };

    // Begin recursion from Gen 1
    if (rootMember) {
      const parents = (rootMember.parentIds || []).map(pid => memberMap.get(pid)).filter((p): p is FamilyMember => !!p);
      const father = parents.find(p => p.gender === 'male') || parents[0] || null;
      const mother = parents.find(p => p.gender === 'female') || (parents.length > 1 ? parents[1] : null);

      // Paternal half (0 - 180 deg)
      nodes.push({
        member: father,
        positionLabel: 'Father',
        generation: 1,
        startAngle: 0,
        endAngle: 180
      });
      if (maxGenerations >= 2) {
        traverseParents(father, 2, 0, 180, 'Father');
      }

      // Maternal half (180 - 360 deg)
      nodes.push({
        member: mother,
        positionLabel: 'Mother',
        generation: 1,
        startAngle: 180,
        endAngle: 360
      });
      if (maxGenerations >= 2) {
        traverseParents(mother, 2, 180, 360, 'Mother');
      }
    }

    return nodes;
  }, [rootMember, members, maxGenerations]);

  // Dimension Constants
  const cx = 400;
  const cy = 400;
  const ringWidth = 72;
  const innerRadius = 55;

  // Arc path generator
  const createArcPath = (startAngleDeg: number, endAngleDeg: number, innerR: number, outerR: number) => {
    // If full circle
    if (endAngleDeg - startAngleDeg >= 359.9) {
      return `M ${cx - outerR} ${cy} A ${outerR} ${outerR} 0 1 0 ${cx + outerR} ${cy} A ${outerR} ${outerR} 0 1 0 ${cx - outerR} ${cy} Z`;
    }

    const startRad = ((startAngleDeg - 90) * Math.PI) / 180;
    const endRad = ((endAngleDeg - 90) * Math.PI) / 180;

    const x1 = cx + outerR * Math.cos(startRad);
    const y1 = cy + outerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(endRad);
    const y2 = cy + outerR * Math.sin(endRad);

    const x3 = cx + innerR * Math.cos(endRad);
    const y3 = cy + innerR * Math.sin(endRad);
    const x4 = cx + innerR * Math.cos(startRad);
    const y4 = cy + innerR * Math.sin(startRad);

    const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  // Color theme per generation ring
  const getRingColor = (gen: number, isPaternal: boolean, hasPerson: boolean) => {
    if (!hasPerson) return '#f5f5f4'; // empty stone-100
    if (gen === 0) return '#059669'; // Root Emerald
    if (isPaternal) {
      // Paternal Blues & Teals
      const shades = ['#0284c7', '#0369a1', '#075985', '#0c4a6e'];
      return shades[Math.min(gen - 1, shades.length - 1)];
    } else {
      // Maternal Pinks & Purples
      const shades = ['#db2777', '#be185d', '#9d174d', '#831843'];
      return shades[Math.min(gen - 1, shades.length - 1)];
    }
  };

  const handleExportSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `ancestral-fan-chart-${rootMember?.firstName || 'lineage'}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const rootMemberOptions: SelectOption[] = useMemo(() => {
    return members.map(m => ({
      value: m.id,
      label: `${m.firstName} ${m.lastName} (Gen ${m.generation})`,
      badge: `Gen ${m.generation}`
    }));
  }, [members]);

  return (
    <div className="space-y-6">
      
      {/* Control Bar */}
      <div className="p-5 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft flex flex-wrap items-center justify-between gap-4">
        
        {/* Root Selector */}
        <div className="flex items-center gap-3 min-w-[280px]">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 whitespace-nowrap flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
            <span>Root Individual:</span>
          </span>
          <div className="flex-1">
            <SelectDropdown
              options={rootMemberOptions}
              value={rootMemberId}
              onChange={setRootMemberId}
              fullWidth
              searchable
              searchPlaceholder="Search root relative..."
            />
          </div>
        </div>

        {/* Generation Depth Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Depth:</span>
          <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
            {[3, 4, 5].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setMaxGenerations(g)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  maxGenerations === g
                    ? 'bg-forest-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {g} Gens
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & Export Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.8))}
            className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.6))}
            className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleExportSvg}
            className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SVG</span>
          </button>
        </div>

      </div>

      {/* Main Canvas Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* SVG Sunburst Canvas (3 spans) */}
        <div className="lg:col-span-3 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-soft flex items-center justify-center overflow-hidden min-h-[620px] relative">
          
          <div 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
            className="w-full flex items-center justify-center"
          >
            <svg
              ref={svgRef}
              viewBox="0 0 800 800"
              className="w-full max-w-[700px] h-auto select-none"
            >
              {/* Radial generation guide circles */}
              {[1, 2, 3, 4, 5].slice(0, maxGenerations).map((g) => (
                <circle
                  key={g}
                  cx={cx}
                  cy={cy}
                  r={innerRadius + g * ringWidth}
                  fill="none"
                  stroke="#e7e5e4"
                  strokeDasharray="3 3"
                  className="dark:stroke-stone-800"
                />
              ))}

              {/* Render Fan Nodes */}
              {fanNodes.map((node, idx) => {
                const isRoot = node.generation === 0;
                const innerR = isRoot ? 0 : innerRadius + (node.generation - 1) * ringWidth;
                const outerR = isRoot ? innerRadius : innerRadius + node.generation * ringWidth;
                const isPaternal = node.startAngle < 180;
                const hasMember = !!node.member;

                const fillColor = getRingColor(node.generation, isPaternal, hasMember);
                const pathD = createArcPath(node.startAngle, node.endAngle, innerR, outerR);

                const midAngle = (node.startAngle + node.endAngle) / 2;
                const midRad = ((midAngle - 90) * Math.PI) / 180;
                const textR = (innerR + outerR) / 2;
                const textX = cx + textR * Math.cos(midRad);
                const textY = cy + textR * Math.sin(midRad);

                const isHovered = hoveredNode === node;

                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => {
                      if (node.member) {
                        setRootMemberId(node.member.id);
                        if (onSelectMember) onSelectMember(node.member.id);
                      }
                    }}
                    className={`transition-all duration-150 ${hasMember ? 'cursor-pointer' : 'opacity-40'}`}
                  >
                    {/* Sector Path */}
                    <path
                      d={pathD}
                      fill={fillColor}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className={`dark:stroke-stone-900 transition-opacity ${
                        isHovered ? 'opacity-90 stroke-amber-300 stroke-2' : 'hover:opacity-95'
                      }`}
                    />

                    {/* Sector Text Label */}
                    {hasMember && (
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#ffffff"
                        fontSize={isRoot ? 11 : node.generation >= 4 ? 8 : 9}
                        fontWeight="bold"
                        className="pointer-events-none font-sans shadow-xs"
                      >
                        {isRoot ? (
                          <>
                            <tspan x={textX} dy="-0.5em">{node.member?.firstName}</tspan>
                            <tspan x={textX} dy="1.2em">{node.member?.lastName}</tspan>
                          </>
                        ) : (
                          node.member?.firstName
                        )}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Legend Overlay */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 text-[11px] bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs p-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 font-semibold shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-600 inline-block" />
              <span className="text-stone-700 dark:text-stone-300">Paternal Line</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-pink-600 inline-block" />
              <span className="text-stone-700 dark:text-stone-300">Maternal Line</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
              <span className="text-stone-700 dark:text-stone-300">Root Relative</span>
            </div>
          </div>
        </div>

        {/* Selected / Hovered Ancestor Detail Card (1 span) */}
        <div className="space-y-4">
          
          <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Ancestral Sector Detail
              </h3>
            </div>

            {hoveredNode && hoveredNode.member ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {hoveredNode.member.avatarUrl ? (
                    <img 
                      src={hoveredNode.member.avatarUrl} 
                      alt="" 
                      className="w-12 h-12 rounded-2xl object-cover border border-stone-200 dark:border-stone-700" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-bold flex items-center justify-center font-serif text-lg">
                      {hoveredNode.member.firstName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {hoveredNode.member.firstName} {hoveredNode.member.lastName}
                    </h4>
                    <span className="text-xs text-forest-700 dark:text-forest-400 font-semibold block">
                      {hoveredNode.positionLabel}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <p><strong>Generation:</strong> Gen {hoveredNode.member.generation}</p>
                  {hoveredNode.member.birthDate && (
                    <p><strong>Born:</strong> {hoveredNode.member.birthDate} ({hoveredNode.member.birthPlace || 'Recorded locality'})</p>
                  )}
                  {hoveredNode.member.occupation && (
                    <p><strong>Occupation:</strong> {hoveredNode.member.occupation}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setRootMemberId(hoveredNode.member!.id)}
                  className="w-full py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Set as Fan Chart Center
                </button>
              </div>
            ) : (
              <div className="py-8 text-center text-stone-400 dark:text-stone-500 space-y-1">
                <Info className="w-6 h-6 mx-auto text-stone-300 dark:text-stone-600" />
                <p className="text-xs">Hover or click any ancestral sector in the wheel to view biographical details or re-center the fan chart.</p>
              </div>
            )}
          </div>

          {/* Pedigree Explanation */}
          <div className="p-5 bg-stone-50 dark:bg-stone-850 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs text-stone-600 dark:text-stone-300">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-forest-600" />
              <span>360° Sunburst Kinship Map</span>
            </h4>
            <p className="leading-relaxed">
              This fan chart illustrates your direct pedigree radiating outward in concentric rings. The left half represents your paternal lineage, while the right half represents your maternal ancestors.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
