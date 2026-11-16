import { useState } from 'react';
import { useGame } from './hooks/useGame';
import { useQuestNotifications } from './hooks/useQuests';
import { useGameSfx } from './hooks/useGameSfx';
import { useLanguage } from './contexts/language-context';
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
import { MikeyHints } from './components/MikeyHints';
import { readMikeyMuted, writeMikeyMuted } from './utils/mikeyMute';
import { LetterModal } from './components/LetterModal';
import { DaySummary } from './components/DaySummary';
import { findCharacter } from './data/story';
import { getProvinceCentres } from './utils/geometry';
import type { Letter } from './types';
import { AlertCircle, Mail, Mic, MicOff, RotateCw, SkipForward, Volume2, VolumeX } from 'lucide-react';

function App() {
  const {
    gameState,
    startGame,
    handleChoice,
    dismissOutcome,
    handleNodeClick,
    resetGame,
    endDay,
    readLetter,
  } = useGame();

  useQuestNotifications();
  useGameSfx(gameState);
  const { lang, t } = useLanguage();

  const [muted, setMuted] = useState(sfx.isMuted());
  const [mikeyMuted, setMikeyMuted] = useState(readMikeyMuted);
  const [openLetter, setOpenLetter] = useState<Letter | null>(null);
  // The end-of-day screen shows once per finished day.
  const [summaryDismissed, setSummaryDismissed] = useState<number | null>(null);
  const showSummary = !!gameState.dayReport && gameState.dayReport.day !== summaryDismissed && !gameState.isGameOver;
  const openAndRead = (l: Letter) => { setOpenLetter(l); readLetter(l.id); };

  const { quests, toasts } = gameState;

  const currentCountry = getCountry(gameState.countryId);
  const currentRegion = getRegion(gameState.countryId, gameState.regionId);

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

      {/* End Day + Mute controls — bottom-center on mobile landscape (the
          actual play orientation) so they don't compete with the HUD for the
          cramped top strip; desktop keeps its original top-center placement. */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 mobile-landscape:top-auto mobile-landscape:bottom-2 mobile-landscape:gap-1.5">
        <button
          onClick={() => { sfx.click(); endDay(); }}
          data-hint="end-day"
          disabled={!!gameState.activeEvent}
          className="glass-panel !rounded-full px-4 py-2 flex items-center gap-2 text-white pointer-events-auto hover:bg-white/10 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none mobile-landscape:px-2.5 mobile-landscape:py-1.5"
        >
          <SkipForward className="w-4 h-4 text-emerald-400 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />
          <span className="text-sm font-bold mobile-landscape:text-xs">{t('app.controls.endDay')}</span>
        </button>
        <button
          onClick={() => { writeMikeyMuted(!mikeyMuted); setMikeyMuted(!mikeyMuted); }}
          title={mikeyMuted ? t('app.controls.mikeyOn') : t('app.controls.mikeyOff')}
          aria-label={mikeyMuted ? t('app.controls.mikeyOn') : t('app.controls.mikeyOff')}
          className="glass-panel !rounded-full p-2.5 flex items-center justify-center text-white pointer-events-auto hover:bg-white/10 transition-all active:scale-95 mobile-landscape:p-1.5"
        >
          {mikeyMuted ? <MicOff className="w-4 h-4 text-slate-400 mobile-landscape:w-3.5 mobile-landscape:h-3.5" /> : <Mic className="w-4 h-4 text-amber-400 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />}
        </button>
        <button
          onClick={() => setMuted(sfx.toggleMuted())}
          title={muted ? t('app.controls.unmute') : t('app.controls.mute')}
          className="glass-panel !rounded-full p-2.5 flex items-center justify-center text-white pointer-events-auto hover:bg-white/10 transition-all active:scale-95 max-sm:invisible mobile-landscape:p-1.5"
        >
          {muted ? <VolumeX className="w-4 h-4 text-slate-400 mobile-landscape:w-3.5 mobile-landscape:h-3.5" /> : <Volume2 className="w-4 h-4 text-emerald-400 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />}
        </button>
      </div>

      <MikeyHints state={gameState} muted={mikeyMuted} />

      {/* Goals Panel */}
      <QuestPanel quests={quests} toast={toasts[0] ?? null} />

      {/* Management Panel */}
      <ManagementPanel />

      {/* Main Game Area - Map & Nodes */}
      <div className="flex-1 relative w-full h-full flex items-center justify-center z-10">

        {/* Map Layer — the overlays go to CountryMap as children so they share the
            map's own aspect-locked box. Sizing them in a second wrapper offset every
            node and project coordinate against the SVG by the map's padding, by a
            different amount at every viewport size. */}
        <div className="absolute inset-0 transform scale-100 transition-transform duration-1000">
          <CountryMap
            provincePaths={currentCountry?.provincePaths ?? []}
            viewBoxWidth={currentCountry?.viewBoxWidth ?? 1000}
            viewBoxHeight={currentCountry?.viewBoxHeight ?? 422}
            selectedRegionId={gameState.regionId}
            interactive={false}
            cleanliness={gameState.cleanliness}
            showWildlife={currentCountry?.id === 'turkey'}
          >
            <ProjectSites />

            {/* Event Nodes Layer — colour, size and a number all scale with severity,
                so a fresh minor crisis reads differently from one about to erupt
                without the difference resting on colour alone. */}
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
                    aria-label={`${t('app.openCrisis')}: ${style.label} (${severity}/${TUNING.nodeMaxSeverity})`}
                    onClick={() => { sfx.click(); handleNodeClick(node.id); }}
                    data-hint="node"
                    data-severity={severity}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`
                    }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto transition-all duration-300 hover:scale-125 focus-visible:scale-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white z-50"
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

                    {/* Severity as a digit as well — size and colour alone are not
                        readable for colour-blind players, and the aria-label above
                        carries the same information for screen readers. */}
                    <span
                      aria-hidden="true"
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-950 border border-white/70 text-[10px] leading-[14px] font-black text-white text-center"
                    >
                      {severity}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Unread letters, each on the province it was sent from */}
            <div className="absolute inset-0 pointer-events-none">
              {gameState.letters.filter(l => !l.read).map(l => {
                const at = getProvinceCentres(gameState.countryId).get(findCharacter(l.characterId)?.province ?? '');
                if (!at) return null;
                return (
                  <button
                    key={l.id}
                    onClick={() => { sfx.click(); openAndRead(l); }}
                    data-hint="letter"
                    data-kind={l.kind}
                    aria-label={t('letter.open')}
                    title={t('letter.open')}
                    style={{ left: `${at.x}%`, top: `${at.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-full pointer-events-auto z-40 rounded-full bg-[#fbf7ea] text-[#2A2622] p-1.5 shadow-lg border-2 border-amber-300 hover:scale-110 transition-transform animate-fade-in"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </CountryMap>
        </div>
      </div>

      {/* Event Popup */}
      {gameState.activeEvent && (
        <EventModal
          event={gameState.activeEvent}
          onChoice={handleChoice}
          outcomeChoiceIndex={gameState.pendingOutcome?.choiceIndex ?? null}
          onContinue={dismissOutcome}
          budget={gameState.budget}
          happiness={gameState.happiness}
          cleanliness={gameState.cleanliness}
        />
      )}

      {showSummary && (
        <DaySummary
          state={gameState}
          onOpenLetter={openAndRead}
          onClose={() => setSummaryDismissed(gameState.dayReport?.day ?? null)}
        />
      )}

      {openLetter && <LetterModal letter={openLetter} onClose={() => setOpenLetter(null)} />}

      {/* Game Over / Victory Screen */}
      {gameState.isGameOver && (
        <GameOver state={gameState} onRestart={resetGame} />
      )}
    </div>
  );
}

export default App;
