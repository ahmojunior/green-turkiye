import { useEffect } from 'react';
import { useGame } from './useGame';

// Goal *state* lives in the reducer; this hook only handles the UI edge:
// auto-dismissing the "goal completed" toast a few seconds after it appears.
// Toasts are a queue, so goals completed in the same tick are shown one after
// another instead of all but the last being dropped.
export function useQuestNotifications() {
    const { gameState, clearQuestToast } = useGame();
    const current = gameState.toasts[0];

    useEffect(() => {
        if (!current) return;
        const timer = setTimeout(clearQuestToast, 3000);
        return () => clearTimeout(timer);
    }, [current, clearQuestToast]);
}
