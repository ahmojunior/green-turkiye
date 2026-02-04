interface GameOverProps {
  reason: string;
  daysSurvived: number;
  onRestart: () => void;
}

export function GameOver({ reason, daysSurvived, onRestart }: GameOverProps) {
  const isVictory = reason.includes("Başardın"); // Simple check based on localized string

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in">
        <h2 className={`text-4xl font-black mb-4 ${isVictory ? 'text-green-600' : 'text-red-600'}`}>
          {isVictory ? 'TEBRİKLER!' : 'OYUN BİTTİ'}
        </h2>
        
        <div className={`p-4 rounded-xl mb-6 ${isVictory ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
            <p className="text-xl text-gray-800 font-bold">{reason}</p>
        </div>

        <p className="text-gray-600 mb-8">
            <span className="font-bold text-black">{daysSurvived} gün</span> boyunca yönetimde kaldın.
        </p>
        
        <button 
          onClick={onRestart}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl w-full"
        >
          Tekrar Oyna
        </button>
      </div>
    </div>
  );
}