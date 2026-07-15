// Each project always lands in the same relative 3x2 plot layout, just anchored
// at a different point per region so it stays clear of that region's spawnPoints.
const PROJECT_PLOT_ORDER = ['recycle-plant', 'public-park', 'eco-park', 'solar-farm', 'water-filter', 'smart-grid'];

export function buildSlotsAt(anchorX: number, anchorY: number): Record<string, { x: number; y: number }> {
  const cols = 3;
  const spacing = 6;
  return Object.fromEntries(
    PROJECT_PLOT_ORDER.map((id, i) => [
      id,
      { x: anchorX + (i % cols) * spacing, y: anchorY + Math.floor(i / cols) * spacing },
    ])
  );
}
