import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Grid, FastForward, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import Button from './Button';
import { LanguageCode } from '../types';
import { audioService } from '../services/audioService';

interface MainMenuProps {
  onPlay: () => void;
  onContinue: () => void;
  onOpenLevelSelect: () => void;
  currentLang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: string) => string;
  canContinue: boolean;
}

const PRIVACY_POLICY_URL = "https://docs.google.com/document/d/1gGTgCBDaEwB1ACVmJHgWPfvDr9-NZ39zNpeMY73v6HE/edit?usp=sharing"; 

const MainMenu: React.FC<MainMenuProps> = ({ 
  onPlay, 
  onContinue,
  onOpenLevelSelect,
  currentLang, 
  setLang, 
  t,
  canContinue 
}) => {
  const [isMuted, setIsMuted] = useState(audioService.getMuteState());

  const handleStartInteraction = async (callback: () => void) => {
    await audioService.initialize();
    audioService.playClick();
    callback();
  };

  const toggleMute = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
    if (!muted) audioService.playClick();
  };

  const openPrivacyPolicy = () => {
    audioService.playClick();
    window.open(PRIVACY_POLICY_URL, '_blank');
  };

  const languages: { code: LanguageCode; country: string }[] = [
    { code: 'en', country: 'gb' },
    { code: 'tr', country: 'tr' },
    { code: 'es', country: 'es' },
    { code: 'fr', country: 'fr' },
    { code: 'ar', country: 'sa' },
    { code: 'ja', country: 'jp' },
    { code: 'ko', country: 'kr' },
    { code: 'zh', country: 'cn' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 safe-area-inset">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-chrono-neonBlue/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-chrono-neonPink/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Left: Language Selection */}
      <div className="absolute top-6 left-6 z-30 flex flex-wrap gap-2 max-w-[160px] md:max-w-none justify-start">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { audioService.playClick(); setLang(lang.code); }}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border transition-all duration-300
              ${currentLang === lang.code 
                ? 'border-chrono-neonPink shadow-[0_0_10px_#FF0099] scale-105 grayscale-0' 
                : 'border-white/10 opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
              }
            `}
          >
            <img 
              src={`https://flagcdn.com/w80/${lang.country}.png`}
              alt={lang.code}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>

      {/* Top Right: Audio Toggle */}
      <div className="absolute top-6 right-6 z-30">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="p-3 bg-white/5 rounded-full backdrop-blur-md border border-white/10 text-white/70 hover:text-chrono-neonBlue transition-colors shadow-lg"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 z-20 flex flex-col items-center"
      >
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-light text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            CHRONO
          </h1>
          <div className="absolute -bottom-2 w-full h-px bg-gradient-to-r from-transparent via-chrono-neonBlue to-transparent opacity-50"></div>
        </div>
        <h2 className="text-2xl md:text-3xl font-thin text-chrono-neonBlue tracking-[0.3em] mt-3 drop-shadow-[0_0_8px_#00F0FF]">
          CONNECT
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="z-20 flex flex-col gap-5 w-full max-w-xs"
      >
        {canContinue ? (
           <Button onClick={() => handleStartInteraction(onContinue)} className="flex items-center justify-center gap-3 px-12 py-4 text-xl shadow-[0_0_20px_rgba(0,240,255,0.15)]">
            <FastForward size={22} /> {t('continue')}
          </Button>
        ) : (
          <Button onClick={() => handleStartInteraction(onPlay)} className="flex items-center justify-center gap-3 px-12 py-4 text-xl shadow-[0_0_20px_rgba(0,240,255,0.15)]">
            <Play size={22} /> {t('play')}
          </Button>
        )}

        <Button onClick={() => handleStartInteraction(onOpenLevelSelect)} variant="secondary" className="flex items-center justify-center gap-3 px-12 py-4 text-lg">
          <Grid size={22} /> {t('levels')}
        </Button>
      </motion.div>

      {/* Modern Version Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 z-20 flex flex-col items-center w-full px-6"
      >
        <button 
          onClick={openPrivacyPolicy}
          className="mb-5 flex items-center gap-2 text-[9px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-[0.2em]"
        >
          <ShieldCheck size={10} />
          {t('privacy')}
        </button>

        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-chrono-neonBlue to-chrono-neonPink tracking-[0.3em] opacity-80 uppercase">
            LYFALCO STUDIOS
          </span>
          
          <div className="flex items-center gap-4">
            <div className="h-[0.5px] w-6 bg-white/10" />
            <div className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-sm">
              <span className="text-[8px] md:text-[9px] text-chrono-neonBlue font-medium tracking-[0.4em] uppercase whitespace-nowrap">
                v2.0 FULL VERSION
              </span>
            </div>
            <div className="h-[0.5px] w-6 bg-white/10" />
          </div>
        </div>
      </motion.div>
      
    </div>
  );
};

export default MainMenu;