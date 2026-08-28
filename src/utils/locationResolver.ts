import { LocationDetails } from '../types/geography';
import { COUNTRIES, getCountryByCode, getCountryByName } from '../data/geo/countries';
import { DIVISIONS_DATA, getRegionsByCountry } from '../data/geo/divisions';

export function createLocationDetails(params: {
  countryCode: string;
  region?: string;
  district?: string;
  city?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
}): LocationDetails {
  const country = getCountryByCode(params.countryCode) || COUNTRIES[0];
  const countryName = country.name;

  // Resolve best-fit coordinates if not directly provided
  let lat = params.latitude;
  let lng = params.longitude;

  if (lat === undefined || lng === undefined) {
    const regions = getRegionsByCountry(params.countryCode);
    let resolved = false;

    // 1. Exact match on Locality / City
    const targetLoc = (params.locality || params.city || '').toLowerCase().trim();
    if (targetLoc) {
      // Priority 1: Exact match
      for (const reg of regions) {
        if (params.region && reg.name.toLowerCase() !== params.region.toLowerCase()) continue;
        for (const dist of reg.districts) {
          if (params.district && dist.name.toLowerCase() !== params.district.toLowerCase()) continue;
          for (const loc of dist.localities) {
            if (loc.name.toLowerCase() === targetLoc) {
              lat = loc.latitude;
              lng = loc.longitude;
              resolved = true;
              break;
            }
          }
          if (resolved) break;
        }
        if (resolved) break;
      }

      // Priority 2: Substring match
      if (!resolved) {
        for (const reg of regions) {
          if (params.region && reg.name.toLowerCase() !== params.region.toLowerCase()) continue;
          for (const dist of reg.districts) {
            if (params.district && dist.name.toLowerCase() !== params.district.toLowerCase()) continue;
            for (const loc of dist.localities) {
              if (loc.name.toLowerCase().includes(targetLoc) || targetLoc.includes(loc.name.toLowerCase())) {
                lat = loc.latitude;
                lng = loc.longitude;
                resolved = true;
                break;
              }
            }
            if (resolved) break;
          }
          if (resolved) break;
        }
      }
    }

    // 2. Match District centroid fallback
    if (!resolved && params.district) {
      const targetDist = params.district.toLowerCase().trim();
      for (const reg of regions) {
        for (const dist of reg.districts) {
          if (dist.name.toLowerCase() === targetDist || dist.name.toLowerCase().includes(targetDist)) {
            if (dist.localities.length > 0) {
              lat = dist.localities[0].latitude;
              lng = dist.localities[0].longitude;
              resolved = true;
              break;
            }
          }
        }
        if (resolved) break;
      }
    }

    // 3. Match Region / Province fallback
    if (!resolved && params.region) {
      const targetReg = params.region.toLowerCase().trim();
      for (const reg of regions) {
        if (reg.name.toLowerCase() === targetReg || reg.name.toLowerCase().includes(targetReg)) {
          if (reg.districts.length > 0 && reg.districts[0].localities.length > 0) {
            lat = reg.districts[0].localities[0].latitude;
            lng = reg.districts[0].localities[0].longitude;
            resolved = true;
            break;
          }
        }
      }
    }

    // 4. Country fallback
    if (!resolved || lat === undefined || lng === undefined) {
      lat = country.latitude;
      lng = country.longitude;
    }
  }

  // Build formatted display string
  const segments = [
    params.locality,
    params.city && params.city !== params.locality ? params.city : undefined,
    params.district && params.district !== params.city && params.district !== params.locality ? params.district : undefined,
    params.region,
    countryName
  ].filter(Boolean);

  const formatted = segments.join(', ');

  return {
    countryCode: country.code,
    countryName,
    region: params.region || undefined,
    district: params.district || undefined,
    city: params.city || undefined,
    locality: params.locality || undefined,
    latitude: lat,
    longitude: lng,
    formatted
  };
}

export function parseLegacyLocation(locationStr?: string, defaultCountryName = 'Sri Lanka'): LocationDetails {
  if (!locationStr || !locationStr.trim()) {
    const defCountry = getCountryByName(defaultCountryName) || COUNTRIES[0];
    return {
      countryCode: defCountry.code,
      countryName: defCountry.name,
      latitude: defCountry.latitude,
      longitude: defCountry.longitude,
      formatted: defCountry.name
    };
  }

  const clean = locationStr.trim();
  const lower = clean.toLowerCase();

  // Check if string contains any known country
  let matchedCountry = COUNTRIES.find(c => lower.includes(c.name.toLowerCase()) || lower.includes(c.code.toLowerCase()));
  if (!matchedCountry) {
    matchedCountry = getCountryByName(defaultCountryName) || COUNTRIES[0];
  }

  const regions = getRegionsByCountry(matchedCountry.code);
  let matchedRegion: string | undefined;
  let matchedDistrict: string | undefined;
  let matchedLocality: string | undefined;
  let lat: number | undefined;
  let lng: number | undefined;

  // Split string by commas/spaces to check tokens
  const tokens = clean.split(/[,;\-\/]+/).map(t => t.trim().toLowerCase()).filter(Boolean);

  // 1. Exact match tokens with known localities
  for (const token of tokens) {
    for (const reg of regions) {
      for (const dist of reg.districts) {
        for (const loc of dist.localities) {
          if (loc.name.toLowerCase() === token) {
            matchedLocality = loc.name;
            matchedDistrict = dist.name;
            matchedRegion = reg.name;
            lat = loc.latitude;
            lng = loc.longitude;
            break;
          }
        }
        if (matchedLocality) break;
      }
      if (matchedLocality) break;
    }
    if (matchedLocality) break;
  }

  // 2. Substring match across localities if exact match not found
  if (!matchedLocality) {
    for (const reg of regions) {
      for (const dist of reg.districts) {
        for (const loc of dist.localities) {
          if (lower.includes(loc.name.toLowerCase())) {
            matchedLocality = loc.name;
            matchedDistrict = dist.name;
            matchedRegion = reg.name;
            lat = loc.latitude;
            lng = loc.longitude;
            break;
          }
        }
        if (matchedLocality) break;
      }
      if (matchedLocality) break;
    }
  }

  // 3. Match district
  if (!matchedDistrict) {
    for (const reg of regions) {
      for (const dist of reg.districts) {
        if (lower.includes(dist.name.toLowerCase())) {
          matchedDistrict = dist.name;
          matchedRegion = reg.name;
          if (dist.localities.length > 0 && lat === undefined) {
            lat = dist.localities[0].latitude;
            lng = dist.localities[0].longitude;
          }
          break;
        }
      }
      if (matchedDistrict) break;
    }
  }

  // 4. Match province/region
  if (!matchedRegion) {
    for (const reg of regions) {
      if (lower.includes(reg.name.toLowerCase())) {
        matchedRegion = reg.name;
        if (reg.districts.length > 0 && reg.districts[0].localities.length > 0 && lat === undefined) {
          lat = reg.districts[0].localities[0].latitude;
          lng = reg.districts[0].localities[0].longitude;
        }
        break;
      }
    }
  }

  // 5. Fallback
  if (lat === undefined || lng === undefined) {
    lat = matchedCountry.latitude;
    lng = matchedCountry.longitude;
  }

  return {
    countryCode: matchedCountry.code,
    countryName: matchedCountry.name,
    region: matchedRegion,
    district: matchedDistrict,
    locality: matchedLocality || (!matchedDistrict && !matchedRegion ? clean.split(',')[0].trim() : undefined),
    latitude: lat,
    longitude: lng,
    formatted: clean
  };
}
