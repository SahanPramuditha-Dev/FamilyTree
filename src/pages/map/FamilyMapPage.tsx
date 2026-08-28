import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Globe, 
  Compass, 
  ExternalLink,
  Users,
  Plane,
  TrendingUp,
  Filter,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  Play,
  Pause,
  RotateCcw,
  Navigation,
  Eye,
  Heart,
  Baby,
  User,
  GitBranch,
  Calendar
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LocationDetails, MigrationEvent, MigrationReason } from '../../types';
import { parseLegacyLocation, createLocationDetails } from '../../utils/locationResolver';
import { MIGRATION_REASONS, getMigrationMeta } from '../../utils/migrationRegistry';
import { SelectDropdown, SelectOption } from '../../components/ui/Dropdown';

// Fix default Leaflet marker icon issues in Vite/React
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [26, 42],
  iconAnchor: [13, 42],
  popupAnchor: [1, -36],
  shadowSize: [41, 41]
});

// Birthplace Marker Icon
const birthMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Controller to smoothly pan & fly to coordinates
function MapFlyToController({ target }: { target: { center: [number, number]; zoom: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target.center, target.zoom, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
}

export interface TrailItem {
  id: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  fromName: string;
  toName: string;
  memberName: string;
  memberId: string;
  memberGender?: string;
  year?: number;
  reason: MigrationReason;
  notes?: string;
  isInternational: boolean;
  type: 'personal' | 'life_journey' | 'generational';
}

export const FamilyMapPage: React.FC = () => {
  const { members, family } = useFamily();
  const navigate = useNavigate();

  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [selectedReasonFilter, setSelectedReasonFilter] = useState<string>('all');
  const [showGenerationalTrails, setShowGenerationalTrails] = useState(true);
  const [showLifeJourneyTrails, setShowLifeJourneyTrails] = useState(true);
  const [activeTab, setActiveTab] = useState<'movements' | 'clusters'>('movements');
  const [focusedTrailId, setFocusedTrailId] = useState<string | null>(null);
  const [mapTarget, setMapTarget] = useState<{ center: [number, number]; zoom: number } | null>(null);

  // Animation Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playProgress, setPlayProgress] = useState<number>(0);
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Structured Family Origin Fallback
  const familyOriginLocation: LocationDetails = useMemo(() => {
    if (family.originLocationDetails) return family.originLocationDetails;
    return parseLegacyLocation(family.originCountry || family.originRegion || 'Sri Lanka', 'Sri Lanka');
  }, [family]);

  // Helper: Find explicit current location for a member if recorded
  const getExplicitCurrentLocation = (m: typeof members[0]): LocationDetails | null => {
    if (m.currentLocationDetails) return m.currentLocationDetails;
    if (m.currentLocation && m.currentLocation.trim()) return parseLegacyLocation(m.currentLocation, familyOriginLocation.countryName);
    return null;
  };

  // Helper: Find explicit birthplace for a member if recorded
  const getExplicitBirthLocation = (m: typeof members[0]): LocationDetails | null => {
    if (m.birthPlaceDetails) return m.birthPlaceDetails;
    if (m.birthPlace && m.birthPlace.trim()) return parseLegacyLocation(m.birthPlace, familyOriginLocation.countryName);
    return null;
  };

  // Primary family anchor location from any member with explicit location
  const primaryFamilyAnchor = useMemo(() => {
    for (const m of members) {
      const explicit = getExplicitCurrentLocation(m) || getExplicitBirthLocation(m);
      if (explicit && (explicit.locality || explicit.district || explicit.city)) {
        return explicit;
      }
    }
    return familyOriginLocation;
  }, [members, familyOriginLocation]);

  // Resolve Effective Location for Member
  const getEffectiveMemberLocation = (m: typeof members[0], visited = new Set<string>()): LocationDetails => {
    if (visited.has(m.id)) return primaryFamilyAnchor;
    visited.add(m.id);

    const direct = getExplicitCurrentLocation(m);
    if (direct) return direct;

    // Inherit from parents if colocated
    if (m.parentIds && m.parentIds.length > 0) {
      for (const pid of m.parentIds) {
        const parent = members.find(p => p.id === pid);
        if (parent) {
          const pLoc = getEffectiveMemberLocation(parent, visited);
          if (pLoc) return pLoc;
        }
      }
    }

    // Inherit from spouse
    if (m.spouseIds && m.spouseIds.length > 0) {
      for (const sid of m.spouseIds) {
        const spouse = members.find(s => s.id === sid);
        if (spouse) {
          const sLoc = getExplicitCurrentLocation(spouse);
          if (sLoc) return sLoc;
        }
      }
    }

    return primaryFamilyAnchor;
  };

  // 2. Discover and Build ALL Family Movement Trails across ALL members
  const { allMovements, allActiveTrails, analytics } = useMemo(() => {
    const trails: TrailItem[] = [];
    const seenMoveKeys = new Set<string>();

    members.forEach(m => {
      const bLoc = getExplicitBirthLocation(m);
      const cLoc = getEffectiveMemberLocation(m);
      const birthYear = m.birthDate ? parseInt(m.birthDate.split('-')[0], 10) : undefined;
      const marriageYear = m.marriageDate ? parseInt(m.marriageDate.split('-')[0], 10) : undefined;

      let hasExplicitPersonalMove = false;

      // A. Explicit Migrations recorded on member
      if (m.migrations && m.migrations.length > 0) {
        m.migrations.forEach(mig => {
          const fromLat = mig.fromLocation.latitude;
          const fromLng = mig.fromLocation.longitude;
          const toLat = mig.toLocation.latitude;
          const toLng = mig.toLocation.longitude;
          const fromName = mig.fromLocation.locality || mig.fromLocation.city || mig.fromLocation.formatted;
          const toName = mig.toLocation.locality || mig.toLocation.city || mig.toLocation.formatted;

          // Validate non-zero move distance
          const diffLat = Math.abs(fromLat - toLat);
          const diffLng = Math.abs(fromLng - toLng);
          if ((diffLat > 0.005 || diffLng > 0.005) && fromName.toLowerCase().trim() !== toName.toLowerCase().trim()) {
            const key = `mig-${m.id}-${fromName}-${toName}`;
            if (!seenMoveKeys.has(key)) {
              seenMoveKeys.add(key);
              hasExplicitPersonalMove = true;
              const isIntl = mig.fromLocation.countryCode !== mig.toLocation.countryCode;
              trails.push({
                id: mig.id,
                fromCoords: [fromLat, fromLng],
                toCoords: [toLat, toLng],
                fromName,
                toName,
                memberName: `${m.firstName} ${m.lastName}`,
                memberId: m.id,
                memberGender: m.gender,
                year: mig.year || marriageYear || birthYear,
                reason: mig.reason,
                notes: mig.notes,
                isInternational: isIntl,
                type: 'personal'
              });
            }
          }
        });
      }

      // B. Life Journey Movement (Birthplace ➔ Current Residence) if no identical move already added
      if (bLoc && cLoc && !hasExplicitPersonalMove) {
        const diffLat = Math.abs(bLoc.latitude - cLoc.latitude);
        const diffLng = Math.abs(bLoc.longitude - cLoc.longitude);
        const fromName = bLoc.locality || bLoc.city || bLoc.district || bLoc.formatted;
        const toName = cLoc.locality || cLoc.city || cLoc.district || cLoc.formatted;

        if ((diffLat > 0.005 || diffLng > 0.005) && fromName.toLowerCase().trim() !== toName.toLowerCase().trim()) {
          const key = `life-${m.id}-${fromName}-${toName}`;
          if (!seenMoveKeys.has(key)) {
            seenMoveKeys.add(key);
            const isIntl = bLoc.countryCode !== cLoc.countryCode;
            const hasSpouse = m.spouseIds && m.spouseIds.length > 0;
            const moveYear = hasSpouse ? (marriageYear || birthYear) : birthYear;

            trails.push({
              id: `life-${m.id}`,
              fromCoords: [bLoc.latitude, bLoc.longitude],
              toCoords: [cLoc.latitude, cLoc.longitude],
              fromName,
              toName,
              memberName: `${m.firstName} ${m.lastName}`,
              memberId: m.id,
              memberGender: m.gender,
              year: moveYear,
              reason: hasSpouse ? 'marriage' : 'family',
              notes: `Relocated from birth home in ${fromName} to ${toName}`,
              isInternational: isIntl,
              type: 'life_journey'
            });
          }
        }
      }

      // C. Inter-generational moves (Parent's origin ➔ Child's residence)
      if (m.parentIds && m.parentIds.length > 0) {
        const mExplicit = getExplicitCurrentLocation(m) || getExplicitBirthLocation(m);
        if (mExplicit) {
          const parent = members.find(p => m.parentIds.includes(p.id));
          if (parent) {
            const pExplicit = getExplicitCurrentLocation(parent) || getExplicitBirthLocation(parent);
            if (pExplicit) {
              const diffLat = Math.abs(pExplicit.latitude - mExplicit.latitude);
              const diffLng = Math.abs(pExplicit.longitude - mExplicit.longitude);
              const fromName = pExplicit.locality || pExplicit.city || pExplicit.formatted;
              const toName = mExplicit.locality || mExplicit.city || mExplicit.formatted;

              if ((diffLat > 0.008 || diffLng > 0.008) && fromName.toLowerCase().trim() !== toName.toLowerCase().trim()) {
                const key = `gen-${parent.id}-${m.id}`;
                if (!seenMoveKeys.has(key)) {
                  seenMoveKeys.add(key);
                  const isIntl = pExplicit.countryCode !== mExplicit.countryCode;
                  trails.push({
                    id: key,
                    fromCoords: [pExplicit.latitude, pExplicit.longitude],
                    toCoords: [mExplicit.latitude, mExplicit.longitude],
                    fromName,
                    toName,
                    memberName: `${m.firstName} ${m.lastName}`,
                    memberId: m.id,
                    memberGender: m.gender,
                    year: birthYear,
                    reason: isIntl ? 'emigration' : 'family',
                    notes: `Lineage branch expansion from parent's origin (${fromName}) to (${toName})`,
                    isInternational: isIntl,
                    type: 'generational'
                  });
                }
              }
            }
          }
        }
      }
    });

    // Sort all movements chronologically
    trails.sort((a, b) => (a.year || 1970) - (b.year || 1970));

    // Filter by member, reason, and layer toggles
    const active = trails.filter(t => {
      if (selectedMemberFilter !== 'all' && t.memberId !== selectedMemberFilter) return false;
      if (t.type === 'generational' && !showGenerationalTrails) return false;
      if (t.type === 'life_journey' && !showLifeJourneyTrails) return false;
      if (selectedReasonFilter !== 'all' && t.reason !== selectedReasonFilter) return false;
      return true;
    });

    // Analytics
    const totalMoves = trails.length;
    const intlMoves = trails.filter(t => t.isInternational).length;
    const domesticMoves = totalMoves - intlMoves;

    const reasonCounts: Partial<Record<MigrationReason, number>> = {};
    trails.forEach(t => {
      reasonCounts[t.reason] = (reasonCounts[t.reason] || 0) + 1;
    });

    const destinationCounts: Record<string, number> = {};
    trails.forEach(t => {
      destinationCounts[t.toName] = (destinationCounts[t.toName] || 0) + 1;
    });
    const topDestination = Object.entries(destinationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Kotugoda';

    return {
      allMovements: trails,
      allActiveTrails: active,
      analytics: {
        totalMoves,
        intlMoves,
        domesticMoves,
        reasonCounts,
        topDestination
      }
    };
  }, [members, primaryFamilyAnchor, selectedMemberFilter, showGenerationalTrails, showLifeJourneyTrails, selectedReasonFilter]);

  // 3. Resolve Structured Settlement Clusters
  const { locationClusters, defaultCenter, defaultZoom } = useMemo(() => {
    const map = new Map<string, { 
      name: string; 
      details: LocationDetails; 
      residents: typeof members; 
      bornHere: typeof members;
      isPrimary: boolean;
    }>();

    // Filter members based on member filter
    const activeMembers = selectedMemberFilter === 'all' 
      ? members 
      : members.filter(m => m.id === selectedMemberFilter);

    activeMembers.forEach(m => {
      // 1. Current living place
      const curLoc = getEffectiveMemberLocation(m);
      const curKey = curLoc.formatted || `${curLoc.latitude.toFixed(3)},${curLoc.longitude.toFixed(3)}`;
      if (!map.has(curKey)) {
        map.set(curKey, { 
          name: curLoc.formatted, 
          details: curLoc, 
          residents: [], 
          bornHere: [],
          isPrimary: curLoc.formatted === primaryFamilyAnchor.formatted
        });
      }
      map.get(curKey)!.residents.push(m);

      // 2. Birthplace if distinct
      const bLoc = getExplicitBirthLocation(m);
      if (bLoc) {
        const bKey = bLoc.formatted || `${bLoc.latitude.toFixed(3)},${bLoc.longitude.toFixed(3)}`;
        if (!map.has(bKey)) {
          map.set(bKey, { 
            name: bLoc.formatted, 
            details: bLoc, 
            residents: [], 
            bornHere: [],
            isPrimary: false
          });
        }
        if (!map.get(bKey)!.bornHere.some(bm => bm.id === m.id)) {
          map.get(bKey)!.bornHere.push(m);
        }
      }
    });

    if (map.size === 0) {
      map.set(primaryFamilyAnchor.formatted, {
        name: primaryFamilyAnchor.formatted,
        details: primaryFamilyAnchor,
        residents: members,
        bornHere: [],
        isPrimary: true
      });
    }

    const clusters = Array.from(map.values());
    const center: [number, number] = clusters.length > 0
      ? [clusters[0].details.latitude, clusters[0].details.longitude]
      : [primaryFamilyAnchor.latitude, primaryFamilyAnchor.longitude];

    const isLocalSriLanka = center[0] > 5 && center[0] < 10 && center[1] > 79 && center[1] < 82;
    const zoom = isLocalSriLanka ? 11 : 4;

    return { locationClusters: clusters, defaultCenter: center, defaultZoom: zoom };
  }, [members, selectedMemberFilter, primaryFamilyAnchor]);

  // 4. Animation Playback Timer
  useEffect(() => {
    if (isPlaying && allActiveTrails.length > 0) {
      playTimerRef.current = setInterval(() => {
        setPlayProgress(prev => {
          const next = prev + 1;
          if (next >= allActiveTrails.length) {
            setIsPlaying(false);
            return 0;
          }
          const curr = allActiveTrails[next];
          if (curr) {
            setMapTarget({ center: curr.toCoords, zoom: 12 });
            setFocusedTrailId(curr.id);
          }
          return next;
        });
      }, 2200);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, allActiveTrails]);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      if (playProgress >= allActiveTrails.length - 1) {
        setPlayProgress(0);
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleFocusMovement = (trail: TrailItem) => {
    setFocusedTrailId(trail.id);
    setMapTarget({
      center: [(trail.fromCoords[0] + trail.toCoords[0]) / 2, (trail.fromCoords[1] + trail.toCoords[1]) / 2],
      zoom: 12
    });
  };

  const handleFocusCluster = (cluster: typeof locationClusters[0]) => {
    setMapTarget({
      center: [cluster.details.latitude, cluster.details.longitude],
      zoom: 13
    });
  };

  // Dropdown options for Member Filter
  const memberFilterOptions: SelectOption[] = useMemo(() => {
    return [
      {
        value: 'all',
        label: `All Family Members (${members.length})`,
        icon: <Users className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
      },
      ...members.map(m => ({
        value: m.id,
        label: `${m.firstName} ${m.lastName} (Gen ${m.generation})`,
        icon: <User className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
      }))
    ];
  }, [members]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Geographical Diaspora & Migration Intelligence</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
            Family Geography & Movements
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Explore ancestral origin lands, matrimonial moves, and animated life journeys across all relatives.
          </p>
        </div>

        {/* Ancestral Anchor Pill */}
        <div className="flex items-center gap-2.5 p-3.5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-soft self-start sm:self-auto">
          <Globe className="w-5 h-5 text-forest-700 dark:text-forest-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">Ancestral Anchor</span>
            <span className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100 truncate block">
              {primaryFamilyAnchor.formatted}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft space-y-1">
          <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 text-emerald-500" /> Total Movements
          </span>
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100 font-mono">
            {allActiveTrails.length} <span className="text-xs font-normal text-stone-400">active</span>
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft space-y-1">
          <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-500" /> Settlement Hubs
          </span>
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100 font-mono">
            {locationClusters.length} <span className="text-xs font-normal text-stone-400">villages</span>
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft space-y-1">
          <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Movement Ratio
          </span>
          <p className="text-xs font-bold text-stone-900 dark:text-stone-100 pt-1">
            <span className="text-emerald-600 dark:text-emerald-400">{analytics.domesticMoves} Local</span> / <span className="text-blue-600 dark:text-blue-400">{analytics.intlMoves} Overseas</span>
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft space-y-1">
          <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" /> Top Settlement Hub
          </span>
          <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate pt-1" title={analytics.topDestination}>
            {analytics.topDestination}
          </p>
        </div>
      </div>

      {/* Control Panel: Member Filter, Animation Player, and Reason Categories */}
      <div className="p-5 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-soft space-y-4">
        
        {/* Row 1: Relative Filter + Animation Player */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Member Filter Dropdown */}
          <div className="flex items-center gap-2.5 min-w-[280px]">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 whitespace-nowrap flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Filter Relative:</span>
            </span>
            <div className="flex-1">
              <SelectDropdown
                options={memberFilterOptions}
                value={selectedMemberFilter}
                onChange={setSelectedMemberFilter}
                fullWidth
              />
            </div>
          </div>

          {/* Animation Playback Bar */}
          <div className="flex items-center gap-2 p-1.5 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 self-start lg:self-auto">
            <button
              type="button"
              onClick={handleTogglePlay}
              disabled={allActiveTrails.length === 0}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause Playback' : 'Play Animated Diaspora'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setPlayProgress(0);
                setFocusedTrailId(null);
                setMapTarget({ center: defaultCenter, zoom: defaultZoom });
              }}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition"
              title="Reset Animation View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {allActiveTrails.length > 0 && (
              <span className="text-[11px] font-mono font-semibold text-stone-600 dark:text-stone-300 px-2">
                Step {playProgress + 1} of {allActiveTrails.length}
              </span>
            )}
          </div>

        </div>

        {/* Row 2: Movement Categories with React Lucide Icons */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-stone-100 dark:border-stone-800/60">
          <span className="text-stone-400 font-semibold text-xs flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>

          <button
            onClick={() => setSelectedReasonFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedReasonFilter === 'all'
                ? 'bg-forest-700 dark:bg-forest-600 text-white font-bold shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            All Types ({allMovements.length})
          </button>

          {Object.values(MIGRATION_REASONS).map(meta => {
            const count = analytics.reasonCounts[meta.reason] || 0;
            return (
              <button
                key={meta.reason}
                onClick={() => setSelectedReasonFilter(meta.reason)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  selectedReasonFilter === meta.reason
                    ? 'ring-2 ring-forest-500 bg-forest-50 dark:bg-forest-950 text-forest-900 dark:text-forest-200 font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
                <span className="text-[10px] opacity-70 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Row 3: Layer Toggles */}
        <div className="flex items-center gap-6 pt-2 border-t border-stone-100 dark:border-stone-800/60 text-xs flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showLifeJourneyTrails}
              onChange={(e) => setShowLifeJourneyTrails(e.target.checked)}
              className="rounded text-forest-600 focus:ring-forest-500"
            />
            <span className="text-stone-700 dark:text-stone-300 font-medium flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5 text-violet-500" /> Life Journey (Birthplace ➔ Residence)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showGenerationalTrails}
              onChange={(e) => setShowGenerationalTrails(e.target.checked)}
              className="rounded text-forest-600 focus:ring-forest-500"
            />
            <span className="text-stone-700 dark:text-stone-300 font-medium flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-emerald-500" /> Inter-Generational Branches
            </span>
          </label>
        </div>

      </div>

      {/* Leaflet Map Canvas with Flowing Animations */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-3 border border-stone-200 dark:border-stone-800 shadow-soft overflow-hidden">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={true}
          className="w-full h-[540px] rounded-2xl z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapFlyToController target={mapTarget} />

          {/* Render Migration Path Trails with Animated SVG Flows */}
          {allActiveTrails.map((trail, idx) => {
            const meta = getMigrationMeta(trail.reason);
            const isFocused = focusedTrailId === trail.id;
            const isCurrentlyPlaying = isPlaying && playProgress === idx;

            return (
              <Polyline
                key={trail.id}
                positions={[trail.fromCoords, trail.toCoords]}
                className="leaflet-migration-flow"
                pathOptions={{
                  color: isFocused || isCurrentlyPlaying ? '#10b981' : meta.colorHex,
                  weight: isFocused || isCurrentlyPlaying ? 5 : 3.5,
                  opacity: isFocused || isCurrentlyPlaying ? 1 : 0.85
                }}
              >
                <Tooltip sticky>
                  <div className="p-2 space-y-2 max-w-xs text-stone-900 dark:text-stone-100">
                    <div className="flex items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-700 pb-1.5">
                      <span className="font-bold text-xs flex items-center gap-1.5" style={{ color: meta.colorHex }}>
                        <span>{meta.icon}</span>
                        <span>{meta.label}</span>
                      </span>
                      {trail.year && (
                        <span className="text-[10px] font-mono font-bold bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                          {trail.year}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 pt-0.5">
                      <div className="w-7 h-7 rounded-full bg-forest-700 dark:bg-forest-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                        {trail.memberName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 block">
                          Family Member
                        </span>
                        <span className="font-serif font-bold text-sm text-stone-950 dark:text-white block truncate">
                          {trail.memberName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-stone-50 dark:bg-stone-800 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700/60">
                      <span className="text-stone-700 dark:text-stone-300 truncate max-w-[42%]">
                        {trail.fromName}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mx-1" />
                      <span className="text-stone-950 dark:text-white font-bold truncate max-w-[42%] text-right">
                        {trail.toName}
                      </span>
                    </div>

                    {trail.notes && (
                      <p className="italic text-stone-500 dark:text-stone-400 text-[10px] pt-0.5">
                        "{trail.notes}"
                      </p>
                    )}
                  </div>
                </Tooltip>
              </Polyline>
            );
          })}

          {/* Render Settlement & Birthplace Markers */}
          {locationClusters.map((cluster, idx) => {
            const isBirthplaceOnly = cluster.residents.length === 0 && cluster.bornHere.length > 0;
            return (
              <Marker
                key={idx}
                position={cluster.details ? [cluster.details.latitude, cluster.details.longitude] : defaultCenter}
                icon={isBirthplaceOnly ? birthMarkerIcon : customMarkerIcon}
              >
                <Popup>
                  <div className="p-2 space-y-2 max-w-xs">
                    <div className="flex items-center gap-1.5 border-b border-stone-100 pb-1">
                      <MapPin className="w-4 h-4 text-forest-700" />
                      <div>
                        <span className="font-serif font-bold text-xs text-stone-900 block">{cluster.name}</span>
                        {cluster.isPrimary && (
                          <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Primary Ancestral Land
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Current Residents */}
                    {cluster.residents.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-stone-400 block">Living Residents ({cluster.residents.length}):</span>
                        <div className="space-y-1 max-h-28 overflow-y-auto">
                          {cluster.residents.map(m => (
                            <div
                              key={m.id}
                              onClick={() => navigate(`/members/${m.id}`)}
                              className="flex items-center justify-between text-xs p-1 rounded-lg hover:bg-stone-100 cursor-pointer transition"
                            >
                              <span className="font-medium text-stone-800">{m.firstName} {m.lastName}</span>
                              <span className="text-[10px] text-stone-400 font-mono">Gen {m.generation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Born Here */}
                    {cluster.bornHere.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-stone-100">
                        <span className="text-[10px] font-bold uppercase text-violet-600 block">Born in this village ({cluster.bornHere.length}):</span>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {cluster.bornHere.map(m => (
                            <div
                              key={m.id}
                              onClick={() => navigate(`/members/${m.id}`)}
                              className="flex items-center justify-between text-xs p-1 rounded-lg hover:bg-violet-50 cursor-pointer transition text-violet-900"
                            >
                              <span className="font-medium">{m.firstName} {m.lastName}</span>
                              <span className="text-[10px] text-violet-400 font-mono">Gen {m.generation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Bottom Tabs: Movements Feed & Settlement Hubs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('movements')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'movements'
                ? 'bg-forest-700 dark:bg-forest-600 text-white shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 border border-stone-200 dark:border-stone-800'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Movement Timeline ({allActiveTrails.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('clusters')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'clusters'
                ? 'bg-forest-700 dark:bg-forest-600 text-white shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 border border-stone-200 dark:border-stone-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Settlement Hubs & Villages ({locationClusters.length})</span>
          </button>
        </div>

        {/* Tab 1: Chronological Movements Feed */}
        {activeTab === 'movements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-in fade-in duration-150">
            {allActiveTrails.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-400 space-y-2">
                <Compass className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
                <p className="text-xs font-semibold">No movements recorded under current filters.</p>
              </div>
            ) : (
              allActiveTrails.map((trail) => {
                const meta = getMigrationMeta(trail.reason);
                const isFocused = focusedTrailId === trail.id;

                return (
                  <div
                    key={trail.id}
                    className={`bg-white dark:bg-stone-900 rounded-3xl p-4 border transition duration-150 shadow-soft space-y-3 ${
                      isFocused
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border" style={{ color: meta.colorHex, borderColor: `${meta.colorHex}40`, backgroundColor: `${meta.colorHex}15` }}>
                        <span>{meta.icon}</span>
                        <span>{meta.label}</span>
                      </span>

                      {trail.year && (
                        <span className="text-[11px] font-mono font-bold text-stone-500 dark:text-stone-400">
                          {trail.year}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 
                        onClick={() => navigate(`/members/${trail.memberId}`)}
                        className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition"
                      >
                        {trail.memberName}
                      </h4>
                      {trail.notes && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
                          {trail.notes}
                        </p>
                      )}
                    </div>

                    {/* Route Badges */}
                    <div className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-850 rounded-2xl text-xs">
                      <span className="font-semibold text-stone-700 dark:text-stone-300 truncate max-w-[42%]">
                        {trail.fromName}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="font-bold text-stone-900 dark:text-stone-100 truncate max-w-[42%] text-right">
                        {trail.toName}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => handleFocusMovement(trail)}
                        className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Focus on Map</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/members/${trail.memberId}`)}
                        className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center gap-1 transition"
                      >
                        <span>Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Settlement Hubs & Clusters */}
        {activeTab === 'clusters' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in duration-150">
            {locationClusters.map((cluster, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-soft space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-forest-700 dark:text-forest-400 flex-shrink-0" />
                    <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate" title={cluster.name}>
                      {cluster.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-forest-50 dark:bg-forest-950/80 text-forest-800 dark:text-forest-300 px-2 py-0.5 rounded-full border border-forest-100 dark:border-forest-800/40 flex-shrink-0">
                    {cluster.residents.length} {cluster.residents.length === 1 ? 'resident' : 'residents'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                  {cluster.residents.map(m => (
                    <div
                      key={m.id}
                      onClick={() => navigate(`/members/${m.id}`)}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer transition"
                    >
                      <span className="font-medium">{m.firstName} {m.lastName}</span>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono">Gen {m.generation}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/60">
                  <button
                    type="button"
                    onClick={() => handleFocusCluster(cluster)}
                    className="w-full py-1.5 text-center text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition"
                  >
                    View on Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
