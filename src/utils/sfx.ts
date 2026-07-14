// Lightweight synthesized SFX engine — Web Audio oscillators/noise, no audio files.
// Lets every game event (project done, crisis, choices, victory...) get a sound
// today; swap in real samples later by replacing the bodies of these functions.

type OscType = OscillatorType;

interface Note {
    freq: number;
    start: number;   // seconds from now
    dur: number;      // seconds
    type?: OscType;
    gain?: number;
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let muted = localStorage.getItem('gt_sfx_muted') === '1';

function getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!ctx) {
        ctx = new Ctor();
        master = ctx.createGain();
        master.gain.value = muted ? 0 : 0.35;
        master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
}

function getNoiseBuffer(audioCtx: AudioContext): AudioBuffer {
    if (noiseBuffer) return noiseBuffer;
    const size = audioCtx.sampleRate * 0.5;
    noiseBuffer = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
    return noiseBuffer;
}

// A single tone with a short attack/decay envelope so notes click less.
function playNote(audioCtx: AudioContext, out: AudioNode, note: Note) {
    const { freq, start, dur, type = 'sine', gain = 0.5 } = note;
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(env);
    env.connect(out);

    const t0 = audioCtx.currentTime + start;
    const attack = Math.min(0.015, dur * 0.3);
    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(gain, t0 + attack);
    env.gain.exponentialRampToValueAtTime(0.001, t0 + dur);

    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
}

// A pitch-drooping noise thump — used for eruptions and game-over stings.
function playThump(audioCtx: AudioContext, out: AudioNode, start: number, dur: number, gain: number) {
    const src = audioCtx.createBufferSource();
    src.buffer = getNoiseBuffer(audioCtx);
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime + start);
    filter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + start + dur);
    const env = audioCtx.createGain();
    const t0 = audioCtx.currentTime + start;
    env.gain.setValueAtTime(gain, t0);
    env.gain.exponentialRampToValueAtTime(0.001, t0 + dur);

    src.connect(filter);
    filter.connect(env);
    env.connect(out);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
}

function playSequence(notes: Note[]) {
    const audioCtx = getCtx();
    if (!audioCtx || !master) return;
    notes.forEach(n => playNote(audioCtx, master!, n));
}

export const sfx = {
    isMuted: () => muted,
    setMuted(value: boolean) {
        muted = value;
        localStorage.setItem('gt_sfx_muted', value ? '1' : '0');
        if (master) master.gain.value = value ? 0 : 0.35;
    },
    toggleMuted() {
        sfx.setMuted(!muted);
        return muted;
    },

    // Generic UI feedback
    click() {
        playSequence([{ freq: 720, start: 0, dur: 0.05, type: 'square', gain: 0.15 }]);
    },

    // Main-menu navigation — a softer, rounder pop than the in-game click.
    menuClick() {
        playSequence([{ freq: 660, start: 0, dur: 0.09, type: 'sine', gain: 0.22 }]);
    },
    // Committing to something (starting a run, confirming a big choice) — a
    // brighter two-note lift so it reads as more consequential than a nav click.
    menuConfirm() {
        playSequence([
            { freq: 587.33, start: 0, dur: 0.1, type: 'sine', gain: 0.26 },
            { freq: 880, start: 0.07, dur: 0.22, type: 'sine', gain: 0.3 },
        ]);
    },
    denied() {
        playSequence([{ freq: 140, start: 0, dur: 0.16, type: 'sawtooth', gain: 0.25 }]);
    },
    purchase() {
        playSequence([
            { freq: 780, start: 0, dur: 0.07, type: 'triangle', gain: 0.28 },
            { freq: 520, start: 0.06, dur: 0.1, type: 'triangle', gain: 0.22 },
        ]);
    },

    // Project construction finishing — bright ascending chime
    projectComplete() {
        playSequence([
            { freq: 523.25, start: 0, dur: 0.14, gain: 0.3 },
            { freq: 659.25, start: 0.09, dur: 0.14, gain: 0.3 },
            { freq: 783.99, start: 0.18, dur: 0.28, gain: 0.32 },
        ]);
    },

    // Crisis lifecycle
    crisisAppear() {
        playSequence([
            { freq: 440, start: 0, dur: 0.08, type: 'sine', gain: 0.18 },
            { freq: 550, start: 0.07, dur: 0.1, type: 'sine', gain: 0.16 },
        ]);
    },
    crisisEscalate(severity: number) {
        const freq = 320 + severity * 90;
        playSequence([
            { freq, start: 0, dur: 0.09, type: 'square', gain: 0.22 },
            { freq, start: 0.14, dur: 0.09, type: 'square', gain: 0.22 },
        ]);
    },
    eruption() {
        const audioCtx = getCtx();
        if (!audioCtx || !master) return;
        playThump(audioCtx, master, 0, 0.5, 0.5);
        playSequence([{ freq: 110, start: 0, dur: 0.3, type: 'sawtooth', gain: 0.2 }]);
    },

    // Event choice resolution
    choiceGood() {
        playSequence([
            { freq: 587.33, start: 0, dur: 0.1, gain: 0.26 },
            { freq: 880, start: 0.08, dur: 0.16, gain: 0.28 },
        ]);
    },
    choiceBad() {
        playSequence([
            { freq: 400, start: 0, dur: 0.12, type: 'triangle', gain: 0.24 },
            { freq: 260, start: 0.1, dur: 0.18, type: 'triangle', gain: 0.24 },
        ]);
    },
    choiceNeutral() {
        playSequence([{ freq: 500, start: 0, dur: 0.12, type: 'sine', gain: 0.2 }]);
    },

    quest() {
        playSequence([
            { freq: 659.25, start: 0, dur: 0.1, gain: 0.28 },
            { freq: 783.99, start: 0.08, dur: 0.1, gain: 0.28 },
            { freq: 1046.5, start: 0.16, dur: 0.22, gain: 0.3 },
        ]);
    },

    victory() {
        playSequence([
            { freq: 523.25, start: 0, dur: 0.15, gain: 0.3 },
            { freq: 659.25, start: 0.13, dur: 0.15, gain: 0.3 },
            { freq: 783.99, start: 0.26, dur: 0.15, gain: 0.3 },
            { freq: 1046.5, start: 0.39, dur: 0.4, gain: 0.34 },
            { freq: 1318.5, start: 0.5, dur: 0.5, gain: 0.28 },
        ]);
    },
    gameOver() {
        const audioCtx = getCtx();
        if (!audioCtx || !master) return;
        playThump(audioCtx, master, 0, 0.6, 0.4);
        playSequence([
            { freq: 392, start: 0, dur: 0.3, type: 'triangle', gain: 0.22 },
            { freq: 329.63, start: 0.25, dur: 0.3, type: 'triangle', gain: 0.22 },
            { freq: 261.63, start: 0.5, dur: 0.6, type: 'triangle', gain: 0.24 },
        ]);
    },
};
