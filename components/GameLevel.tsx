import React, { useState, useEffect, useRef } from 'react';
import { Level, ContainerState, TargetState } from '../types';
import Container from './Container';
import Modal from './Modal';
import { RotateCcw, ArrowLeft, Info, Droplets, Undo2, LogOut } from 'lucide-react';

interface GameLevelProps {
  level: Level;
  onLevelComplete: () => void;
  onExit: () => void;
}

const GameLevel: React.FC<GameLevelProps> = ({ level, onLevelComplete, onExit }) => {
  // State
  const [containers, setContainers] = useState<ContainerState[]>([]);
  const [history, setHistory] = useState<ContainerState[][]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(true);
  const [showWinModal, setShowWinModal] = useState(false);
  const [isPouring, setIsPouring] = useState(false);

  // Audio Ref
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize level
  useEffect(() => {
    const initialStates = level.containers.map(c => ({
      id: c.id,
      currentAmount: c.initialAmount
    }));
    setContainers(initialStates);
    setHistory([]);
    setSelectedId(null);
    setShowGoalModal(true);
    setShowWinModal(false);
  }, [level]);

  // Check win condition
  useEffect(() => {
    if (isPouring) return; // Don't check while animating

    const isWin = level.targets.every(target => {
      if (target.containerId === 'ANY') {
        return containers.some(c => c.currentAmount === target.amount);
      }
      const container = containers.find(c => c.id === target.containerId);
      return container && container.currentAmount === target.amount;
    });

    if (isWin && containers.length > 0) {
      // Small delay for realism
      setTimeout(() => setShowWinModal(true), 600);
    }
  }, [containers, level.targets, isPouring]);

  // Audio helper
  const playPourSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed interaction required", e));
    }
  };

  const stopPourSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Actions
  const handleContainerClick = (id: string) => {
    if (isPouring) return;

    if (selectedId === null) {
      // Select source
      const container = containers.find(c => c.id === id);
      if (container && container.currentAmount > 0) {
        setSelectedId(id);
      }
    } else if (selectedId === id) {
      // Deselect
      setSelectedId(null);
    } else {
      // Pour from selectedId to id
      pourLiquid(selectedId, id);
    }
  };

  const pourLiquid = (fromId: string, toId: string) => {
    const fromContainer = containers.find(c => c.id === fromId);
    const toContainer = containers.find(c => c.id === toId);
    const toDef = level.containers.find(c => c.id === toId);

    if (!fromContainer || !toContainer || !toDef) return;

    const availableSpace = toDef.capacity - toContainer.currentAmount;
    if (availableSpace <= 0) {
      setSelectedId(null); // Cannot pour into full container
      return;
    }

    const amountToPour = Math.min(fromContainer.currentAmount, availableSpace);

    if (amountToPour > 0) {
      performAction(() => {
        return containers.map(c => {
          if (c.id === fromId) return { ...c, currentAmount: c.currentAmount - amountToPour };
          if (c.id === toId) return { ...c, currentAmount: c.currentAmount + amountToPour };
          return c;
        });
      });
    }
    setSelectedId(null);
  };

  const fillFromTap = (toId: string) => {
    if (isPouring) return;
    const toContainer = containers.find(c => c.id === toId);
    const toDef = level.containers.find(c => c.id === toId);
    if (!toContainer || !toDef || toContainer.currentAmount >= toDef.capacity) return;

    performAction(() => {
      return containers.map(c => {
        if (c.id === toId) return { ...c, currentAmount: toDef.capacity };
        return c;
      });
    });
  };

  const emptyToSink = (fromId: string) => {
    if (isPouring) return;
    const fromContainer = containers.find(c => c.id === fromId);
    if (!fromContainer || fromContainer.currentAmount === 0) return;

    performAction(() => {
      return containers.map(c => {
        if (c.id === fromId) return { ...c, currentAmount: 0 };
        return c;
      });
    });
  };

  const performAction = (getNewState: () => ContainerState[]) => {
    // Save history
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(containers))]);
    
    setIsPouring(true);
    playPourSound();
    
    const newState = getNewState();
    setContainers(newState);

    // Animation duration simulation
    setTimeout(() => {
      setIsPouring(false);
      stopPourSound();
    }, 600); // Sync with CSS transition
  };

  const handleUndo = () => {
    if (history.length === 0 || isPouring) return;
    const previousState = history[history.length - 1];
    setContainers(previousState);
    setHistory(prev => prev.slice(0, -1));
    setSelectedId(null);
  };

  const handleReset = () => {
    if(isPouring) return;
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(containers))]);
    const initialStates = level.containers.map(c => ({
      id: c.id,
      currentAmount: c.initialAmount
    }));
    setContainers(initialStates);
    setSelectedId(null);
  };

  const formatTargetDescription = (t: TargetState) => {
    const cName = t.containerId === 'ANY' 
      ? "любой таре" 
      : level.containers.find(c => c.id === t.containerId)?.name || "таре";
    return `${t.amount} мл в ${cName}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-100 to-blue-50 relative overflow-hidden">
      {/* Audio Element */}
      {/* TODO: Insert path to audio file here. Example: src="/assets/sounds/water_pour.mp3" */}
      <audio ref={audioRef} loop src="" className="hidden" />

      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-white/50 backdrop-blur-md shadow-sm z-20">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2 hover:bg-red-100 rounded-full text-slate-600 transition-colors" title="Выйти в меню">
            <LogOut size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-800">Уровень {level.id}</h1>
            <span className="text-sm text-slate-500">{level.title}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
           <button 
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold hover:bg-blue-200 transition-colors"
          >
            <Info size={20} />
            <span className="hidden sm:inline">Задание</span>
          </button>

          <button 
            onClick={handleUndo}
            disabled={history.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors
              ${history.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
          >
            <Undo2 size={20} />
            <span className="hidden sm:inline">Отмена</span>
          </button>
          
          <button 
            onClick={handleReset}
            className="p-2 bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 transition-colors"
            title="Заново"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      {/* Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative">
        
        {/* Environment - Tap */}
        {level.hasSinkAndTap && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
            {level.tapSpriteUrl ? (
              <button 
                onClick={() => selectedId ? fillFromTap(selectedId) : null}
                className={`transition-transform active:scale-95 ${selectedId ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
              >
                 <img 
                    src={level.tapSpriteUrl} 
                    alt="Кран" 
                    className={`w-32 h-auto object-contain drop-shadow-lg ${selectedId ? 'brightness-110 drop-shadow-xl' : ''}`}
                 />
                 {selectedId && <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-4 h-16 bg-blue-400/50 blur-md animate-pulse"></div>}
              </button>
            ) : (
              // Default CSS Tap
              <>
                <div className="bg-slate-300 w-4 h-16 rounded-full"></div>
                <button 
                  onClick={() => selectedId ? fillFromTap(selectedId) : null}
                  className={`bg-slate-400 p-3 rounded-full shadow-lg border-4 border-slate-200 transition-transform active:scale-95
                    ${selectedId ? 'ring-4 ring-green-400 animate-pulse cursor-pointer' : 'opacity-50 cursor-default'}`}
                >
                   <Droplets className="text-blue-600" size={32} />
                </button>
                <span className="mt-1 font-bold text-slate-500 text-sm">КРАН</span>
              </>
            )}
          </div>
        )}

        {/* Containers Row */}
        <div className="flex flex-wrap items-end justify-center gap-8 px-4 py-12 z-10 w-full max-w-6xl">
          {level.containers.map(def => {
            const state = containers.find(c => c.id === def.id);
            return (
              <Container 
                key={def.id}
                def={def}
                currentAmount={state?.currentAmount || 0}
                isSelected={selectedId === def.id}
                isSource={selectedId === def.id}
                onClick={() => handleContainerClick(def.id)}
              />
            );
          })}
        </div>

        {/* Environment - Sink */}
        {level.hasSinkAndTap && (
          <div className="absolute bottom-0 w-full flex items-end justify-center">
            {level.sinkSpriteUrl ? (
              <div 
                className="w-full h-48 flex items-end justify-center bg-no-repeat bg-bottom bg-contain"
                style={{ backgroundImage: `url(${level.sinkSpriteUrl})` }}
              >
                 <button 
                  onClick={() => selectedId ? emptyToSink(selectedId) : null}
                  className={`mb-4 px-6 py-2 rounded-full font-bold transition-all shadow-md
                    ${selectedId ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer' : 'bg-slate-400/50 text-white cursor-default'}`}
                >
                  ВЫЛИТЬ В РАКОВИНУ
                </button>
              </div>
            ) : (
              // Default CSS Sink
              <div className="w-full h-24 bg-slate-300 border-t-8 border-slate-400 flex items-center justify-center">
                <button 
                  onClick={() => selectedId ? emptyToSink(selectedId) : null}
                  className={`px-8 py-3 rounded-xl font-bold transition-all
                    ${selectedId ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg cursor-pointer transform hover:-translate-y-1' : 'bg-slate-400 text-slate-600 cursor-default'}`}
                >
                  ВЫЛИТЬ В РАКОВИНУ
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Goal Modal */}
      <Modal 
        title={`Уровень ${level.id}: ${level.title}`}
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
      >
        <p className="mb-4">{level.description}</p>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-800 mb-2">Цель:</h3>
          <ul className="list-disc list-inside space-y-1">
            {level.targets.map((t, idx) => (
              <li key={idx} className="text-blue-900">{formatTargetDescription(t)}</li>
            ))}
          </ul>
        </div>
      </Modal>

      {/* Win Modal */}
      <Modal 
        title="Поздравляем!" 
        isOpen={showWinModal}
        actions={
          <button 
            onClick={onLevelComplete}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-full shadow-lg transform transition-transform hover:scale-105"
          >
            Следующий уровень
          </button>
        }
      >
        <div className="flex flex-col items-center">
          <div className="text-6xl mb-4">🎉</div>
          <p>Вы успешно решили загадку!</p>
        </div>
      </Modal>

    </div>
  );
};

export default GameLevel;