import React, { useState, useEffect } from 'react';
import { Level, ContainerState } from '../types';
import Container from './Container';
import Modal from './Modal';
import { RotateCcw, Info, Droplets, Undo2, LogOut, Lightbulb, Lock, ChevronRight, Trash2, Music, Volume2, VolumeX } from 'lucide-react';

interface GameLevelProps {
  level: Level;
  onLevelComplete: () => void;
  onExit: () => void;
  audioSettings: { music: boolean; sfx: boolean };
  toggleMusic: () => void;
  toggleSfx: () => void;
  playRandomSfx: (type: 'transfer' | 'sink' | 'tap') => void;
  isMobile?: boolean;
}

const GameLevel: React.FC<GameLevelProps> = ({
  level,
  onLevelComplete,
  onExit,
  audioSettings,
  toggleMusic,
  toggleSfx,
  playRandomSfx,
  isMobile = false
}) => {
  const [containers, setContainers] = useState<ContainerState[]>([]);
  const [history, setHistory] = useState<ContainerState[][]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(true);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [revealedHintsCount, setRevealedHintsCount] = useState(0);
  const [isPouring, setIsPouring] = useState(false);

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
    setRevealedHintsCount(0);
  }, [level]);

  useEffect(() => {
    if (isPouring) return;
    const isWin = level.targets.every(target => {
      if (target.containerId === 'ANY') {
        return containers.some(c => c.currentAmount === target.amount);
      }
      const container = containers.find(c => c.id === target.containerId);
      return container && container.currentAmount === target.amount;
    });
    if (isWin && containers.length > 0) {
      setTimeout(() => setShowWinModal(true), 600);
    }
  }, [containers, level.targets, isPouring]);

  const handleContainerClick = (id: string) => {
    if (isPouring) return;

    if (selectedId === 'TAP') {
      fillFromTap(id);
      setSelectedId(null);
    } else if (selectedId === 'SINK') {
      emptyToSink(id);
      setSelectedId(null);
    } else if (selectedId === null) {
      setSelectedId(id);
    } else if (selectedId === id) {
      setSelectedId(null);
    } else if (selectedId !== 'TAP' && selectedId !== 'SINK') {
      pourLiquid(selectedId, id);
    }
  };

  const handleTapButtonClick = () => {
    if (isPouring) return;
    if (selectedId === 'TAP') {
      setSelectedId(null);
    } else if (selectedId !== null && selectedId !== 'SINK') {
      fillFromTap(selectedId);
      setSelectedId(null);
    } else {
      setSelectedId('TAP');
    }
  };

  const handleSinkButtonClick = () => {
    if (isPouring) return;
    if (selectedId === 'SINK') {
      setSelectedId(null);
    } else if (selectedId !== null && selectedId !== 'TAP') {
      emptyToSink(selectedId);
      setSelectedId(null);
    } else {
      setSelectedId('SINK');
    }
  };

  const pourLiquid = (fromId: string, toId: string) => {
    const fromContainer = containers.find(c => c.id === fromId);
    const toContainer = containers.find(c => c.id === toId);
    const toDef = level.containers.find(c => c.id === toId);
    if (!fromContainer || !toContainer || !toDef) return;
    
    const availableSpace = toDef.capacity - toContainer.currentAmount;
    if (availableSpace <= 0 || fromContainer.currentAmount === 0) {
      setSelectedId(null);
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
      }, 'transfer');
    }
    setSelectedId(null);
  };

  const fillFromTap = (toId: string) => {
    const toDef = level.containers.find(c => c.id === toId);
    const toContainer = containers.find(c => c.id === toId);
    if (!toDef || !toContainer || toContainer.currentAmount === toDef.capacity) return;
    
    performAction(() => containers.map(c => c.id === toId ? { ...c, currentAmount: toDef.capacity } : c), 'tap');
  };

  const emptyToSink = (fromId: string) => {
    const fromContainer = containers.find(c => c.id === fromId);
    if (!fromContainer || fromContainer.currentAmount === 0) return;
    
    performAction(() => containers.map(c => c.id === fromId ? { ...c, currentAmount: 0 } : c), 'sink');
  };

  const performAction = (getNewState: () => ContainerState[], soundType: 'transfer' | 'sink' | 'tap') => {
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(containers))]);
    setIsPouring(true);
    playRandomSfx(soundType);
    setContainers(getNewState());
    setTimeout(() => {
      setIsPouring(false);
    }, 600);
  };

  const handleUndo = () => {
    if (history.length === 0 || isPouring) return;
    setContainers(history[history.length - 1]);
    setHistory(prev => prev.slice(0, -1));
    setSelectedId(null);
  };

  const handleReset = () => {
    if (isPouring) return;
    setContainers(level.containers.map(c => ({ id: c.id, currentAmount: c.initialAmount })));
    setHistory([]);
    setSelectedId(null);
  };

  const selectedContainer = selectedId ? containers.find(c => c.id === selectedId) : null;
  const selectedDef = selectedId ? level.containers.find(c => c.id === selectedId) : null;
  const isTapSuggested = selectedContainer && selectedDef && selectedContainer.currentAmount < selectedDef.capacity;
  const isSinkSuggested = selectedContainer && selectedDef && selectedContainer.currentAmount > 0;

  return (
    <div className="flex flex-col h-screen bg-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <header className={`flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm z-[60] ${isMobile ? 'p-2 gap-2' : 'p-4'}`}>
        <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
          <button onClick={onExit} className={`hover:bg-red-100 rounded-full text-slate-600 transition-colors ${isMobile ? 'p-1.5' : 'p-2'}`}>
            <LogOut size={isMobile ? 20 : 24} />
          </button>
          <div className="flex flex-col">
            <h1 className={`font-bold text-slate-800 ${isMobile ? 'text-base' : 'text-xl'}`}>Уровень {level.id}</h1>
            {!isMobile && <span className="text-sm text-slate-500">{level.title}</span>}
          </div>
        </div>

        <div className={`flex ${isMobile ? 'gap-1' : 'gap-2'}`}>
          {/* Аудио Контролы */}
          <button onClick={toggleMusic} className={`rounded-full transition-colors ${audioSettings.music ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-400'} ${isMobile ? 'p-1.5' : 'p-2'}`}>
            {audioSettings.music ? <Music size={isMobile ? 16 : 20} /> : <Music size={isMobile ? 16 : 20} className="opacity-40" />}
          </button>
          <button onClick={toggleSfx} className={`rounded-full transition-colors ${audioSettings.sfx ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-400'} ${isMobile ? 'p-1.5' : 'p-2'}`}>
            {audioSettings.sfx ? <Volume2 size={isMobile ? 16 : 20} /> : <VolumeX size={isMobile ? 16 : 20} />}
          </button>

          {!isMobile && <div className="w-px h-8 bg-slate-200 mx-1"></div>}

          <button
            onClick={() => {
              setShowHintModal(true);
              if (revealedHintsCount === 0) setRevealedHintsCount(1);
            }}
            className={`flex items-center bg-amber-100 text-amber-700 rounded-full font-semibold hover:bg-amber-200 transition-colors ${isMobile ? 'p-1.5' : 'gap-2 px-4 py-2'}`}
          >
            <Lightbulb size={isMobile ? 16 : 20} />
            {!isMobile && <span className="hidden sm:inline">Подсказка</span>}
          </button>

          <button onClick={() => setShowGoalModal(true)} className={`bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors ${isMobile ? 'p-1.5' : 'p-2'}`}>
            <Info size={isMobile ? 16 : 20} />
          </button>

          <button onClick={handleUndo} disabled={history.length === 0} className={`rounded-full ${history.length === 0 ? 'bg-slate-200 text-slate-400' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'} ${isMobile ? 'p-1.5' : 'p-2'}`}>
            <Undo2 size={isMobile ? 16 : 20} />
          </button>

          <button onClick={handleReset} className={`bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 transition-colors ${isMobile ? 'p-1.5' : 'p-2'}`}>
            <RotateCcw size={isMobile ? 16 : 20} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative">
        {level.hasSinkAndTap && (
          <div className={`absolute flex flex-col items-center z-50 ${isMobile ? 'top-2 left-2 scale-75 origin-top-left' : 'top-12 left-12'}`}>
            <div className={`relative group transition-all duration-300 ${selectedId === 'TAP' ? 'scale-110 drop-shadow-2xl' : ''}`}>
              <div className="flex flex-col items-center">
                <div className={`${isMobile ? 'w-6 h-8' : 'w-8 h-10'} rounded-t-sm transition-colors ${selectedId === 'TAP' || isTapSuggested ? 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.6)]' : 'bg-slate-400'}`}></div>
                <div className={`${isMobile ? 'w-16 h-8 left-6' : 'w-24 h-10 left-8'} rounded-tr-[40px] relative transition-colors ${selectedId === 'TAP' || isTapSuggested ? 'bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.4)]' : 'bg-slate-400'}`}>
                  <div
                    onClick={(e) => { e.stopPropagation(); handleTapButtonClick(); }}
                    className={`absolute -top-4 left-0 ${isMobile ? 'w-8 h-3' : 'w-10 h-4'} rounded-full cursor-pointer transition-all shadow-md active:scale-95
                      ${selectedId === 'TAP' ? 'bg-blue-600 ring-2 ring-white' : isTapSuggested ? 'bg-blue-500 animate-pulse ring-2 ring-blue-300' : 'bg-slate-600 hover:bg-slate-700'}`}
                  ></div>
                  <div className={`absolute right-0 ${isMobile ? 'top-8 w-6 h-4' : 'top-10 w-8 h-6'} rounded-b-md transition-colors ${selectedId === 'TAP' || isTapSuggested ? 'bg-blue-400' : 'bg-slate-400'}`}></div>
                </div>
              </div>
              <button onClick={handleTapButtonClick} className={`absolute ${isMobile ? 'top-[3rem]' : 'top-[4.5rem]'} left-1/2 -translate-x-1/2 mt-4 flex flex-col items-center transition-all ${selectedId === 'TAP' || isTapSuggested ? 'scale-110 opacity-100' : 'opacity-80 scale-90'}`}>
                 <div className={`${isMobile ? 'p-3' : 'p-5'} rounded-full shadow-lg border-4 transition-all ${selectedId === 'TAP' || isTapSuggested ? 'bg-blue-500 border-white ring-4 ring-blue-200 animate-pulse' : 'bg-slate-400 border-slate-300'}`}>
                    <Droplets className="text-white" size={isMobile ? 24 : 36} />
                 </div>
                 <span className={`${isMobile ? 'text-[9px] px-2 py-0.5' : 'text-[11px] px-3 py-1'} font-black mt-2 uppercase tracking-wider rounded-full transition-colors whitespace-nowrap ${selectedId === 'TAP' ? 'bg-blue-600 text-white' : isTapSuggested ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                   {selectedId === 'TAP' ? 'ВЫБЕРИТЕ ТАРУ' : isTapSuggested ? 'ЗАПОЛНИТЬ?' : 'КРАН'}
                 </span>
              </button>
            </div>
          </div>
        )}

        <div className={`flex-1 flex items-center justify-center ${isMobile ? 'p-2' : 'p-8'}`}>
           <div className={`relative w-full bg-white/40 backdrop-blur-sm border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden flex items-center justify-center ${isMobile ? 'rounded-2xl min-h-[200px] max-w-full' : 'rounded-[40px] min-h-[450px] max-w-5xl'}`}>
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')]"></div>
              <div className={`flex flex-wrap items-end justify-center z-10 w-full relative ${isMobile ? 'gap-3 p-3' : 'gap-12 p-12'}`}>
                {level.containers.map(def => {
                  const state = containers.find(c => c.id === def.id);
                  return (
                    <Container
                      key={def.id}
                      def={def}
                      currentAmount={state?.currentAmount || 0}
                      isSelected={selectedId === def.id}
                      isSource={selectedId === def.id}
                      activeTool={selectedId === 'TAP' ? 'TAP' : selectedId === 'SINK' ? 'SINK' : 'NONE'}
                      onClick={() => handleContainerClick(def.id)}
                      isMobile={isMobile}
                    />
                  );
                })}
              </div>
           </div>
        </div>

        <div className={`w-full flex flex-col items-center transition-opacity duration-500 ${level.hasSinkAndTap ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="relative w-full flex flex-col items-center">
            <div className={`relative w-full bg-slate-200 border-x-8 border-t-8 shadow-inner flex items-center justify-center overflow-hidden transition-all duration-500 z-30 ${isMobile ? 'max-w-sm h-16 rounded-t-[50px]' : 'max-w-2xl h-32 rounded-t-[100px]'} ${selectedId === 'SINK' || isSinkSuggested ? 'border-red-400 bg-red-50 shadow-[inset_0_0_30px_rgba(248,113,113,0.15)]' : 'border-slate-300'}`}>
              <div className={`rounded-full blur-[2px] relative transition-colors ${isMobile ? 'w-10 h-5 mt-6' : 'w-16 h-8 mt-12'} ${isSinkSuggested ? 'bg-red-400/50' : 'bg-slate-400/50'}`}>
                <div className={`absolute inset-2 rounded-full ${isSinkSuggested ? 'bg-red-600/30' : 'bg-slate-600/30'}`}></div>
              </div>
            </div>
            <div className={`absolute flex justify-center w-full z-50 ${isMobile ? '-top-6' : '-top-10'}`}>
              <button onClick={handleSinkButtonClick} className={`rounded-full font-black tracking-tight transition-all duration-300 transform flex items-center ${isMobile ? 'px-4 py-2 text-sm gap-2' : 'px-10 py-4 text-lg gap-3'} ${selectedId === 'SINK' || isSinkSuggested ? 'bg-red-600 text-white shadow-[0_10px_0_0_rgba(153,27,27,1)] -translate-y-2 ring-4 ring-red-200 animate-pulse' : 'bg-slate-500 text-slate-100 hover:bg-slate-600 shadow-[0_6px_0_0_rgba(71,85,105,1)] active:translate-y-1 active:shadow-none'}`}>
                {selectedId === 'SINK' ? <><Trash2 size={isMobile ? 16 : 24} /> {isMobile ? 'ВЫБРАТЬ' : 'ВЫБЕРИТЕ ТАРУ'}</> : isSinkSuggested ? <><Trash2 size={isMobile ? 16 : 24} /> {isMobile ? 'СЛИТЬ?' : 'СЛИТЬ ВОДУ?'}</> : isMobile ? 'СЛИВ' : 'РАКОВИНА'}
              </button>
            </div>
            <div className={`w-full shadow-xl transition-colors ${isMobile ? 'h-4' : 'h-8'} ${isSinkSuggested ? 'bg-red-300' : 'bg-slate-400'} z-20`}></div>
          </div>
        </div>
      </main>

      <Modal title={`Уровень ${level.id}`} isOpen={showGoalModal} onClose={() => setShowGoalModal(false)}>
        <p className="mb-4">{level.description}</p>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-left">
          <h3 className="font-bold text-blue-800 mb-2 text-center">Цель:</h3>
          <ul className="list-disc list-inside space-y-1 text-blue-900">
            {level.targets.map((t, idx) => (
              <li key={idx}>{t.containerId === 'ANY' ? `Любая тара: ${t.amount} мл` : `${level.containers.find(c=>c.id===t.containerId)?.name}: ${t.amount} мл`}</li>
            ))}
          </ul>
        </div>
      </Modal>

      <Modal title="Победа!" isOpen={showWinModal} actions={
        <button onClick={onLevelComplete} className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-full shadow-lg">
          Далее
        </button>
      }>
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <p>Великолепно! Вы нашли решение.</p>
        </div>
      </Modal>

      {showHintModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Lightbulb /> Подсказки</h2>
              <button onClick={() => setShowHintModal(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><LogOut size={24} /></button>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50">
              {level.solutionSteps.map((step, idx) => (
                <div key={idx} className={`relative p-4 rounded-2xl border-2 transition-all duration-500 ${idx < revealedHintsCount ? 'bg-white border-amber-200 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60'}`}>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">{idx + 1}</span>
                    <h3 className="font-semibold text-slate-800">{idx < revealedHintsCount ? step.description : "Шаг скрыт"}</h3>
                  </div>
                  {idx < revealedHintsCount ? (
                    <div className="flex justify-center gap-4 pt-2">
                      {level.containers.map(cDef => {
                        const amt = step.amounts[cDef.id] || 0;
                        const pct = (amt / cDef.capacity) * 100;
                        return (
                          <div key={cDef.id} className="flex flex-col items-center">
                            <div className="relative w-12 h-20 border-2 border-slate-400 rounded-b-lg overflow-hidden bg-slate-200/30">
                              <div className="absolute bottom-0 w-full bg-blue-500/80 transition-all duration-1000" style={{ height: `${pct}%` }}></div>
                            </div>
                            <span className="text-[10px] mt-1 font-bold text-slate-600">{amt} мл</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : <div className="flex justify-center py-4"><Lock className="text-slate-400" /></div>}
                </div>
              ))}
            </div>
            <div className="p-6 bg-white border-t flex justify-center gap-4">
              <button disabled={revealedHintsCount >= level.solutionSteps.length} onClick={() => setRevealedHintsCount(prev => prev + 1)} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg transition-all ${revealedHintsCount >= level.solutionSteps.length ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg active:scale-95'}`}>
                Открыть еще один шаг <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLevel;