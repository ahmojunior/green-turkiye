import { getCountry } from '../data/countries';

// ---------------------------------------------------------------------------
// Map geometry derived from the province path data itself.
//
// Crisis nodes and project sites used to sit on hand-tuned percentage
// coordinates per region, which drifted out of their region (and into the sea)
// whenever the map or the viewport changed. Instead we measure each province
// from its own outline and place everything on a point guaranteed to lie inside
// that province, so a node can only ever appear on land inside the region the
// player is governing.
// ---------------------------------------------------------------------------

/** A position as a percentage of the map viewBox — the unit every map overlay uses. */
export interface MapPoint {
    x: number;
    y: number;
}

interface Box {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

interface Ring {
    // Outline vertices as [x, y] pairs, in viewBox units.
    points: number[][];
    box: Box;
}

const boxArea = (b: Box) => (b.maxX - b.minX) * (b.maxY - b.minY);

// All three country datasets are exported with only M/m (moveto), l (relative
// lineto) and z (closepath) — verified across turkey, germany and uk
// provincePaths. A minimal walker is therefore enough; curve commands would
// need flattening before their points could be trusted.
const subpaths = (d: string): Ring[] => {
    const rings: Ring[] = [];
    let points: number[][] = [];
    let box: Box | null = null;
    let x = 0;
    let y = 0;
    let startX = 0;
    let startY = 0;

    const add = (px: number, py: number) => {
        points.push([px, py]);
        if (box) {
            box.minX = Math.min(box.minX, px);
            box.minY = Math.min(box.minY, py);
            box.maxX = Math.max(box.maxX, px);
            box.maxY = Math.max(box.maxY, py);
        } else {
            box = { minX: px, minY: py, maxX: px, maxY: py };
        }
    };

    const flush = () => {
        if (box && points.length > 2) rings.push({ points, box });
        points = [];
        box = null;
    };

    for (const group of d.match(/[MmLlZz][^MmLlZz]*/g) ?? []) {
        const command = group[0];
        const numbers = (group.slice(1).match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number);
        const relative = command === command.toLowerCase();

        if (command === 'M' || command === 'm') {
            // A new subpath starts, so bank the one being measured. Islands and
            // exclaves become separate rings, letting us ignore the small ones.
            flush();
            for (let i = 0; i + 1 < numbers.length; i += 2) {
                if (relative) {
                    x += numbers[i];
                    y += numbers[i + 1];
                } else {
                    x = numbers[i];
                    y = numbers[i + 1];
                }
                if (i === 0) {
                    startX = x;
                    startY = y;
                }
                add(x, y);
            }
        } else if (command === 'L' || command === 'l') {
            for (let i = 0; i + 1 < numbers.length; i += 2) {
                if (relative) {
                    x += numbers[i];
                    y += numbers[i + 1];
                } else {
                    x = numbers[i];
                    y = numbers[i + 1];
                }
                add(x, y);
            }
        } else {
            x = startX;
            y = startY;
        }
    }

    flush();
    return rings;
};

// Standard even-odd ray cast. Province outlines here are simple closed polygons.
const isInside = (points: number[][], px: number, py: number): boolean => {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, yi] = points[i];
        const [xj, yj] = points[j];
        if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
            inside = !inside;
        }
    }
    return inside;
};

// The centre of the bounding box is the obvious label point and is right for 79
// of the 81 Turkish provinces, but a province wrapped around a gulf (Izmir,
// Antalya) has its box centre in a neighbour or out at sea. When that happens,
// search the box on a grid and take the inside point nearest the centre, so a
// crisis node always lands on the province it belongs to.
const GRID = 11;

const representativePoint = (ring: Ring): MapPoint => {
    const cx = (ring.box.minX + ring.box.maxX) / 2;
    const cy = (ring.box.minY + ring.box.maxY) / 2;
    if (isInside(ring.points, cx, cy)) return { x: cx, y: cy };

    let best: MapPoint | null = null;
    let bestDistance = Infinity;
    for (let i = 1; i < GRID; i++) {
        for (let j = 1; j < GRID; j++) {
            const px = ring.box.minX + ((ring.box.maxX - ring.box.minX) * i) / GRID;
            const py = ring.box.minY + ((ring.box.maxY - ring.box.minY) * j) / GRID;
            if (!isInside(ring.points, px, py)) continue;
            const distance = (px - cx) ** 2 + (py - cy) ** 2;
            if (distance < bestDistance) {
                bestDistance = distance;
                best = { x: px, y: py };
            }
        }
    }

    return best ?? { x: cx, y: cy };
};

