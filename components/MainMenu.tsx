import React from 'react';
import { Play, PlayCircle } from 'lucide-react';

interface MainMenuProps {
  onStart: () => void;
  canContinue: boolean;
  onContinue: () => void;
  currentLevelId: number;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, canContinue, onContinue, currentLevelId }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center transform transition-all hover:scale-105 duration-500">
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-5xl">🧪</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Занимательные<br/>Жидкости</h1>
          <p className="text-slate-500">Головоломки на переливание</p>
        </div>

        <div className="space-y-4">
          {canContinue && (
            <button 
              onClick={onContinue}
              className="w-full group relative flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95"
            >
              <PlayCircle size={24} />
              Продолжить (Уровень {currentLevelId})
              <div className="absolute inset-0 rounded-xl ring-2 ring-white/30 group-hover:ring-4 transition-all"></div>
            </button>
          )}

          <button 
            onClick={onStart}
            className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95"
          >
            <Play size={24} />
            {canContinue ? "Начать заново" : "Новая игра"}
          </button>
        </div>

        <div className="mt-8 text-xs text-slate-400">
          Версия 1.0.0
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
