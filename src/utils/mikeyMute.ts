// "Mute Mikey" is a per-player preference. Storage can throw (private mode,
// blocked site data); the toggle then just lasts for this session.
const MUTE_KEY = 'greenTurkiye_mikeyMuted';

export const readMikeyMuted = (): boolean => {
    try { return localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; }
};

export const writeMikeyMuted = (muted: boolean) => {
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch { /* not persisted */ }
};
