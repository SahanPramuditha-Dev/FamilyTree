// Built-in intelligent geocoder for family tree places, cities, and countries

const GEO_DICTIONARY: Record<string, [number, number]> = {
  // Sri Lanka
  'sri lanka': [7.8731, 80.7718],
  'colombo': [6.9271, 79.8612],
  'kandy': [7.2906, 80.6337],
  'galle': [6.0535, 80.2210],
  'matara': [5.9549, 80.5550],
  'jaffna': [9.6615, 80.0255],
  'negombo': [7.2008, 79.8737],
  'kurunegala': [7.4863, 80.3623],
  'anuradhapura': [8.3114, 80.4037],
  'gampaha': [7.0840, 79.9943],
  'kalutara': [6.5854, 79.9607],
  'batticaloa': [7.7310, 81.6747],
  'trincomalee': [8.5874, 81.2152],
  'ratnapura': [6.7056, 80.3847],
  'badulla': [6.9934, 81.0550],
  'nuwara eliya': [6.9497, 80.7891],
  'hambantota': [6.1429, 81.1212],

  // United Kingdom & Europe
  'united kingdom': [55.3781, -3.4360],
  'uk': [55.3781, -3.4360],
  'london': [51.5074, -0.1278],
  'edinburgh': [55.9533, -3.1883],
  'manchester': [53.4808, -2.2426],
  'birmingham': [52.4862, -1.8904],
  'paris': [48.8566, 2.3522],
  'france': [46.2276, 2.2137],
  'italy': [41.8719, 12.5674],
  'rome': [41.9028, 12.4964],
  'germany': [51.1657, 10.4515],
  'berlin': [52.5200, 13.4050],
  'netherlands': [52.1326, 5.2913],
  'amsterdam': [52.3676, 4.9041],
  'switzerland': [46.8182, 8.2275],
  'dublin': [53.3498, -6.2603],
  'ireland': [53.1424, -7.6921],

  // North America
  'united states': [37.0902, -95.7129],
  'usa': [37.0902, -95.7129],
  'new york': [40.7128, -74.0060],
  'boston': [42.3601, -71.0589],
  'san francisco': [37.7749, -122.4194],
  'los angeles': [34.0522, -118.2437],
  'california': [36.7783, -119.4179],
  'chicago': [41.8781, -87.6298],
  'seattle': [47.6062, -122.3321],
  'texas': [31.9686, -99.9018],
  'canada': [56.1304, -106.3468],
  'toronto': [43.6532, -79.3832],
  'vancouver': [49.2827, -123.1207],
  'montreal': [45.5017, -73.5673],

  // Asia Pacific & Middle East
  'australia': [-25.2744, 133.7751],
  'melbourne': [-37.8136, 144.9631],
  'sydney': [-33.8688, 151.2093],
  'brisbane': [-27.4698, 153.0251],
  'perth': [-31.9505, 115.8605],
  'new zealand': [-40.9006, 174.8860],
  'auckland': [-36.8485, 174.7633],
  'india': [20.5937, 78.9629],
  'delhi': [28.6139, 77.2090],
  'mumbai': [19.0760, 72.8777],
  'chennai': [13.0827, 80.2707],
  'bangalore': [12.9716, 77.5946],
  'singapore': [1.3521, 103.8198],
  'malaysia': [4.2105, 101.9758],
  'kuala lumpur': [3.1390, 101.6869],
  'united arab emirates': [23.4241, 53.8478],
  'uae': [23.4241, 53.8478],
  'dubai': [25.2048, 55.2708],
  'qatar': [25.3548, 51.1839],
  'doha': [25.2854, 51.5310],
  'japan': [36.2048, 138.2529],
  'tokyo': [35.6762, 139.6503]
};

export function geocodeLocation(locationText?: string): [number, number] | null {
  if (!locationText || !locationText.trim()) return null;

  const normalized = locationText.toLowerCase().trim();

  // 1. Direct exact match
  if (GEO_DICTIONARY[normalized]) {
    return GEO_DICTIONARY[normalized];
  }

  // 2. Tokenized match (e.g., 'Colombo, Sri Lanka' -> matches 'colombo')
  const tokens = normalized.split(/[,;\-\/]+/).map(t => t.trim());
  for (const token of tokens) {
    if (GEO_DICTIONARY[token]) {
      return GEO_DICTIONARY[token];
    }
  }

  // 3. Substring check
  for (const key of Object.keys(GEO_DICTIONARY)) {
    if (normalized.includes(key)) {
      return GEO_DICTIONARY[key];
    }
  }

  return null;
}
