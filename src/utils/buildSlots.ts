import { getRegionSpawnPoints, type MapPoint } from './geometry';
import { getProjectsForRegion } from '../data/projects';

// Project sites are spread across the actual provinces of the selected region
// (left to right) rather than over a hand-anchored 3x2 grid, so a completed
// build always lands on land inside the region the player is governing. The
// spots come from the same verified set the crisis nodes use: every one of them
// has been checked against the outline of the province it belongs to.

// Only needed where a region has fewer verified spots than projects, so one spot
// has to host several sites. Kept tiny, since a nudge is not outline-checked.
const STACK_OFFSET = { x: 1.2, y: 0.9 };

export function getRegionBuildSlots(
    countryId: string | null | undefined,
    regionId: string | null | undefined
): Record<string, MapPoint> {
    const points = getRegionSpawnPoints(countryId, regionId);
    if (points.length === 0) return {};

    // Shared projects plus this region's own ones.
    const plotOrder = getProjectsForRegion(regionId).map(p => p.id);
    const slots: Record<string, MapPoint> = {};
    const used = new Map<number, number>();

    plotOrder.forEach((projectId, i) => {
        const index = Math.floor((i * points.length) / plotOrder.length);
        const stack = used.get(index) ?? 0;
        used.set(index, stack + 1);
        const point = points[index];
        slots[projectId] = {
            x: point.x + STACK_OFFSET.x * stack,
            y: point.y - STACK_OFFSET.y * stack,
        };
    });

    return slots;
}
