import { useState, useEffect, useRef } from 'react';
import { useGame } from './hooks/useGame';
import { useQuestNotifications } from './hooks/useQuests';
import { useGameSfx } from './hooks/useGameSfx';
import { useLanguage } from './contexts/LanguageContext';
import { TUNING, getNodeSeverity } from './utils/gameLogic';
import { sfx } from './utils/sfx';
import { MainMenu } from './components/MainMenu';
import { GameHUD } from './components/GameHUD';
import { ManagementPanel } from './components/ManagementPanel';
import { EventModal } from './components/EventModal';
import { GameOver } from './components/GameOver';
import { QuestPanel } from './components/QuestPanel';
import { CountryMap } from './components/CountryMap';
import { TacticalBackground } from './components/TacticalBackground';
import { ProjectSites } from './components/ProjectSites';
import { getCountry, getRegion } from './data/countries';
import { AlertCircle, Pause, Play, RotateCw, Volume2, VolumeX } from 'lucide-react';

function App() {
  const {
    gameState,
    startGame,
    handleChoice,
    handleNodeClick,
    resetGame,
    setPaused,
  } = useGame();

  useQuestNotifications();
  useGameSfx(gameState);
  const { lang, t } = useLanguage();

  const [muted, setMuted] = useState(sfx.isMuted());

  // Auto-pause while the rotate-device prompt covers the screen (mobile portrait),
  // matching the CSS breakpoint used for that overlay below. Only resumes what we
  // paused ourselves, so a manual pause the player made survives a rotation.
  const autoPausedRef = useRef(false);
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return;
    const mql = window.matchMedia('(max-width: 639.98px) and (orientation: portrait)');
    const handle = (e: MediaQueryList | MediaQueryListEvent) => {
      if (e.matches) {
        if (!gameState.isPaused) {
          autoPausedRef.current = true;
          setPaused(true);
        }
      } else if (autoPausedRef.current) {
        autoPausedRef.current = false;
        setPaused(false);
      }
    };
    handle(mql);
    mql.addEventListener('change', handle);
    return () => mql.removeEventListener('change', handle);
  }, [gameState.isPlaying, gameState.isGameOver, gameState.isPaused, setPaused]);

  const { quests, questToast } = gameState;

  const currentCountry = getCountry(gameState.countryId);
  const currentRegion = getRegion(gameState.countryId, gameState.regionId);

  // Determine Game Over reason
  let gameOverReason = t('app.gameOver.regionUnmanageable');

  if (gameState.isVictory) {
    gameOverReason = t('app.gameOver.victory').replace('{days}', String(TUNING.sustainGoalDays));
  } else if (gameState.isGameOver) {
    if (gameState.budget <= 0) gameOverReason = t('app.gameOver.bankrupt');
    else if (gameState.happiness <= 0) gameOverReason = t('app.gameOver.uprising');
    else if (gameState.cleanliness <= 0) gameOverReason = t('app.gameOver.toxicWasteZone');
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

      {/* Rotate-device nudge — browsers that can't be orientation-locked (e.g. iOS Safari) need a manual prompt */}
      <div className="hidden max-sm:portrait:flex fixed inset-0 z-[100] flex-col items-center justify-center gap-4 bg-slate-950 text-center p-8">
        <RotateCw className="w-12 h-12 text-emerald-400 animate-pulse" />
        <p className="text-white font-bold text-lg">{t('app.rotateDevice')}</p>
      </div>

      <TacticalBackground>
        {/* Winter Snow Effect — CSS dot pattern, no external asset */}
        {seasonIndex === 3 && (
          <div
            className="absolute inset-0 opacity-20 animate-pulse"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>
        )}
      </TacticalBackground>

      {/* HUD */}
      <GameHUD state={gameState} regionName={currentRegion?.name[lang] || t('app.unknownRegion')} />

      {/* Pause/Resume + Mute controls — bottom-center on mobile landscape (the
          actual play orientation) so they don't compete with the HUD for the
          cramped top strip; desktop keeps its original top-center placement. */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 mobile-landscape:top-auto mobile-landscape:bottom-2 mobile-landscape:gap-1.5">
        <button
          onClick={() => { sfx.click(); setPaused(!gameState.isPaused); }}
          className="glass-panel !rounded-full px-4 py-2 flex items-center gap-2 text-white pointer-events-auto hover:bg-white/10 transition-all active:scale-95 mobile-landscape:px-2.5 mobile-landscape:py-1.5"
        >
          {gameState.isPaused ? <Play className="w-4 h-4 text-emerald-400 mobile-landscape:w-3.5 mobile-landscape:h-3.5" /> : <Pause className="w-4 h-4 text-amber-400 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />}
          <span className="text-sm font-bold mobile-landscape:text-xs">{gameState.isPaused ? t('app.controls.resume') : t('app.controls.pause')}</span>
        </button>
        <button
          onClick={() => setMuted(sfx.toggleMuted())}
          title={muted ? t('app.controls.unmute') : t('app.controls.mute')}
          className="glass-panel !rounded-full p-2.5 flex items-center justify-center text-white pointer-events-auto hover:bg-white/10 transition-all active:scale-95 max-sm:invisible mobile-landscape:p-1.5"
        >
          {muted ? <VolumeX className="w-4 h-4 text-slate-400 mobile-landscape:w-3.5 mobile-landscape:h-3.5" /> : <Volume2 className="w-4 h-4 text-emerald-400 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />}
        </button>
      </div>

      {/* Paused overlay — sits above the map but below the control panels */}
      {gameState.isPaused && !gameState.activeEvent && (
        <div className="absolute inset-0 z-[15] flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
          <div className="glass-panel px-10 py-8 text-center animate-fade-in">
            <Pause className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <p className="text-2xl font-black text-white tracking-wide">{t('app.paused.title')}</p>
            <p className="text-sm text-slate-400 mt-1">{t('app.paused.hint')}</p>
          </div>
        </div>
      )}

      {/* Goals Panel */}
      <QuestPanel quests={quests} toast={questToast} />

      {/* Management Panel */}
      <ManagementPanel />

      {/* Main Game Area - Map & Nodes */}
      <div className="flex-1 relative w-full h-full flex items-center justify-center z-10">

        {/* Map Layer */}
        <div className="absolute inset-0 flex items-center justify-center p-4 transform scale-100 transition-transform duration-1000" style={{ containerType: 'size' }}>
          {/* We wrap the map to control sizing. Sized via container query units, not
              aspect-ratio + max-w/max-h — see the matching comment in CountryMap.tsx
              for why that combo silently shrinks to the SVG's default intrinsic size. */}
          <div
            className="relative"
            style={{
              width: `min(100cqw, calc(100cqh * ${(currentCountry?.viewBoxWidth ?? 1000) / (currentCountry?.viewBoxHeight ?? 422)}))`,
              height: `min(100cqh, calc(100cqw / ${(currentCountry?.viewBoxWidth ?? 1000) / (currentCountry?.viewBoxHeight ?? 422)}))`,
            }}
          >
            <CountryMap
              provincePaths={currentCountry?.provincePaths ?? []}
              viewBoxWidth={currentCountry?.viewBoxWidth ?? 1000}
              viewBoxHeight={currentCountry?.viewBoxHeight ?? 422}
              selectedRegionId={gameState.regionId}
              interactive={false}
              cleanliness={gameState.cleanliness}
              showWildlife={currentCountry?.id === 'turkey'}
            />

            <ProjectSites />

            {/* Event Nodes Layer — colour & size scale with severity, so the player
                can tell a fresh minor crisis from one about to erupt at a glance. */}
            <div className="absolute inset-0 pointer-events-none">
              {gameState.activeNodes.map(node => {
                const severity = getNodeSeverity(node.spawnDay, gameState.day);
                const style = severity >= 3
                  ? { grad: 'from-red-500 to-red-700', ping: 'bg-red-500', glow: '0 0 18px rgba(220,38,38,0.7)', icon: 'w-6 h-6', pad: 'p-2', dur: '900ms', label: t('app.severity.critical') }
                  : severity === 2
                    ? { grad: 'from-orange-400 to-orange-600', ping: 'bg-orange-500', glow: '0 0 15px rgba(249,115,22,0.6)', icon: 'w-5 h-5', pad: 'p-2', dur: '1300ms', label: t('app.severity.growing') }
                    : { grad: 'from-amber-300 to-amber-500', ping: 'bg-amber-400', glow: '0 0 12px rgba(251,191,36,0.5)', icon: 'w-4 h-4', pad: 'p-1.5', dur: '1800ms', label: t('app.severity.new') };
                return (
                  <button
                    key={node.id}
                    title={style.label}
                    onClick={() => { sfx.click(); handleNodeClick(node.id); }}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`
                    }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto transition-all duration-300 hover:scale-125 z-50"
                  >
                    {/* Pulse Effect */}
                    <div className={`absolute inset-0 ${style.ping} rounded-full animate-ping opacity-75`} style={{ animationDuration: style.dur }}></div>

                    {/* Icon */}
                    <div
                      className={`relative bg-gradient-to-br ${style.grad} text-white ${style.pad} rounded-full border-2 border-white/50`}
                      style={{ boxShadow: style.glow }}
                    >
                      <AlertCircle className={style.icon} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Event Popup */}
      {gameState.activeEvent && (
        <EventModal
          event={gameState.activeEvent}
          onChoice={handleChoice}
          budget={gameState.budget}
          happiness={gameState.happiness}
          cleanliness={gameState.cleanliness}
        />
      )}

      {/* Game Over / Victory Screen */}
      {gameState.isGameOver && (
        <GameOver
          reason={gameOverReason}
          isVictory={gameState.isVictory}
          daysSurvived={gameState.day}
          onRestart={resetGame}
        />
      )}
    </div>
  );
}

export default App;
