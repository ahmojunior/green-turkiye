import { PROJECTS } from '../data/projects';

type Slot = { x: number; y: number };

// Shared projects always land in the same relative 3x2 plot layout, anchored at a
// different point per region so it stays clear of that region's spawnPoints.
// A region's own projects use hand-picked spots on its land, listed in project order.
export function buildSlotsAt(regionId: string, anchorX: number, anchorY: number, regionalSpots: Slot[]): Record<string, Slot> {
  const cols = 3;
  const spacing = 6;
  const shared = PROJECTS.filter(p => !p.regionId).map(({ id }, i): [string, Slot] => [
    id,
    { x: anchorX + (i % cols) * spacing, y: anchorY + Math.floor(i / cols) * spacing },
  ]);
  const regional = PROJECTS.filter(p => p.regionId === regionId).map(({ id }, i): [string, Slot] => [id, regionalSpots[i]]);
  return Object.fromEntries([...shared, ...regional]);
}
