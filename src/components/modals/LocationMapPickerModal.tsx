import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationDetails } from '../../types/geography';
import { COUNTRIES, getCountryByCode } from '../../data/geo/countries';
import { DIVISIONS_DATA } from '../../data/geo/divisions';
import { X, MapPin, Check, Search, Compass, Loader2, Sparkles, Navigation, LocateFixed } from 'lucide-react';
import { searchLocationsLive, reverseGeocodeLive, LocationSearchResult } from '../../services/geocoding';

const mapPickerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [28, 46],
  iconAnchor: [14, 46],
  popupAnchor: [1, -38],
  shadowSize: [41, 41]
});

interface LocationMapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: LocationDetails;
  onConfirm: (location: LocationDetails) => void;
}

// Map Click Listener component
function MapEventsHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

// Center view controller
function RecenterController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export const LocationMapPickerModal: React.FC<LocationMapPickerModalProps> = ({
  isOpen,
  onClose,
  initialLocation,
  onConfirm
}) => {
  const defaultCountry = getCountryByCode(initialLocation?.countryCode || 'LK') || COUNTRIES[0];
  
  const [lat, setLat] = useState<number>(initialLocation?.latitude || defaultCountry.latitude);
  const [lng, setLng] = useState<number>(initialLocation?.longitude || defaultCountry.longitude);
  const [locality, setLocality] = useState<string>(initialLocation?.locality || initialLocation?.city || '');
  const [district, setDistrict] = useState<string>(initialLocation?.district || '');
  const [region, setRegion] = useState<string>(initialLocation?.region || '');
  const [countryCode, setCountryCode] = useState<string>(initialLocation?.countryCode || 'LK');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(initialLocation?.locality ? 14 : 11);

  // Sync with initial location on open
  useEffect(() => {
    if (isOpen) {
      if (initialLocation) {
        setLat(initialLocation.latitude);
        setLng(initialLocation.longitude);
        setLocality(initialLocation.locality || initialLocation.city || '');
        setDistrict(initialLocation.district || '');
        setRegion(initialLocation.region || '');
        setCountryCode(initialLocation.countryCode || 'LK');
        setZoomLevel(initialLocation.locality ? 14 : 11);
      }
    }
  }, [isOpen, initialLocation]);

  // Live search debounced
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      const results = await searchLocationsLive(searchQuery, countryCode);
      if (isMounted) {
        setSearchResults(results);
        setIsSearching(false);
      }
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, countryCode]);

  // Reverse geocoding on map click
  const handleMapClick = async (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);

    // Fast local reverse lookup
    let closestDist = Infinity;
    let closestLocality = '';
    let closestDistrict = '';
    let closestRegion = '';

    const regions = DIVISIONS_DATA[countryCode] || [];
    for (const reg of regions) {
      for (const dist of reg.districts) {
        for (const loc of dist.localities) {
          const d = Math.hypot(loc.latitude - newLat, loc.longitude - newLng);
          if (d < closestDist) {
            closestDist = d;
            if (d < 0.04) closestLocality = loc.name;
            closestDistrict = dist.name;
            closestRegion = reg.name;
          }
        }
      }
    }

    if (closestDistrict) setDistrict(closestDistrict);
    if (closestRegion) setRegion(closestRegion);
    if (closestLocality) setLocality(closestLocality);

    // Also query live OpenStreetMap reverse geocode for finer village names
    const liveReverse = await reverseGeocodeLive(newLat, newLng);
    if (liveReverse) {
      if (liveReverse.locality) setLocality(liveReverse.locality);
      if (liveReverse.district && !closestDistrict) setDistrict(liveReverse.district);
      if (liveReverse.region && !closestRegion) setRegion(liveReverse.region);
    }
  };

  const handleSelectSearchResult = (res: LocationSearchResult) => {
    setLat(res.latitude);
    setLng(res.longitude);
    if (res.name) setLocality(res.name);
    if (res.district) setDistrict(res.district);
    if (res.region) setRegion(res.region);
    if (res.countryCode) setCountryCode(res.countryCode);
    setZoomLevel(15);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Browser GPS Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        setZoomLevel(15);
        handleMapClick(latitude, longitude);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleConfirm = () => {
    const cData = getCountryByCode(countryCode) || COUNTRIES[0];
    const segments = [locality, district, region, cData.name].filter(Boolean);
    const formatted = segments.join(', ');

    const result: LocationDetails = {
      countryCode: cData.code,
      countryName: cData.name,
      region: region || undefined,
      district: district || undefined,
      city: locality || undefined,
      locality: locality || undefined,
      latitude: parseFloat(lat.toFixed(5)),
      longitude: parseFloat(lng.toFixed(5)),
      formatted
    };

    onConfirm(result);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-stone-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-forest-50 dark:bg-forest-950/80 border border-forest-100 dark:border-forest-800/60 text-forest-700 dark:text-forest-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                  Interactive Map Location Picker
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <Sparkles className="w-3 h-3" /> Live GPS & OSM
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Click anywhere or drag the pin to set the exact coordinates for your family record
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Canvas & Floating Controls */}
        <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] flex flex-col bg-stone-100 dark:bg-stone-950">
          
          {/* Top Floating Bar (Search + Quick GPS) */}
          <div className="absolute top-3 left-3 right-3 sm:left-4 sm:right-4 z-[1000] flex items-center gap-2 pointer-events-none">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md pointer-events-auto">
              <div className="relative flex items-center">
                {isSearching ? (
                  <Loader2 className="w-4 h-4 text-forest-600 animate-spin absolute left-3.5" />
                ) : (
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
                )}
                <input
                  type="text"
                  placeholder="Search village, city, or district in Sri Lanka..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-stone-700 rounded-2xl text-xs font-semibold text-stone-900 dark:text-stone-100 placeholder-stone-400 shadow-xl focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Suggestions Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-1.5 left-0 right-0 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-2xl p-1.5 max-h-56 overflow-y-auto space-y-0.5 animate-in fade-in duration-150">
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-forest-50 dark:hover:bg-forest-950/70 text-stone-800 dark:text-stone-200 flex items-center justify-between transition group"
                    >
                      <div className="truncate pr-2">
                        <span className="font-bold block text-stone-900 dark:text-stone-100 group-hover:text-forest-700 dark:group-hover:text-forest-400">
                          {res.name}
                        </span>
                        <span className="text-[10px] text-stone-400 truncate block">
                          {res.district ? `${res.district}, ` : ''}{res.region || res.countryName}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex-shrink-0">
                        {res.source === 'offline_database' ? 'Local DB' : 'OSM Live'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick GPS Location Button */}
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="p-2.5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md hover:bg-forest-50 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-2xl shadow-xl text-stone-700 dark:text-stone-300 hover:text-forest-700 dark:hover:text-forest-400 transition pointer-events-auto flex items-center gap-1.5 text-xs font-bold active:scale-95"
              title="Locate my current position"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin text-forest-600" />
              ) : (
                <LocateFixed className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
              <span className="hidden sm:inline">My GPS</span>
            </button>

          </div>

          {/* Leaflet Map Canvas */}
          <div className="flex-1 w-full h-full min-h-[380px] sm:min-h-[440px]">
            <MapContainer
              center={[lat, lng]}
              zoom={zoomLevel}
              zoomControl={false}
              scrollWheelZoom={true}
              className="w-full h-full min-h-[380px] sm:min-h-[440px] z-10"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl position="bottomright" />
              <RecenterController center={[lat, lng]} zoom={zoomLevel} />
              <MapEventsHandler onLocationSelect={handleMapClick} />
              
              <Marker
                position={[lat, lng]}
                icon={mapPickerIcon}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    handleMapClick(position.lat, position.lng);
                  }
                }}
              />
            </MapContainer>
          </div>
        </div>

        {/* Selected Coordinates & Metadata Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-forest-700 dark:text-forest-400 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  value={locality}
                  placeholder="Village / Town / Landmark"
                  onChange={(e) => setLocality(e.target.value)}
                  className="font-bold text-sm text-stone-900 dark:text-stone-100 bg-stone-50 dark:bg-stone-800/90 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-1 focus:ring-2 focus:ring-forest-500 focus:outline-none min-w-[140px] max-w-xs"
                />
                
                {district && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                    {district}{region ? `, ${region}` : ''}
                  </span>
                )}
              </div>

              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono flex items-center gap-2">
                <span>Lat: <strong className="text-stone-800 dark:text-stone-200">{lat.toFixed(5)}</strong></span>
                <span>•</span>
                <span>Lng: <strong className="text-stone-800 dark:text-stone-200">{lng.toFixed(5)}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 dark:bg-forest-600 dark:hover:bg-forest-500 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-1.5 active:scale-95 flex-shrink-0"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Pin Location</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
