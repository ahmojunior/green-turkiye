import React, { createContext, useContext, useReducer, useCallback, useRef, type PropsWithChildren } from 'react';
import type { GameState, Region, Project, TaxRate } from '../types';
import { gameReducer, INITIAL_STATE } from '../reducers/gameReducer';
import { useGameLoop } from '../hooks/useGameLoop';

interface GameContextType {
    gameState: GameState;
    startGame: (region: Region) => void;
    resetGame: () => void;
    handleChoice: (choiceIndex: number) => void;
    handleNodeClick: (nodeId: string) => void;
    setTaxRate: (rate: TaxRate) => void;
    buyProject: (project: Project) => void;
    setPaused: (paused: boolean) => void;
}

export const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [gameState, dispatch] = useReducer(gameReducer, INITIAL_STATE);

    const startGame = useCallback((region: Region) => {
        // Check for "Green Hero" badge in local storage
        const badges = JSON.parse(localStorage.getItem('green-turkey-badges') || '[]');
        const hasGreenHero = badges.includes('green-hero');
        const startBudget = hasGreenHero ? 1500 : 500;

        dispatch({ type: 'START_GAME', payload: { region, startBudget } });
    }, []);

    const resetGame = useCallback(() => {
        dispatch({ type: 'RESET_GAME' });
    }, []);

    const openEvent = useCallback((nodeId: string) => {
        dispatch({ type: 'OPEN_EVENT', payload: nodeId });
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
        openEvent(nodeId);
    }, [openEvent]);

    const setPaused = useCallback((paused: boolean) => {
        dispatch({ type: 'SET_PAUSED', payload: paused });
    }, []);

    // Game Loop
    const timeAccumulator = useRef(0);

    const handleTick = useCallback((deltaTime: number) => {
        // CLAMP DELTA TIME to prevent spiral of death
        const safeDelta = Math.min(deltaTime, 100);

        timeAccumulator.current += safeDelta;
        // 1000ms = 1 day
        if (timeAccumulator.current >= 1000) {
            dispatch({ type: 'TICK', payload: { deltaTime: 1000 } });
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
        setPaused
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export function useGameContext() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
}
