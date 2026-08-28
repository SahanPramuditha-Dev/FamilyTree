import { DIVISIONS_DATA } from '../data/geo/divisions';
import { COUNTRIES, getCountryByCode } from '../data/geo/countries';

export interface LocationSearchResult {
  name: string;
  district?: string;
  region?: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
  formatted: string;
  source: 'offline_database' | 'openstreetmap_nominatim';
}

/**
 * Searches for places, towns, villages, Grama Niladhari divisions, and landmarks
 * across both the curated Sri Lanka / global offline database and OpenStreetMap Nominatim API.
 */
export async function searchLocationsLive(
  query: string,
  countryCode = 'LK'
): Promise<LocationSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim().toLowerCase();
  const results: LocationSearchResult[] = [];
  const seenKeys = new Set<string>();

  // 1. Fast Local Database Search
  const regions = DIVISIONS_DATA[countryCode.toUpperCase()] || [];
  const countryObj = getCountryByCode(countryCode) || COUNTRIES[0];

  for (const reg of regions) {
    for (const dist of reg.districts) {
      for (const loc of dist.localities) {
        if (loc.name.toLowerCase().includes(q)) {
          const key = `${loc.name.toLowerCase()}_${dist.name.toLowerCase()}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            results.push({
              name: loc.name,
              district: dist.name,
              region: reg.name,
              countryCode: countryObj.code,
              countryName: countryObj.name,
              latitude: loc.latitude,
              longitude: loc.longitude,
              formatted: `${loc.name}, ${dist.name}, ${reg.name}, ${countryObj.name}`,
              source: 'offline_database'
            });
          }
        }
      }
    }
  }

  // 2. Query OpenStreetMap Nominatim for exact villages, streets, GN divisions, or unlisted places
  try {
    const countryParam = countryCode ? `&countrycodes=${countryCode.toLowerCase()}` : '';
    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}${countryParam}&addressdetails=1&limit=6`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        data.forEach(item => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          const addr = item.address || {};
          const placeName =
            addr.village ||
            addr.suburb ||
            addr.town ||
            addr.city ||
            addr.hamlet ||
            addr.neighbourhood ||
            item.name ||
            item.display_name.split(',')[0];

          const districtName = addr.county || addr.state_district || addr.district;
          const stateName = addr.state || addr.province;
          const key = `${placeName.toLowerCase()}_${lat.toFixed(3)}_${lon.toFixed(3)}`;

          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            results.push({
              name: placeName,
              district: districtName,
              region: stateName,
              countryCode: (addr.country_code || countryCode).toUpperCase(),
              countryName: addr.country || countryObj.name,
              latitude: lat,
              longitude: lon,
              formatted: item.display_name,
              source: 'openstreetmap_nominatim'
            });
          }
        });
      }
    }
  } catch (err) {
    // Graceful fallback to offline results if network or CORS/timeout occurs
  }

  return results.slice(0, 12);
}

/**
 * Reverse geocodes a coordinate using OpenStreetMap Nominatim
 */
export async function reverseGeocodeLive(
  lat: number,
  lng: number
): Promise<{ locality?: string; district?: string; region?: string; countryCode?: string; formatted?: string } | null> {
  try {
    const endpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const locality =
        addr.village ||
        addr.suburb ||
        addr.town ||
        addr.city ||
        addr.hamlet ||
        addr.neighbourhood ||
        data.name;

      return {
        locality,
        district: addr.county || addr.state_district || addr.district,
        region: addr.state || addr.province,
        countryCode: (addr.country_code || 'LK').toUpperCase(),
        formatted: data.display_name
      };
    }
  } catch (e) {
    // Fail silently
  }
  return null;
}
