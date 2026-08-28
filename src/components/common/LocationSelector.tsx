import React, { useState, useEffect, useMemo } from 'react';
import { LocationDetails } from '../../types/geography';
import { COUNTRIES, getCountryByCode } from '../../data/geo/countries';
import { getRegionsByCountry } from '../../data/geo/divisions';
import { createLocationDetails, parseLegacyLocation } from '../../utils/locationResolver';
import { MapPin, ChevronDown, Edit3, Globe, Compass } from 'lucide-react';
import { SelectDropdown, SelectOption } from '../ui/Dropdown';
import { LocationMapPickerModal } from '../modals/LocationMapPickerModal';

export interface LocationSelectorProps {
  label?: string;
  value?: LocationDetails | string;
  onChange: (loc: LocationDetails) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
  defaultCountryCode?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  label,
  value,
  onChange,
  required = false,
  className = '',
  defaultCountryCode = 'LK'
}) => {
  // Normalize value to structured LocationDetails
  const initialDetails: LocationDetails = useMemo(() => {
    if (!value) {
      return createLocationDetails({ countryCode: defaultCountryCode });
    }
    if (typeof value === 'string') {
      return parseLegacyLocation(value, 'Sri Lanka');
    }
    return value;
  }, [value, defaultCountryCode]);

  const [countryCode, setCountryCode] = useState<string>(initialDetails.countryCode || defaultCountryCode);
  const [region, setRegion] = useState<string>(initialDetails.region || '');
  const [district, setDistrict] = useState<string>(initialDetails.district || '');
  const [locality, setLocality] = useState<string>(initialDetails.locality || initialDetails.city || '');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState<boolean>(false);

  // Sync internal state when external value changes
  useEffect(() => {
    if (value) {
      const details = typeof value === 'string' ? parseLegacyLocation(value, 'Sri Lanka') : value;
      setCountryCode(details.countryCode || defaultCountryCode);
      setRegion(details.region || '');
      setDistrict(details.district || '');
      setLocality(details.locality || details.city || '');
    }
  }, [value, defaultCountryCode]);

  const countryData = useMemo(() => getCountryByCode(countryCode) || COUNTRIES[0], [countryCode]);
  const adminConfig = countryData.adminConfig;

  // Divisions for selected country
  const regions = useMemo(() => getRegionsByCountry(countryCode), [countryCode]);

  // Districts for selected region
  const districts = useMemo(() => {
    if (!region) return [];
    const reg = regions.find(r => r.name.toLowerCase() === region.toLowerCase());
    return reg ? reg.districts : [];
  }, [region, regions]);

  // Localities for selected district
  const localities = useMemo(() => {
    if (!district) return [];
    const dist = districts.find(d => d.name.toLowerCase() === district.toLowerCase());
    return dist ? dist.localities : [];
  }, [district, districts]);

  // Update parent when fields change
  const emitChange = (newCountry = countryCode, newRegion = region, newDistrict = district, newLocality = locality, newLat?: number, newLng?: number) => {
    const details = createLocationDetails({
      countryCode: newCountry,
      region: newRegion || undefined,
      district: newDistrict || undefined,
      locality: newLocality || undefined,
      city: newLocality || undefined,
      latitude: newLat,
      longitude: newLng
    });
    onChange(details);
  };

  const handleCountryChange = (cCode: string) => {
    setCountryCode(cCode);
    setRegion('');
    setDistrict('');
    setLocality('');
    emitChange(cCode, '', '', '');
  };

  const handleRegionChange = (regName: string) => {
    setRegion(regName);
    setDistrict('');
    setLocality('');
    emitChange(countryCode, regName, '', '');
  };

  const handleDistrictChange = (distName: string) => {
    setDistrict(distName);
    setLocality('');
    emitChange(countryCode, region, distName, '');
  };

  const handleLocalityChange = (locName: string) => {
    setLocality(locName);
    emitChange(countryCode, region, district, locName);
  };

  // Called when user selects & confirms a pinpoint on interactive Leaflet map
  const handleMapConfirm = (pickedLocation: LocationDetails) => {
    setCountryCode(pickedLocation.countryCode);
    setRegion(pickedLocation.region || '');
    setDistrict(pickedLocation.district || '');
    setLocality(pickedLocation.locality || pickedLocation.city || '');
    onChange(pickedLocation);
  };

  const formattedDisplay = initialDetails.formatted || `${countryData.name}`;

  // Dropdown options
  const countryOptions: SelectOption[] = useMemo(() => {
    return COUNTRIES.map(c => ({
      value: c.code,
      label: `${c.name} (${c.code})`,
      icon: <Globe className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
    }));
  }, []);

  const regionOptions: SelectOption[] = useMemo(() => {
    return [
      { value: '', label: `-- All ${adminConfig.regionLabel}s --` },
      ...regions.map(r => ({ value: r.name, label: r.name }))
    ];
  }, [regions, adminConfig.regionLabel]);

  const districtOptions: SelectOption[] = useMemo(() => {
    return [
      { value: '', label: `-- All ${adminConfig.districtLabel}s --` },
      ...districts.map(d => ({ value: d.name, label: d.name }))
    ];
  }, [districts, adminConfig.districtLabel]);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400 flex-shrink-0" />
            <span>{label}</span>
            {required && <span className="text-emerald-500">*</span>}
          </span>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMapPickerOpen(true)}
              className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 transition"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Pick on Map</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] font-medium text-stone-500 dark:text-stone-400 hover:underline flex items-center gap-1 transition"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isExpanded ? 'Hide' : 'Customize'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Formatted Preview Bar & Quick Trigger */}
      <div className="flex items-center gap-2">
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 p-3 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-300/80 dark:border-stone-700 rounded-xl shadow-2xs flex items-center justify-between gap-3 cursor-pointer transition group"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 flex-shrink-0">
              <Globe className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
              <span className="font-mono font-bold tracking-wider">{countryData.code}</span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 block truncate group-hover:text-forest-700 dark:group-hover:text-forest-400 transition">
                {formattedDisplay}
              </span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500 block truncate font-mono">
                GPS: {initialDetails.latitude.toFixed(4)}, {initialDetails.longitude.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-100 dark:bg-stone-800 group-hover:bg-forest-50 dark:group-hover:bg-forest-950/60 text-stone-700 dark:text-stone-200 rounded-lg transition border border-stone-200 dark:border-stone-700 flex-shrink-0">
            <span>{isExpanded ? 'Collapse' : 'Change'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-forest-600 dark:text-forest-400' : ''}`} />
          </div>
        </div>

        {/* Dedicated Pick on Map Action Button */}
        <button
          type="button"
          onClick={() => setIsMapPickerOpen(true)}
          className="p-3 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-xl shadow-2xs flex items-center gap-1.5 text-xs font-bold transition active:scale-95 flex-shrink-0"
          title="Pick exact location on interactive map"
        >
          <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">Map</span>
        </button>
      </div>

      {/* Hierarchical Cascading Dropdowns */}
      {isExpanded && (
        <div className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Level 1: Country with custom searchable Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              Country
            </label>
            <SelectDropdown
              options={countryOptions}
              value={countryCode}
              onChange={handleCountryChange}
              fullWidth
              searchable
              searchPlaceholder="Search country..."
              icon={<Globe className="w-3.5 h-3.5" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Level 2: Region / Province / State */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5 truncate" title={adminConfig.regionLabel}>
                {adminConfig.regionLabel}
              </label>
              {regions.length > 0 ? (
                <SelectDropdown
                  options={regionOptions}
                  value={region}
                  onChange={handleRegionChange}
                  fullWidth
                  placeholder={`Select ${adminConfig.regionLabel}`}
                />
              ) : (
                <input
                  type="text"
                  value={region}
                  placeholder={`e.g. ${adminConfig.regionLabel}`}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 shadow-xs focus:ring-forest-500"
                />
              )}
            </div>

            {/* Level 3: District / County */}
            {adminConfig.districtLabel && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5 truncate" title={adminConfig.districtLabel}>
                  {adminConfig.districtLabel}
                </label>
                {districts.length > 0 ? (
                  <SelectDropdown
                    options={districtOptions}
                    value={district}
                    onChange={handleDistrictChange}
                    fullWidth
                    placeholder={`Select ${adminConfig.districtLabel}`}
                  />
                ) : (
                  <input
                    type="text"
                    value={district}
                    placeholder={`e.g. ${adminConfig.districtLabel}`}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 shadow-xs focus:ring-forest-500"
                  />
                )}
              </div>
            )}

            {/* Level 4: City / Village / Locality */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5 truncate" title={adminConfig.localityLabel || adminConfig.cityLabel}>
                {adminConfig.localityLabel || adminConfig.cityLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  list={`locality-options-${countryCode}-${region}-${district}`}
                  value={locality}
                  placeholder={`e.g. Kotugoda, Colombo...`}
                  onChange={(e) => handleLocalityChange(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 shadow-xs focus:ring-forest-500"
                />
                <datalist id={`locality-options-${countryCode}-${region}-${district}`}>
                  {localities.map(loc => (
                    <option key={loc.name} value={loc.name} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1.5 text-[11px] text-stone-500 dark:text-stone-400">
            <button
              type="button"
              onClick={() => setIsMapPickerOpen(true)}
              className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Or click here to pick exact coordinates on map</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="font-bold text-forest-700 dark:text-forest-400 hover:underline"
            >
              Done
            </button>
          </div>

        </div>
      )}

      {/* Interactive Map Picker Modal */}
      <LocationMapPickerModal
        isOpen={isMapPickerOpen}
        onClose={() => setIsMapPickerOpen(false)}
        initialLocation={initialDetails}
        onConfirm={handleMapConfirm}
      />
    </div>
  );
};
