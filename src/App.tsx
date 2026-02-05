import { useGame } from './hooks/useGame';
import { MainMenu } from './components/MainMenu';
import { GameHUD } from './components/GameHUD';
import { ManagementPanel } from './components/ManagementPanel';
import { EventModal } from './components/EventModal';
import { GameOver } from './components/GameOver';
import { TurkeyMap } from './components/TurkeyMap';
import { REGIONS } from './data/regions';
import { AlertCircle } from 'lucide-react';

function App() {
  const {
    gameState,
    startGame,
    handleChoice,
    gameState,
    handleChoice,
    handleNodeClick,
    resetGame,
  } = useGame();

  const currentRegion = REGIONS.find(r => r.id === gameState.regionId);

  // Determine Game Over reason
  let gameOverReason = "Acil duruma müdahale edilmedi! Kriz büyüdü."; // Default to timeout

  if (gameState.isVictory) {
    gameOverReason = "Başardın! Bölgen hem mutlu hem tertemiz!";
  } else if (gameState.isGameOver) {
    if (gameState.budget <= 0) gameOverReason = "Bölge İflas Etti!";
    else if (gameState.happiness <= 0) gameOverReason = "Halk Ayaklandı!";
    else if (gameState.cleanliness <= 0) gameOverReason = "Bölge Zehirli Atık Bölgesi İlan Edildi!";
  }

  // Seasons Logic
  // 0: Spring, 1: Summer, 2: Autumn, 3: Winter
  // Assuming 1 year = 120 days (30 days/season)
  const seasonIndex = Math.floor(gameState.day / 30) % 4;

  let seasonalClass = "";
  if (seasonIndex === 1) seasonalClass = "saturate-150 brightness-110"; // Summer
  if (seasonIndex === 2) seasonalClass = "sepia-[.3]"; // Autumn
  if (seasonIndex === 3) seasonalClass = "brightness-90 hue-rotate-15"; // Winter (Cold)

  if (!gameState.isPlaying && !gameState.isGameOver) {
    return <MainMenu onStart={startGame} />;
  }

  return (
    <div className={`relative h-full w-full bg-slate-950 overflow-hidden flex flex-col font-sans select-none transition-all duration-1000 ${seasonalClass}`}>

      {/* Tactical Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Deep Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]"></div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>

        {/* Subtle Corner Accents */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/5 blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 blur-[120px]"></div>

        {/* Winter Snow Effect (Simple CSS) */}
        {seasonIndex === 3 && (
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/snow.png')] animate-pulse"></div>
        )}
      </div>

      {/* HUD */}
      <GameHUD state={gameState} regionName={currentRegion?.name || 'Bilinmeyen Bölge'} />

      {/* Management Panel */}
      <ManagementPanel />

      {/* Main Game Area - Map & Nodes */}
      <div className="flex-1 relative w-full h-full flex items-center justify-center z-10">

        {/* Map Layer */}
        <div className="absolute inset-0 flex items-center justify-center p-4 transform scale-100 transition-transform duration-1000">
          {/* We wrap the map to control sizing */}
          <div className="w-full max-w-6xl aspect-[1000/422] relative">
            <TurkeyMap
              selectedRegionId={gameState.regionId}
              interactive={false}
              cleanliness={gameState.cleanliness}
            />

            {/* Event Nodes Layer */}
            <div className="absolute inset-0 pointer-events-none">
              {gameState.activeNodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto transition-all duration-300 hover:scale-125 z-50"
                >
                  {/* Pulse Effect */}
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75 duration-1000"></div>

                  {/* Icon */}
                  <div className="relative bg-gradient-to-br from-red-500 to-red-700 text-white p-2 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)] border-2 border-white/50">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Popup */}
      {gameState.activeEvent && (
        <EventModal event={gameState.activeEvent} onChoice={handleChoice} />
      )}

      {/* Game Over / Victory Screen */}
      {gameState.isGameOver && (
        <GameOver
          reason={gameOverReason}
          daysSurvived={gameState.day}
          onRestart={resetGame}
        />
      )}
    </div>
  );
}

export default App;
