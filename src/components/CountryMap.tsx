import { useState, memo } from 'react';
import type { ProvincePath } from '../types';
import { MapWildlife } from './MapWildlife';

interface CountryMapProps {
  provincePaths: ProvincePath[];
  viewBoxWidth: number;
  viewBoxHeight: number;
  onRegionSelect?: (regionId: string) => void;
  selectedRegionId?: string | null;
  interactive?: boolean;
  cleanliness?: number;
  showWildlife?: boolean; // ambient planes/boats — Turkey-only flourish, see MapWildlife
}

export const CountryMap = memo(function CountryMap({ provincePaths, viewBoxWidth, viewBoxHeight, onRegionSelect, selectedRegionId, interactive = true, cleanliness = 100, showWildlife = false }: CountryMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Calculate Visual Filters
  // Cleanliness 100 -> 0% filter
  // Cleanliness 0 -> 100% filter
  const pollutionFactor = Math.max(0, 100 - cleanliness);

  const filterStyle = {
    filter: `
      drop-shadow(0px 10px 10px rgba(0,0,0,0.2))
      sepia(${pollutionFactor > 30 ? (pollutionFactor - 30) * 1.5 : 0}%)
      brightness(${100 - (pollutionFactor / 3)}%)
      saturate(${100 + (pollutionFactor / 2)}%)
      grayscale(${pollutionFactor > 20 ? (pollutionFactor - 20) : 0}%)
    `,
    transition: 'filter 1.5s ease-in-out'
  };


  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative">
      {/* Locked to the map's own aspect ratio so MapWildlife's percentage
          positions always line up with the rendered SVG, regardless of
          whatever aspect ratio the parent container happens to be. */}
      <div className="relative w-full max-w-5xl" style={{ aspectRatio: `${viewBoxWidth} / ${viewBoxHeight}` }}>
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full drop-shadow-2xl transition-all duration-1000"
        >
          <g style={filterStyle}>
            {provincePaths.map((province, index) => {
              const isSelected = selectedRegionId === province.region;
              const isHovered = hoveredRegion === province.region;

              // Determine Fill Color
              let fillClass = 'fill-slate-200';
              if (isSelected) fillClass = 'fill-green-600';
              else if (interactive && isHovered) fillClass = 'fill-green-400';

              return (
                <path
                  key={`${province.name}-${index}`}
                  d={province.d}
                  className={`
                        stroke-white stroke-[0.5] transition-colors duration-200 ease-in-out
                        ${fillClass}
                        ${interactive ? 'cursor-pointer' : ''}
                      `}
                  onMouseEnter={() => interactive && setHoveredRegion(province.region)}
                  onMouseLeave={() => interactive && setHoveredRegion(null)}
                  onClick={() => interactive && onRegionSelect?.(province.region)}
                >
                  <title>{province.name}</title>
                </path>
              );
            })}
          </g>
        </svg>

        {showWildlife && <MapWildlife />}
      </div>
    </div>
  );
});
