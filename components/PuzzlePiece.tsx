import React from 'react';
import { Reorder, useMotionValue } from 'framer-motion';
import { GamePieceInstance } from '../types';
import { RotateCw, Info } from 'lucide-react';

interface PuzzlePieceProps {
  piece: GamePieceInstance;
  onRotate: (id: string) => void;
  onShowInfo: (piece: GamePieceInstance) => void; // New prop
  isConnectedPrev: boolean;
  isConnectedNext: boolean;
  isLocked: boolean; // If level is won
  t: (key: string) => string;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ 
  piece, 
  onRotate, 
  onShowInfo,
  isConnectedPrev, 
  isConnectedNext,
  isLocked,
  t
}) => {
  const y = useMotionValue(0);

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start when clicking rotate
    if (!isLocked) {
      onRotate(piece.instanceId);
    }
  };

  const handleInfo = (e: React.MouseEvent) => {
    // Stop propagation to prevent Reorder drag
    e.stopPropagation();
    e.preventDefault(); 
    onShowInfo(piece);
  };

  // Neon color based on connection status
  const borderColor = (isConnectedPrev || isConnectedNext) ? 'border-chrono-neonBlue shadow-neon-blue' : 'border-white/20';
  const iconColor = (isConnectedPrev || isConnectedNext) ? 'text-chrono-neonBlue' : 'text-white/80';
  
  return (
    <Reorder.Item 
      value={piece} 
      id={piece.instanceId} 
      style={{ y }}
      className="relative flex justify-center items-center my-4 select-none touch-none"
    >
      {/* Connector Line Top */}
      {isConnectedPrev && (
        <div className="absolute -top-6 w-1 h-6 bg-chrono-neonBlue shadow-[0_0_8px_#00F0FF] z-0" />
      )}

      {/* The Piece Card */}
      <div 
        className={`
          relative w-28 h-28 md:w-32 md:h-32 
          bg-chrono-bg bg-opacity-90 backdrop-blur-md
          border-2 ${borderColor} rounded-xl
          flex flex-col items-center justify-center
          transition-colors duration-500 z-10
          cursor-grab active:cursor-grabbing
        `}
      >
        {/* Info Button (Top Left) - Increased Touch Area for Accessibility */}
        <button
          type="button"
          aria-label={`Info about ${t(piece.labelKey)}`}
          onPointerDown={(e) => e.stopPropagation()} // Critical: Prevents drag from starting
          onClick={handleInfo} // Critical: Opens modal on a proper click event
          className="absolute top-0 left-0 p-3 text-white/30 hover:text-chrono-neonBlue hover:bg-white/5 transition-colors z-20 rounded-tl-xl rounded-br-xl"
        >
          <Info size={18} />
        </button>

        {/* Content Container that rotates */}
        <div 
          className="flex flex-col items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${piece.currentRotation}deg)` }}
        >
          <piece.icon 
            size={40} 
            strokeWidth={1.5} 
            className={`${iconColor} mb-2 transition-colors duration-500`} 
          />
          <span className="text-xs font-light tracking-widest uppercase opacity-70 text-center px-1 pointer-events-none">
            {t(piece.labelKey)}
          </span>
        </div>

        {/* Rotate Button Overlay */}
        {!isLocked && (
          <button 
            type="button"
            aria-label="Rotate Piece"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleRotate}
            className="absolute -bottom-3 -right-3 w-10 h-10 bg-chrono-bg border border-chrono-neonPink rounded-full flex items-center justify-center hover:bg-chrono-neonPink hover:text-white transition-all duration-200 z-20 shadow-lg"
          >
            <RotateCw size={16} />
          </button>
        )}
      </div>

      {/* Connector Line Bottom */}
      {isConnectedNext && (
        <div className="absolute -bottom-6 w-1 h-6 bg-chrono-neonBlue shadow-[0_0_8px_#00F0FF] z-0" />
      )}
    </Reorder.Item>
  );
};

export default PuzzlePiece;