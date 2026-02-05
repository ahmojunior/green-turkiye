import { useGameContext } from '../contexts/GameContext';

export function useGame() {
  return useGameContext();
}