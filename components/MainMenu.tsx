import React from 'react';
import { PlayCircle, List, Sparkles, Music, Volume2, VolumeX } from 'lucide-react';

interface MainMenuProps {
  onStart: () => void;
  canContinue: boolean;
  onContinue: () => void;
  onOpenLevelSelect: () => void;
  currentLevelId: number;
  audioSettings: { music: boolean; sfx: boolean };
  toggleMusic: () => void;
  toggleSfx: () => void;
  isMobile?: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({
  onStart,
  canContinue,
  onContinue,
  onOpenLevelSelect,
  currentLevelId,
  audioSettings,
  toggleMusic,
  toggleSfx,
  isMobile = false
}) => {
  return (
    <div className={`min-h-screen bg-slate-100 flex items-center justify-center ${isMobile ? 'p-2' : 'p-4'}`}>
      {/* Декоративный фон */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      {/* Аудио Контролы */}
      <div className={`fixed flex z-50 ${isMobile ? 'top-2 right-2 gap-2' : 'top-6 right-6 gap-3'}`}>
        <button
          onClick={toggleMusic}
          className={`rounded-2xl shadow-lg border-2 transition-all active:scale-90 ${isMobile ? 'p-2' : 'p-3'} ${audioSettings.music ? 'bg-white border-blue-200 text-blue-500' : 'bg-slate-200 border-slate-300 text-slate-400'}`}
        >
          {audioSettings.music ? <Music size={isMobile ? 18 : 24} /> : <Music size={isMobile ? 18 : 24} className="opacity-40" />}
        </button>
        <button
          onClick={toggleSfx}
          className={`rounded-2xl shadow-lg border-2 transition-all active:scale-90 ${isMobile ? 'p-2' : 'p-3'} ${audioSettings.sfx ? 'bg-white border-yellow-200 text-yellow-500' : 'bg-slate-200 border-slate-300 text-slate-400'}`}
        >
          {audioSettings.sfx ? <Volume2 size={isMobile ? 18 : 24} /> : <VolumeX size={isMobile ? 18 : 24} />}
        </button>
      </div>

      <div className={`bg-white shadow-2xl w-full text-center relative z-10 border-8 border-white ${isMobile ? 'rounded-3xl p-4 max-w-lg flex flex-row items-center gap-6' : 'rounded-[50px] p-10 max-w-md'}`}>
        <div className={isMobile ? 'flex-shrink-0' : 'mb-10'}>
          <div className={`bg-blue-500 mx-auto flex items-center justify-center shadow-[0_15px_35px_rgba(59,130,246,0.4)] rotate-3 hover:rotate-0 transition-transform duration-500 ${isMobile ? 'w-16 h-16 rounded-2xl mb-2' : 'w-28 h-28 rounded-[35px] mb-6'}`}>
            <span className={isMobile ? 'text-3xl' : 'text-6xl'}>🧪</span>
          </div>
          {isMobile && (
            <h1 className="text-lg font-black text-slate-800 tracking-tight whitespace-nowrap">Жидкости</h1>
          )}
        </div>
        {!isMobile && (
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">Занимательные<br/>Жидкости</h1>
            <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-500 font-medium">Мастерство переливания</p>
          </div>
        )}

        <div className={`${isMobile ? 'flex-1 space-y-2' : 'space-y-4'}`}>
          {canContinue ? (
            <>
              <button
                onClick={(e) => { e.preventDefault(); onContinue(); }}
                className={`w-full group relative flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black shadow-[0_10px_25px_rgba(59,130,246,0.3)] transition-all active:scale-95 ${isMobile ? 'gap-2 py-2 text-base' : 'gap-4 py-5 text-xl'}`}
              >
                <PlayCircle size={isMobile ? 20 : 28} />
                Продолжить
                <div className={`absolute top-0 -translate-y-1/2 bg-yellow-400 text-yellow-950 rounded-full border-2 border-white shadow-sm ${isMobile ? 'right-2 text-[8px] px-1.5 py-0.5' : 'right-4 text-[10px] px-2 py-1'}`}>
                  УР. {currentLevelId}
                </div>
              </button>

              <button
                onClick={(e) => { e.preventDefault(); onOpenLevelSelect(); }}
                className={`w-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all active:scale-95 ${isMobile ? 'gap-2 py-2 text-sm' : 'gap-4 py-5 text-lg'}`}
              >
                <List size={isMobile ? 18 : 24} />
                {isMobile ? 'Уровни' : 'Выбрать уровень'}
              </button>

              <button
                onClick={(e) => { e.preventDefault(); onStart(); }}
                className={`w-full text-slate-400 hover:text-red-500 font-bold transition-all flex items-center justify-center gap-2 ${isMobile ? 'pt-1 text-xs' : 'pt-4 text-sm'}`}
              >
                {isMobile ? 'Заново' : 'Начать игру заново'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => { e.preventDefault(); onStart(); }}
                className={`w-full group relative flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black shadow-[0_10px_30px_rgba(59,130,246,0.4)] transition-all active:scale-95 animate-bounce-subtle ${isMobile ? 'gap-2 py-3 text-lg' : 'gap-4 py-6 text-2xl'}`}
              >
                <Sparkles size={isMobile ? 20 : 28} className="text-yellow-300" />
                {isMobile ? 'Играть' : 'Новая игра'}
              </button>

              <button
                onClick={(e) => { e.preventDefault(); onOpenLevelSelect(); }}
                className={`w-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-bold transition-all active:scale-95 ${isMobile ? 'gap-2 py-2 text-sm' : 'gap-4 py-4 text-lg'}`}
              >
                <List size={isMobile ? 18 : 24} />
                {isMobile ? 'Уровни' : 'Выбрать уровень'}
              </button>
            </>
          )}
        </div>

        {!isMobile && (
          <div className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Liquid Logic Puzzles • 2025
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MainMenu;