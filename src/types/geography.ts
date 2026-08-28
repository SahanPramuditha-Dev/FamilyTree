export interface LocationDetails {
  countryCode: string;       // e.g. 'LK', 'AU', 'GB', 'US', 'CA', etc.
  countryName: string;       // e.g. 'Sri Lanka', 'Australia'
  region?: string;           // Province / State / Region
  district?: string;         // District / County
  city?: string;             // City / Town / Suburb
  locality?: string;         // Village / Locality / Neighborhood
  latitude: number;
  longitude: number;
  formatted: string;         // e.g. 'Kotugoda, Gampaha, Western Province, Sri Lanka'
}

export type MigrationReason =
  | 'marriage'
  | 'career'
  | 'education'
  | 'emigration'
  | 'retirement'
  | 'family'
  | 'other';

export interface MigrationEvent {
  id: string;
  year?: number;
  date?: string;
  fromLocation: LocationDetails;
  toLocation: LocationDetails;
  reason: MigrationReason;
  notes?: string;
  spouseId?: string;
}

export interface AdminStructureConfig {
  countryCode: string;
  countryName: string;
  flag: string;
  regionLabel: string;     // e.g., 'Province', 'State', 'Country/Region'
  districtLabel?: string;  // e.g., 'District', 'County', 'Council'
  cityLabel: string;        // e.g., 'City / Town', 'City / Suburb'
  localityLabel?: string;   // e.g., 'Village / Locality', 'Neighborhood'
}
