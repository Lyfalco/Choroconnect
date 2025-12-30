import React, { useState, useEffect, useRef } from 'react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, ChevronRight, Fingerprint, Star, Clock, X } from 'lucide-react';
import { LevelData, GamePieceInstance, Rotation } from '../types';
import { scrambleLevel, ConnectionValidator } from '../services/gameLogic';
import { audioService } from '../services/audioService';
import PuzzlePiece from './PuzzlePiece';
import Button from './Button';

interface GameLevelProps {
  levelData: LevelData;
  totalLevels: number;
  currentLevelIndex: number;
  onBack: () => void;
  onNextLevel: (stars: number, time: number) => void;
  isLastLevel: boolean;
  t: (key: string) => string;
}

const VictoryParticle: React.FC = () => {
  // Generate random values for the particle animation
  // Using refs or constant values inside component body since it mounts once
  const angle = Math.random() * 360;
  const distance = Math.random() * 250 + 100; // Distance to travel
  const duration = Math.random() * 1.5 + 1;
  const delay = Math.random() * 0.3;
  const size = Math.random() * 3 + 2;
  const isBlue = Math.random() > 0.5;
  const color = isBlue ? '#00F0FF' : '#FF0099';

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{ 
        x: Math.cos(angle * (Math.PI / 180)) * distance,
        y: Math.sin(angle * (Math.PI / 180)) * distance,
        opacity: [0, 1, 0],
        scale: [0, 1, 0]
      }}
      transition={{ 
        duration: duration, 
        delay: delay,
        ease: "easeOut",
        times: [0, 0.2, 1]
      }}
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
    />
  );
};

