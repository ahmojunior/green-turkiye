// Budget values are stored in millions. Below 1000M, show as "980M";
// at 1000M and above, switch to billions with up to one decimal, e.g. "1.4B".
export function formatBudget(valueInMillions: number): string {
  const rounded = Math.round(valueInMillions);
  if (Math.abs(rounded) < 1000) {
    return `${rounded}M`;
  }
  const billions = rounded / 1000;
  const formatted = billions.toFixed(1).replace(/\.0$/, '');
  return `${formatted}B`;
}
