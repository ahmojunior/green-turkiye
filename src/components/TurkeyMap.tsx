

import { useState } from 'react';
import { PROVINCE_PATHS } from '../data/provincePaths';

interface TurkeyMapProps {
  onRegionSelect?: (regionId: string) => void;
  selectedRegionId?: string | null;
  interactive?: boolean;
  cleanliness?: number;
}

export function TurkeyMap({ onRegionSelect, selectedRegionId, interactive = true, cleanliness = 100 }: TurkeyMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Calculate Visual Filters
  // Cleanliness 100 -> 0% filter
  // Cleanliness 0 -> 100% filter
  const pollutionFactor = Math.max(0, 100 - cleanliness);
  
  const filterStyle = {
    filter: `
      drop-shadow(0px 10px 10px rgba(0,0,0,0.2)) 
      sepia(${pollutionFactor > 50 ? (pollutionFactor - 50) * 2 : 0}%)
      grayscale(${pollutionFactor > 20 ? (pollutionFactor - 20) : 0}%)
    `,
    transition: 'filter 1s ease-in-out'
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative">
      <svg 
        viewBox="0 0 1000 422" 
        className="w-full h-full max-w-5xl drop-shadow-2xl transition-all duration-1000"
        style={filterStyle}
      >
        {PROVINCE_PATHS.map((province, index) => {
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
      </svg>
      
      {/* Smog Overlay for Critical Levels */}
      {cleanliness < 40 && (
        <div 
            className="absolute inset-0 pointer-events-none mix-blend-multiply bg-amber-900/20 z-10 animate-pulse"
            style={{ opacity: (40 - cleanliness) / 40 }} 
        ></div>
      )}
    </div>
  );
}
