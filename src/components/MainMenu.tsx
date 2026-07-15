import { useState } from 'react';
import type { Country, Region } from '../types';
import { COUNTRIES } from '../data/countries';
import { TUNING } from '../utils/gameLogic';
import { CountryMap } from './CountryMap';
import { TacticalBackground } from './TacticalBackground';
import { Map, ArrowLeft, ArrowRight, Play, HelpCircle, Users, X, Leaf, Target, AlertTriangle, Scale, Siren, Lightbulb } from 'lucide-react';
import { sfx } from '../utils/sfx';
import { useLanguage } from '../contexts/LanguageContext';

interface MainMenuProps {
  onStart: (country: Country, region: Region) => void;
}

type MenuPhase = 'SPLASH' | 'COUNTRY_SELECT' | 'REGION_SELECT' | 'HELP' | 'CREDITS';

const LANGUAGES: { code: 'tr' | 'en' | 'de'; label: string }[] = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
];

export function MainMenu({ onStart }: MainMenuProps) {
  const [phase, setPhase] = useState<MenuPhase>('SPLASH');
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [showWelcomePrompt, setShowWelcomePrompt] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const handlePlayClick = () => {
    sfx.menuConfirm();
    if (localStorage.getItem('greenTurkiye_hasPlayed')) {
      setPhase('COUNTRY_SELECT');
    } else {
      setShowWelcomePrompt(true);
    }
  };

  const handleAcceptTutorial = () => {
    sfx.menuClick();
    localStorage.setItem('greenTurkiye_hasPlayed', 'true');
    setShowWelcomePrompt(false);
    setPhase('HELP');
  };

  const handleDeclineTutorial = () => {
    sfx.menuClick();
    localStorage.setItem('greenTurkiye_hasPlayed', 'true');
    setShowWelcomePrompt(false);
    setPhase('COUNTRY_SELECT');
  };

  const handleCountrySelect = (countryId: string) => {
    sfx.menuClick();
    setSelectedCountryId(countryId);
    setSelectedRegionId(null);
    setPhase('REGION_SELECT');
  };

  const selectedCountry = COUNTRIES.find(c => c.id === selectedCountryId);
  const selectedRegion = selectedCountry?.regions.find(r => r.id === selectedRegionId);
  const langIndex = LANGUAGES.findIndex(l => l.code === lang);

  // The goal paragraph interleaves plain text with <strong> emphasis, so split
  // the translated template on its placeholder tokens (they appear in the same
  // order in both languages) and re-insert the emphasized fragments as JSX.
  const goalParts = t('menu.help.goalBody1').split(/\{budget\}|\{happiness\}|\{cleanliness\}|\{highlight\}/);
  const goalHighlight = t('menu.help.goalHighlight')
    .replace('{threshold}', String(TUNING.sustainThreshold))
    .replace('{days}', String(TUNING.sustainGoalDays));

  const tip3Parts = t('menu.help.tip3')
    .replace('{threshold}', String(TUNING.sustainThreshold))
    .replace('{days}', String(TUNING.sustainGoalDays))
    .split(/\{stability\}/);
  const creditsP1Parts = t('menu.credits.p1').split(/\{name\}/);
  const creditsP3Parts = t('menu.credits.p3').split(/\{link\}/);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 overflow-hidden relative">
      <TacticalBackground />

      {/* ===================== WELCOME PROMPT ===================== */}
      {showWelcomePrompt && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="glass-panel flex flex-col items-center gap-6 px-8 py-10 max-w-sm w-full text-center animate-slide-up border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
            <div className="bg-green-500/20 p-4 rounded-full mb-2">
              <Leaf className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{t('menu.welcome.title')}</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t('menu.welcome.body')}
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleAcceptTutorial}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl py-3 transition-colors"
              >
                {t('menu.welcome.yes')}
              </button>
              <button
                onClick={handleDeclineTutorial}
                className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-xl py-3 border border-white/10 transition-colors"
              >
                {t('menu.welcome.no')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SPLASH SCREEN ===================== */}
      {phase === 'SPLASH' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
          {/* Glassmorphism Container */}
          <div className="glass-panel flex flex-col items-center gap-8 px-8 py-12 max-w-lg w-full animate-fade-in">
            {/* Logo */}
            <img
              src={import.meta.env.BASE_URL + 'logo.png'}
              alt={t('menu.logoAlt')}
              className="w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-float"
            />

            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl font-black text-white tracking-tight mb-1">
                {t('menu.title')}
              </h1>
              <p className="text-slate-400 text-sm font-medium whitespace-nowrap">
                {t('menu.tagline')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full mt-2">
              <button
                onClick={handlePlayClick}
                className="menu-btn menu-btn-primary"
              >
                <Play className="w-5 h-5" />
                {t('menu.play')}
              </button>

              <button
                onClick={() => { sfx.menuClick(); setPhase('HELP'); }}
                className="menu-btn menu-btn-secondary"
              >
                <HelpCircle className="w-5 h-5" />
                {t('menu.howToPlay')}
              </button>

              <button
                onClick={() => { sfx.menuClick(); setPhase('CREDITS'); }}
                className="menu-btn menu-btn-secondary"
              >
                <Users className="w-5 h-5" />
                {t('menu.about')}
              </button>
            </div>

            {/* Language Slider */}
            <div className="relative flex w-full max-w-[220px] bg-white/5 border border-white/10 rounded-full p-1">
              <div
                className="absolute inset-y-1 left-1 rounded-full bg-white/15 transition-transform duration-300 ease-out"
                style={{ width: 'calc((100% - 8px) / 3)', transform: `translateX(${langIndex * 100}%)` }}
              />
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { sfx.menuClick(); setLang(l.code); }}
                  className={`relative z-10 flex-1 py-1.5 text-sm font-bold rounded-full transition-colors ${lang === l.code ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== HELP MODAL ===================== */}
      {phase === 'HELP' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel max-w-2xl w-full max-h-[80vh] overflow-y-auto px-8 py-8 relative custom-scrollbar">
            <button
              onClick={() => { sfx.menuClick(); setPhase('SPLASH'); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              {t('menu.howToPlay')}
            </h2>

            <div className="space-y-6 text-slate-300 text-sm leading-relaxed">

              {/* Section 1: Goal */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" /> {t('menu.help.goalTitle')}
                </h3>
                <p>
                  {goalParts[0]}
                  <strong className="text-white">{t('menu.help.goalBudget')}</strong>
                  {goalParts[1]}
                  <strong className="text-white">{t('menu.help.goalHappiness')}</strong>
                  {goalParts[2]}
                  <strong className="text-white">{t('menu.help.goalCleanliness')}</strong>
                  {goalParts[3]}
                  <strong className="text-emerald-400">{goalHighlight}</strong>
                  {goalParts[4]}
                </p>
                <p className="mt-2 text-amber-300/90 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{t('menu.help.warning')}</span>
                </p>
              </section>

              {/* Section 2: Mechanics */}
              <section className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex gap-3">
                  <Map className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block mb-1">{t('menu.help.regionMgmtTitle')}</strong>
                    {t('menu.help.regionMgmtBody')}
                    <img
                      src={import.meta.env.BASE_URL + 'region_preview.gif'}
                      alt={t('menu.help.regionMgmtImgAlt')}
                      className="mt-3 w-full max-w-sm rounded-xl border border-white/10 shadow-lg object-cover"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Scale className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block mb-1">{t('menu.help.economyTitle')}</strong>
                    {t('menu.help.economyBody')}
                    <img
                      src={import.meta.env.BASE_URL + 'tax_preview.gif'}
                      alt={t('menu.help.economyImgAlt')}
                      className="mt-3 w-full max-w-sm rounded-xl border border-white/10 shadow-lg object-cover"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Siren className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block mb-1">{t('menu.help.crisisTitle')}</strong>
                    {t('menu.help.crisisBody')}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400"></span> {t('menu.help.crisisNew')}</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500"></span> {t('menu.help.crisisGrowing')}</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> {t('menu.help.crisisCritical')}</span>
                    </div>
                    <img
                      src={import.meta.env.BASE_URL + 'crisis_preview.gif'}
                      alt={t('menu.help.crisisImgAlt')}
                      className="mt-3 w-full max-w-sm rounded-xl border border-white/10 shadow-lg object-cover"
                    />
                  </div>
                </div>
              </section>

              {/* Section 3: Strategy Tips */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-emerald-400" /> {t('menu.help.tipsTitle')}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>{t('menu.help.tip1')}</li>
                  <li>{t('menu.help.tip2')}</li>
                  <li>
                    {tip3Parts[0]}
                    <strong className="text-slate-300">{t('menu.help.tip3Stability')}</strong>
                    {tip3Parts[1]}
                  </li>
                  <li>{t('menu.help.tip4')}</li>
                  <li>{t('menu.help.tip5')}</li>
                </ul>
              </section>

            </div>
          </div>
        </div>
      )}

      {/* ===================== CREDITS MODAL ===================== */}
      {phase === 'CREDITS' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel max-w-lg w-full px-8 py-8 relative">
            <button
              onClick={() => { sfx.menuClick(); setPhase('SPLASH'); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-4">{t('menu.credits.title')}</h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>{t('menu.credits.name')}</strong>{t('menu.credits.akaNote')}{creditsP1Parts[1]}
              </p>
              <p>
                {t('menu.credits.p2')}
              </p>
              <p>
                {creditsP3Parts[0]}
                <a href="https://github.com/ahmojunior/green-turkiye" target="_blank" rel="noopener noreferrer" style={{ color: 'DodgerBlue', textDecorationLine: 'underline' }}>{t('menu.credits.githubRepo')}</a>
                {creditsP3Parts[1]}
              </p>
              <hr className="border-white/10 my-3" />
              <p className="text-slate-400 text-xs">
                {t('menu.credits.designDev')} <a href="https://github.com/ahmojunior" target="_blank" rel="noopener noreferrer" style={{ textDecorationLine: 'underline' }}>ahmocodes</a> / <a href="https://github.com/SirAtilotty" target="_blank" rel="noopener noreferrer" style={{ textDecorationLine: 'underline' }}>SirAtilotty</a>
              </p>
              <p className="text-slate-500 text-xs">v0.2 • 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* ===================== COUNTRY SELECT ===================== */}
      {phase === 'COUNTRY_SELECT' && (
        <>
          {/* Back Button */}
          <div className="absolute top-6 left-6 z-30">
            <button
              onClick={() => { sfx.menuClick(); setPhase('SPLASH'); }}
              className="menu-btn menu-btn-secondary !px-4 !py-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> {t('menu.back')}
            </button>
          </div>

          <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
            <div className="glass-panel flex flex-col items-center gap-6 px-8 py-10 max-w-lg w-full animate-fade-in">
              <h2 className="text-2xl font-bold text-white">{t('menu.countrySelect.title')}</h2>
              <div className="grid grid-cols-2 gap-4 w-full">
                {COUNTRIES.map(country => (
                  <button
                    key={country.id}
                    onClick={() => handleCountrySelect(country.id)}
                    className="flex flex-col items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-6 transition-colors cursor-pointer"
                  >
                    <img
                      src={import.meta.env.BASE_URL + country.icon}
                      alt={country.name[lang]}
                      className="w-12 h-12 object-contain rounded-full shadow-lg"
                    />
                    <span className="text-white font-bold">{country.name[lang]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===================== REGION SELECT ===================== */}
      {(phase === 'REGION_SELECT') && selectedCountry && (
        <>
          {/* Back Button */}
          <div className="absolute top-6 left-6 z-30">
            <button
              onClick={() => { sfx.menuClick(); setPhase('COUNTRY_SELECT'); setSelectedRegionId(null); }}
              className="menu-btn menu-btn-secondary !px-4 !py-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> {t('menu.back')}
            </button>
          </div>

          {/* Map Area — centered */}
          <div className="flex-1 relative flex items-center justify-center z-10">
            <CountryMap
              provincePaths={selectedCountry.provincePaths}
              viewBoxWidth={selectedCountry.viewBoxWidth}
              viewBoxHeight={selectedCountry.viewBoxHeight}
              onRegionSelect={(id) => { sfx.menuClick(); setSelectedRegionId(id); }}
              selectedRegionId={selectedRegionId}
            />

            {/* Helper Text */}
            {!selectedRegionId && (
              <div className="absolute bottom-10 animate-bounce text-gray-400 font-medium">
                {t('menu.selectRegionHint')}
              </div>
            )}
          </div>

          {/* Selected Region Info Panel */}
          {selectedRegion && (
            <div className="absolute bottom-0 left-0 w-full glass-panel !rounded-none !rounded-t-2xl p-8 z-50 animate-slide-up">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Map className="w-6 h-6 text-green-400" />
                    <h3 className="text-3xl font-bold text-white">{selectedRegion.name[lang]}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ml-2 ${selectedRegion.difficulty === 'Kolay'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : selectedRegion.difficulty === 'Orta'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                    >
                      {t(`difficulty.${selectedRegion.difficulty}`)}
                    </span>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {selectedRegion.description[lang]}
                  </p>
                </div>

                <button
                  onClick={() => { sfx.menuConfirm(); onStart(selectedCountry, selectedRegion); }}
                  className="group flex items-center gap-3 menu-btn menu-btn-primary !px-8 !py-4 !text-xl min-w-[200px] justify-center"
                >
                  {t('menu.startGame')}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