const GameLevel: React.FC<GameLevelProps> = ({ 
  levelData, 
  totalLevels, 
  currentLevelIndex, 
  onBack, 
  onNextLevel, 
  isLastLevel, 
  t 
}) => {
  const [pieces, setPieces] = useState<GamePieceInstance[]>([]);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [shake, setShake] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  
  // Info Modal State
  const [selectedInfoPiece, setSelectedInfoPiece] = useState<GamePieceInstance | null>(null);

  // Track if the sequence is currently valid to trigger sound once
  const [isSequenceValid, setIsSequenceValid] = useState(false);
  
  // Use ReturnType<typeof setInterval> instead of NodeJS.Timeout to avoid namespace errors
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Level
  useEffect(() => {
    startLevel();
    // Ensure audio context is running when level starts
    audioService.initialize();
    return () => stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelData]);

  // Check for implicit success (sound cue)
  useEffect(() => {
    if (pieces.length === 0 || isLevelComplete) return;

    const currentValid = ConnectionValidator.validateSequence(pieces);
    
    // If it becomes valid and wasn't before, play the "Ready" sound
    if (currentValid && !isSequenceValid) {
      audioService.playReady();
    }
    
    setIsSequenceValid(currentValid);
  }, [pieces, isLevelComplete, isSequenceValid]);

  const startTimer = () => {
    stopTimer();
    setElapsedTime(0);
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startLevel = () => {
    setPieces(scrambleLevel(levelData.pieces));
    setIsLevelComplete(false);
    setIsSequenceValid(false);
    setStarsEarned(0);
    startTimer();
  };

  const handleRotate = (instanceId: string) => {
    if (isLevelComplete) return;
    
    // Play Rotate Sound
    audioService.playRotate();

    setPieces(prev => prev.map(p => {
      if (p.instanceId === instanceId) {
        // Always ADD 90 to rotate clockwise without wrapping back to 0
        const nextRotation = p.currentRotation + 90;
        return { ...p, currentRotation: nextRotation };
      }
      return p;
    }));
  };

  const handleReorder = (newOrder: GamePieceInstance[]) => {
    if (isLevelComplete) return;
    setPieces(newOrder);
  };

  const handleShowInfo = (piece: GamePieceInstance) => {
    audioService.playClick();
    setSelectedInfoPiece(piece);
  };

  const closeInfo = () => {
    audioService.playClick();
    setSelectedInfoPiece(null);
  };

  // Manual Validation Logic
  const handleCheckSequence = () => {
    if (isLevelComplete) return;

    // Play click for button press
    audioService.playClick();

    const isValid = ConnectionValidator.validateSequence(pieces);
    if (isValid) {
      stopTimer();
      setIsLevelComplete(true);
      
      // Play Victory Sound with Theme
      audioService.playWin(levelData.id);
      
      // Calculate Stars
      const [threeStar, twoStar] = levelData.starThresholds;
      let stars = 1;
      if (elapsedTime <= threeStar) stars = 3;
      else if (elapsedTime <= twoStar) stars = 2;
      
      setStarsEarned(stars);
    } else {
      // Wrong sequence - visual feedback
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      
      {/* HUD */}
      <div className="w-full max-w-md p-6 flex justify-between items-end z-20">
        <button onClick={() => { audioService.playClick(); onBack(); }} className="text-white/60 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-chrono-neonBlue mb-1">
            {t('level_indicator')} {currentLevelIndex + 1} / {totalLevels}
          </span>
          <h3 className="text-white font-light tracking-wide text-sm">
            {t(levelData.nameKey)}
          </h3>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-white/50 mb-1">{t('time')}</span>
          <div className="flex items-center gap-1 font-mono text-chrono-neonPink">
            <Clock size={14} />
            <span>{elapsedTime}s</span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 w-full max-w-md overflow-y-auto px-4 py-4 relative scroll-smooth no-scrollbar">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 z-0" />

        <Reorder.Group 
          axis="y" 
          values={pieces} 
          onReorder={handleReorder}
          className="flex flex-col items-center justify-start min-h-[400px] pb-32"
        >
          {pieces.map((piece, index) => {
            const prevPiece = index > 0 ? pieces[index - 1] : null;
            const nextPiece = index < pieces.length - 1 ? pieces[index + 1] : null;
            
            const isConnectedPrev = prevPiece ? ConnectionValidator.areConnected(prevPiece, piece) : false;
            const isConnectedNext = nextPiece ? ConnectionValidator.areConnected(piece, nextPiece) : false;

            return (
              <PuzzlePiece
                key={piece.instanceId}
                piece={piece}
                onRotate={handleRotate}
                onShowInfo={handleShowInfo}
                isConnectedPrev={isConnectedPrev}
                isConnectedNext={isConnectedNext}
                isLocked={isLevelComplete}
                t={t}
              />
            );
          })}
        </Reorder.Group>
      </div>

      {/* Action Bar */}
      {!isLevelComplete && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="w-full max-w-md p-6 bg-gradient-to-t from-[#0A0A1F] to-transparent z-30"
        >
          <motion.button
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : (isSequenceValid ? { scale: [1, 1.05, 1], boxShadow: "0 0 25px #00F0FF" } : {})}
            transition={isSequenceValid ? { duration: 1.5, repeat: Infinity } : { duration: 0.4 }}
            onClick={handleCheckSequence}
            className={`
              w-full py-4 rounded-xl border 
              ${isSequenceValid 
                ? 'border-chrono-neonBlue bg-chrono-neonBlue/20 text-white shadow-[0_0_20px_#00F0FF]' 
                : 'border-chrono-neonBlue/50 bg-chrono-neonBlue/10 text-chrono-neonBlue shadow-[0_0_15px_rgba(0,240,255,0.2)]'
              }
              uppercase tracking-[0.2em] font-bold
              hover:bg-chrono-neonBlue/30
              transition-all flex items-center justify-center gap-3 backdrop-blur-md
            `}
          >
            <Fingerprint size={20} className={isSequenceValid ? "text-white" : ""} />
            {shake ? t('try_again') : t('stabilize')}
          </motion.button>
        </motion.div>
      )}

      {/* Info Modal */}
      <AnimatePresence>
        {selectedInfoPiece && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-6"
            onClick={closeInfo}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the card itself
              className="bg-[#0A0A1F] border border-chrono-neonBlue/50 rounded-2xl p-6 w-full max-w-xs relative shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col items-center text-center"
            >
              <button 
                onClick={closeInfo}
                className="absolute top-3 right-3 text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="w-24 h-24 rounded-full bg-chrono-neonBlue/10 flex items-center justify-center mb-6 ring-2 ring-chrono-neonBlue/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <selectedInfoPiece.icon size={48} className="text-chrono-neonBlue" />
              </div>

              <h3 className="text-2xl text-white font-light tracking-widest uppercase mb-3">
                {t(selectedInfoPiece.labelKey)}
              </h3>
              
              <div className="w-10 h-1 bg-gradient-to-r from-transparent via-chrono-neonPink to-transparent mb-4 opacity-50" />

              <p className="text-white/80 leading-relaxed font-light text-lg">
                {t(selectedInfoPiece.descriptionKey)}
              </p>

              <div className="mt-8">
                <Button onClick={closeInfo} variant="primary" className="py-2 px-8 text-sm">
                  {t('close')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory Overlay */}
      <AnimatePresence>
        {isLevelComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center pointer-events-auto overflow-hidden"
          >
            {/* Particle Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(40)].map((_, i) => (
                <VictoryParticle key={i} />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center p-8 bg-[#0A0A1F] border border-chrono-neonBlue rounded-2xl shadow-neon-blue max-w-xs mx-4 w-full z-10"
            >
              <h2 className="text-2xl font-light text-white mb-2">{t('sequence_restored')}</h2>
              
              <div className="flex justify-center gap-2 my-6">
                {[1, 2, 3].map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.2, type: 'spring' }}
                  >
                    <Star 
                      size={40} 
                      className={s <= starsEarned ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "text-white/10"} 
                    />
                  </motion.div>
                ))}
              </div>

              <div className="text-white/60 font-mono text-sm mb-6">
                {t('time')}: <span className="text-white">{elapsedTime}s</span>
              </div>
              
              <div className="w-full h-px bg-gradient-to-r from-transparent via-chrono-neonBlue to-transparent my-4 opacity-50" />
              
              <Button onClick={() => { audioService.playClick(); onNextLevel(starsEarned, elapsedTime); }} variant="primary" className="w-full flex justify-center items-center gap-2 mt-4">
                {isLastLevel ? t('finish') : t('next_level')} <ChevronRight size={18} />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameLevel;