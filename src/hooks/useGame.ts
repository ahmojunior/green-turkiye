import { useState, useEffect } from 'react';
import type { GameState, Region, EventNode, TaxRate, Project } from '../types';
import { EVENTS } from '../data/events';
import { REGIONS } from '../data/regions';
import { PROJECTS } from '../data/projects';

const INITIAL_STATE: GameState = {
  regionId: null,
  budget: 500,
  happiness: 50,
  cleanliness: 50,
  taxRate: 'normal',
  activeProjects: [],
  completedProjectIds: [],
  isPlaying: false,
  isGameOver: false,
  isVictory: false,
  day: 1,
  activeNodes: [],
  activeEvent: null
};

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  const startGame = (region: Region) => {
    // Check for "Green Hero" badge in local storage
    const badges = JSON.parse(localStorage.getItem('green-turkey-badges') || '[]');
    const hasGreenHero = badges.includes('green-hero');
    const startBudget = hasGreenHero ? 1500 : 500;

    setGameState({
      ...INITIAL_STATE,
      budget: startBudget,
      regionId: region.id,
      isPlaying: true,
    });
  };

  const openEvent = (nodeId: string) => {
    const node = gameState.activeNodes.find(n => n.id === nodeId);
    if (!node) return;

    const event = EVENTS.find(e => e.id === node.eventId);
    if (event) {
      setGameState(prev => ({ ...prev, activeEvent: event }));
    }
  };

  const setTaxRate = (rate: TaxRate) => {
    setGameState(prev => ({ ...prev, taxRate: rate }));
  };

  const buyProject = (project: Project) => {
    if (gameState.budget < project.cost) return; // Should be handled in UI too

    setGameState(prev => ({
      ...prev,
      budget: prev.budget - project.cost,
      activeProjects: [
        ...prev.activeProjects,
        { ...project, daysRemaining: project.duration }
      ]
    }));
  };

  const handleChoice = (choiceIndex: number) => {
    if (!gameState.activeEvent) return;

    const choice = gameState.activeEvent.choices[choiceIndex];
    
    setGameState(prev => {
      let newBudget = prev.budget + (choice.effects.budget || 0);
      let newHappiness = prev.happiness + (choice.effects.happiness || 0);
      let newCleanliness = prev.cleanliness + (choice.effects.cleanliness || 0);

      newHappiness = Math.max(0, Math.min(100, newHappiness));
      newCleanliness = Math.max(0, Math.min(100, newCleanliness));

      return {
        ...prev,
        budget: newBudget,
        happiness: newHappiness,
        cleanliness: newCleanliness,
        activeEvent: null, 
      };
    });
  };

  const handleNodeClick = (nodeId: string) => {
      setGameState(prev => ({
          ...prev,
          activeNodes: prev.activeNodes.filter(n => n.id !== nodeId)
      }));
      openEvent(nodeId);
  }

  // Game Loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.activeEvent || gameState.isGameOver) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        let { 
          day, budget, happiness, cleanliness, 
          taxRate, activeProjects, completedProjectIds 
        } = prev;

        const newDay = day + 1;

        // 1. Apply Tax Effects
        let dailyBudgetChange = 0;
        let dailyHappinessChange = 0;

        if (taxRate === 'low') {
          dailyBudgetChange += 10;
          dailyHappinessChange += 1;
        } else if (taxRate === 'normal') {
          dailyBudgetChange += 30; // Increased slightly from 50 to balance
          dailyHappinessChange += 0;
        } else if (taxRate === 'high') {
          dailyBudgetChange += 80;
          dailyHappinessChange -= 1;
        }

        // 2. Apply Completed Project Passive Effects
        completedProjectIds.forEach(pId => {
          const proj = PROJECTS.find(p => p.id === pId);
          if (proj && proj.effects.budgetPerTurn) {
            dailyBudgetChange += proj.effects.budgetPerTurn;
          }
        });

        budget += dailyBudgetChange;
        happiness = Math.min(100, happiness + dailyHappinessChange);

        // 3. Process Active Projects
        const nextActiveProjects = [];
        const nextCompletedProjects = [...completedProjectIds];

        // We use a simple loop here. 
        // Note: In React state updates, it's better to not mutate, so we build new arrays.
        for (const p of activeProjects) {
            const remaining = p.daysRemaining - 1;
            if (remaining <= 0) {
                // Project Complete!
                nextCompletedProjects.push(p.id);
                // Apply Instant Effects
                if (p.effects.happiness) happiness += p.effects.happiness;
                if (p.effects.cleanliness) cleanliness += p.effects.cleanliness;
            } else {
                nextActiveProjects.push({ ...p, daysRemaining: remaining });
            }
        }
        
        happiness = Math.max(0, Math.min(100, happiness));
        cleanliness = Math.max(0, Math.min(100, cleanliness));

        // 4. Check End Game Conditions
        let isGameOver = false;
        let isVictory = false;

        if (budget <= 0 || happiness <= 0 || cleanliness <= 0) {
            isGameOver = true;
        } else if (happiness >= 100 && cleanliness >= 100) {
            isVictory = true;
            isGameOver = true;
        }

        // Check for Expired Nodes -> Game Over
        const hasExpiredNode = prev.activeNodes.some(n => n.expiresAt < newDay);
        if (hasExpiredNode) {
            isGameOver = true;
        }

        if (isGameOver) {
            // Save Score
            const currentHigh = parseInt(localStorage.getItem('green-turkey-highscore') || '0');
            if (newDay > currentHigh) {
                localStorage.setItem('green-turkey-highscore', newDay.toString());
            }

            // Unlock Badges
            const badges = JSON.parse(localStorage.getItem('green-turkey-badges') || '[]');
            if (newDay >= 30 && !badges.includes('bronze-mayor')) {
                badges.push('bronze-mayor');
            }
            if (newDay >= 100 && !badges.includes('green-hero')) {
                badges.push('green-hero');
            }
            localStorage.setItem('green-turkey-badges', JSON.stringify(badges));
        }

        // 5. Random Event Spawning
        const spawnChance = 0.3; 
        let newNodes = [...prev.activeNodes];
        
        if (!isGameOver && Math.random() < spawnChance && newNodes.length < 3) {
             const relevantEvents = EVENTS.filter(e => !e.regionId || e.regionId === prev.regionId);
             
             if (relevantEvents.length > 0) {
                 const randomEvent = relevantEvents[Math.floor(Math.random() * relevantEvents.length)];
                 const currentRegion = REGIONS.find(r => r.id === prev.regionId);
                 let spawnX = 50;
                 let spawnY = 50;
                 
                 if (currentRegion?.spawnPoints && currentRegion.spawnPoints.length > 0) {
                     const randomPoint = currentRegion.spawnPoints[Math.floor(Math.random() * currentRegion.spawnPoints.length)];
                     spawnX = randomPoint.x + (Math.random() * 5 - 2.5);
                     spawnY = randomPoint.y + (Math.random() * 5 - 2.5);
                 }

                 const newNode: EventNode = {
                     id: Math.random().toString(36).substr(2, 9),
                     eventId: randomEvent.id,
                     x: spawnX, 
                     y: spawnY,
                     expiresAt: newDay + 8 
                 };
                 newNodes.push(newNode);
             }
        }

        return {
          ...prev,
          day: newDay,
          budget,
          happiness,
          cleanliness,
          activeProjects: nextActiveProjects,
          completedProjectIds: nextCompletedProjects,
          activeNodes: newNodes,
          isPlaying: !isGameOver,
          isGameOver,
          isVictory
        };
      });
    }, 1000); 

    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.activeEvent, gameState.isGameOver]);

  const resetGame = () => {
    setGameState(INITIAL_STATE);
  };

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