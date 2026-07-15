import React, { createContext, useReducer, useCallback, useRef, type PropsWithChildren } from 'react';
import type { GameState, Country, Region, Project, TaxRate } from '../types';
import { gameReducer, INITIAL_STATE } from '../reducers/gameReducer';
import { TUNING } from '../utils/gameLogic';
import { useGameLoop } from '../hooks/useGameLoop';

interface GameContextType {
    gameState: GameState;
    startGame: (country: Country, region: Region) => void;
    resetGame: () => void;
    handleChoice: (choiceIndex: number) => void;
    handleNodeClick: (nodeId: string) => void;
    setTaxRate: (rate: TaxRate) => void;
    buyProject: (project: Project) => void;
    setPaused: (paused: boolean) => void;
    clearQuestToast: () => void;
}

export const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [gameState, dispatch] = useReducer(gameReducer, INITIAL_STATE);

    const startGame = useCallback((country: Country, region: Region) => {
        dispatch({ type: 'START_GAME', payload: { country, region, startBudget: TUNING.startBudget } });
    }, []);

    const resetGame = useCallback(() => {
        dispatch({ type: 'RESET_GAME' });
    }, []);

    const setTaxRate = useCallback((rate: TaxRate) => {
        dispatch({ type: 'SET_TAX_RATE', payload: rate });
    }, []);

    const buyProject = useCallback((project: Project) => {
        dispatch({ type: 'BUY_PROJECT', payload: project });
    }, []);

    const handleChoice = useCallback((choiceIndex: number) => {
        dispatch({ type: 'HANDLE_CHOICE', payload: choiceIndex });
    }, []);

    const handleNodeClick = useCallback((nodeId: string) => {
        dispatch({ type: 'OPEN_EVENT', payload: nodeId });
    }, []);

    const setPaused = useCallback((paused: boolean) => {
        dispatch({ type: 'SET_PAUSED', payload: paused });
    }, []);

    const clearQuestToast = useCallback(() => {
        dispatch({ type: 'CLEAR_QUEST_TOAST' });
    }, []);

    // Game Loop
    const timeAccumulator = useRef(0);

    const handleTick = useCallback((deltaTime: number) => {
        // CLAMP DELTA TIME to prevent spiral of death
        const safeDelta = Math.min(deltaTime, 100);

        timeAccumulator.current += safeDelta;
        // 1000ms = 1 in-game day
        if (timeAccumulator.current >= 1000) {
            dispatch({ type: 'TICK' });
            timeAccumulator.current -= 1000;
        }
    }, []);

    const shouldRun = gameState.isPlaying && !gameState.isGameOver && !gameState.activeEvent && !gameState.isPaused;
    useGameLoop(handleTick, !!shouldRun);

    const value = {
        gameState,
        startGame,
        resetGame,
        handleChoice,
        handleNodeClick,
        setTaxRate,
        buyProject,
        setPaused,
        clearQuestToast
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
