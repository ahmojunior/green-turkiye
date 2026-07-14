import type { ReactNode } from 'react';

interface TacticalBackgroundProps {
  children?: ReactNode; // extra decoration layered on top (e.g. winter snow)
}

export function TacticalBackground({ children }: TacticalBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]"></div>
      {children}
    </div>
  );
}
