import { useEffect } from 'react';
import { useGame } from './useGame';

// Goal *state* lives in the reducer; this hook only handles the UI edge:
// auto-dismissing the "goal completed" toast a few seconds after it appears.
export function useQuestNotifications() {
    const { gameState, clearQuestToast } = useGame();
    const { questToast } = gameState;

    useEffect(() => {
        if (!questToast) return;
        const timer = setTimeout(clearQuestToast, 3000);
        return () => clearTimeout(timer);
    }, [questToast, clearQuestToast]);
}