// Two crises can share a province, and stacked icons hide each other. Rather
// than jittering a node by a random amount — which pushed small provinces like
// Edirne or Kilis over a national border — every province offers a couple of
// alternative spots, each one checked against the outline before it is kept.
const SLOT_OFFSETS: number[][] = [
    [0, 0],
    [9, 4],
    [-9, -4],
];

const provinceSlots = (ring: Ring): MapPoint[] => {
    const base = representativePoint(ring);
    const slots: MapPoint[] = [];
    for (const [dx, dy] of SLOT_OFFSETS) {
        const point = { x: base.x + dx, y: base.y + dy };
        if (isInside(ring.points, point.x, point.y)) slots.push(point);
    }
    return slots.length > 0 ? slots : [base];
};

// Measuring 81-232 paths is cheap but not free, and the result never changes
// for a given country, so do it once per country id.
const slotCache = new Map<string, Map<string, MapPoint[]>>();

/** Every usable spot inside every province, keyed by province name, in viewBox %. */
export const getProvinceSlots = (countryId: string | null | undefined): Map<string, MapPoint[]> => {
    const country = getCountry(countryId);
    if (!country) return new Map();

    const cached = slotCache.get(country.id);
    if (cached) return cached;

    const slots = new Map<string, MapPoint[]>();
    const areas = new Map<string, number>();

    for (const province of country.provincePaths) {
        const rings = subpaths(province.d);
        if (rings.length === 0) continue;
        // The mainland body, not a stray island, is what we want to mark.
        const ring = rings.reduce((biggest, r) => (boxArea(r.box) > boxArea(biggest.box) ? r : biggest));
        // A province can also appear as several entries (multi-polygon); keep the
        // biggest piece so the marker lands on the main landmass.
        if ((areas.get(province.name) ?? 0) >= boxArea(ring.box)) continue;
        areas.set(province.name, boxArea(ring.box));
        slots.set(
            province.name,
            provinceSlots(ring).map(p => ({
                x: (p.x / country.viewBoxWidth) * 100,
                y: (p.y / country.viewBoxHeight) * 100,
            }))
        );
    }

    slotCache.set(country.id, slots);
    return slots;
};

/** The main anchor of every province of a country, keyed by province name. */
export const getProvinceCentres = (countryId: string | null | undefined): Map<string, MapPoint> =>
    new Map([...getProvinceSlots(countryId)].map(([name, slots]) => [name, slots[0]]));

const regionCache = new Map<string, { anchors: MapPoint[]; spawns: MapPoint[] }>();

const regionGeometry = (countryId: string | null | undefined, regionId: string | null | undefined) => {
    const country = getCountry(countryId);
    if (!country || !regionId) return { anchors: [], spawns: [] };

    const key = `${country.id}:${regionId}`;
    const cached = regionCache.get(key);
    if (cached) return cached;

    const slots = getProvinceSlots(country.id);
    const names = [...new Set(
        country.provincePaths.filter(p => p.region === regionId).map(p => p.name)
    )];

    const byX = (a: MapPoint, b: MapPoint) => a.x - b.x || a.y - b.y;
    const present = names.map(name => slots.get(name)).filter((s): s is MapPoint[] => !!s);
    const geometry = {
        anchors: present.map(s => s[0]).sort(byX),
        spawns: present.flat().sort(byX),
    };

    regionCache.set(key, geometry);
    return geometry;
};

/**
 * One anchor per province of a region, ordered left to right. Used to lay out
 * the permanent project sites.
 */
export const getRegionPoints = (
    countryId: string | null | undefined,
    regionId: string | null | undefined
): MapPoint[] => regionGeometry(countryId, regionId).anchors;

/**
 * Every spot a crisis node may occupy in a region: each one has been checked to
 * fall inside the outline of the province it belongs to.
 */
export const getRegionSpawnPoints = (
    countryId: string | null | undefined,
    regionId: string | null | undefined
): MapPoint[] => regionGeometry(countryId, regionId).spawns;

/**
 * The spots inside the provinces an event actually names, narrowed to the region
 * being played. This is what puts the Konya sinkhole crisis on Konya instead of
 * anywhere in Central Anatolia; an event that names no province (national policy)
 * or only provinces outside this region returns nothing, and the caller falls
 * back to the region as a whole.
 */
export const getProvinceSpawnPoints = (
    countryId: string | null | undefined,
    regionId: string | null | undefined,
    provinces: string[] | undefined
): MapPoint[] => {
    const country = getCountry(countryId);
    if (!country || !regionId || !provinces || provinces.length === 0) return [];

    const inRegion = new Set(
        country.provincePaths.filter(p => p.region === regionId).map(p => p.name)
    );
    const slots = getProvinceSlots(country.id);
    return provinces.filter(name => inRegion.has(name)).flatMap(name => slots.get(name) ?? []);
};
