import { useReducer, useCallback, useRef } from 'react';
import type { Region, Project, TaxRate } from '../types';
import { gameReducer, INITIAL_STATE } from '../reducers/gameReducer';
import { useGameLoop } from './useGameLoop';

export function useGame() {
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

  // Internal use mostly, but handleNodeClick uses it
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


  // Game Loop
  const timeAccumulator = useRef(0);

  const handleTick = useCallback((deltaTime: number) => {
    timeAccumulator.current += deltaTime;
    // 1000ms = 1 day
    if (timeAccumulator.current >= 1000) {
      dispatch({ type: 'TICK', payload: { deltaTime: 1000 } });
      timeAccumulator.current -= 1000;
    }
  }, []);

  const shouldRun = gameState.isPlaying && !gameState.isGameOver && !gameState.activeEvent;
  // Use non-null assertion or Boolean cast if needed, but boolean is fine
  useGameLoop(handleTick, !!shouldRun);

  return {
    gameState,
    startGame,
    handleChoice,
    handleNodeClick,
    setTaxRate,
    buyProject,
    resetGame
  };
}