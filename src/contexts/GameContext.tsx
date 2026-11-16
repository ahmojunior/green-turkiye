import React, { useReducer, useCallback, type PropsWithChildren } from 'react';
import type { Country, Region, Project, TaxRate } from '../types';
import { GameContext } from './game-context';
import { gameReducer, INITIAL_STATE } from '../reducers/gameReducer';
import { TUNING } from '../utils/gameLogic';
import { createSeed } from '../utils/rng';

export const GameProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [gameState, dispatch] = useReducer(gameReducer, INITIAL_STATE);

    const startGame = useCallback((country: Country, region: Region) => {
        // The seed is drawn here, outside the reducer, so the reducer stays pure
        // and a run can be replayed by starting it with the same seed.
        dispatch({ type: 'START_GAME', payload: { country, region, startBudget: TUNING.startBudget, seed: createSeed() } });
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

    const dismissOutcome = useCallback(() => {
        dispatch({ type: 'DISMISS_OUTCOME' });
    }, []);

    const handleNodeClick = useCallback((nodeId: string) => {
        dispatch({ type: 'OPEN_EVENT', payload: nodeId });
    }, []);

    // A day is a turn: time only moves when the player ends the day.
    const endDay = useCallback(() => {
        dispatch({ type: 'TICK' });
    }, []);

    const readLetter = useCallback((letterId: string) => {
        dispatch({ type: 'READ_LETTER', payload: letterId });
    }, []);

    const clearQuestToast = useCallback(() => {
        dispatch({ type: 'CLEAR_QUEST_TOAST' });
    }, []);

    const value = {
        gameState,
        startGame,
        resetGame,
        handleChoice,
        dismissOutcome,
        handleNodeClick,
        setTaxRate,
        buyProject,
        endDay,
        readLetter,
        clearQuestToast
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
