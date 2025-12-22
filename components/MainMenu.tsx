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
}

const MainMenu: React.FC<MainMenuProps> = ({
  onStart,
  canContinue,
  onContinue,
  onOpenLevelSelect,
  currentLevelId,
  audioSettings,
  toggleMusic,
  toggleSfx
}) => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Декоративный фон */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      {/* Аудио Контролы */}
      <div className="fixed top-6 right-6 flex gap-3 z-50">
        <button 
          onClick={toggleMusic}
          className={`p-3 rounded-2xl shadow-lg border-2 transition-all active:scale-90 ${audioSettings.music ? 'bg-white border-blue-200 text-blue-500' : 'bg-slate-200 border-slate-300 text-slate-400'}`}
        >
          {audioSettings.music ? <Music size={24} /> : <Music size={24} className="opacity-40" />}
        </button>
        <button 
          onClick={toggleSfx}
          className={`p-3 rounded-2xl shadow-lg border-2 transition-all active:scale-90 ${audioSettings.sfx ? 'bg-white border-yellow-200 text-yellow-500' : 'bg-slate-200 border-slate-300 text-slate-400'}`}
        >
          {audioSettings.sfx ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      <div className="bg-white rounded-[50px] shadow-2xl p-10 w-full max-w-md text-center relative z-10 border-8 border-white">
        <div className="mb-10">
          <div className="w-28 h-28 bg-blue-500 rounded-[35px] mx-auto mb-6 flex items-center justify-center shadow-[0_15px_35px_rgba(59,130,246,0.4)] rotate-3 hover:rotate-0 transition-transform duration-500">
            <span className="text-6xl">🧪</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">Занимательные<br/>Жидкости</h1>
          <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full mb-4"></div>
          <p className="text-slate-500 font-medium">Мастерство переливания</p>
        </div>

        <div className="space-y-4">
          {canContinue ? (
            <>
              <button 
                onClick={(e) => { e.preventDefault(); onContinue(); }}
                className="w-full group relative flex items-center justify-center gap-4 bg-blue-500 hover:bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-[0_10px_25px_rgba(59,130,246,0.3)] transition-all active:scale-95"
              >
                <PlayCircle size={28} />
                Продолжить
                <div className="absolute top-0 right-4 -translate-y-1/2 bg-yellow-400 text-yellow-950 text-[10px] px-2 py-1 rounded-full border-2 border-white shadow-sm">
                  УРОВЕНЬ {currentLevelId}
                </div>
              </button>

              <button 
                onClick={(e) => { e.preventDefault(); onOpenLevelSelect(); }}
                className="w-full flex items-center justify-center gap-4 bg-slate-100 hover:bg-slate-200 text-slate-700 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95"
              >
                <List size={24} />
                Выбрать уровень
              </button>

              <button 
                onClick={(e) => { e.preventDefault(); onStart(); }}
                className="w-full pt-4 text-slate-400 hover:text-red-500 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                Начать игру заново
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={(e) => { e.preventDefault(); onStart(); }}
                className="w-full group relative flex items-center justify-center gap-4 bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-2xl font-black text-2xl shadow-[0_10px_30px_rgba(59,130,246,0.4)] transition-all active:scale-95 animate-bounce-subtle"
              >
                <Sparkles size={28} className="text-yellow-300" />
                Новая игра
              </button>

              <button 
                onClick={(e) => { e.preventDefault(); onOpenLevelSelect(); }}
                className="w-full flex items-center justify-center gap-4 bg-slate-100 hover:bg-slate-200 text-slate-500 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95"
              >
                <List size={24} />
                Выбрать уровень
              </button>
            </>
          )}
        </div>

        <div className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-widest">
          Liquid Logic Puzzles • 2025
        </div>
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