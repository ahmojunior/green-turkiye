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


  const aspectRatio = viewBoxWidth / viewBoxHeight;

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative" style={{ containerType: 'size' }}>
      {/* Locked to the map's own aspect ratio so MapWildlife's percentage
          positions always line up with the rendered SVG, regardless of
          whatever aspect ratio the parent container happens to be.
          Sized via container query units rather than aspect-ratio + max-w/max-h —
          that combo is ambiguous with no definite width/height on either axis and
          resolves against the SVG's default 300x150 intrinsic size instead of the
          actually available space. cqw/cqh give a definite, unambiguous basis. */}
      <div
        className="relative"
        style={{
          width: `min(100cqw, calc(100cqh * ${aspectRatio}))`,
          height: `min(100cqh, calc(100cqw / ${aspectRatio}))`,
        }}
      >
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
                        stroke-white stroke-[0.5] transition-colors duration-200 ease-in-out touch-manipulation
                        ${fillClass}
                        ${interactive ? 'cursor-pointer' : ''}
                        ${interactive && !isSelected ? 'active:fill-green-300' : ''}
                      `}
                  onPointerEnter={(e) => interactive && e.pointerType === 'mouse' && setHoveredRegion(province.region)}
                  onPointerLeave={(e) => interactive && e.pointerType === 'mouse' && setHoveredRegion(null)}
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
