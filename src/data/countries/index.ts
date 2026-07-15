import type { Country, Region } from '../../types';
import { TURKEY_PROVINCE_PATHS } from './turkey/provincePaths';
import { TURKEY_REGIONS } from './turkey/regions';
import { GERMANY_PROVINCE_PATHS } from './germany/provincePaths';
import { GERMANY_REGIONS } from './germany/regions';
import { UK_PROVINCE_PATHS } from './uk/provincePaths';
import { UK_REGIONS } from './uk/regions';

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
  {
    id: 'uk',
    name: { tr: 'Birleşik Krallık', en: 'United Kingdom', de: 'Vereinigtes Königreich' },
    icon: 'uk-icon.png',
    // Cropped tightly to gb.svg's actual content bounding box (plus a small
    // padding margin) instead of its full 1000x1000 source canvas, which had
    // large unused margins and made the map render tiny within its frame.
    viewBoxWidth: 764.4,
    viewBoxHeight: 949,
    provincePaths: UK_PROVINCE_PATHS,
    regions: UK_REGIONS,
  },
];

export function getCountry(countryId: string | null | undefined): Country | undefined {
  return COUNTRIES.find(c => c.id === countryId);
}

export function getRegion(countryId: string | null | undefined, regionId: string | null | undefined): Region | undefined {
  return getCountry(countryId)?.regions.find(r => r.id === regionId);
}
