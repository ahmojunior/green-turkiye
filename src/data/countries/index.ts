import type { Country, Region } from '../../types';
import { TURKEY_PROVINCE_PATHS } from './turkey/provincePaths';
import { TURKEY_REGIONS } from './turkey/regions';
import { GERMANY_PROVINCE_PATHS } from './germany/provincePaths';
import { GERMANY_REGIONS } from './germany/regions';

export const COUNTRIES: Country[] = [
  {
    id: 'turkey',
    name: { tr: 'Türkiye', en: 'Turkey', de: 'Türkei' },
    icon: 'tr-icon.png',
    viewBoxWidth: 1000,
    viewBoxHeight: 422,
    provincePaths: TURKEY_PROVINCE_PATHS,
    regions: TURKEY_REGIONS,
  },
  {
    id: 'germany',
    name: { tr: 'Almanya', en: 'Germany', de: 'Deutschland' },
    icon: 'de-icon.png',
    viewBoxWidth: 1000,
    viewBoxHeight: 1000,
    provincePaths: GERMANY_PROVINCE_PATHS,
    regions: GERMANY_REGIONS,
  },
];

export function getCountry(countryId: string | null | undefined): Country | undefined {
  return COUNTRIES.find(c => c.id === countryId);
}

export function getRegion(countryId: string | null | undefined, regionId: string | null | undefined): Region | undefined {
  return getCountry(countryId)?.regions.find(r => r.id === regionId);
}
