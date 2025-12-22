import React from 'react';
import { Level } from '../types';
import { Lock, Play, ChevronLeft } from 'lucide-react';

interface LevelSelectProps {
  levels: Level[];
  maxReachedIndex: number;
  onSelect: (index: number) => void;
  onBack: () => void;
  isMobile?: boolean;
}

const LevelSelect: React.FC<LevelSelectProps> = ({ levels, maxReachedIndex, onSelect, onBack, isMobile = false }) => {
  return (
    <div className={`min-h-screen bg-slate-100 flex items-center justify-center ${isMobile ? 'p-2' : 'p-4'}`}>
      <div className={`bg-white shadow-2xl w-full transform transition-all duration-500 ${isMobile ? 'rounded-2xl p-3 max-w-full' : 'rounded-[40px] p-8 max-w-2xl'}`}>
        <div className={`flex items-center ${isMobile ? 'gap-2 mb-3' : 'gap-4 mb-8'}`}>
          <button
            onClick={onBack}
            className={`hover:bg-slate-100 rounded-full text-slate-600 transition-colors ${isMobile ? 'p-2' : 'p-3'}`}
          >
            <ChevronLeft size={isMobile ? 20 : 24} />
          </button>
          <h1 className={`font-black text-slate-800 ${isMobile ? 'text-lg' : 'text-3xl'}`}>{isMobile ? 'Уровни' : 'Выбор уровня'}</h1>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto' : 'grid-cols-2 sm:grid-cols-3 gap-4'}`}>
          {levels.map((level, index) => {
            const isLocked = index > maxReachedIndex;
            return (
              <button
                key={level.id}
                disabled={isLocked}
                onClick={() => onSelect(index)}
                className={`relative group rounded-2xl flex flex-col items-center justify-center transition-all border-4
                  ${isMobile ? 'h-16' : 'h-32 rounded-3xl'}
                  ${isLocked
                    ? 'bg-slate-50 border-slate-100 cursor-not-allowed'
                    : 'bg-white border-blue-100 hover:border-blue-400 hover:shadow-xl active:scale-95'
                  }`}
              >
                {isLocked ? (
                  <>
                    <Lock className="text-slate-300" size={isMobile ? 16 : 32} />
                    {!isMobile && <span className="text-slate-400 font-bold mt-2">Уровень {level.id}</span>}
                  </>
                ) : (
                  <>
                    <div className={`rounded-full bg-blue-500 text-white flex items-center justify-center font-black shadow-lg group-hover:scale-110 transition-transform ${isMobile ? 'w-8 h-8 text-sm' : 'w-10 h-10 mb-2'}`}>
                      {level.id}
                    </div>
                    {!isMobile && (
                      <span className="text-slate-700 font-bold px-2 text-center text-sm line-clamp-1">
                        {level.title}
                      </span>
                    )}
                    <Play className={`absolute text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity ${isMobile ? 'bottom-1 right-1' : 'bottom-3 right-3'}`} size={isMobile ? 12 : 16} />
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;