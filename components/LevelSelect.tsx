import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Star } from 'lucide-react';
import { LevelData, LevelProgress } from '../types';

interface LevelSelectProps {
  levels: LevelData[];
  progress: LevelProgress[];
  onSelectLevel: (index: number) => void;
  onBack: () => void;
  t: (key: string) => string;
}

const LevelSelect: React.FC<LevelSelectProps> = ({ levels, progress, onSelectLevel, onBack, t }) => {
  return (
    <div className="absolute inset-0 flex flex-col bg-chrono-bg z-20">
      
      {/* Header */}
      <div className="p-6 flex items-center gap-4 z-30">
        <button 
          onClick={onBack} 
          className="p-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/40 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-light tracking-widest uppercase text-white">
          {t('levels')}
        </h2>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pb-20">
          {levels.map((level, index) => {
            const levelProgress = progress.find(p => p.levelId === level.id);
            const isUnlocked = levelProgress?.unlocked || index === 0;
            const stars = levelProgress?.stars || 0;

            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => isUnlocked && onSelectLevel(index)}
                disabled={!isUnlocked}
                className={`
                  relative aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2
                  transition-all duration-300
                  ${isUnlocked 
                    ? 'border-chrono-neonBlue/30 bg-chrono-neonBlue/5 hover:bg-chrono-neonBlue/10 hover:border-chrono-neonBlue hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
                    : 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                {!isUnlocked && (
                  <Lock size={32} className="text-white/20 mb-2" />
                )}

                <span className={`text-4xl font-thin ${isUnlocked ? 'text-white' : 'text-white/20'}`}>
                  {level.id}
                </span>

                {isUnlocked && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3].map((star) => (
                      <Star 
                        key={star} 
                        size={14} 
                        className={`${star <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-white/10'}`} 
                      />
                    ))}
                  </div>
                )}
                
                {isUnlocked && levelProgress?.bestTime && (
                  <span className="text-[10px] text-white/40 mt-1 font-mono">
                     {levelProgress.bestTime}s
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
