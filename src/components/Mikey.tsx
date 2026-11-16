// Mikey, the reporter mascot. Drawing and colours come from Mikey's Lounge
// (MIKEY.md); they are fixed illustration values, never theme tokens.
// Every mood lives in one SVG and `data-mood` picks which parts show.
// For `point`, the caller sets `data-arm` and `--mikey-point` on the SVG once
// it knows where the target is on screen (see MikeyHints).
export type MikeyMood = 'idle' | 'happy' | 'sad' | 'think' | 'point' | 'alarmed';

interface MikeyProps {
    mood?: MikeyMood;
    className?: string;
}

// Sparse grille dots inside the head circle, same rule as the Lounge drawing.
const DOTS: [number, number][] = [];
for (let y = 14; y <= 80; y += 7) {
    for (let x = 24 + ((y / 7) % 2) * 3.5; x <= 96; x += 7) {
        if ((x - 60) ** 2 + (y - 46) ** 2 < 34 ** 2) DOTS.push([x, y]);
    }
}

const sparkle = (x: number, y: number, r: number) => {
    const k = r / 4;
    return `M${x} ${y - r}Q${x + k} ${y - k} ${x + r} ${y}Q${x + k} ${y + k} ${x} ${y + r}Q${x - k} ${y + k} ${x - r} ${y}Q${x - k} ${y - k} ${x} ${y - r}Z`;
};

export function Mikey({ mood = 'idle', className = '' }: MikeyProps) {
    return (
        <svg
            className={`mikey ${className}`}
            viewBox="0 0 120 152"
            aria-hidden="true"
            focusable="false"
            data-mood={mood}
        >
            <ellipse className="shadow" cx="60" cy="146" rx="24" ry="4" fill="#000" opacity=".16" />
            <g className="rig">
                <path className="stick arm l" d="M51 104L37 96L25 90" />
                <path className="stick arm r" d="M69 104L83 96L95 90" />
                <path fill="#403E4A" d="M48.5 86L71.5 86L72.5 120L70.5 144L49.5 144L48 118Z" />
                <path fill="none" stroke="#5A5866" strokeWidth="1.4" strokeLinecap="round" d="M54 96L53.5 140M60 95L60.5 141M66 96L66.5 140" />
                <rect x="56" y="104" width="8" height="11" rx="3" fill="#2A2830" />
                <rect x="57.5" y="106" width="5" height="4" rx="1.5" fill="#E0AE4E" />
                <rect x="45" y="83" width="30" height="11" rx="4" fill="#B8862F" />
                <path fill="none" stroke="#F1D58E" strokeWidth="1.6" strokeLinecap="round" d="M48 86.5H72" />
                <g className="head">
                    <circle cx="58" cy="44" r="40" fill="#F4DFA6" />
                    <circle cx="60" cy="46" r="40" fill="#E2AB38" />
                    <g fill="#C48E22" opacity=".55">
                        {DOTS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.25" />)}
                    </g>
                    <path fill="none" stroke="#FFF3CF" strokeWidth="3.5" strokeLinecap="round" opacity=".55" d="M33 30Q39 16 54 11" />
                    <ellipse className="blush" cx="41" cy="58" rx="6" ry="3.8" />
                    <ellipse className="blush" cx="79" cy="58" rx="6" ry="3.8" />
                    <g className="v-idle">
                        <g className="eye"><circle className="face" cx="48" cy="49" r="4.6" /><circle cx="49.6" cy="47.4" r="1.5" fill="#fff" /></g>
                        <g className="eye"><circle className="face" cx="72" cy="49" r="4.6" /><circle cx="73.6" cy="47.4" r="1.5" fill="#fff" /></g>
                        <path className="st" d="M54 60Q60 65 66 60" />
                    </g>
                    <g className="v-think">
                        <g className="eye"><circle className="face" cx="49" cy="47" r="4.6" /><circle cx="50.6" cy="45.4" r="1.5" fill="#fff" /></g>
                        <g className="eye"><circle className="face" cx="73" cy="47" r="4.6" /><circle cx="74.6" cy="45.4" r="1.5" fill="#fff" /></g>
                        <path className="face" d="M60.5 56.5C63.5 56.5 64 61 62.5 64C61.5 66 59 66 58.5 63.5C58 60.5 58.5 56.5 60.5 56.5Z" />
                    </g>
                    <g className="v-happy">
                        <path className="st" d="M42 51Q47.5 43.5 53 51" />
                        <path className="st" d="M67 51Q72.5 43.5 78 51" />
                        <path className="face" d="M52 57Q60 57.5 68 57Q67.5 68 60 68.5Q52.5 68 52 57Z" />
                        <path fill="#F0718A" d="M55.5 64.5Q60 61.5 64.5 64.5Q62.5 67.6 60 67.6Q57.5 67.6 55.5 64.5Z" />
                    </g>
                    <g className="v-sad">
                        <circle className="face" cx="48" cy="51" r="4.2" /><circle cx="49.4" cy="49.6" r="1.3" fill="#fff" />
                        <circle className="face" cx="72" cy="51" r="4.2" /><circle cx="73.4" cy="49.6" r="1.3" fill="#fff" />
                        <path className="st" d="M41 44L52 40" />
                        <path className="st" d="M68 40L79 44" />
                        <path className="st" d="M54 65Q60 59.5 66 65" />
                        <path className="tear" d="M44.5 56Q40.5 62 44.5 64Q48.5 62 44.5 56Z" />
                    </g>
                    {/* point: idle face looking toward the target side */}
                    <g className="v-point">
                        <g className="eye"><circle className="face" cx="50" cy="49" r="4.6" /><circle cx="51.6" cy="47.4" r="1.5" fill="#fff" /></g>
                        <g className="eye"><circle className="face" cx="74" cy="49" r="4.6" /><circle cx="75.6" cy="47.4" r="1.5" fill="#fff" /></g>
                        <path className="st" d="M54 59Q61 65 67 59" />
                    </g>
                    {/* alarmed: wide eyes, raised brows, small round mouth */}
                    <g className="v-alarmed">
                        <circle cx="48" cy="49" r="7" fill="#fff" stroke="#2A2622" strokeWidth="1.6" />
                        <circle cx="72" cy="49" r="7" fill="#fff" stroke="#2A2622" strokeWidth="1.6" />
                        <circle className="face" cx="48" cy="49" r="3.4" /><circle className="face" cx="72" cy="49" r="3.4" />
                        <path className="st" d="M40 37Q47 32 54 36M66 36Q73 32 80 37" />
                        <ellipse className="face" cx="60" cy="64" rx="4" ry="5" />
                    </g>
                </g>
            </g>
            <g className="v-happy">
                <path className="spark" d={sparkle(12, 26, 7)} />
                <path className="spark" d={sparkle(108, 18, 6)} />
                <path className="spark" d={sparkle(106, 66, 5)} />
            </g>
            <g className="v-alarmed">
                <path className="st alarm-mark" stroke="#E2453C" strokeWidth="4" d="M104 8L101 26M99 34L98.6 35" />
            </g>
        </svg>
    );
}
