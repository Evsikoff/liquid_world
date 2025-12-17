import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import GameLevel from './components/GameLevel';
import { LEVELS } from './constants';

const STORAGE_KEY = 'liquid_puzzle_progress';

const App: React.FC = () => {
  const [view, setView] = useState<'menu' | 'game'>('menu');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  // Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const levelId = parseInt(saved, 10);
      // Ensure level exists (in case levels array changed)
      const index = LEVELS.findIndex(l => l.id === levelId);
      if (index !== -1) {
        setCurrentLevelIndex(index);
      }
    }
  }, []);

  const saveProgress = (index: number) => {
    const levelId = LEVELS[index].id;
    localStorage.setItem(STORAGE_KEY, levelId.toString());
  };

  const handleStartNewGame = () => {
    setCurrentLevelIndex(0);
    saveProgress(0);
    setView('game');
  };

  const handleContinue = () => {
    setView('game');
  };

  const handleLevelComplete = () => {
    const nextIndex = currentLevelIndex + 1;
    if (nextIndex < LEVELS.length) {
      setCurrentLevelIndex(nextIndex);
      saveProgress(nextIndex);
    } else {
      // Game Over / Victory Screen logic could go here
      alert("Вы прошли все уровни! Игра начнется сначала.");
      setCurrentLevelIndex(0);
      saveProgress(0);
      setView('menu');
    }
  };

  const handleExitToMenu = () => {
    setView('menu');
  };

  return (
    <>
      {view === 'menu' && (
        <MainMenu 
          onStart={handleStartNewGame}
          canContinue={localStorage.getItem(STORAGE_KEY) !== null}
          onContinue={handleContinue}
          currentLevelId={LEVELS[currentLevelIndex].id}
        />
      )}

      {view === 'game' && (
        <GameLevel 
          level={LEVELS[currentLevelIndex]}
          onLevelComplete={handleLevelComplete}
          onExit={handleExitToMenu}
        />
      )}
    </>
  );
};

export default App;
