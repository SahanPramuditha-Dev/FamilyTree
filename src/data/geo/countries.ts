import { AdminStructureConfig } from '../../types/geography';

export interface CountryData {
  code: string;
  name: string;
  flag: string;
  latitude: number;
  longitude: number;
  adminConfig: AdminStructureConfig;
}

export const COUNTRIES: CountryData[] = [
  {
    code: 'LK',
    name: 'Sri Lanka',
    flag: '🇱🇰',
    latitude: 7.8731,
    longitude: 80.7718,
    adminConfig: {
      countryCode: 'LK',
      countryName: 'Sri Lanka',
      flag: '🇱🇰',
      regionLabel: 'Province',
      districtLabel: 'District',
      cityLabel: 'City / Town',
      localityLabel: 'Village / Locality'
    }
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    latitude: -25.2744,
    longitude: 133.7751,
    adminConfig: {
      countryCode: 'AU',
      countryName: 'Australia',
      flag: '🇦🇺',
      regionLabel: 'State / Territory',
      districtLabel: 'Region / Council',
      cityLabel: 'City / Suburb',
      localityLabel: 'Neighborhood'
    }
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    latitude: 55.3781,
    longitude: -3.4360,
    adminConfig: {
      countryCode: 'GB',
      countryName: 'United Kingdom',
      flag: '🇬🇧',
      regionLabel: 'Country / Region',
      districtLabel: 'County / Borough',
      cityLabel: 'City / Town',
      localityLabel: 'Village / Parish'
    }
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    latitude: 37.0902,
    longitude: -95.7129,
    adminConfig: {
      countryCode: 'US',
      countryName: 'United States',
      flag: '🇺🇸',
      regionLabel: 'State',
      districtLabel: 'County',
      cityLabel: 'City / Town',
      localityLabel: 'Locality / Area'
    }
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    latitude: 56.1304,
    longitude: -106.3468,
    adminConfig: {
      countryCode: 'CA',
      countryName: 'Canada',
      flag: '🇨🇦',
      regionLabel: 'Province / Territory',
      districtLabel: 'Regional Municipality',
      cityLabel: 'City / Town',
      localityLabel: 'Community'
    }
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    flag: '🇳🇿',
    latitude: -40.9006,
    longitude: 174.8860,
    adminConfig: {
      countryCode: 'NZ',
      countryName: 'New Zealand',
      flag: '🇳🇿',
      regionLabel: 'Region',
      districtLabel: 'District / Council',
      cityLabel: 'City / Town',
      localityLabel: 'Suburb'
    }
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    latitude: 20.5937,
    longitude: 78.9629,
    adminConfig: {
      countryCode: 'IN',
      countryName: 'India',
      flag: '🇮🇳',
      regionLabel: 'State / Union Territory',
      districtLabel: 'District',
      cityLabel: 'City / Town',
      localityLabel: 'Village / Locality'
    }
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    latitude: 23.4241,
    longitude: 53.8478,
    adminConfig: {
      countryCode: 'AE',
      countryName: 'United Arab Emirates',
      flag: '🇦🇪',
      regionLabel: 'Emirate',
      districtLabel: 'Municipality',
      cityLabel: 'City',
      localityLabel: 'Area / Sector'
    }
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    latitude: 1.3521,
    longitude: 103.8198,
    adminConfig: {
      countryCode: 'SG',
      countryName: 'Singapore',
      flag: '🇸🇬',
      regionLabel: 'Region',
      districtLabel: 'Planning Area',
      cityLabel: 'Town / Subzone',
      localityLabel: 'Estate'
    }
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    latitude: 46.2276,
    longitude: 2.2137,
    adminConfig: {
      countryCode: 'FR',
      countryName: 'France',
      flag: '🇫🇷',
      regionLabel: 'Région',
      districtLabel: 'Département',
      cityLabel: 'Ville / Commune',
      localityLabel: 'Quartier / Village'
    }
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    latitude: 51.1657,
    longitude: 10.4515,
    adminConfig: {
      countryCode: 'DE',
      countryName: 'Germany',
      flag: '🇩🇪',
      regionLabel: 'Bundesland (State)',
      districtLabel: 'Landkreis (District)',
      cityLabel: 'Stadt / Gemeinde',
      localityLabel: 'Ortsteil'
    }
  },
  {
    code: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    latitude: 41.8719,
    longitude: 12.5674,
    adminConfig: {
      countryCode: 'IT',
      countryName: 'Italy',
      flag: '🇮🇹',
      regionLabel: 'Regione',
      districtLabel: 'Provincia',
      cityLabel: 'Comune / Città',
      localityLabel: 'Frazione'
    }
  },
  {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    latitude: 36.2048,
    longitude: 138.2529,
    adminConfig: {
      countryCode: 'JP',
      countryName: 'Japan',
      flag: '🇯🇵',
      regionLabel: 'Prefecture',
      districtLabel: 'District / Ward',
      cityLabel: 'City / Town',
      localityLabel: 'Village / Chome'
    }
  }
];

export function getCountryByCode(code: string): CountryData | undefined {
  return COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase());
}

export function getCountryByName(name: string): CountryData | undefined {
  const norm = name.toLowerCase().trim();
  return COUNTRIES.find(c => c.name.toLowerCase() === norm || c.code.toLowerCase() === norm);
}
