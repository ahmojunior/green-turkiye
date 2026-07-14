import { useEffect, useMemo, useRef } from 'react';
import { useGame } from '../hooks/useGame';

// Purely decorative ambient life over the (top-down) map — no gameplay meaning.
const BASE_URL = import.meta.env.BASE_URL;
const PLANE_SRCS = ['plane.svg', 'plane_blue.svg', 'plane_red.svg'];

// The map box is ~this many times wider than tall; used to turn a straight line
// in %-space into the correct on-screen heading so the plane's nose leads.
const CONTAINER_ASPECT = 1000 / 422;
// plane.svg's nose points LEFT (180°) by default, so -180° aligns it with the heading.
const PLANE_BASE_ROTATION = -180;

interface PlaneFlight {
  src: string;
  fromX: number; fromY: number; toX: number; toY: number;
  angle: number; duration: number; delay: number; size: number;
}

// Each plane gets a random entry side and random start/end heights, so no two
// take the same path. Long durations + the off-screen wait in `plane-fly` keep
// them sparse — just the odd fly-by rather than a constant stream.
function randomFlights(): PlaneFlight[] {
  return PLANE_SRCS.map(src => {
    const leftToRight = Math.random() < 0.5;
    const fromX = leftToRight ? -12 : 112;
    const toX = leftToRight ? 112 : -12;
    const fromY = 4 + Math.random() * 82;
    const toY = 4 + Math.random() * 82;
    const dx = (toX - fromX) * CONTAINER_ASPECT;
    const dy = toY - fromY;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + PLANE_BASE_ROTATION;
    const duration = 34 + Math.random() * 20;
    const delay = -Math.random() * duration; // start mid-cycle so phases differ
    const size = 24 + Math.random() * 10;
    return { src, fromX, fromY, toX, toY, angle, duration, delay, size };
  });
}

// Boats idle only in open sea — Aegean (west), Mediterranean (south) and Black
// Sea (north). Deliberately none in the Marmara/Bosphorus straits (north-west).
// `flip` mirrors the sprite so they don't all face the same way; `presence`
// fades each in and out on its own cycle so the sea is only occasionally busy.
const BOATS = [
  { left: '55%', top: '4%', size: 30, drift: 9, presence: 26, delay: 0, flip: false },   // Black Sea
  { left: '67%', top: '4%', size: 26, drift: 11, presence: 30, delay: -8, flip: true },  // Black Sea
  { left: '3%', top: '55%', size: 28, drift: 8, presence: 24, delay: -4, flip: true },   // Aegean
  { left: '4%', top: '67%', size: 24, drift: 10, presence: 28, delay: -15, flip: false },// Aegean
  { left: '41%', top: '93%', size: 30, drift: 9, presence: 33, delay: -21, flip: false },// Mediterranean
  { left: '57%', top: '92%', size: 26, drift: 12, presence: 22, delay: -12, flip: true },// Mediterranean
];

export function MapWildlife() {
  const { gameState } = useGame();
  const isPaused = gameState.isPaused;
  const flights = useMemo(() => randomFlights(), []);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pause/resume with a slow-motion ramp rather than an instant freeze: on pause,
  // ease every ambient animation's speed down to a standstill; on resume, ease it
  // back up to full speed.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const anims = el.getAnimations({ subtree: true });
    if (!anims.length) return;

    const to = isPaused ? 0 : 1;
    const from = anims[0].playbackRate;
    if (from === to) return;

    const durationMs = isPaused ? 900 : 450;
    const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / durationMs);
      const rate = from + (to - from) * easeOut(p);
      anims.forEach(a => { a.playbackRate = rate; });
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isPaused]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
      {flights.map((f, i) => (
        <img
          key={`plane-${i}`}
          src={BASE_URL + f.src}
          alt=""
          className="absolute"
          style={{
            width: f.size,
            height: f.size,
            left: `${f.fromX}%`,
            top: `${f.fromY}%`,
            transform: `rotate(${f.angle}deg)`,
            animation: `plane-fly ${f.duration}s linear infinite`,
            animationDelay: `${f.delay}s`,
            ['--from-x' as string]: `${f.fromX}%`,
            ['--from-y' as string]: `${f.fromY}%`,
            ['--to-x' as string]: `${f.toX}%`,
            ['--to-y' as string]: `${f.toY}%`,
          } as React.CSSProperties}
        />
      ))}
      {BOATS.map((b, i) => (
        <div
          key={`boat-${i}`}
          className="absolute"
          style={{
            left: b.left,
            top: b.top,
            animation: `boat-drift ${b.drift}s ease-in-out infinite, boat-presence ${b.presence}s ease-in-out infinite`,
            animationDelay: `0s, ${b.delay}s`,
          }}
        >
          <img
            src={`${BASE_URL}boat.png`}
            alt=""
            className="block drop-shadow"
            style={{ width: b.size, transform: b.flip ? 'scaleX(-1)' : 'none' }}
          />
        </div>
      ))}
    </div>
  );
}
