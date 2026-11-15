// ---------------------------------------------------------------------------
// Deterministic RNG. The reducer must stay pure and reproducible: given the
// same starting seed and the same player inputs, a run has to unfold the same
// way every time. That makes runs replayable, lets a scenario pin a fixed seed,
// and makes the reducer testable — none of which is possible while the reducer
// calls Math.random() itself.
//
// mulberry32: tiny, fast, statistically fine for crisis rolls. Every draw
// returns the next seed alongside the value, so callers thread the seed through
// state instead of mutating a hidden global.
// ---------------------------------------------------------------------------

export interface RandomDraw {
    value: number; // [0, 1)
    seed: number;  // feed this into the next draw
}

export const nextRandom = (seed: number): RandomDraw => {
    const nextSeed = (seed + 0x6d2b79f5) | 0;
    let t = nextSeed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    return { value, seed: nextSeed };
};

// A fresh seed for a new run. Called from the UI layer, never from the reducer.
export const createSeed = (): number => (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) | 0;
