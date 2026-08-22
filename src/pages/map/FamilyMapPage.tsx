import React, { useState, useMemo } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useNavigate } from 'react-router-dom';
import { 
  Map as MapIcon, 
  MapPin, 
  Globe, 
  Navigation, 
  Users, 
  Compass, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default Leaflet marker icon issues in Vite/React
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const FamilyMapPage: React.FC = () => {
  const { members, family } = useFamily();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'origins' | 'diaspora'>('all');

  // Known location anchors
  const locationClusters = useMemo(() => {
    const map = new Map<string, { name: string; coords: [number, number]; members: typeof members }>();

    members.forEach(m => {
      if (m.coordinates && m.currentLocation) {
        const key = m.currentLocation;
        if (!map.has(key)) {
          map.set(key, { name: key, coords: m.coordinates, members: [] });
        }
        map.get(key)!.members.push(m);
      }
    });

    return Array.from(map.values());
  }, [members]);

  // Migration diaspora links (e.g. Sri Lanka -> London, Sri Lanka -> Melbourne)
  const migrationTrails: { from: [number, number]; to: [number, number]; label: string }[] = [
    { from: [51.5074, -0.1278], to: [-37.8136, 144.9631], label: 'International Migration to Melbourne (Julian)' },
    { from: [51.5074, -0.1278], to: [37.7749, -122.4194], label: 'Diaspora Expansion to San Francisco (Alexander)' },
    { from: [42.3601, -71.0589], to: [49.2827, -123.1207], label: 'Pacific Expansion to Vancouver (Emily)' }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Geographical Diaspora & Migration Map</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
            Family Geography & Migration
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1">
            Explore ancestral origin lands, current residences, and global diaspora migration routes across generations.
          </p>
        </div>

        {/* Origin Badge */}
        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-soft flex items-center gap-3">
          <Globe className="w-6 h-6 text-forest-700" />
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Family Origin</span>
            <span className="font-serif font-bold text-sm text-stone-900">{family.originCountry} ({family.originRegion})</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl h-[520px] relative z-0">
        <MapContainer
          center={[20.0, 40.0]}
          zoom={2}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Migration Path Polylines */}
          {migrationTrails.map((path, idx) => (
            <Polyline
              key={idx}
              positions={[path.from, path.to]}
              color="#059669"
              dashArray="6,8"
              weight={2.5}
              opacity={0.8}
            />
          ))}

          {/* Location Clusters */}
          {locationClusters.map((cluster, idx) => (
            <Marker key={idx} position={cluster.coords} icon={customMarkerIcon}>
              <Popup>
                <div className="p-1 space-y-2 text-stone-900">
                  <h4 className="font-bold text-xs">{cluster.name}</h4>
                  <p className="text-[11px] text-stone-500">{cluster.members.length} Family Members connected</p>
                  <div className="space-y-1 pt-1 border-t border-stone-100 max-h-24 overflow-y-auto">
                    {cluster.members.map(m => (
                      <div key={m.id} className="text-[11px] flex items-center justify-between gap-2">
                        <span className="font-semibold">{m.firstName} {m.lastName}</span>
                        <span className="text-[10px] text-stone-400">Gen {m.generation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Location Clusters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {locationClusters.map((cluster, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-5 border border-stone-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-forest-700" />
                <h3 className="font-serif font-bold text-sm text-stone-900">{cluster.name}</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-forest-50 text-forest-800 px-2 py-0.5 rounded-full">
                {cluster.members.length}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-stone-600">
              {cluster.members.map(m => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/members/${m.id}`)}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-stone-50 cursor-pointer"
                >
                  <span className="font-medium">{m.firstName} {m.lastName}</span>
                  <span className="text-[10px] text-stone-400 font-mono">Gen {m.generation}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
