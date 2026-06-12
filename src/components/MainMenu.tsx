import { useState } from 'react';
import type { Region } from '../types';
import { REGIONS } from '../data/regions';
import { TurkeyMap } from './TurkeyMap';
import { Map, ArrowRight, Play, HelpCircle, Users, X, Leaf } from 'lucide-react';

interface MainMenuProps {
  onStart: (region: Region) => void;
}

type MenuPhase = 'SPLASH' | 'REGION_SELECT' | 'HELP' | 'CREDITS';

export function MainMenu({ onStart }: MainMenuProps) {
  const [phase, setPhase] = useState<MenuPhase>('SPLASH');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [showWelcomePrompt, setShowWelcomePrompt] = useState(false);

  const handlePlayClick = () => {
    if (localStorage.getItem('greenTurkiye_hasPlayed')) {
      setPhase('REGION_SELECT');
    } else {
      setShowWelcomePrompt(true);
    }
  };

  const handleAcceptTutorial = () => {
    localStorage.setItem('greenTurkiye_hasPlayed', 'true');
    setShowWelcomePrompt(false);
    setPhase('HELP');
  };

  const handleDeclineTutorial = () => {
    localStorage.setItem('greenTurkiye_hasPlayed', 'true');
    setShowWelcomePrompt(false);
    setPhase('REGION_SELECT');
  };

  const selectedRegion = REGIONS.find(r => r.id === selectedRegionId);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 overflow-hidden relative">
      {/* Tactical Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        ></div>
        <div className="absolute top-0 left-0 w-80 h-80 bg-green-500/10 blur-[140px]"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[140px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 blur-[200px] rounded-full"></div>
      </div>

      {/* ===================== WELCOME PROMPT ===================== */}
      {showWelcomePrompt && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="glass-panel flex flex-col items-center gap-6 px-8 py-10 max-w-sm w-full text-center animate-slide-up border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
            <div className="bg-green-500/20 p-4 rounded-full mb-2">
              <Leaf className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Aramıza Hoş Geldin!</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Görünüşe göre burada ilk kez buradasın. Oyuna başlamadan önce nasıl oynandığını öğrenmek ister misin?
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleAcceptTutorial}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl py-3 transition-colors"
              >
                Evet, Göster!
              </button>
              <button
                onClick={handleDeclineTutorial}
                className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-xl py-3 border border-white/10 transition-colors"
              >
                Hayır, Kendim Keşfederim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SPLASH SCREEN ===================== */}
      {phase === 'SPLASH' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
          {/* Glassmorphism Container */}
          <div className="glass-panel flex flex-col items-center gap-8 px-10 py-12 max-w-md w-full animate-fade-in">
            {/* Logo */}
            <img
              src={import.meta.env.BASE_URL + 'logo.png'}
              alt="Yeşil Türkiye"
              className="w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-float"
            />

            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl font-black text-white tracking-tight mb-1">
                YEŞİL TÜRKİYE
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                Bölgeni seç, çevreyi koru, geleceği inşa et.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full mt-2">
              <button
                onClick={handlePlayClick}
                className="menu-btn menu-btn-primary"
              >
                <Play className="w-5 h-5" />
                Oyna
              </button>

              <button
                onClick={() => setPhase('HELP')}
                className="menu-btn menu-btn-secondary"
              >
                <HelpCircle className="w-5 h-5" />
                Nasıl Oynanır?
              </button>

              <button
                onClick={() => setPhase('CREDITS')}
                className="menu-btn menu-btn-secondary"
              >
                <Users className="w-5 h-5" />
                Hakkında
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== HELP MODAL ===================== */}
      {phase === 'HELP' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel max-w-2xl w-full max-h-[80vh] overflow-y-auto px-8 py-8 relative custom-scrollbar">
            <button
              onClick={() => setPhase('SPLASH')}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r text-white mb-6 border-b border-white/10 pb-4">
              Nasıl Oynanır?
            </h2>

            <div className="space-y-6 text-slate-300 text-sm leading-relaxed">

              {/* Bölüm 1: Hedef */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <span>🎯</span> Oyunun Hedefi
                </h3>
                <p>
                  Yönettiğiniz bölgede Bütçe, Halkın Mutluluğu ve Çevre Temizliği metriklerini dengeleyin. Tüm göstergeleri %80'in üzerinde tutarak "Yeşil Kahraman" statüsüne ulaşmak temel amacınızdır.
                </p>
              </section>

              {/* Bölüm 2: Mekanikler */}
              <section className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex gap-3">
                  <span className="text-xl">🗺️</span>
                  <div>
                    <strong className="text-white block mb-1">Bölge Yönetimi</strong>
                    Harita üzerinden bir bölge seçerek yönetime başlayın. Her bölgenin anlık istatistiklerini sol panelden takip edebilirsiniz.
                    <img
                      src={import.meta.env.BASE_URL + 'region_preview.gif'}
                      alt="Bölge Yönetimi Önizleme"
                      className="mt-3 w-full max-w-sm rounded-xl border border-white/10 shadow-lg object-cover"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-xl">⚖️</span>
                  <div>
                    <strong className="text-white block mb-1">Ekonomi ve Yatırımlar</strong>
                    Bütçe oluşturmak için vergi oranlarını belirleyin. Yüksek vergilerin halkın mutluluğunu düşüreceğini unutmayın. Elde ettiğiniz gelirleri çevre projelerine (geri dönüşüm, yenilenebilir enerji) aktararak gelişimi hızlandırın.
                    <img
                      src={import.meta.env.BASE_URL + 'tax_preview.gif'}
                      alt="Ekonomi ve Yatırımlar Önizleme"
                      className="mt-3 w-full max-w-sm rounded-xl border border-white/10 shadow-lg object-cover"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-xl">🚨</span>
                  <div>
                    <strong className="text-white block mb-1">Kriz Müdahalesi</strong>
                    Haritada beliren kırmızı uyarı ikonları acil durumları (fabrika sızıntısı, yangın vb.) belirtir. Çevresel felaketleri önlemek için bu krizlere anında bütçe ayırarak müdahale edin.
                    <img
                      src={import.meta.env.BASE_URL + 'crisis_preview.gif'}
                      alt="Kriz Müdahalesi Önizleme"
                      className="mt-3 w-full max-w-sm rounded-xl border border-white/10 shadow-lg object-cover"
                    />
                  </div>
                </div>
              </section>

              {/* Bölüm 3: Strateji İpuçları */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <span>💡</span> Strateji İpuçları
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Acil durum krizlerine anında müdahale edebilmek için kasanızda her zaman yedek bütçe bulundurun.</li>
                  <li>Vergi artışlarından kaynaklanan memnuniyetsizliği, yeni çevre projeleri inşa ederek dengeleyin.</li>
                  <li>Üst paneldeki ilerleme çubuklarını sürekli izleyin ve kritik seviyeye yaklaşan metrikleri önceliklendirin.</li>
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
              onClick={() => setPhase('SPLASH')}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-4">Hakkında</h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong>Yeşil Türkiye</strong>, çevre bilincini artırmayı amaçlayan
                eğitici bir strateji oyunudur.
              </p>
              <p>
                Oyuncu olarak bir bölgenin yönetimini üstlenir, çevre politikaları
                belirler ve doğal afetlerle mücadele edersiniz.
              </p>
              <p>
                Oyun şu an geliştirme sürecindedir. Oyuna katkı sağlamak isterseniz, oyunun <a href="https://github.com/ahmojunior/green-turkiye" target="_blank" rel="noopener noreferrer" style={{ color: 'DodgerBlue', textDecorationLine: 'underline' }}>GitHub deposuna</a> göz atabilirsiniz.
              </p>
              <hr className="border-white/10 my-3" />
              <p className="text-slate-400 text-xs">
                Tasarım &amp; Geliştirme — <a href="https://github.com/ahmojunior" target="_blank" rel="noopener noreferrer" style={{ textDecorationLine: 'underline' }}>ahmocodes</a> / <a href="https://github.com/SirAtilotty" target="_blank" rel="noopener noreferrer" style={{ textDecorationLine: 'underline' }}>SirAtilotty</a>
              </p>
              <p className="text-slate-500 text-xs">v0.2 • 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* ===================== REGION SELECT ===================== */}
      {(phase === 'REGION_SELECT') && (
        <>
          {/* Back Button */}
          <div className="absolute top-6 left-6 z-30">
            <button
              onClick={() => { setPhase('SPLASH'); setSelectedRegionId(null); }}
              className="menu-btn menu-btn-secondary !px-4 !py-2 text-sm"
            >
              ← Geri
            </button>
          </div>

          {/* Map Area — centered */}
          <div className="flex-1 relative flex items-center justify-center z-10">
            <TurkeyMap
              onRegionSelect={setSelectedRegionId}
              selectedRegionId={selectedRegionId}
            />

            {/* Helper Text */}
            {!selectedRegionId && (
              <div className="absolute bottom-10 animate-bounce text-gray-400 font-medium">
                Başlamak için haritadan bir bölge seçin
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
                    <h3 className="text-3xl font-bold text-white">{selectedRegion.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ml-2 ${selectedRegion.difficulty === 'Kolay'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : selectedRegion.difficulty === 'Orta'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                    >
                      {selectedRegion.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {selectedRegion.description}
                  </p>
                </div>

                <button
                  onClick={() => onStart(selectedRegion)}
                  className="group flex items-center gap-3 menu-btn menu-btn-primary !px-8 !py-4 !text-xl min-w-[200px] justify-center"
                >
                  Oyunu Başlat
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