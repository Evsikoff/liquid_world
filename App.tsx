import React, { useState, useEffect, useRef, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import GameLevel from './components/GameLevel';
import LevelSelect from './components/LevelSelect';
import RotateDeviceOverlay from './components/RotateDeviceOverlay';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { LEVELS, AUDIO_ASSETS } from './constants';

const PROGRESS_KEY = 'liquid_puzzle_v2_progress';
const MAX_LEVEL_KEY = 'liquid_puzzle_v2_max_level';
const AUDIO_SETTINGS_KEY = 'liquid_puzzle_v2_audio';

// Web Audio API manager - doesn't show in system media player
interface AudioBufferCache {
  [key: string]: AudioBuffer;
}

const App: React.FC = () => {
  const [view, setView] = useState<'menu' | 'game' | 'levelSelect'>('menu');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [maxReachedLevelIndex, setMaxReachedLevelIndex] = useState(0);

  // Mobile device detection
  const { isMobile, isPortrait } = useDeviceDetection();

  // Audio settings
  const [audioSettings, setAudioSettings] = useState({
    music: true,
    sfx: true
  });

  // Web Audio API refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<AudioBufferCache>({});
  const currentMusicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize AudioContext on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Load audio file into buffer
  const loadAudioBuffer = useCallback(async (url: string): Promise<AudioBuffer | null> => {
    if (audioBuffersRef.current[url]) {
      return audioBuffersRef.current[url];
    }

    const ctx = initAudioContext();
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      audioBuffersRef.current[url] = audioBuffer;
      return audioBuffer;
    } catch (error) {
      console.log("Failed to load audio:", url);
      return null;
    }
  }, [initAudioContext]);

  // Play music with loop
  const playMusic = useCallback(async (url: string) => {
    const ctx = initAudioContext();
    const buffer = await loadAudioBuffer(url);
    if (!buffer || !gainNodeRef.current) return;

    // Stop current music
    if (currentMusicSourceRef.current) {
      currentMusicSourceRef.current.stop();
      currentMusicSourceRef.current.disconnect();
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainNodeRef.current);
    source.start(0);
    currentMusicSourceRef.current = source;
  }, [initAudioContext, loadAudioBuffer]);

  // Stop music
  const stopMusic = useCallback(() => {
    if (currentMusicSourceRef.current) {
      try {
        currentMusicSourceRef.current.stop();
        currentMusicSourceRef.current.disconnect();
      } catch (e) {
        // Already stopped
      }
      currentMusicSourceRef.current = null;
    }
  }, []);

  // Play SFX (one-shot)
  const playSfx = useCallback(async (url: string) => {
    const ctx = initAudioContext();
    const buffer = await loadAudioBuffer(url);
    if (!buffer || !gainNodeRef.current) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNodeRef.current);
    source.start(0);
  }, [initAudioContext, loadAudioBuffer]);

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

    // Preload audio files
    const preloadAudio = async () => {
      const urls = [
        AUDIO_ASSETS.music.menu,
        AUDIO_ASSETS.music.game,
        ...AUDIO_ASSETS.sfx.transfer,
        ...AUDIO_ASSETS.sfx.sink,
        ...AUDIO_ASSETS.sfx.tap
      ];
      for (const url of urls) {
        loadAudioBuffer(url);
      }
    };
    preloadAudio();

    // Cleanup on unmount
    return () => {
      stopMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [loadAudioBuffer, stopMusic]);

  // Music playback control based on view and settings
  useEffect(() => {
    if (!audioSettings.music) {
      stopMusic();
      return;
    }

    const musicUrl = (view === 'menu' || view === 'levelSelect')
      ? AUDIO_ASSETS.music.menu
      : AUDIO_ASSETS.music.game;

    playMusic(musicUrl);
  }, [view, audioSettings.music, playMusic, stopMusic]);

  // SFX playback helper
  const playRandomSfx = useCallback((type: 'transfer' | 'sink' | 'tap') => {
    if (!audioSettings.sfx) return;

    const variants = AUDIO_ASSETS.sfx[type];
    const randomUrl = variants[Math.floor(Math.random() * variants.length)];
    playSfx(randomUrl);
  }, [audioSettings.sfx, playSfx]);

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
    initAudioContext(); // Ensure audio context is ready
    const hasProgress = localStorage.getItem(PROGRESS_KEY) !== null;

    if (hasProgress) {
      if (!window.confirm("Вы уверены, что хотите начать заново? Весь текущий прогресс будет сброшен.")) {
        return;
      }
    }

    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(MAX_LEVEL_KEY);

    setCurrentLevelIndex(0);
    setMaxReachedLevelIndex(0);
    saveProgress(0, 0);
    setView('game');
  };

  const handleContinue = () => {
    initAudioContext();
    setView('game');
  };

  const handleOpenLevelSelect = () => {
    initAudioContext();
    setView('levelSelect');
  };

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
      {/* Show rotate overlay on mobile portrait mode */}
      {isMobile && isPortrait && <RotateDeviceOverlay />}

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
          isMobile={isMobile}
        />
      )}

      {view === 'levelSelect' && (
        <LevelSelect
          levels={LEVELS}
          maxReachedIndex={maxReachedLevelIndex}
          onSelect={handleSelectLevel}
          onBack={() => setView('menu')}
          isMobile={isMobile}
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
          isMobile={isMobile}
        />
      )}
    </>
  );
};

export default App;
