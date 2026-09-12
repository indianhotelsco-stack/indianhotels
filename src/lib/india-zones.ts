// Groups states/UTs into the broad zones travellers actually think in —
// far more scannable than 33 individual alphabetical headers.

export interface Zone {
  id: string
  label: string
  blurb: string
}

export const ZONES: Zone[] = [
  { id: 'north', label: 'North India', blurb: 'Himalayan peaks, Mughal monuments, and the Golden Triangle.' },
  { id: 'west', label: 'West India', blurb: 'Beaches, deserts, and the Deccan’s cave temples.' },
  { id: 'south', label: 'South India', blurb: 'Temple towns, backwaters, and the tech capitals of the Deccan.' },
  { id: 'east', label: 'East India', blurb: 'Tea gardens, temple towns, and the Ganges delta.' },
  { id: 'central', label: 'Central India', blurb: 'Ancient temples and India’s wildest national parks.' },
  { id: 'northeast', label: 'Northeast India', blurb: 'Living root bridges, tribal culture, and untouched hills.' },
  { id: 'islands', label: 'Islands', blurb: 'Turquoise water and coral reefs in the Bay of Bengal.' },
]

const REGION_TO_ZONE: Record<string, string> = {
  'Jammu and Kashmir': 'north',
  'Ladakh': 'north',
  'Himachal Pradesh': 'north',
  'Punjab': 'north',
  'Haryana': 'north',
  'Delhi': 'north',
  'Chandigarh': 'north',
  'Uttarakhand': 'north',
  'Uttar Pradesh': 'north',
  'Rajasthan': 'north',
  'Gujarat': 'west',
  'Maharashtra': 'west',
  'Goa': 'west',
  'Dadra and Nagar Haveli and Daman and Diu': 'west',
  'Karnataka': 'south',
  'Kerala': 'south',
  'Tamil Nadu': 'south',
  'Telangana': 'south',
  'Andhra Pradesh': 'south',
  'Puducherry': 'south',
  'West Bengal': 'east',
  'Odisha': 'east',
  'Bihar': 'east',
  'Jharkhand': 'east',
  'Madhya Pradesh': 'central',
  'Chhattisgarh': 'central',
  'Assam': 'northeast',
  'Arunachal Pradesh': 'northeast',
  'Manipur': 'northeast',
  'Meghalaya': 'northeast',
  'Mizoram': 'northeast',
  'Nagaland': 'northeast',
  'Sikkim': 'northeast',
  'Tripura': 'northeast',
  'Andaman and Nicobar Islands': 'islands',
}

export function zoneForRegion(region: string): string {
  return REGION_TO_ZONE[region] ?? 'north'
}

// India has 28 states and 8 union territories (since Jammu & Kashmir's 2019
// reorganisation split it into the J&K and Ladakh union territories). Used
// to report state/UT counts precisely rather than a single ambiguous
// "N states and union territories" figure that reads easily as "N states".
const UNION_TERRITORIES = new Set([
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
])

export function isUnionTerritory(region: string): boolean {
  return UNION_TERRITORIES.has(region)
}

export function countStatesAndUTs(regions: Iterable<string>): { states: number; unionTerritories: number } {
  const unique = new Set(regions)
  let states = 0
  let unionTerritories = 0
  for (const region of unique) {
    if (isUnionTerritory(region)) unionTerritories++
    else states++
  }
  return { states, unionTerritories }
}
