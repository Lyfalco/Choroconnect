import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import GameLevel from './components/GameLevel';
import LevelSelect from './components/LevelSelect';
import { LEVELS } from './constants';
import { GameState, LanguageCode, LevelData, LevelProgress } from './types';
import { TRANSLATIONS } from './translations';
import { storageService } from './services/storageService';
import { shuffleArray } from './services/gameLogic';
import { audioService } from './services/audioService';
import { Shuffle } from 'lucide-react';

const LANG_KEY = 'chrono_connect_lang';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [progress, setProgress] = useState<LevelProgress[]>([]);
  
  // State for the currently active order of levels.
  // Default is the canonical order, but "Remix" will shuffle this.
  const [activeLevels, setActiveLevels] = useState<LevelData[]>(LEVELS);

  // Initialize System
  useEffect(() => {
    // 1. Load Language
    const savedLang = localStorage.getItem(LANG_KEY) as LanguageCode;
    const validLangs: LanguageCode[] = ['en','tr','es','fr','ar','ja','ko','zh'];
    
    if (savedLang && validLangs.includes(savedLang)) {
      setLanguage(savedLang);
      // Set direction immediately on load
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLang;
    }

    // 2. Load & Hydrate Progress safely
    // This allows adding new levels to 'constants.ts' without breaking user saves
    const loadedProgress = storageService.loadProgress(LEVELS);
    setProgress(loadedProgress);
  }, []);

  const changeLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem(LANG_KEY, lang);
    // Update document direction for Arabic support
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  // Translation Helper
  const t = (key: string): string => {
    return TRANSLATIONS[language][key] || key;
  };

  const handleStartGame = () => {
    setCurrentLevelIndex(0);
    // Ensure we start with standard order if new game from menu
    setActiveLevels(LEVELS);
    setGameState('PLAYING');
  };

  const handleContinue = () => {
    // Smart Continue: Find the first unlocked level that hasn't been 3-starred?
    // Or simply the highest unlocked level.
    // Let's go with highest unlocked level.
    const unlockedLevels = progress.filter(p => p.unlocked);
    
    // Find the last one in the unlocked list
    if (unlockedLevels.length > 0) {
      const lastUnlockedId = unlockedLevels[unlockedLevels.length - 1].levelId;
      // Find its index in the current LEVELS array definition
      const index = LEVELS.findIndex(l => l.id === lastUnlockedId);
      
      // If found, and if it's completed (has stars), check if there is a next level
      if (index !== -1) {
        const p = unlockedLevels[unlockedLevels.length - 1];
        if (p.stars > 0 && index < LEVELS.length - 1) {
             // If completed, try to jump to next (if unlocked check passes implicitly by filter)
             setCurrentLevelIndex(index + 1);
        } else {
             setCurrentLevelIndex(index);
        }
      } else {
        setCurrentLevelIndex(0);
      }
    } else {
      setCurrentLevelIndex(0);
    }
    
    setActiveLevels(LEVELS); // Reset order on continue
    setGameState('PLAYING');
  };

  const handleLevelSelect = (index: number) => {
    setCurrentLevelIndex(index);
    setActiveLevels(LEVELS); // Reset order on explicit select
    setGameState('PLAYING');
  };

  const handleNextLevel = (stars: number, time: number) => {
    const currentLevelId = activeLevels[currentLevelIndex].id;
    
    // Create a new updated progress array
    const updatedProgress = progress.map(p => {
      // 1. Update current level stats
      if (p.levelId === currentLevelId) {
        return {
          ...p,
          stars: Math.max(p.stars, stars),
          bestTime: p.bestTime === null ? time : Math.min(p.bestTime, time)
        };
      }
      return p;
    });

    // 2. Unlock next level logic
    // We rely on the activeLevels array order for "Next Level" progression
    if (currentLevelIndex < activeLevels.length - 1) {
      const nextLevelId = activeLevels[currentLevelIndex + 1].id;
      
      // Find the next level in our progress array and unlock it
      const nextLevelIndexInStats = updatedProgress.findIndex(p => p.levelId === nextLevelId);
      if (nextLevelIndexInStats !== -1) {
        updatedProgress[nextLevelIndexInStats].unlocked = true;
      }
    }
    
    // 3. Save to storage via service
    setProgress(updatedProgress);
    storageService.saveProgress(updatedProgress);

    // 4. Navigate
    if (currentLevelIndex < activeLevels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      setGameState('VICTORY');
    }
  };

  const handleBackToMenu = () => {
    setGameState('MENU');
  };

  // Remix Logic: Shuffles the levels and starts from index 0
  const handleRestartRemix = () => {
    audioService.playClick();
    const shuffled = shuffleArray(LEVELS);
    setActiveLevels(shuffled);
    setCurrentLevelIndex(0);
    setGameState('PLAYING');
  };

  return (
    <div className="relative w-full h-screen bg-chrono-bg text-white overflow-hidden font-sans">
      
      {gameState === 'MENU' && (
        <MainMenu 
          onPlay={handleStartGame}
          onContinue={handleContinue}
          onOpenLevelSelect={() => setGameState('LEVEL_SELECT')}
          currentLang={language}
          setLang={changeLanguage}
          t={t}
          // Can continue if we have played at least level 1 (stars > 0) OR we are past level 1
          canContinue={progress.some(p => p.stars > 0 || (p.unlocked && p.levelId > 1))}
        />
      )}

      {gameState === 'LEVEL_SELECT' && (
        <LevelSelect 
          levels={LEVELS} // Always show canonical order in grid
          progress={progress}
          onSelectLevel={handleLevelSelect}
          onBack={handleBackToMenu}
          t={t}
        />
      )}

      {gameState === 'PLAYING' && (
        <GameLevel 
          levelData={activeLevels[currentLevelIndex]}
          totalLevels={activeLevels.length}
          currentLevelIndex={currentLevelIndex}
          onBack={handleBackToMenu}
          onNextLevel={handleNextLevel}
          isLastLevel={currentLevelIndex === activeLevels.length - 1}
          t={t}
        />
      )}

      {gameState === 'VICTORY' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-chrono-bg z-50">
          <h1 className="text-4xl md:text-6xl font-thin text-chrono-neonPink mb-6 drop-shadow-[0_0_15px_#FF0099]">
            {t('timeline_stabilized')}
          </h1>
          <p className="text-white/60 mb-12 font-light">{t('all_restored')}</p>
          
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button 
              onClick={handleRestartRemix}
              className="px-8 py-4 border border-chrono-neonBlue rounded-full hover:bg-chrono-neonBlue/10 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <Shuffle size={18} />
              {t('restart_remix')}
            </button>

            <button 
              onClick={handleBackToMenu}
              className="px-8 py-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors uppercase tracking-widest text-sm"
            >
              {t('return_menu')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;