import { TaxRate } from '../types/enums';
import type { Project, RegionModifiers } from '../types';

export const calculateDailyTax = (
    rate: TaxRate,
    activeProjects: string[],
    projects: Project[],
    modifiers?: RegionModifiers
) => {
    let dailyBudgetChange = 0;
    let dailyHappinessChange = 0;

    if (rate === TaxRate.LOW) {
        dailyBudgetChange += 5; // Decreased from 10
        dailyHappinessChange += 1;
    } else if (rate === TaxRate.NORMAL) {
        dailyBudgetChange += 15; // Decreased from 30
        dailyHappinessChange += 0;
    } else if (rate === TaxRate.HIGH) {
        dailyBudgetChange += 40; // Decreased from 80
        dailyHappinessChange -= 1;
    }

    // Apply Region Modifiers (Base Tax)
    if (modifiers?.budgetMultiplier) {
        dailyBudgetChange *= modifiers.budgetMultiplier;
    }

    // Apply Completed Project Passive Effects (Budget)
    activeProjects.forEach(pId => {
        const proj = projects.find(p => p.id === pId);
        if (proj && proj.effects.budgetPerTurn) {
            dailyBudgetChange += proj.effects.budgetPerTurn;
        }
    });

    return { dailyBudgetChange, dailyHappinessChange };
};

export const clampValue = (value: number, min: number = 0, max: number = 100) => {
    return Math.max(min, Math.min(max, value));
};
