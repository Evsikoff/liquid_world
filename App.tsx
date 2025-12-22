import React, { useState, useEffect, useRef, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import GameLevel from './components/GameLevel';
import LevelSelect from './components/LevelSelect';
import { LEVELS, AUDIO_ASSETS } from './constants';

const PROGRESS_KEY = 'liquid_puzzle_v2_progress';
const MAX_LEVEL_KEY = 'liquid_puzzle_v2_max_level';
const AUDIO_SETTINGS_KEY = 'liquid_puzzle_v2_audio';

const App: React.FC = () => {
  const [view, setView] = useState<'menu' | 'game' | 'levelSelect'>('menu');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [maxReachedLevelIndex, setMaxReachedLevelIndex] = useState(0);
  
  // Audio settings
  const [audioSettings, setAudioSettings] = useState({
    music: true,
    sfx: true
  });

  // Centralized audio management
  const menuMusicRef = useRef<HTMLAudioElement | null>(null);
  const gameMusicRef = useRef<HTMLAudioElement | null>(null);
  const sfxPoolRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Load progress and audio settings on mount
  useEffect(() => {
    const savedCurrent = localStorage.getItem(PROGRESS_KEY);
    const savedMax = localStorage.getItem(MAX_LEVEL_KEY);
    const savedAudio = localStorage.getItem(AUDIO_SETTINGS_KEY);
    
    if (savedMax) {
      const maxIdx = parseInt(savedMax, 10);
      setMaxReachedLevelIndex(isNaN(maxIdx) ? 0 : maxIdx);
    }

    if (savedCurrent) {
      const currentIdx = parseInt(savedCurrent, 10);
      if (!isNaN(currentIdx) && currentIdx < LEVELS.length) {
        setCurrentLevelIndex(currentIdx);
      }
    }

    if (savedAudio) {
      try {
        setAudioSettings(JSON.parse(savedAudio));
      } catch (e) {
        console.error("Failed to parse audio settings");
      }
    }

    // Initialize audio elements once
    if (!menuMusicRef.current) {
      menuMusicRef.current = new Audio(AUDIO_ASSETS.music.menu);
      menuMusicRef.current.loop = true;
      menuMusicRef.current.preload = 'auto';
    }
    if (!gameMusicRef.current) {
      gameMusicRef.current = new Audio(AUDIO_ASSETS.music.game);
      gameMusicRef.current.loop = true;
      gameMusicRef.current.preload = 'auto';
    }

    // Disable Media Session (system media player integration)
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    }

    // Cleanup on unmount
    return () => {
      menuMusicRef.current?.pause();
      gameMusicRef.current?.pause();
      menuMusicRef.current = null;
      gameMusicRef.current = null;
    };
  }, []);

  // Music playback control based on view and settings
  useEffect(() => {
    const menuMusic = menuMusicRef.current;
    const gameMusic = gameMusicRef.current;

    if (!menuMusic || !gameMusic) return;

    // Stop all music first
    menuMusic.pause();
    gameMusic.pause();

    if (!audioSettings.music) return;

    // Play appropriate music based on view
    const playMusic = async (audio: HTMLAudioElement) => {
      try {
        audio.currentTime = 0;
        await audio.play();
        // Clear Media Session after play to hide from system player
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = null;
          navigator.mediaSession.playbackState = 'none';
        }
      } catch (error) {
        console.log("Audio playback blocked. User interaction required.");
      }
    };

    if (view === 'menu' || view === 'levelSelect') {
      playMusic(menuMusic);
    } else if (view === 'game') {
      playMusic(gameMusic);
    }
  }, [view, audioSettings.music]);

  // SFX playback helper
  const playRandomSfx = useCallback((type: 'transfer' | 'sink' | 'tap') => {
    if (!audioSettings.sfx) return;

    const variants = AUDIO_ASSETS.sfx[type];
    const randomUrl = variants[Math.floor(Math.random() * variants.length)];

    // Use pooled audio or create new
    let audio = sfxPoolRef.current.get(randomUrl);
    if (!audio) {
      audio = new Audio(randomUrl);
      audio.preload = 'auto';
      sfxPoolRef.current.set(randomUrl, audio);
    }

    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.log("SFX playback failed:", error.message);
    });
  }, [audioSettings.sfx]);

  const toggleMusic = () => {
    setAudioSettings(prev => {
      const newState = { ...prev, music: !prev.music };
      localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  const toggleSfx = () => {
    setAudioSettings(prev => {
      const newState = { ...prev, sfx: !prev.sfx };
      localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  const saveProgress = (currentIdx: number, maxIdx: number) => {
    localStorage.setItem(PROGRESS_KEY, currentIdx.toString());
    const newMax = Math.max(maxReachedLevelIndex, maxIdx);
    setMaxReachedLevelIndex(newMax);
    localStorage.setItem(MAX_LEVEL_KEY, newMax.toString());
  };

  const handleStartNewGame = () => {
    const hasProgress = localStorage.getItem(PROGRESS_KEY) !== null;
    
    if (hasProgress) {
      if (!window.confirm("Вы уверены, что хотите начать заново? Весь текущий прогресс будет сброшен.")) {
        return;
      }
    }

    // Очищаем хранилище и состояние перед началом
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(MAX_LEVEL_KEY);
    
    setCurrentLevelIndex(0);
    setMaxReachedLevelIndex(0);
    saveProgress(0, 0);
    
    // Переключаем экран
    setView('game');
  };

  const handleContinue = () => setView('game');
  const handleOpenLevelSelect = () => setView('levelSelect');

  const handleSelectLevel = (index: number) => {
    setCurrentLevelIndex(index);
    saveProgress(index, index);
    setView('game');
  };

  const handleLevelComplete = () => {
    const nextIndex = currentLevelIndex + 1;
    if (nextIndex < LEVELS.length) {
      setCurrentLevelIndex(nextIndex);
      saveProgress(nextIndex, nextIndex);
    } else {
      alert("Поздравляем! Вы прошли все доступные уровни!");
      saveProgress(currentLevelIndex, currentLevelIndex);
      setView('menu');
    }
  };

  const handleExitToMenu = () => {
    saveProgress(currentLevelIndex, maxReachedLevelIndex);
    setView('menu');
  };

  return (
    <>
      {view === 'menu' && (
        <MainMenu 
          onStart={handleStartNewGame}
          canContinue={localStorage.getItem(PROGRESS_KEY) !== null}
          onContinue={handleContinue}
          onOpenLevelSelect={handleOpenLevelSelect}
          currentLevelId={LEVELS[currentLevelIndex].id}
          audioSettings={audioSettings}
          toggleMusic={toggleMusic}
          toggleSfx={toggleSfx}
        />
      )}

      {view === 'levelSelect' && (
        <LevelSelect 
          levels={LEVELS}
          maxReachedIndex={maxReachedLevelIndex}
          onSelect={handleSelectLevel}
          onBack={() => setView('menu')}
        />
      )}

      {view === 'game' && (
        <GameLevel
          level={LEVELS[currentLevelIndex]}
          onLevelComplete={handleLevelComplete}
          onExit={handleExitToMenu}
          audioSettings={audioSettings}
          toggleMusic={toggleMusic}
          toggleSfx={toggleSfx}
          playRandomSfx={playRandomSfx}
        />
      )}
    </>
  );
};

export default App;