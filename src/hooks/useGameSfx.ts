import { useEffect, useRef } from 'react';
import type { GameState, LocalizedText } from '../types';
import { getNodeSeverity } from '../utils/gameLogic';
import { sfx } from '../utils/sfx';

interface Snapshot {
    completedProjectIds: string[];
    nodeIds: string[];
    severities: Record<string, number>;
    day: number;
    isGameOver: boolean;
    questToast: LocalizedText | null;
}

// Watches gameState for transitions that don't have a single obvious click
// handler to hang a sound off of — project completion, crisis escalation/
// eruption, and game over/victory all happen "inside" a TICK.
export function useGameSfx(gameState: GameState) {
    const prevRef = useRef<Snapshot | null>(null);

    useEffect(() => {
        const currentIds = gameState.activeNodes.map(n => n.id);
        const nextSeverities: Record<string, number> = {};
        for (const n of gameState.activeNodes) {
            nextSeverities[n.id] = getNodeSeverity(n.spawnDay, gameState.day);
        }

        const prev = prevRef.current;
        if (!prev) {
            prevRef.current = {
                completedProjectIds: gameState.completedProjectIds,
                nodeIds: currentIds,
                severities: nextSeverities,
                day: gameState.day,
                isGameOver: gameState.isGameOver,
                questToast: gameState.questToast,
            };
            return;
        }

        // Note: project completion already gets its chime from ProjectSites,
        // played alongside its landing animation — not duplicated here.
        const newSpawns = currentIds.filter(id => !prev.nodeIds.includes(id));
        if (newSpawns.length > 0) sfx.crisisAppear();

        for (const n of gameState.activeNodes) {
            const prevSeverity = prev.severities[n.id] ?? 1;
            if (nextSeverities[n.id] > prevSeverity) sfx.crisisEscalate(nextSeverities[n.id]);
        }

        // A node erupts (removed by TICK, not by the player opening it) only when
        // the day actually advanced — OPEN_EVENT removes a node without ticking day.
        if (gameState.day !== prev.day) {
            const disappeared = prev.nodeIds.filter(id => !currentIds.includes(id));
            if (disappeared.length > 0) sfx.eruption();
        }

        if (!prev.isGameOver && gameState.isGameOver) {
            if (gameState.isVictory) sfx.victory();
            else sfx.gameOver();
        }

        if (gameState.questToast && gameState.questToast !== prev.questToast) {
            sfx.quest();
        }

        prevRef.current = {
            completedProjectIds: gameState.completedProjectIds,
            nodeIds: currentIds,
            severities: nextSeverities,
            day: gameState.day,
            isGameOver: gameState.isGameOver,
            questToast: gameState.questToast,
        };
    }, [gameState]);
}
