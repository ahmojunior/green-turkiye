import { useEffect, useRef, useState } from 'react';
import { Recycle, TreePine, Leaf, Sun, Droplet, Zap, type LucideIcon } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { getRegion } from '../data/countries';
import { sfx } from '../utils/sfx';
import { generateId } from '../utils/id';

// Placeholder icon per project — swap for a real sprite <img> here once art lands.
const PROJECT_ICON: Record<string, { Icon: LucideIcon; color: string }> = {
  'recycle-plant': { Icon: Recycle, color: 'text-emerald-400' },
  'public-park': { Icon: TreePine, color: 'text-green-400' },
  'eco-park': { Icon: Leaf, color: 'text-lime-400' },
  'solar-farm': { Icon: Sun, color: 'text-amber-400' },
  'water-filter': { Icon: Droplet, color: 'text-sky-400' },
  'smart-grid': { Icon: Zap, color: 'text-yellow-300' },
};

interface Arrival {
  id: string;
  projectId: string;
  x: number;
  y: number;
}

export function ProjectSites() {
  const { gameState } = useGame();
  const { countryId, regionId, completedProjectIds } = gameState;
  const region = getRegion(countryId, regionId);
  const slots = region?.buildSlots;

  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const prevCompletedRef = useRef<string[]>([]);

  // Detect projects that finished since the last render and play a one-shot
  // "delivery" flight + burst before they settle into a permanent site icon.
  useEffect(() => {
    if (!slots) return;
    const prev = prevCompletedRef.current;
    const fresh = completedProjectIds.filter(id => !prev.includes(id));
    prevCompletedRef.current = completedProjectIds;
    if (fresh.length === 0) return;

    sfx.projectComplete();
    const newArrivals = fresh
      .filter(id => slots[id])
      .map(id => ({ id: generateId(), projectId: id, x: slots[id].x, y: slots[id].y }));
    setArrivals(prevArr => [...prevArr, ...newArrivals]);

    const timer = setTimeout(() => {
      setArrivals(prevArr => prevArr.filter(a => !newArrivals.some(n => n.id === a.id)));
    }, 1600);
    return () => clearTimeout(timer);
  }, [completedProjectIds, slots]);

  if (!slots) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[8]">
      {/* Permanent site icons for everything already completed */}
      {completedProjectIds.map(id => {
        const slot = slots[id];
        const iconInfo = PROJECT_ICON[id];
        if (!slot || !iconInfo) return null;
        const { Icon, color } = iconInfo;
        return (
          <div
            key={id}
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-fade-in"
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          >
            <div className={`bg-slate-900/70 border border-white/20 rounded-full p-1.5 backdrop-blur-sm shadow-lg ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}

      {/* One-shot delivery flight + arrival burst for newly finished projects */}
      {arrivals.map(a => {
        const iconInfo = PROJECT_ICON[a.projectId];
        if (!iconInfo) return null;
        const { Icon, color } = iconInfo;
        return (
          <div
            key={a.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${a.x}%`,
              top: `${a.y}%`,
              ['--land-x' as string]: `${a.x}%`,
              ['--land-y' as string]: `${a.y}%`,
            } as React.CSSProperties}
          >
            <div className={`${color} animate-project-flyin`}>
              <Icon className="w-7 h-7 drop-shadow-[0_0_6px_currentColor]" />
            </div>
            <div className="absolute inset-0 animate-project-burst rounded-full border-2 border-white/70" />
          </div>
        );
      })}
    </div>
  );
}
